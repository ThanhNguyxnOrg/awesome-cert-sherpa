---
slug: practice-engine-launch
title: "Practice Engine is Live — 1,590+ Questions Across 14 Certifications 🧠"
authors: [thanhnguyxn]
tags: [announcement, practice]
---

The CertSherpa Practice Engine is officially live! Test your knowledge with 1,590+ original practice questions covering 14 of the most popular IT certifications — all free, all open-source, and absolutely zero exam dumps.

<!-- truncate -->

## What's Inside

We've built question banks for 14 certifications, with carefully crafted questions aligned to official exam objectives:

| Certification | Questions | Difficulty |
|---------------|-----------|------------|
| ☁️ AWS Solutions Architect Associate (SAA-C03) | 120 | Associate |
| ☁️ AWS Solutions Architect Professional (SAP-C02) | 120 | Professional |
| ☁️ Azure Fundamentals (AZ-900) | 120 | Fundamentals |
| ☁️ Azure Administrator (AZ-104) | 130 | Associate |
| ☁️ Google Cloud Associate Cloud Engineer | 100 | Associate |
| 🛡️ CompTIA Security+ (SY0-701) | 120 | Entry-level |
| 🛡️ (ISC)² CISSP | 100 | Professional |
| 🌐 Cisco CCNA (200-301) | 130 | Associate |
| 🌐 CompTIA Network+ (N10-009) | 100 | Entry-level |
| ⚙️ Kubernetes CKA | 130 | Professional |
| ⚙️ HashiCorp Terraform Associate (003) | 120 | Associate |
| 🐧 Linux LPIC-1 | 100 | Entry-level |
| 🤖 AWS Machine Learning Specialty (MLS-C01) | 100 | Specialty |
| 📋 PMP | 100 | Professional |

## How It Works

1. **Pick a certification** — choose from 14 available tracks on the [Practice page](/practice).
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

- 📈 **More questions** — we've hit 100+ per certification and continue expanding.
- 🔀 **Randomized quizzes** — shuffle questions and pick subsets.
- 📊 **Performance analytics** — track improvement over time (local storage, no tracking).
- 🌍 **More certifications** — CCSP, CISA, AWS DevOps Professional, Azure Solutions Architect, and more.
- 🌍 **Community contributions** — submit your own questions via PR.

## Try It Now

👉 **[Launch the Practice Engine](/practice)**

Found a mistake? Want to contribute questions? [Open an issue](https://github.com/ThanhNguyxn/awesome-cert-sherpa/issues) or submit a PR. Every contribution makes CertSherpa better for everyone.
