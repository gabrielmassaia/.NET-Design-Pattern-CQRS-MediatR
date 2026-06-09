using MediatR;
using PainelObrigacoes.Domain.Empresas.Commands;
using PainelObrigacoes.Domain.Empresas.Events;
using PainelObrigacoes.Domain.Empresas.Models;
using PainelObrigacoes.Domain.Empresas.Repositories;
using PainelObrigacoes.Domain.Obrigacoes.Repositories;
using PainelObrigacoes.Domain.Obrigacoes.Services;
using PainelObrigacoes.Domain.Shared.Interfaces;

namespace PainelObrigacoes.Domain.Empresas.CommandHandlers;

public sealed class CreateEmpresaCommandHandler
    : IRequestHandler<CreateEmpresaCommand, EmpresaModel>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmpresaRepository _empresaRepository;
    private readonly IObrigacaoRepository _obrigacaoRepository;
    private readonly ITributaryRulesEngine _rulesEngine;
    private readonly IMediator _mediator;

    public CreateEmpresaCommandHandler(
        IUnitOfWork unitOfWork,
        IEmpresaRepository empresaRepository,
        IObrigacaoRepository obrigacaoRepository,
        ITributaryRulesEngine rulesEngine,
        IMediator mediator)
    {
        _unitOfWork = unitOfWork;
        _empresaRepository = empresaRepository;
        _obrigacaoRepository = obrigacaoRepository;
        _rulesEngine = rulesEngine;
        _mediator = mediator;
    }

    public async Task<EmpresaModel> Handle(
        CreateEmpresaCommand command, CancellationToken cancellationToken)
    {
        var cnpjLimpo = command.CNPJ.Replace(".", "").Replace("/", "").Replace("-", "");

        if (await _empresaRepository.ExistsByCnpjAsync(cnpjLimpo))
            throw new InvalidOperationException("CNPJ já cadastrado.");

        var model = command.ToModel();
        _empresaRepository.Create(model);

        var obrigacoes = _rulesEngine.GenerateAnoCompleto(model, DateTime.UtcNow.Year);
        _obrigacaoRepository.CreateRange(obrigacoes);

        await _unitOfWork.CompleteAsync(cancellationToken);

        await _mediator.Publish(
            new EmpresaCreatedEvent(model.Id, model.CNPJ, model.RazaoSocial, model.Regime),
            cancellationToken);

        return model;
    }
}
