# Awesome CertSherpa

> A community-driven certification exam prep hub — curated study resources, structured learning paths, and (soon) an interactive practice engine. Open-source, vendor-neutral, and built by people who actually sit these exams.

IT certifications are expensive and the study landscape is fragmented. CertSherpa collects the best free and paid resources in one place, organised by domain and difficulty, so you can **study smarter, not harder**. Think [awesome-list](https://github.com/sindresorhus/awesome) meets structured exam prep.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Quickstart

```bash
# Clone
git clone git@github.com:ThanhNguyxn/awesome-cert-sherpa.git
cd awesome-cert-sherpa

# Install (requires Node >= 20 + pnpm)
pnpm install

# Run the docs site locally
pnpm dev        # → http://localhost:3000/awesome-cert-sherpa/

# Build for production
pnpm build

# Preview the production build
pnpm serve
```

## Project Structure

```
awesome-cert-sherpa/
├── website/          # Docusaurus docs portal (TypeScript + pnpm)
├── content/          # Raw markdown/YAML content sources (planned)
├── bank/             # Question bank data (planned)
├── tools/            # CLI utilities and scripts (planned)
├── .github/          # Workflows, issue/PR templates (planned)
├── package.json      # Root workspace scripts
└── pnpm-workspace.yaml
```

## Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| **1 — Scaffold** | ✅ Done | Docusaurus portal, GitHub Pages config, category structure, OSS docs |
| **2 — Content** | 🔜 Next | Populate cert pages (AWS, Azure, Security+, CCNA, CKA, …) with curated resources |
| **3 — Community** | 📋 Planned | GitHub Discussions, contribution workflows, issue templates, CI/CD |
| **4 — Practice Engine** | 📋 Planned | Interactive quiz runner (self-hostable), spaced repetition, progress tracking |
| **5 — Grow** | 📋 Planned | Community voting, "verified resource" badges, multilingual support |

## Anti-Dump Policy

> **This project does NOT contain, host, or link to exam dumps, leaked questions, or any material that violates NDA agreements.**

We take this seriously:

- **No exam dumps** — real questions from any vendor's live exam pool are strictly forbidden.
- **No NDA violations** — if a resource reproduces verbatim exam content, it will be removed immediately.
- **Practice questions only** — community-written practice questions that test the same *objectives* (not the same *questions*) are welcome.
- **Report violations** — if you spot a linked resource that contains dump material, [open an issue](https://github.com/ThanhNguyxn/awesome-cert-sherpa/issues) and we will act within 48 hours.

Violating this policy results in immediate removal of the content and a ban for repeat offenders.

## Contributing

We welcome contributions of all sizes. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Links

- **Repository**: [github.com/ThanhNguyxn/awesome-cert-sherpa](https://github.com/ThanhNguyxn/awesome-cert-sherpa)
- **Docs site** *(coming soon)*: [ThanhNguyxn.github.io/awesome-cert-sherpa](https://ThanhNguyxn.github.io/awesome-cert-sherpa/)

## License

[MIT](LICENSE) — use it, fork it, learn from it.
