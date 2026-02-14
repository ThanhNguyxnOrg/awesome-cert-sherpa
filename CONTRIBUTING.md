# Contributing to Awesome CertSherpa

First off — thank you for considering a contribution! Every fix, resource link, or new cert page makes this project better for everyone.

## The Golden Rule

> **No exam dumps. No leaked questions. No NDA-violating material. Ever.**

Any pull request that adds, links to, or references real exam questions from a vendor's live pool will be **closed immediately**. Community-written practice questions that cover the same *exam objectives* are perfectly fine — just don't copy the actual exam.

If you're unsure whether a resource crosses the line, open an issue first and ask.

## Getting Started

```bash
# 1. Fork & clone
git clone git@github.com:<your-username>/awesome-cert-sherpa.git
cd awesome-cert-sherpa

# 2. Install dependencies (Node >= 20 + pnpm required)
pnpm install

# 3. Start the dev server
pnpm dev
```

The site will be available at `http://localhost:3000/awesome-cert-sherpa/`.

## What You Can Contribute

- **Resource links** — study guides, video courses, labs, practice exams (legitimate ones).
- **New cert pages** — pick a certification that's missing and create its page.
- **Typo / grammar fixes** — always welcome, no issue required.
- **Practice questions** — original, community-written questions mapped to exam objectives.
- **Bug fixes** — if the site is broken, help us fix it.

## Pull Request Guidelines

1. **Keep PRs small and focused.** One cert page per PR, one fix per PR. Don't bundle unrelated changes.
2. **Use a descriptive title.** `Add AWS SAA-C03 resource page` is good. `Update docs` is not.
3. **Follow existing formatting.** Look at an existing category or cert page and match the structure.
4. **Test locally.** Run `pnpm build` before submitting — it will catch broken links.
5. **No generated files.** Don't commit `node_modules/`, `build/`, or `.docusaurus/`.

## Commit Messages

We're not strict about format, but prefer clear messages:

```
docs: add CCNA resource page
fix: broken link on security category page
chore: update dependencies
```

## Reporting Issues

- **Broken link or incorrect info** — open an issue with the page URL and what's wrong.
- **Dump/NDA violation** — open an issue immediately. We respond within 48 hours.
- **Feature request** — open an issue describing what you'd like and why.

## Code of Conduct

This project follows the [Contributor Covenant](CODE_OF_CONDUCT.md). Be kind, be respectful.
