using FluentAssertions;
using Moq;
using PainelObrigacoes.Domain.Enums;
using PainelObrigacoes.Domain.Obrigacoes.Models;
using PainelObrigacoes.Domain.Obrigacoes.Queries;
using PainelObrigacoes.Domain.Obrigacoes.QueryHandlers;
using PainelObrigacoes.Domain.Obrigacoes.Repositories;
using Xunit;

namespace PainelObrigacoes.Tests.Domain.Obrigacoes;

public class FindObrigacoesQueryHandlerTests
{
    private readonly Mock<IObrigacaoRepository> _repositoryMock = new();
    private readonly FindObrigacoesQueryHandler _handler;

    public FindObrigacoesQueryHandlerTests()
    {
        _handler = new FindObrigacoesQueryHandler(_repositoryMock.Object);
    }

    [Fact]
    public async Task Handle_DeveCalcularStatusCorretamente()
    {
        var empresaId = Guid.NewGuid();
        var hoje = DateTime.UtcNow.Date;

        var obrigacoes = new List<ObrigacaoReadModel>
        {
            new() { Id = Guid.NewGuid(), EmpresaId = empresaId, Tipo = TipoObrigacao.DAS, Competencia = new DateTime(hoje.Year, 1, 1), DataVencimento = hoje.AddDays(-5), Status = StatusObrigacao.Pendente },
            new() { Id = Guid.NewGuid(), EmpresaId = empresaId, Tipo = TipoObrigacao.DCTF, Competencia = new DateTime(hoje.Year, 1, 1), DataVencimento = hoje.AddDays(10), Status = StatusObrigacao.Pendente },
            new() { Id = Guid.NewGuid(), EmpresaId = empresaId, Tipo = TipoObrigacao.eSocial, Competencia = new DateTime(hoje.Year, 1, 1), DataVencimento = hoje.AddDays(-1), DataEntrega = hoje.AddDays(-2), Status = StatusObrigacao.Entregue },
        };

        _repositoryMock.Setup(r => r.FindByEmpresaAndMonthAsync(empresaId, hoje.Year, 1, 0, 100))
            .ReturnsAsync(obrigacoes);

        var result = await _handler.Handle(new FindObrigacoesQuery { EmpresaId = empresaId, Ano = hoje.Year, Mes = 1 }, CancellationToken.None);

        result.Should().HaveCount(3);
        result[0].Status.Should().Be(StatusObrigacao.Atrasada);
        result[1].Status.Should().Be(StatusObrigacao.Pendente);
        result[2].Status.Should().Be(StatusObrigacao.Entregue);
    }
}
