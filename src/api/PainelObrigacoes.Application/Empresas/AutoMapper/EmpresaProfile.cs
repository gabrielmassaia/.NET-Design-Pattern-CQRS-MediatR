using AutoMapper;
using PainelObrigacoes.Application.Empresas.ViewModels;
using PainelObrigacoes.Domain.Empresas.Commands;
using PainelObrigacoes.Domain.Empresas.Models;

namespace PainelObrigacoes.Application.Empresas.AutoMapper;

public sealed class EmpresaProfile : Profile
{
    public EmpresaProfile()
    {
        CreateMap<CreateEmpresaViewModel, CreateEmpresaCommand>();
        CreateMap<EmpresaModel, EmpresaResultViewModel>();
    }
}
