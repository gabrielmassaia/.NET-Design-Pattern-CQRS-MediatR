using FluentValidation;
using FluentAssertions;
using MediatR;
using CleanArchReference.Domain.Shared.Behaviors;

namespace CleanArchReference.Tests.Domain.Shared;

public class ValidationBehaviorTests
{
    private static Task<TestResponse> Next(CancellationToken _) =>
        Task.FromResult(new TestResponse());

    [Fact]
    public async Task Handle_QuandoSemValidadores_DeveChamarProximo()
    {
        var behavior = new ValidationBehavior<TestRequest, TestResponse>(Enumerable.Empty<IValidator<TestRequest>>());

        var result = await behavior.Handle(new TestRequest(), Next, CancellationToken.None);

        result.Should().NotBeNull();
    }

    [Fact]
    public async Task Handle_QuandoValidacaoPassa_DeveChamarProximo()
    {
        var validators = new List<IValidator<TestRequest>> { new TestValidator(true) };
        var behavior = new ValidationBehavior<TestRequest, TestResponse>(validators);

        var result = await behavior.Handle(new TestRequest { Value = "ok" }, Next, CancellationToken.None);

        result.Should().NotBeNull();
    }

    [Fact]
    public async Task Handle_QuandoValidacaoFalha_DeveLancarValidationException()
    {
        var validators = new List<IValidator<TestRequest>> { new TestValidator(false) };
        var behavior = new ValidationBehavior<TestRequest, TestResponse>(validators);

        var act = async () => await behavior.Handle(new TestRequest { Value = "" }, Next, CancellationToken.None);

        await act.Should().ThrowAsync<ValidationException>();
    }

    public sealed record TestRequest : IRequest<TestResponse>
    {
        public string Value { get; init; } = string.Empty;
    }

    public sealed record TestResponse();

    public sealed class TestValidator : AbstractValidator<TestRequest>
    {
        public TestValidator(bool shouldPass)
        {
            if (!shouldPass)
                RuleFor(x => x.Value).NotEmpty();
        }
    }
}
