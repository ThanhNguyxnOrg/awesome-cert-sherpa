# Awesome CertSherpa

> A community-driven certification exam prep hub — curated study resources, structured learning paths, and an interactive practice engine with 1,590+ original questions. Open-source, vendor-neutral, and built by people who actually sit these exams.

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
├── content/          # Curated resource YAML files and source registry
├── bank/             # Question bank YAML data (1,590+ questions, 14 certs)
├── tools/            # CLI utilities — bank validator, build pipeline
├── .github/          # CI/CD workflows, issue/PR templates
├── package.json      # Root workspace scripts
└── pnpm-workspace.yaml
```

## Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| **1 — Scaffold** | ✅ Done | Docusaurus portal, GitHub Pages config, category structure, OSS docs |
| **2 — Content** | ✅ Done | 1,590+ practice questions across 14 certs, 440+ curated resources across 7 categories |
| **3 — Community** | ✅ Done | GitHub Discussions, contribution workflows, issue templates |
| **4 — Practice Engine** | ✅ Done | Interactive quiz runner with 14 certification question banks |
| **5 — Grow** | 🔜 Next | Community voting, "verified resource" badges, multilingual support, CI/CD |

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
- **Docs site**: [ThanhNguyxn.github.io/awesome-cert-sherpa](https://ThanhNguyxn.github.io/awesome-cert-sherpa/)

## License

[MIT](LICENSE) — use it, fork it, learn from it.
