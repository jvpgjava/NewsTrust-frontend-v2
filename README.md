# NewsTrust Frontend (Angular / Signals)

Frontend do NewsTrust — análise de credibilidade de notícias e fontes digitais. Reescrita em
Angular 22 (standalone, zoneless, Signals), substituindo a versão anterior em Next.js/React.

## Stack

- **Angular 22**, standalone components, **zoneless** change detection
- **Signals** (`signal()`/`computed()`/`effect()`) como mecanismo primário de estado
- **Tailwind CSS v4** (CSS-first, `@theme` em `src/styles.css`)
- **Vitest** para testes unitários (padrão do Angular CLI nesta versão)
- **D3.js** para o grafo de credibilidade interativo (força-dirigida, zoom/pan, drag)
- **Server-Sent Events** (`EventSource`) para atualização em tempo real do grafo

## Estrutura

```
src/app
├── core            # Layout raiz, interceptor HTTP, cliente SSE
├── shared          # Modelos TypeScript (espelham os DTOs do backend) e UI reutilizável
└── features
    ├── content-analysis   # Análise de conteúdo de notícia
    ├── source-analysis    # Análise de credibilidade de fonte (URL)
    └── trust-graph        # Rede de fontes / rede de notícias (D3 + SSE)
```

Cada feature tem seu próprio service de API, DTOs e componentes — nada de pastas genéricas
`services/`/`components/` soltas na raiz.

## Rodando localmente

```powershell
npm install
npm start
```

Abre em `http://localhost:4200`, apontando por padrão para `http://localhost:8080/api`
(`src/environments/environment.ts`) — suba o [NewsTrustV2-backend](../NewsTrustV2-backend) local
antes de testar as telas.

## Testes

```powershell
npm test
```

## Build de produção

```powershell
npm run build
```

Gera `dist/newstrust-frontend/browser/` — arquivos estáticos prontos para serem servidos pelo
Nginx (sem servidor Node, sem SSR). O `apiBaseUrl` de produção é relativo (`/api`): o mesmo build
funciona em qualquer ambiente, desde que o Nginx daquele domínio faça proxy de `/api/*` para o
backend correto (ver guia de deploy).

## Deploy

Sem Docker — build estático + Nginx + Jenkins, na mesma VPS do backend. Guia completo, incluindo
os dois ambientes (produção e dev/homolog):
[`NewsTrustV2-backend/docs/DEPLOY.md`](../NewsTrustV2-backend/docs/DEPLOY.md).
