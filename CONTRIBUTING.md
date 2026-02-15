# Contributing to Awesome CertSherpa

Thanks for contributing. Every high-quality resource, fix, or question helps someone pass the right way. 🏔️

## 🚫 Golden Rule (Non-Negotiable)

> **No exam dumps. No leaked questions. No NDA-violating material. Ever.**

PRs that include or reference live exam question pools are closed immediately.

Allowed:
- Objective-aligned, original practice questions
- Curated links to legitimate study materials

Not allowed:
- Verbatim exam questions
- Leaked content or "brain dumps"
- Rehosted copyrighted question banks

If you're unsure, open an issue before submitting.

## 🧰 Local Setup

```bash
git clone git@github.com:<your-username>/awesome-cert-sherpa.git
cd awesome-cert-sherpa
pnpm install
pnpm dev
```

Local site: `http://localhost:3000/awesome-cert-sherpa/`

## 🧩 Contribution Types

- 📚 Add or improve resource links
- 🧠 Add original practice questions
- 📝 Improve docs and wording
- 🐛 Fix bugs in site/components/scripts
- 🧪 Improve validation/build tooling

## 🧠 Practice Question Contribution Guide

Question bank files are in `bank/**.yml` and validated by `bank/schema.json`.

Requirements:
- Questions must be original and objective-aligned
- Each question must include a clear explanation and at least one reference URL
- IDs must be globally unique across all bank files
- `answerIndex` must match the choices array bounds

Before opening a PR:

```bash
pnpm validate:bank
pnpm build
```

## 📌 Pull Request Guidelines

1. Keep PRs focused (one theme per PR).
2. Use a specific title (`docs:`, `fix:`, `feat:` style is preferred).
3. Follow existing data and formatting conventions.
4. Do not commit generated artifacts (`build/`, `.docusaurus/`, `node_modules/`).
5. Verify links and run local checks before requesting review.

## ✅ Suggested Commit Message Style

```text
docs: improve README badges and roadmap
fix: correct outdated practice question counts
feat: add 20 original questions for AZ-104
```

## 🐞 Reporting Issues

- Broken link or bad metadata: open an issue with URL + details
- Dump/NDA concern: open an issue immediately (high priority triage)
- Feature request: explain problem, proposed outcome, and impact

## 🤝 Code of Conduct

This project follows [Contributor Covenant](CODE_OF_CONDUCT.md). Be respectful and constructive.
