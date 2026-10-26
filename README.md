# 🤖 Android CI Path

**Learn CI/CD for Android step by step, from your first green build to senior-level pipelines.**

### 👉 [Start learning: mohammadaqeel.github.io/learn-android-ci-cd](https://mohammadaqeel.github.io/learn-android-ci-cd/)

No installation or sign-up needed. Just open the link and start with Lesson 1.

## Why I built this

When I decided to learn CI/CD as an Android developer, I found the information scattered everywhere: GitHub Actions docs, Gradle docs, blog posts, conference talks and random workflow files on GitHub. Most resources were either too basic ("here's a YAML file, good luck") or assumed you already knew everything.

So I built this website: a single, structured path that takes you from zero to senior level, one small step at a time. I made it to learn this skill myself, and to make it easier for other Android developers who want to learn it too.

## Who it's for

- **Android developers who've never set up CI** and want to start from the very beginning.
- **Junior and mid-level developers** who use CI at work but want to understand how it really works and how to improve it.
- **Senior developers and tech leads** who want a refresher on release automation, build performance, pipeline security and scaling.
- **Students and self-learners** building a portfolio. A real CI/CD pipeline on your GitHub projects makes a strong impression.

All you need is basic Android development knowledge and a GitHub account.

## How it works

The course is split into **5 levels with 26 lessons**. Each level builds on the previous one:

| Level | What you learn |
|---|---|
| 🟢 **Beginner** | What CI is, Git and branching, building with Gradle from the terminal, your first GitHub Actions workflow |
| 🔵 **Junior** | Unit tests in CI, Lint and detekt, caching, saving APKs from each build, protecting the main branch |
| 🟠 **Mid-level** | UI tests on an emulator, signing release builds with secrets, build variants and versioning, troubleshooting failures, distributing builds to testers |
| 🟣 **Senior** | Automated Play Store releases, build performance, pipeline security, reusable workflows, quality gates and CI metrics |
| 🔴 **Specializations** | GitLab, Bitrise and Jenkins, self-hosted runners, Fastlane, device farms, screenshot testing, very large codebases, feature flags and release health, Kotlin Multiplatform CI |

Every lesson includes:

- 📖 **A short explanation** of the concept and why it matters
- 📋 **Copy-ready code**: real GitHub Actions YAML, Gradle and Kotlin snippets with a one-click Copy button
- 🛠 **"Do it yourself" tasks** to complete in your own Android project. This is where the real learning happens.
- 🧠 **A quick quiz** to check your understanding

Your progress is **saved automatically in your browser**: completed lessons, ticked tasks and quiz answers. There's no account and no sign-up. The site also has a glossary of CI/CD terms, a page of useful resources, light and dark mode, and it works on phones.

### Suggested way to learn

1. Create a small Android app (or use an existing one) and push it to GitHub.
2. Go through the lessons in order.
3. Actually do the tasks. Watch your pipeline go red, then fix it.
4. Mark each lesson complete when its tasks are done.
5. At the end, build a full pipeline for a new project from scratch without looking at your notes.

## Run locally

The easiest way is to use the live site: **https://mohammadaqeel.github.io/learn-android-ci-cd/**

To run your own copy, open `index.html` in a browser, or serve the folder:

```bash
npx serve .
# or
python -m http.server 8000
```

## Deploy

It's a static site, so upload the folder as-is to any static host: GitHub Pages, Netlify, Vercel or Cloudflare Pages. No build command is needed, and the output directory is the project root.

**GitHub Pages:** go to Settings → Pages, choose "Deploy from a branch", select `main` and `/ (root)`, and save.

## Editing content

All lessons live in `js/content.js`. Each lesson has a `body` (HTML), `tasks`, and a `quiz`.
Code samples go in `<div class="code-block" data-lang="yaml" data-label="file name">…</div>` and are escaped automatically.
Inside lesson bodies, write GitHub expressions as `\${{ ... }}` so JavaScript doesn't interpolate them.

## Structure

```
index.html        page shell
css/styles.css    styles (light/dark)
js/content.js     course content
js/app.js         routing, rendering, progress
```

## Contributing

Found a mistake, an outdated action version, or want to suggest a lesson? Issues and pull requests are welcome.
