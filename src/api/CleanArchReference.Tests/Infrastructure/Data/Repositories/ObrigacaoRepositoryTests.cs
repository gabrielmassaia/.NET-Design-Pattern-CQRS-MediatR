using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using CleanArchReference.Domain.Enums;
using CleanArchReference.Domain.Obrigacoes.Models;
using CleanArchReference.Infrastructure.Data.Context;
using CleanArchReference.Infrastructure.Data.Entities;
using CleanArchReference.Infrastructure.Data.Obrigacoes.Repositories;

namespace CleanArchReference.Tests.Infrastructure.Data.Repositories;

public class ObrigacaoRepositoryTests : IDisposable
{
    private readonly AppDbContext _context;
    private readonly ObrigacaoRepository _sut;

    public ObrigacaoRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _context = new AppDbContext(options);
        _context.Database.EnsureCreated();
        _sut = new ObrigacaoRepository(_context);

        SeedEmpresa();
    }

    private Guid _empresaId;

    private void SeedEmpresa()
    {
        var empresa = new EmpresaEntity
        {
            Id = Guid.NewGuid(),
            CNPJ = "11222333000181",
            RazaoSocial = "Empresa Teste Ltda",
            Regime = RegimeTributario.SimplesNacional,
        };
        _empresaId = empresa.Id;
        _context.Empresas.Add(empresa);
        _context.SaveChanges();
    }

    private ObrigacaoModel CreateObrigacao(int mes = 6, TipoObrigacao tipo = TipoObrigacao.DAS, StatusObrigacao status = StatusObrigacao.Pendente, DateTime? dataEntrega = null)
        => new()
        {
            Id = Guid.NewGuid(),
            EmpresaId = _empresaId,
            Tipo = tipo,
            Competencia = new DateTime(2026, mes, 1),
            DataVencimento = new DateTime(2026, mes + 1, 20),
            DataEntrega = dataEntrega,
            Status = status,
            CreatedAt = DateTime.UtcNow,
        };

    public void Dispose()
    {
        _context.Dispose();
        GC.SuppressFinalize(this);
    }

    [Fact]
    public async Task FindByIdAsync_ObrigacaoExistente_DeveRetornarModel()
    {
        var obrigacao = CreateObrigacao();
        _sut.CreateRange([obrigacao]);
        await _context.SaveChangesAsync();

        var result = await _sut.FindByIdAsync(obrigacao.Id);

        result.Should().NotBeNull();
        result!.Tipo.Should().Be(TipoObrigacao.DAS);
        result.EmpresaId.Should().Be(_empresaId);
    }

    [Fact]
    public async Task FindByIdAsync_ObrigacaoInexistente_DeveRetornarNull()
    {
        var result = await _sut.FindByIdAsync(Guid.NewGuid());

        result.Should().BeNull();
    }

    [Fact]
    public async Task FindByEmpresaAndMonthAsync_DeveRetornarObrigacoesDoMes()
    {
        var obrigacaoMesCorreto = CreateObrigacao(mes: 6);
        var obrigacaoOutroMes = CreateObrigacao(mes: 5);
        _sut.CreateRange([obrigacaoMesCorreto, obrigacaoOutroMes]);
        await _context.SaveChangesAsync();

        var result = await _sut.FindByEmpresaAndMonthAsync(_empresaId, 2026, 6);

        result.Should().HaveCount(1);
        result[0].Id.Should().Be(obrigacaoMesCorreto.Id);
    }

    [Fact]
    public async Task FindByEmpresaAndMonthAsync_DeveOrdenarPorDataVencimento()
    {
        var obrigacao1 = CreateObrigacao(mes: 6, tipo: TipoObrigacao.DAS); // Vencimento julho
        obrigacao1.DataVencimento = new DateTime(2026, 7, 20);
        var obrigacao2 = CreateObrigacao(mes: 6, tipo: TipoObrigacao.eSocial); // Vencimento julho
        obrigacao2.DataVencimento = new DateTime(2026, 7, 7);
        _sut.CreateRange([obrigacao1, obrigacao2]);
        await _context.SaveChangesAsync();

        var result = await _sut.FindByEmpresaAndMonthAsync(_empresaId, 2026, 6);

        result.Should().HaveCount(2);
        result[0].Id.Should().Be(obrigacao2.Id); // 07/07 antes de 20/07
        result[1].Id.Should().Be(obrigacao1.Id);
    }

    [Fact]
    public async Task FindEntreguesByEmpresaAsync_DeveRetornarApenasEntregues()
    {
        var entregue = CreateObrigacao(mes: 5, dataEntrega: new DateTime(2026, 6, 15));
        var pendente = CreateObrigacao(mes: 6);
        _sut.CreateRange([entregue, pendente]);
        await _context.SaveChangesAsync();

        var result = await _sut.FindEntreguesByEmpresaAsync(_empresaId);

        result.Should().HaveCount(1);
        result[0].Id.Should().Be(entregue.Id);
    }

    [Fact]
    public async Task HasObrigacoesInYearAsync_AnoComObrigacoes_DeveRetornarTrue()
    {
        var obrigacao = CreateObrigacao(mes: 6);
        _sut.CreateRange([obrigacao]);
        await _context.SaveChangesAsync();

        var result = await _sut.HasObrigacoesInYearAsync(_empresaId, 2026);

        result.Should().BeTrue();
    }

    [Fact]
    public async Task HasObrigacoesInYearAsync_AnoSemObrigacoes_DeveRetornarFalse()
    {
        var obrigacao = CreateObrigacao(mes: 6);
        _sut.CreateRange([obrigacao]);
        await _context.SaveChangesAsync();

        var result = await _sut.HasObrigacoesInYearAsync(_empresaId, 2025);

        result.Should().BeFalse();
    }

    [Fact]
    public async Task CreateRange_DevePersistirMultiplasObrigacoes()
    {
        var obrigacoes = new[] { CreateObrigacao(), CreateObrigacao(tipo: TipoObrigacao.DCTF) };
        _sut.CreateRange(obrigacoes);
        await _context.SaveChangesAsync();

        var count = await _context.Obrigacoes.CountAsync();
        count.Should().Be(2);
    }

    [Fact]
    public async Task Update_DeveAlterarDataEntregaEStatus()
    {
        var obrigacao = CreateObrigacao();
        _sut.CreateRange([obrigacao]);
        await _context.SaveChangesAsync();

        obrigacao.DataEntrega = new DateTime(2026, 7, 15);
        obrigacao.Status = StatusObrigacao.Entregue;
        _sut.Update(obrigacao);
        await _context.SaveChangesAsync();

        var updated = await _context.Obrigacoes.FindAsync(obrigacao.Id);
        updated!.DataEntrega.Should().Be(new DateTime(2026, 7, 15));
        updated.Status.Should().Be(StatusObrigacao.Entregue);
    }
}
