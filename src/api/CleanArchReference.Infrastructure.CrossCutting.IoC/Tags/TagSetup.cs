using Microsoft.Extensions.DependencyInjection;
using CleanArchReference.Application.Tags.Services;
using CleanArchReference.Domain.Tags.Repositories;
using CleanArchReference.Infrastructure.Data.Tags.Repositories;

namespace CleanArchReference.Infrastructure.CrossCutting.IoC.Tags;

public static class TagSetup
{
    public static IServiceCollection AddTagFeature(this IServiceCollection services)
    {
        services.AddScoped<ITagAppService, TagAppService>();
        services.AddScoped<ITagRepository, TagRepository>();
        return services;
    }
}
