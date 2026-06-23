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
CleanArchReference.Tests/
├── Api/
│   └── Extensions/
│       └── ResultExtensionsTests.cs
├── Application/
│   ├── AutoMapper/
│   │   └── AutoMapperProfileTests.cs
│   ├── CachedDashboardAppServiceTests.cs
│   ├── DashboardAppServiceTests.cs
│   ├── EmpresaAppServiceTests.cs
│   ├── EmpresaCreatedHandlerTests.cs
│   ├── EmpresaDeletedHandlerTests.cs
│   ├── ObrigacaoAppServiceTests.cs
│   └── ObrigacaoEntregueHandlerTests.cs
├── Domain/
│   ├── Dashboard/
│   │   ├── GetAlertasQueryHandlerTests.cs
│   │   └── GetDashboardQueryHandlerTests.cs
│   ├── Empresas/
│   │   ├── CreateEmpresaCommandHandlerTests.cs
│   │   ├── CreateEmpresaCommandValidationTests.cs
│   │   ├── DeleteEmpresaCommandHandlerTests.cs
│   │   ├── FindEmpresasQueryHandlerTests.cs
│   │   └── SearchEmpresasQueryHandlerTests.cs
│   ├── Engine/
│   │   └── TributaryRulesEngineTests.cs
│   ├── Obrigacoes/
│   │   ├── BrazilianHolidayProviderTests.cs
│   │   ├── BusinessDayAdjusterTests.cs
│   │   ├── FindObrigacoesQueryHandlerTests.cs
│   │   ├── FindObrigacoesQueryValidationTests.cs
│   │   ├── GetHistoricoQueryHandlerTests.cs
│   │   ├── RegistrarEntregaCommandHandlerTests.cs
│   │   └── RegistrarEntregaCommandValidationTests.cs
│   └── Shared/
│       └── ValidationBehaviorTests.cs
├── Infrastructure/
│   ├── Data/
│   │   ├── Repositories/
│   │   │   ├── EmpresaRepositoryTests.cs
│   │   │   └── ObrigacaoRepositoryTests.cs
│   │   ├── Search/
│   │   │   └── MeilisearchEmpresaServiceTests.cs
│   │   └── Services/
│   │       └── YearRolloverServiceTests.cs
│   └── Services/
│       ├── Dashboard/
│       │   └── DashboardExportServiceTests.cs
│       └── Obrigacoes/
│           └── ObrigacaoExportServiceTests.cs
└── Shared/
    └── ResponseDataTests.cs
```

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| xUnit | 2.9.2 | Test runner |
| Moq | 4.20 | Mocking framework |
| FluentAssertions | 6.12 | Assertion library |
| coverlet | 6.0.2 | Code coverage |
| EF Core InMemory | 9.x | In-memory database for repository tests |

---

## Running Tests

```bash
# All tests
dotnet test src/api/CleanArchReference.Tests/CleanArchReference.Tests.csproj

# Filter by category
dotnet test --filter "FullyQualifiedName~TributaryRulesEngine"

# With coverage (using runsettings)
dotnet test --settings coverlet.runsettings

# Integration tests
dotnet test src/api/CleanArchReference.IntegrationTests/CleanArchReference.IntegrationTests.csproj
```

---

## Test Patterns

### Handler Tests (Moq + FluentAssertions)

```csharp
[Fact]
public async Task Handle_ShouldPersistAndCommit()
{
    var result = await _handler.Handle(new CreateXCommand(), CancellationToken.None);

    result.Should().NotBeNull();
    _repoMock.Verify(r => r.Create(It.IsAny<XModel>()), Times.Once);
    _uowMock.Verify(u => u.CompleteAsync(It.IsAny<CancellationToken>()), Times.Once);
}
```

### Repository Tests (EF Core InMemory)

```csharp
public class XRepositoryTests : IDisposable
{
    private readonly AppDbContext _context;
    private readonly XRepository _sut;

    public XRepositoryTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        _context = new AppDbContext(options);
        _sut = new XRepository(_context);
    }

    public void Dispose()
    {
        _context.Dispose();
        GC.SuppressFinalize(this);
    }
}
```

### Search Service Tests (Mock HTTP)

```csharp
// Uses MeilisearchClient(HttpClient, url) constructor
// with a custom MockHttpMessageHandler that returns
// expected JSON responses

var handler = new MockHttpMessageHandler();
var httpClient = new HttpClient(handler) { BaseAddress = new Uri("http://localhost:7700") };
var client = new MeilisearchClient(httpClient, "http://localhost:7700");
var sut = new MeilisearchEmpresaService(client);
```

### Export Service Tests (QuestPDF)

```csharp
// Static constructor to set QuestPDF license
static XExportServiceTests()
{
    QuestPDF.Settings.License = LicenseType.Community;
}
```
