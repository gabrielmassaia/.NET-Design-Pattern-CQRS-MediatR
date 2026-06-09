---
created: 2026-06
updated: 2026-06
tags: testing, backend, setup
scope: be
---

# Backend Testing — Setup

> Test project structure and configuration.

---

## Project Structure

```
PainelObrigacoes.Tests/
├── Domain/
│   ├── Engine/
│   │   └── TributaryRulesEngineTests.cs
│   ├── Empresas/
│   │   └── DeleteEmpresaCommandHandlerTests.cs
│   └── Obrigacoes/
│       ├── RegistrarEntregaCommandHandlerTests.cs
│       └── FindObrigacoesCommandHandlerTests.cs
├── Application/
│   └── EmpresaAppServiceTests.cs
└── Api/
    └── (integration tests in future)
```

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| xUnit | 2.9.2 | Test runner |
| Moq | 4.20 | Mocking framework |
| FluentAssertions | 6.12 | Assertion library |
| coverlet | 6.0.2 | Code coverage |

---

## Running Tests

```bash
# All tests
dotnet test src/api/PainelObrigacoes.Tests/PainelObrigacoes.Tests.csproj

# Filter by category
dotnet test --filter "FullyQualifiedName~TributaryRulesEngine"

# With coverage
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=opencover
```

---

## Test Patterns

### Handler Tests

```csharp
public class CreateXCommandHandlerTests
{
    private readonly Mock<IUnitOfWork> _uowMock = new();
    private readonly Mock<IXRepository> _repoMock = new();
    private readonly CreateXCommandHandler _handler;

    public CreateXCommandHandlerTests()
    {
        _handler = new CreateXCommandHandler(_uowMock.Object, _repoMock.Object);
    }

    [Fact]
    public async Task Handle_ShouldPersistAndCommit()
    {
        var result = await _handler.Handle(new CreateXCommand(), CancellationToken.None);

        result.Should().NotBeNull();
        _repoMock.Verify(r => r.Create(It.IsAny<XModel>()), Times.Once);
        _uowMock.Verify(u => u.CompleteAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task Handle_WhenNotFound_ShouldThrow()
    {
        var act = async () => await _handler.Handle(new CreateXCommand { Id = missingId }, CancellationToken.None);

        await act.Should().ThrowAsync<KeyNotFoundException>();
        _uowMock.Verify(u => u.CompleteAsync(It.IsAny<CancellationToken>()), Times.Never);
    }
}
```

### AppService Tests

```csharp
public class XAppServiceTests
{
    private readonly Mock<IMediatrService> _mediatorMock = new();
    private readonly Mock<IMapper> _mapperMock = new();
    private readonly XAppService _service;

    [Fact]
    public async Task CreateAsync_ShouldMapAndSend()
    {
        _mapperMock.Setup(m => m.Map<CreateXCommand>(viewModel)).Returns(command);
        _mediatorMock.Setup(m => m.SendCommand(command, It.IsAny<CancellationToken>())).ReturnsAsync(model);
        _mapperMock.Setup(m => m.Map<XResultViewModel>(model)).Returns(resultViewModel);

        var result = await _service.CreateAsync(viewModel);

        result.Should().BeEquivalentTo(resultViewModel);
        _mediatorMock.Verify(m => m.SendCommand(command, It.IsAny<CancellationToken>()), Times.Once);
    }
}
```
