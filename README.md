# Awesome CertSherpa

> 🏔️ Community-driven certification prep hub with curated resources and a no-dump practice engine.

[![Deploy to GitHub Pages](https://github.com/ThanhNguyxn/awesome-cert-sherpa/actions/workflows/deploy.yml/badge.svg)](https://github.com/ThanhNguyxn/awesome-cert-sherpa/actions/workflows/deploy.yml)
[![Validate Question Bank](https://github.com/ThanhNguyxn/awesome-cert-sherpa/actions/workflows/validate-bank.yml/badge.svg)](https://github.com/ThanhNguyxn/awesome-cert-sherpa/actions/workflows/validate-bank.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Questions](https://img.shields.io/badge/Questions-1%2C590%2B-0ea5e9)](https://thanhnguyxn.github.io/awesome-cert-sherpa/practice)
[![Certifications](https://img.shields.io/badge/Certifications-14-14b8a6)](https://thanhnguyxn.github.io/awesome-cert-sherpa/practice)

CertSherpa collects high-quality prep material in one place so you can **study smarter, not harder**. It combines awesome-list style curation with an interactive practice runner for major IT certifications.

## ✨ Highlights

- 🧠 **1,590+ original practice questions** across 14 certifications
- 📚 **440+ curated resources** across 7 categories
- 🚫 **Strict anti-dump policy** (no leaked or NDA-violating material)
- 🌍 **Vendor-neutral coverage**: AWS, Azure, GCP, CompTIA, Cisco, Kubernetes, Linux, and more
- 🆓 **100% open source and free**

## 🎯 Covered Certifications

| Domain | Certifications |
|---|---|
| Cloud | AWS SAA, AWS SAP, AZ-900, AZ-104, GCP ACE |
| Security | CompTIA Security+ (SY0-701), CISSP |
| Networking | CCNA, Network+ |
| DevOps | CKA, Terraform Associate |
| Linux | LPIC-1 |
| Data & AI | AWS MLS |
| PM & ITSM | PMP |

## ⚡ Quickstart

```bash
git clone git@github.com:ThanhNguyxn/awesome-cert-sherpa.git
cd awesome-cert-sherpa
pnpm install

# Local docs site
pnpm dev

# Validate question bank
pnpm validate:bank

# Production build
pnpm build

# Serve production build locally
pnpm serve
```

Local URL: `http://localhost:3000/awesome-cert-sherpa/`

## 🧱 Project Structure

```text
awesome-cert-sherpa/
├── website/          # Docusaurus portal + practice UI
├── content/          # Curated resource YAML + source registry
├── bank/             # Question bank YAML (1,590+ questions)
├── tools/            # Validator and bank build pipeline
├── .github/          # Actions workflows + templates
├── package.json      # Root workspace scripts
└── pnpm-workspace.yaml
```

## 🛠️ Stack

- Node.js 20+
- pnpm workspaces
- TypeScript
- Docusaurus 3.9.x
- YAML + JSON Schema (Ajv validation)
- GitHub Actions (validation + pages deploy)

## 🗺️ Roadmap

| Phase | Status | Description |
|---|---|---|
| **1 — Scaffold** | ✅ Done | Docusaurus portal, GitHub Pages config, category structure |
| **2 — Content** | ✅ Done | 1,590+ practice questions, 440+ curated resources |
| **3 — Community** | ✅ Done | Discussions, contribution workflow, issue/PR templates |
| **4 — Practice Engine** | ✅ Done | Interactive quiz runner with objective-aligned explanations |
| **5 — Grow** | 🚧 In Progress | Community voting, verified resource badges, multilingual support |
| **6 — Platform Hardening** | ✅ Done | CI/CD validation and automated GitHub Pages deployment |

## 🛡️ Anti-Dump Policy

> **This project does NOT contain, host, or link to exam dumps, leaked questions, or any material that violates NDA agreements.**

- **No exam dumps**: real exam questions are strictly forbidden.
- **No NDA violations**: verbatim exam content is removed immediately.
- **Practice questions only**: original, objective-aligned, community-written content.
- **Report violations**: [open an issue](https://github.com/ThanhNguyxn/awesome-cert-sherpa/issues) and maintainers will triage within 48 hours.

## 🤝 Contributing

Contributions are welcome: resources, questions, docs, fixes, and tooling.

- Start here: [CONTRIBUTING.md](CONTRIBUTING.md)
- Security reports: [SECURITY.md](SECURITY.md)
- Governance and review model: [GOVERNANCE.md](GOVERNANCE.md)

## 🔗 Links

- Repository: [github.com/ThanhNguyxn/awesome-cert-sherpa](https://github.com/ThanhNguyxn/awesome-cert-sherpa)
- Docs site: [ThanhNguyxn.github.io/awesome-cert-sherpa](https://thanhnguyxn.github.io/awesome-cert-sherpa/)

## 📄 License

[MIT](LICENSE)
