using AutoMapper;
using CleanArchReference.Application.Dashboard.ViewModels;
using CleanArchReference.Domain.Dashboard.Models;

namespace CleanArchReference.Application.Dashboard.AutoMapper;

public sealed class DashboardProfile : Profile
{
    public DashboardProfile()
    {
        CreateMap<DashboardModel, DashboardResultViewModel>();
        CreateMap<AlertaModel, AlertaResultViewModel>();
    }
}
