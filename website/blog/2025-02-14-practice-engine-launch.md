---
slug: practice-engine-launch
title: "Practice Engine is Live — 240+ Questions Across 8 Certifications 🧠"
authors: [thanhnguyxn]
tags: [announcement, practice]
---

The CertSherpa Practice Engine is officially live! Test your knowledge with 240+ original practice questions covering 8 of the most popular IT certifications — all free, all open-source, and absolutely zero exam dumps.

<!-- truncate -->

## What's Inside

We've built question banks for 8 certifications, each with 30 carefully crafted questions aligned to official exam objectives:

| Certification | Questions | Difficulty |
|---------------|-----------|------------|
| ☁️ AWS Solutions Architect Associate | 30 | Associate |
| ☁️ Azure Administrator (AZ-104) | 30 | Associate |
| 🛡️ CompTIA Security+ (SY0-701) | 30 | Entry-level |
| 🌐 Cisco CCNA (200-301) | 30 | Associate |
| ⚙️ Kubernetes CKA | 30 | Professional |
| 🐧 Linux LPIC-1 | 30 | Entry-level |
| 🤖 AWS Machine Learning Specialty | 30 | Specialty |
| 📋 PMP | 30 | Professional |

## How It Works

1. **Pick a certification** — choose from 8 available tracks on the [Practice page](/awesome-cert-sherpa/practice).
2. **Answer questions** — each question has 4 options with a detailed explanation.
3. **Learn from explanations** — every answer (right or wrong) comes with a thorough explanation of *why* that's the correct choice.
4. **Track your progress** — see your score at the end and identify weak areas.

## Built Different

Every question in CertSherpa is:

- ✍️ **Original** — written from scratch based on published exam objectives.
- 🔍 **Validated** — checked against our JSON Schema for consistency and quality.
- 📖 **Educational** — detailed explanations teach the concept, not just the answer.
- 🚫 **Not a dump** — we never reproduce real exam questions. Period.

## The Tech Behind It

The practice engine is built as a static system — no backend, no database, no accounts:

- Question banks are authored in **YAML** and validated with **JSON Schema + Ajv**.
- A build step compiles YAML → JSON and deploys as static assets.
- The frontend is a **React component** within our Docusaurus site.
- CI automatically validates every question bank change via GitHub Actions.

This means the entire system is forkable, self-hostable, and auditable.

## What's Next

- 📈 **More questions** — we're aiming for 50+ per certification.
- 🔀 **Randomized quizzes** — shuffle questions and pick subsets.
- 📊 **Performance analytics** — track improvement over time (local storage, no tracking).
- 🌍 **Community contributions** — submit your own questions via PR.

## Try It Now

👉 **[Launch the Practice Engine](/awesome-cert-sherpa/practice)**

Found a mistake? Want to contribute questions? [Open an issue](https://github.com/ThanhNguyxn/awesome-cert-sherpa/issues) or submit a PR. Every contribution makes CertSherpa better for everyone.
