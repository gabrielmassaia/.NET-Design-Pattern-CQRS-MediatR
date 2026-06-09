using AutoMapper;
using PainelObrigacoes.Application.Dashboard.ViewModels;
using PainelObrigacoes.Domain.Dashboard.Models;

namespace PainelObrigacoes.Application.Dashboard.AutoMapper;

public sealed class DashboardProfile : Profile
{
    public DashboardProfile()
    {
        CreateMap<DashboardModel, DashboardResultViewModel>();
        CreateMap<AlertaModel, AlertaResultViewModel>();
    }
}
