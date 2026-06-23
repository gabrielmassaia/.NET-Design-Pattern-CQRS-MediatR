using AutoMapper;
using PainelObrigacoes.Application.Tags.ViewModels;
using PainelObrigacoes.Domain.Tags.Commands;
using PainelObrigacoes.Domain.Tags.Models;

namespace PainelObrigacoes.Application.Tags.AutoMapper;

public sealed class TagProfile : Profile
{
    public TagProfile()
    {
        CreateMap<CreateTagViewModel, CreateTagCommand>();
        CreateMap<TagModel, TagResultViewModel>();
    }
}
