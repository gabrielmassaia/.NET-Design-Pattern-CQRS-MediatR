using AutoMapper;
using PainelObrigacoes.Application.Obrigacoes.ViewModels;
using PainelObrigacoes.Domain.Obrigacoes.Queries;
using PainelObrigacoes.Domain.Obrigacoes.Models;

namespace PainelObrigacoes.Application.Obrigacoes.AutoMapper;

public sealed class ObrigacaoProfile : Profile
{
    public ObrigacaoProfile()
    {
        CreateMap<FindObrigacoesViewModel, FindObrigacoesQuery>();
        CreateMap<ObrigacaoModel, ObrigacaoResultViewModel>()
            .ForMember(d => d.RazaoSocial, o => o.Ignore());
        CreateMap<ObrigacaoReadModel, ObrigacaoResultViewModel>();
    }
}
