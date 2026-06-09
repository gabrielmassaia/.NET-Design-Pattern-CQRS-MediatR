# Plano de Implementação de Testes — case_e-Auditoria

> **Gerado em:** 09/06/2026  
> **Baseado no diagnóstico:** 90 testes backend + 131 testes frontend existentes  
> **Após implementação:** 163 testes backend (73 novos) + 174 testes frontend (43 novos)
> **Coverage frontend atual:** 87.68% statements, 86.87% branches, 82.16% functions, 87.59% lines

---

## Visão Geral

| Fase | Foco | Prioridade | Status | Testes Novos |
|------|------|-----------|--------|-------------|
| **1** | Riscos críticos (handlers, páginas principais, rollover) | 🔴 P0 | ✅ **Implementado** | 30 |
| **2** | Integração e serviços (export, search, repositories) | 🟠 P1 | ✅ **Implementado** | 43 |
| **3** | Componentes reutilizáveis e utilitários | 🟡 P2 | ✅ **Implementado** | 20 |
| **4** | CI/CD e coverage tooling | 🟢 P3 | ✅ **Implementado** | — |
| | **Total** | | **✅ 100% implementado** | **~116 novos** |

---

## Fase 1 — Riscos Críticos (P0)

### 1.1 Frontend: `EmpresaService` + `EmpresaForm` + `DashboardPage`

**Motivação:**
- `empresa.service.ts` é o único service HTTP sem teste
- `EmpresaForm.tsx` com apenas 47% coverage (sem teste de submissão/erro)
- `DashboardPage.tsx` com apenas 41% coverage (sem teste de exportação, alertas view, loading)

**Arquivos a criar:**

| Arquivo | Testes | Esforço |
|---------|--------|---------|
| `application/services/empresa.service.test.ts` | getAll, search, create, remove | 0.5h |
| `components/empresa/EmpresaForm.test.tsx` | submit, validation, loading, erro | 1.5h |
| `pages/Dashboard/DashboardPage.test.tsx` | alertas mode, export buttons, loading, erro, empty | 2h |

### 1.2 Frontend: `CalendarioPage` + `ExportButton` + `EmpresasPage`

**Motivação:**
- `CalendarioPage.tsx` com 76% — sem teste de filtro status, alertas, export
- `ExportButton.tsx` com apenas 18% coverage
- `EmpresasPage.tsx` com 76% — sem teste de busca, exclusão, modal

**Arquivos a criar:**

| Arquivo | Testes | Esforço |
|---------|--------|---------|
| `pages/Calendario/CalendarioPage.test.tsx` | filtros, registro entrega, export, loading, vazio | 1.5h |
| `components/calendario/ExportButton.test.tsx` | click export CSV/PDF, disabled state | 1h |
| `pages/Empresas/EmpresasPage.test.tsx` | busca, exclusão, modal create, histórico | 1.5h |

### 1.3 Backend: `YearRolloverService` + `BusinessDayAdjuster`

**Motivação:**
- `YearRolloverService` — executado a cada 24h em produção, **zero cobertura**
- `BusinessDayAdjuster` — apenas 1 teste indireto, sem teste dedicado

**Arquivos a criar:**

| Arquivo | Testes | Esforço |
|---------|--------|---------|
| `Domain/Obrigacoes/BusinessDayAdjusterTests.cs` | Natal, Ano Novo, sábado, domingo, quarta-feira | 0.5h |
| `Infrastructure.Data/Services/YearRolloverServiceTests.cs` | startup, 24h tick, empresas sem obrigações | 1h |

---

## Fase 2 — Integração e Serviços (P1)

### 2.1 Backend: ExportServices (`DashboardExport` + `ObrigacaoExport`)

**Motivação:** 390 linhas combinadas, QuestPDF, sem nenhum teste.

**Arquivos a criar:**

| Arquivo | Testes | Esforço |
|---------|--------|---------|
| `Infrastructure.Services/Dashboard/DashboardExportServiceTests.cs` | CSV alertas, CSV dashboard, PDF geração | 3h |
| `Infrastructure.Services/Obrigacoes/ObrigacaoExportServiceTests.cs` | CSV obrigações, PDF geração | 2h |

### 2.2 Backend: `MeilisearchEmpresaService` + Repositories (integration)

**Motivação:** Busca textual e repositórios sem cobertura.

**Arquivos a criar:**

| Arquivo | Testes | Esforço |
|---------|--------|---------|
| `Infrastructure.Data/Search/MeilisearchEmpresaServiceTests.cs` | index, delete, search, mapping | 1.5h |
| `Infrastructure.Data/Repositories/*RepositoryTests.cs` | CRUD, filtros, paginação (integration) | 4h |

### 2.3 Frontend: `base-service.ts` + `AppSidebar` + `ExportButton` coverage

**Motivação:** Componentes de navegação e base de services.

**Arquivos a criar:**

| Arquivo | Testes | Esforço |
|---------|--------|---------|
| `shared/services/base-service.test.ts` | getAll, create, update, remove, getRequest | 1h |
| `components/AppSidebar.test.tsx` | navegação, tema toggle, active state | 1h |
| `components/calendario/ExportButton.test.tsx` | cobertura completa | 1h |

---

## Fase 3 — Componentes Reutilizáveis (P2)

### 3.1 Frontend: Componentes visuais

**Arquivos a criar:**

| Arquivo | Testes | Esforço |
|---------|--------|---------|
| `components/dashboard/ChartCard.test.tsx` | render com label e children | 0.5h |
| `components/dashboard/LegendChip.test.tsx` | render com cor, label, count, pct | 0.5h |
| `components/empresa/RegimeMatrixModal.test.tsx` | render tabela de regimes | 1h |

### 3.2 Backend: Utilitários

| Arquivo | Testes | Esforço |
|---------|--------|---------|
| `Application/AutoMapper/*ProfileTests.cs` | validação de configuração AutoMapper | 1h |
| `Shared/ResponseData/ResponseDataTests.cs` | factory methods Ok/Fail | 0.5h |
| `Api/Extensions/ResultExtensionsTests.cs` | extension methods | 0.5h |

---

## Fase 4 — CI/CD e Coverage Tooling (P3)

### 4.1 Backend: Configurar coverlet

- Adicionar pacotes `coverlet.collector` + `coverlet.msbuild`
- Criar `coverlet.runsettings`
- Adicionar thresholds mínimo

### 4.2 CI: GitHub Actions

- Workflow com `dotnet test --collect:"XPlat Code Coverage"`
- Workflow com `npm run test:coverage`
- Executar em push/PR na main

---

## Referência de Padrões

### Frontend (Vitest + Testing Library + MSW)

```tsx
import { renderWithProviders, screen, userEvent } from '@/test/render';

describe('Component', () => {
  it('renders and interacts', async () => {
    renderWithProviders(<Component />);
    expect(await screen.findByText('Title')).toBeInTheDocument();
    await user.click(screen.getByRole('button'));
  });
});
```

### Backend (xUnit + Moq + FluentAssertions)

```csharp
[Fact]
public async Task DeveExecutarComSucesso()
{
    var mock = new Mock<IDependency>();
    mock.Setup(x => x.Method()).ReturnsAsync(expectedValue);
    var sut = new Service(mock.Object);
    var result = await sut.Execute();
    result.Should().Be(expectedValue);
}
```

---

## Como Executar

```bash
# Backend — Unit Tests
dotnet test src/api/PainelObrigacoes.Tests/PainelObrigacoes.Tests.csproj

# Backend — Integration Tests
dotnet test src/api/PainelObrigacoes.IntegrationTests/PainelObrigacoes.IntegrationTests.csproj

# Backend — All
dotnet test src/api

# Frontend — All
cd src/web && npm run test

# Frontend — Coverage
cd src/web && npm run test:coverage

# Build completo
dotnet build && cd src/web && npm run build
```
