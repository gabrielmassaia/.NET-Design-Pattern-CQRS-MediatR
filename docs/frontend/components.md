---
created: 2026-06
updated: 2026-06
tags: frontend, components
scope: fe
---

# Component Catalog

> Reusable UI components.

---

## Shared Components

### `StatusBadge`

Renders obligation status as a colored badge.

```tsx
<StatusBadge status={StatusObrigacao.Pendente} />   // blue
<StatusBadge status={StatusObrigacao.Atrasada} />   // red
<StatusBadge status={StatusObrigacao.Entregue} />   // green
```

### `RegimeBadge`

Renders tax regime as a tagged label.

```tsx
<RegimeBadge regime={RegimeTributario.SimplesNacional} />
```

### `PageHeader`

Consistent page title with optional subtitle.

```tsx
<PageHeader title="Empresas" subtitle="Gerencie os CNPJs cadastrados" />
```

---

## Dashboard Components

### `StatCard`

Single metric display card.

```tsx
<StatCard title="Total Empresas" value={42} icon={<BuildingOutlined />} color="#1565C0" />
```

### `AlertasTable`

Table showing upcoming/overdue obligations.

```tsx
<AlertasTable data={alertas} loading={isLoading} />
```

---

## Empresa Components

### `EmpresaTable`

Table listing all registered companies.

```tsx
<EmpresaTable
  data={empresas}
  loading={isLoading}
  onDelete={(id) => handleDelete(id)}
/>
```

### `EmpresaForm`

Modal form for creating a new company.

```tsx
<EmpresaForm
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  onSubmit={(values) => handleCreate(values)}
  loading={isPending}
/>
```

---

## Calendario Components

### `ObrigacaoTable`

Table displaying monthly obligations for a company.

```tsx
<ObrigacaoTable
  data={obrigacoes}
  loading={isLoading}
  onRegisterEntrega={(id) => handleEntrega(id)}
/>
```

### `CalendarioFilters`

Filter bar for the calendar view.

```tsx
<CalendarioFilters
  empresas={empresas}
  empresaId={selectedEmpresa}
  mes={selectedMes}
  ano={selectedAno}
  onChange={handleFilterChange}
/>
```
