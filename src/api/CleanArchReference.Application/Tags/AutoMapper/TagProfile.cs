using AutoMapper;
using CleanArchReference.Application.Tags.ViewModels;
using CleanArchReference.Domain.Tags.Commands;
using CleanArchReference.Domain.Tags.Models;

namespace CleanArchReference.Application.Tags.AutoMapper;

public sealed class TagProfile : Profile
{
    public TagProfile()
    {
        CreateMap<CreateTagViewModel, CreateTagCommand>();
        CreateMap<TagModel, TagResultViewModel>();
    }
}
