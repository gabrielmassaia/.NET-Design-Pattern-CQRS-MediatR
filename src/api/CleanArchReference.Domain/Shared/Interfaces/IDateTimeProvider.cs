namespace CleanArchReference.Domain.Shared.Interfaces;

public interface IDateTimeProvider
{
    DateTime UtcNow { get; }
    int CurrentYear { get; }
    int CurrentMonth { get; }
}
