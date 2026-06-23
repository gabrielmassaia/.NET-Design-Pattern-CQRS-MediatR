using Microsoft.Extensions.DependencyInjection;
using PainelObrigacoes.Application.Tags.Services;
using PainelObrigacoes.Domain.Tags.Repositories;
using PainelObrigacoes.Infrastructure.Data.Tags.Repositories;

namespace PainelObrigacoes.Infrastructure.CrossCutting.IoC.Tags;

public static class TagSetup
{
    public static IServiceCollection AddTagFeature(this IServiceCollection services)
    {
        services.AddScoped<ITagAppService, TagAppService>();
        services.AddScoped<ITagRepository, TagRepository>();
        return services;
    }
}
