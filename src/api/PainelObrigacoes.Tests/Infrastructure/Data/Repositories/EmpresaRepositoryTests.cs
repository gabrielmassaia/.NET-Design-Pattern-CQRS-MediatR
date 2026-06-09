using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using PainelObrigacoes.Domain.Empresas.Models;
using PainelObrigacoes.Domain.Enums;
using PainelObrigacoes.Infrastructure.Data.Configurations;
using PainelObrigacoes.Infrastructure.Data.Context;
using PainelObrigacoes.Infrastructure.Data.Empresas.Repositories;

namespace PainelObrigacoes.Tests.Infrastructure.Data.Repositories;

public class EmpresaRepositoryTests : IDisposable
{
    private readonly AppDbContext _context;
    private readonly EmpresaRepository _sut;

    public EmpresaRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new AppDbContext(options);
        _context.Database.EnsureCreated();
        _sut = new EmpresaRepository(_context);
    }

    public void Dispose()
    {
        _context.Dispose();
        GC.SuppressFinalize(this);
    }

    private static EmpresaModel CreateEmpresa(string cnpj = "11222333000181", string nome = "Empresa Teste Ltda")
        => new()
        {
            Id = Guid.NewGuid(),
            CNPJ = cnpj,
            RazaoSocial = nome,
            Regime = RegimeTributario.SimplesNacional,
            CreatedAt = DateTime.UtcNow,
        };

    [Fact]
    public async Task FindByIdAsync_EmpresaExistente_DeveRetornarModel()
    {
        var empresa = CreateEmpresa();
        _sut.Create(empresa);
        await _context.SaveChangesAsync();

        var result = await _sut.FindByIdAsync(empresa.Id);

        result.Should().NotBeNull();
        result!.CNPJ.Should().Be(empresa.CNPJ);
        result.RazaoSocial.Should().Be(empresa.RazaoSocial);
        result.Regime.Should().Be(RegimeTributario.SimplesNacional);
    }

    [Fact]
    public async Task FindByIdAsync_EmpresaInexistente_DeveRetornarNull()
    {
        var result = await _sut.FindByIdAsync(Guid.NewGuid());

        result.Should().BeNull();
    }

    [Fact]
    public async Task FindAllAsync_DeveRetornarTodasOrdenadasPorRazaoSocial()
    {
        var empresaB = CreateEmpresa("99888777000155", "Beta Ltda");
        var empresaA = CreateEmpresa("11222333000181", "Alpha S.A.");
        _sut.Create(empresaA);
        _sut.Create(empresaB);
        await _context.SaveChangesAsync();

        var result = await _sut.FindAllAsync();

        result.Should().HaveCount(2);
        result[0].RazaoSocial.Should().Be("Alpha S.A.");
        result[1].RazaoSocial.Should().Be("Beta Ltda");
    }

    [Fact]
    public async Task FindAllAsync_ComPaginacao_DeveRespeitarSkipETake()
    {
        for (int i = 0; i < 5; i++)
            _sut.Create(CreateEmpresa($"111111110001{i:D2}", $"Empresa {i}"));
        await _context.SaveChangesAsync();

        var result = await _sut.FindAllAsync(skip: 1, take: 2);

        result.Should().HaveCount(2);
    }

    [Fact]
    public async Task ExistsByCnpjAsync_CnpjExistente_DeveRetornarTrue()
    {
        _sut.Create(CreateEmpresa("11222333000181"));
        await _context.SaveChangesAsync();

        var result = await _sut.ExistsByCnpjAsync("11222333000181");

        result.Should().BeTrue();
    }

    [Fact]
    public async Task ExistsByCnpjAsync_CnpjInexistente_DeveRetornarFalse()
    {
        var result = await _sut.ExistsByCnpjAsync("00000000000000");

        result.Should().BeFalse();
    }

    [Fact]
    public async Task Create_DevePersistirEmpresa()
    {
        var empresa = CreateEmpresa();
        _sut.Create(empresa);
        await _context.SaveChangesAsync();

        var saved = await _context.Empresas.FindAsync(empresa.Id);
        saved.Should().NotBeNull();
        saved!.CNPJ.Should().Be("11222333000181");
    }

    [Fact]
    public async Task Delete_MarcaComoInativo_DeveAplicarSoftDelete()
    {
        var empresa = CreateEmpresa();
        _sut.Create(empresa);
        await _context.SaveChangesAsync();

        _sut.Delete(empresa);
        await _context.SaveChangesAsync();

        var softDeleted = await _context.Empresas
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(e => e.Id == empresa.Id);
        softDeleted.Should().NotBeNull();
        softDeleted!.IsActive.Should().BeFalse();
        softDeleted.UpdatedAt.Should().NotBeNull();
    }

    [Fact]
    public async Task Delete_ComQueryFilter_NaoDeveRetornarEmpresaInativa()
    {
        var empresa = CreateEmpresa();
        _sut.Create(empresa);
        await _context.SaveChangesAsync();

        _sut.Delete(empresa);
        await _context.SaveChangesAsync();

        var active = await _context.Empresas
            .FirstOrDefaultAsync(e => e.Id == empresa.Id);
        active.Should().BeNull();
    }
}
