using FluentAssertions;
using Moq;
using CleanArchReference.Domain.Enums;
using CleanArchReference.Domain.Obrigacoes.Models;
using CleanArchReference.Domain.Obrigacoes.Queries;
using CleanArchReference.Domain.Obrigacoes.QueryHandlers;
using CleanArchReference.Domain.Obrigacoes.Repositories;

namespace CleanArchReference.Tests.Domain.Obrigacoes;

public class GetHistoricoQueryHandlerTests
{
    private readonly Mock<IObrigacaoRepository> _repoMock = new();

    [Fact]
    public async Task Handle_DeveRetornarSomenteObrigacoesEntregues()
    {
        var empresaId = Guid.NewGuid();
        var entregues = new List<ObrigacaoReadModel>
        {
            new()
            {
                Id = Guid.NewGuid(), EmpresaId = empresaId, Tipo = TipoObrigacao.DAS,
                Competencia    = new DateTime(2024, 1, 1),
                DataVencimento = new DateTime(2024, 2, 20),
                DataEntrega    = new DateTime(2024, 2, 15),
                Status         = StatusObrigacao.Entregue
            }
        };

        _repoMock.Setup(r => r.FindEntreguesByEmpresaAsync(empresaId))
                 .ReturnsAsync(entregues);

        var handler = new GetHistoricoEmpresaQueryHandler(_repoMock.Object);
        var result  = await handler.Handle(
            new GetHistoricoEmpresaQuery { EmpresaId = empresaId },
            CancellationToken.None);

        result.Should().HaveCount(1);
        result[0].Status.Should().Be(StatusObrigacao.Entregue);
        result[0].DataEntrega.Should().Be(new DateTime(2024, 2, 15));
    }

    [Fact]
    public async Task Handle_SemEntregas_DeveRetornarListaVazia()
    {
        var empresaId = Guid.NewGuid();
        _repoMock.Setup(r => r.FindEntreguesByEmpresaAsync(empresaId))
                 .ReturnsAsync(new List<ObrigacaoReadModel>());

        var handler = new GetHistoricoEmpresaQueryHandler(_repoMock.Object);
        var result  = await handler.Handle(
            new GetHistoricoEmpresaQuery { EmpresaId = empresaId },
            CancellationToken.None);

        result.Should().BeEmpty();
    }
}
