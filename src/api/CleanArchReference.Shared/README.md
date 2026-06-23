# CleanArchReference.Shared — Fundação Compartilhada

## ⑦ Degrau na escada (base de tudo)

```
 ① Api
 ② Application
 ③ IoC
 ④ Domain
 ⑤ Data
 ⑥ Services
 ─────────────────────
 ⑦ Shared  ← VOCÊ ESTÁ AQUI
```

## Responsabilidade

Fornece tipos comuns e o contrato de resposta unificado para toda a aplicação.
É a única camada que não depende de nenhum outro projeto — serve de alicerce.

## O que contém

- `ResponseData/ResponseData<T>` — envelope único de resposta da API:
  ```json
  { "success": true, "message": "", "data": { ... }, "errorCode": null }
  ```
- `ResponseData/ResponseErrorCode` — enum com códigos de erro padronizados

## Dependências

- **Zero dependências** — projeto raiz

## Quem depende

- CleanArchReference.Domain
- CleanArchReference.Application
- CleanArchReference.Api
