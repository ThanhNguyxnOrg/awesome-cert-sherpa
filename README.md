# Awesome CertSherpa

> Community-driven IT certification prep — curated resources, original practice questions, and an anti-dump pledge stitched into every card.

[![Deploy to GitHub Pages](https://github.com/ThanhNguyxnOrg/awesome-cert-sherpa/actions/workflows/deploy.yml/badge.svg)](https://github.com/ThanhNguyxnOrg/awesome-cert-sherpa/actions/workflows/deploy.yml)
[![Validate Question Bank](https://github.com/ThanhNguyxnOrg/awesome-cert-sherpa/actions/workflows/validate-bank.yml/badge.svg)](https://github.com/ThanhNguyxnOrg/awesome-cert-sherpa/actions/workflows/validate-bank.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Questions](https://img.shields.io/badge/Questions-1%2C590%2B-0e5a8a)](https://thanhnguyxnorg.github.io/awesome-cert-sherpa/practice)
[![Certifications](https://img.shields.io/badge/Certifications-14-2b6e5a)](https://thanhnguyxnorg.github.io/awesome-cert-sherpa/practice)
[![Code of Conduct](https://img.shields.io/badge/Code%20of%20Conduct-Contributor%20Covenant-e07a2f)](CODE_OF_CONDUCT.md)

CertSherpa is the field journal for climbing IT certifications — a hand-curated awesome list paired with a practice engine that never ships exam dumps. Every question is original, scenario-based, and mapped to published exam objectives.

> **Tagline:** *Study smarter, summit higher.* 🏔️

## ✨ Highlights

- **1,590+ original practice questions** across 14 certifications
- **440+ curated resources** across 7 categories
- **Strict anti-dump policy** — no leaked or NDA-violating material, ever
- **Vendor-neutral coverage** — AWS, Azure, GCP, CompTIA, Cisco, Kubernetes, Linux, HashiCorp, ISC2, PMI
- **Topographic field-journal UI** — paper, ink, and altimeter chips instead of generic SaaS gradients
- **100% open source, free, and ad-free**

## 🎯 Covered Certifications

| Domain | Certifications | Bank size |
|---|---|---|
| Cloud | AWS SAA · AWS SAP · AZ-900 · AZ-104 · GCP ACE | 590 |
| Security | CompTIA Security+ (SY0-701) · CISSP | 200 |
| Networking | CCNA · Network+ | 220 |
| DevOps | CKA · Terraform Associate | 250 |
| Linux | LPIC-1 | 100 |
| Data & AI | AWS MLS-C01 | 100 |
| PM & ITSM | PMP | 130 |

## ⚡ Quickstart

```bash
git clone https://github.com/ThanhNguyxnOrg/awesome-cert-sherpa.git
cd awesome-cert-sherpa
pnpm install

# Local docs site at http://localhost:3000/awesome-cert-sherpa/
pnpm dev

# Validate the question bank against bank/schema.json
pnpm validate:bank

# Production build (static, deploys to GitHub Pages)
pnpm build

# Serve the production build locally
pnpm serve
```

Site URL: <https://thanhnguyxnorg.github.io/awesome-cert-sherpa/>

## 🧱 Project Structure

```text
awesome-cert-sherpa/
├── website/          # Docusaurus 3 portal — pages, components, styles
│   ├── src/components/expedition/   # The visual system (compass, peaks, paper buttons)
│   ├── src/pages/                   # Home, Practice
│   └── plugins/                     # YAML loader + Tailwind PostCSS bridge
├── content/          # Curated resource YAML + source registry
├── bank/             # Question bank YAML (schema-validated)
├── tools/            # Validator + bank build pipeline (TypeScript)
├── .github/          # Issue templates + Actions workflows
└── pnpm-workspace.yaml
```

## 🛠️ Stack

- Node.js 20+ · pnpm workspaces
- TypeScript end-to-end
- Docusaurus 3.9 · React 19
- Tailwind CSS v4 (PostCSS, scoped to the website workspace)
- Framer Motion (`motion`) for choreographed transitions
- YAML + JSON Schema (Ajv validation)
- GitHub Actions for validation and Pages deploy

## 🎨 Design system — *Topographic Expedition*

The site borrows from a Himalayan field journal:

- **Palette:** Daybreak Glacier (light) / Aurora Bivouac (dark)
- **Type:** Fraunces (display, italic) · Inter (body) · JetBrains Mono (data)
- **Signature elements:** topographic contour SVG, altimeter chips, trail-rope progress bar, ink-stamped verdicts, paper-tinted journal cards

All tokens live in [`website/src/css/tokens.css`](website/src/css/tokens.css) as plain CSS custom properties so both Docusaurus' Infima theme and the Tailwind v4 utility layer pull from the same source of truth.

## 🗺️ Roadmap

| Phase | Status | Description |
|---|---|---|
| 1 — Scaffold | ✅ | Docusaurus portal, Pages config, category structure |
| 2 — Content | ✅ | 1,590+ practice questions, 440+ curated resources |
| 3 — Community | ✅ | Issue/PR templates, Discussions, contribution workflow |
| 4 — Practice Engine | ✅ | Picker → Quiz → Summit log with localStorage stats |
| 5 — Visual rebuild | ✅ | Topographic Expedition design system |
| 6 — Platform hardening | ✅ | CI validation + automated Pages deploy |
| 7 — Grow | 🚧 | Community voting, verified badges, multilingual |

## 🛡️ Anti-Dump Policy

> **CertSherpa never hosts, links to, or sells exam dumps, leaked questions, or NDA-violating material.**

- **No exam dumps** — real exam questions are forbidden.
- **No NDA violations** — verbatim exam content is removed within 48 hours.
- **Practice questions only** — original, objective-aligned, community-written.
- **Report violations:** [open an issue](https://github.com/ThanhNguyxnOrg/awesome-cert-sherpa/issues/new/choose) and maintainers will triage within 48 hours.

## 🤝 Contributing

Contributions are welcome — resources, questions, docs, fixes, and tooling.

- Start here: [CONTRIBUTING.md](CONTRIBUTING.md)
- Security reports: [SECURITY.md](SECURITY.md)
- Governance and review model: [GOVERNANCE.md](GOVERNANCE.md)
- Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## 🔗 Links

- Repository: <https://github.com/ThanhNguyxnOrg/awesome-cert-sherpa>
- Live site: <https://thanhnguyxnorg.github.io/awesome-cert-sherpa/>
- Discussions: <https://github.com/ThanhNguyxnOrg/awesome-cert-sherpa/discussions>

## 📄 License

[MIT](LICENSE) © Awesome CertSherpa contributors.
