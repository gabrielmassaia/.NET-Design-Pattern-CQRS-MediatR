using MediatR;
using PainelObrigacoes.Domain.Enums;

namespace PainelObrigacoes.Domain.Empresas.Events;

public sealed record EmpresaCreatedEvent(
    Guid EmpresaId,
    string CNPJ,
    string RazaoSocial,
    RegimeTributario Regime) : INotification;
