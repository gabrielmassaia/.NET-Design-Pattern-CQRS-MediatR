using AutoMapper;
using CleanArchReference.Application.Obrigacoes.ViewModels;
using CleanArchReference.Domain.Obrigacoes.Queries;
using CleanArchReference.Domain.Obrigacoes.Models;

namespace CleanArchReference.Application.Obrigacoes.AutoMapper;

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
