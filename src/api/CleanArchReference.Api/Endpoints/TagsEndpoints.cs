using CleanArchReference.Api.Extensions;
using CleanArchReference.Application.Tags.Services;
using CleanArchReference.Application.Tags.ViewModels;
using CleanArchReference.Shared.ResponseData;

namespace CleanArchReference.Api.Endpoints;

public static class TagsEndpoints
{
    public static IEndpointRouteBuilder MapTagsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/tags")
            .WithTags("Tags");

        group.MapGet("/", FindAllAsync)
            .WithName("FindTags")
            .Produces<ResponseData<IList<TagResultViewModel>>>(StatusCodes.Status200OK);

        group.MapPost("/", CreateAsync)
            .WithName("CreateTag")
            .Produces<ResponseData<TagResultViewModel>>(StatusCodes.Status200OK)
            .Produces<ResponseData<object>>(StatusCodes.Status400BadRequest);

        group.MapDelete("/{id:guid}", DeleteAsync)
            .WithName("DeleteTag")
            .Produces<ResponseData<bool>>(StatusCodes.Status200OK)
            .Produces<ResponseData<object>>(StatusCodes.Status404NotFound);

        return app;
    }

    private static async Task<IResult> FindAllAsync(
        ITagAppService appService, CancellationToken ct)
    {
        var result = await appService.FindAllAsync(ct);
        return result.ToOkResponse();
    }

    private static async Task<IResult> CreateAsync(
        CreateTagViewModel payload,
        ITagAppService appService, CancellationToken ct)
    {
        var result = await appService.CreateAsync(payload, ct);
        return result.ToOkResponse();
    }

    private static async Task<IResult> DeleteAsync(
        Guid id,
        ITagAppService appService, CancellationToken ct)
    {
        var result = await appService.DeleteAsync(id, ct);
        return result.ToOkResponse();
    }
}
