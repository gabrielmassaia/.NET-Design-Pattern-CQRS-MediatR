// ============================================================
// 🟢 FASE 2 — DI Setup da Feature Empresa
// ============================================================
//
// Responsabilidade: "Registrar TODAS as dependências da feature Empresa no DI"
//
// AddScoped = uma instância por requisição HTTP
// AddSingleton = uma instância pra toda a aplicação
// AddTransient = uma nova instância cada vez que pedir
//
// O QUE É REGISTRADO AQUI:
//
//   IEmpresaAppService → EmpresaAppService
//     Quem usa: Endpoint (EmpresasEndpoints.cs)
//     Função: tradutor entre HTTP e Domain
//
//   IEmpresaRepository → EmpresaRepository
//     Quem usa: CreateEmpresaCommandHandler
//     Função: acesso a dados de empresa
//
//   IEmpresaSearchService → MeilisearchEmpresaService
//     Quem usa: EmpresaCreatedHandler (evento)
//     Função: indexar/buscar empresas no Meilisearch
//
//   INotificationHandler<EmpresaCreatedEvent> → EmpresaCreatedHandler
//     Quem usa: MediatR (quando EmpresaCreatedEvent é publicado)
//     Função: side effects pós-criação
//
// Esse método é chamado pelo ProjectBootstrapper.RegisterServices()
// ============================================================

using MediatR;
using Microsoft.Extensions.DependencyInjection;
using CleanArchReference.Application.Empresas.Services;
using CleanArchReference.Domain.Empresas.Repositories;
using CleanArchReference.Domain.Empresas.Services;
using CleanArchReference.Infrastructure.Data.Empresas.Repositories;
using CleanArchReference.Infrastructure.Data.Events;
using CleanArchReference.Infrastructure.Data.Search;

namespace CleanArchReference.Infrastructure.CrossCutting.IoC.Empresas;

public static class EmpresaSetup
{
    public static IServiceCollection AddEmpresaFeature(this IServiceCollection services)
    {
        // 🟢 Application Layer
        services.AddScoped<IEmpresaAppService, EmpresaAppService>();

        // 🟠 Infrastructure.Data Layer
        services.AddScoped<IEmpresaRepository, EmpresaRepository>();
        services.AddScoped<IEmpresaSearchService, MeilisearchEmpresaService>();

        // 🟠 Event Handlers (side effects)
        services.AddScoped<INotificationHandler<Domain.Empresas.Events.EmpresaCreatedEvent>, EmpresaCreatedHandler>();
        services.AddScoped<INotificationHandler<Domain.Empresas.Events.EmpresaDeletedEvent>, EmpresaDeletedHandler>();

        return services;
    }
}
