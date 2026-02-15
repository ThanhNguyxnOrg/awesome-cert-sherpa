# Website

This website uses [Docusaurus](https://docusaurus.io/) and is managed from the workspace root with `pnpm`.

## Local Development

Run commands from repository root:

```bash
pnpm install
pnpm dev
```

Site URL: `http://localhost:3000/awesome-cert-sherpa/`

## Build

```bash
pnpm build
```

This runs bank build + static site build and outputs production assets to `website/build/`.

## Preview Production Build

```bash
pnpm serve
```

## Deployment

Deployment is handled by GitHub Actions (`.github/workflows/deploy.yml`) on push to `main`.
