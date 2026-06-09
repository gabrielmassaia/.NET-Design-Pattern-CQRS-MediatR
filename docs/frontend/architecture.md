---
created: 2026-06
updated: 2026-06
tags: frontend, architecture, react
scope: fe
---

# Frontend Architecture

> React 19 feature-based architecture with TanStack Query.

---

## Layer Diagram

```mermaid
graph TD
    subgraph "Pages"
        D[DashboardPage]
        E[EmpresasPage]
        C[CalendarioPage]
    end

    subgraph "Hooks (TanStack Query)"
        HD[useDashboard]
        HE[useEmpresas]
        HO[useObrigacoes]
    end

    subgraph "Services"
        S_D[dashboard.service.ts]
        S_E[empresa.service.ts]
        S_O[obrigacao.service.ts]
    end

    subgraph "API Layer"
        A[api/axios.ts]
    end

    subgraph "Components"
        SB[StatusBadge]
        RB[RegimeBadge]
        PH[PageHeader]
        SC[StatCard]
        AT[AlertasTable]
        ET[EmpresaTable]
        EF[EmpresaForm]
        OT[ObrigacaoTable]
        CF[CalendarioFilters]
    end

    D --> HD
    D --> SC
    D --> AT
    E --> HE
    E --> ET
    E --> EF
    C --> HO
    C --> OT
    C --> CF

    HD --> S_D
    HE --> S_E
    HO --> S_O

    S_D --> A
    S_E --> A
    S_O --> A

    SB -.-> D
    SB -.-> E
    SB -.-> C
    RB -.-> E
    PH -.-> D
    PH -.-> E
    PH -.-> C

    style Pages fill:#e8daef,stroke:#6c3483
    style Hooks fill:#d5f5e3,stroke:#1e8449
    style Services fill:#fdebd0,stroke:#935116
    style Components fill:#d4e6f1,stroke:#2c3e50
```

---

## Data Flow

```mermaid
sequenceDiagram
    participant Page as Page Component
    participant Hook as Custom Hook (TanStack)
    participant Service as Service File
    participant Axios as api/axios
    participant API as .NET API

    Page->>Hook: useQuery/useMutation
    Hook->>Service: Call service function
    Service->>Axios: HTTP request
    Axios->>API: GET/POST/DELETE
    API-->>Axios: JSON (ResponseData)
    Axios-->>Service: Parsed response
    Service-->>Hook: Typed data
    Hook-->>Page: Re-render with data
```

---

## Route Structure

| Route | Page Component | Description |
|---|---|---|
| `/` | Redirect to `/dashboard` | Root |
| `/dashboard` | `DashboardPage` | Statistics + alerts |
| `/empresas` | `EmpresasPage` | Company CRUD |
| `/calendario` | `CalendarioPage` | Obligation calendar |
| `/alertas` | `DashboardPage showOnlyAlertas` | Alert list view |

---

## Key Dependencies

| Package | Purpose |
|---|---|
| `antd` | UI components (Table, Form, Layout, Modal, Select, DatePicker) |
| `@ant-design/icons` | Icon library |
| `@tanstack/react-query` | Server state management |
| `axios` | HTTP client |
| `dayjs` | Date manipulation (locale pt-BR) |

---

## Project Structure

```
src/web/src/
├── infrastructure/http/ → axios.ts (base instance + interceptors)
├── application/services/ → HTTP calls per feature (class-based services)
├── hooks/         → TanStack Query hooks
├── pages/         → Route-level components
├── components/    → Reusable UI components
├── domain/types/  → TypeScript interfaces and enums
├── shared/        → BaseService, ApiResponse, utilities
├── lib/           → Query key factories
├── context/       → Theme context
├── theme/         → Ant Design theme config
└── utils/         → Formatters and helpers
```
