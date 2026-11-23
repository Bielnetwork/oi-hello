# Oi Hello

oi

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/9850f491-5825-496f-8104-6c92b0c56e1a).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Rota 60 — site de vendas

O funil utiliza React e Vite dentro da estrutura TanStack Start do projeto Lovable.
Use Node.js 22.12 ou superior (ou Node.js 24) e Bun para instalar as versões do lockfile.

```sh
bun install --frozen-lockfile
bun run dev
bun run build
bun run test
```

Abra `/` ou `/experiencia` para a demonstração. A conclusão leva a `/oferta`, que também
pode ser acessada diretamente. As ilustrações ficam em `public/images`. O áudio usa a
síntese de voz do navegador e depende das vozes instaladas no dispositivo.

A seleção de planos é demonstrativa. Checkout Wiapy e integração com o miniapp de entrega
estão pendentes. O push para `main` sincroniza o código com o editor vinculado. Para atualizar
o endereço público, use **Publish → Publish changes** nesse mesmo projeto Lovable.
