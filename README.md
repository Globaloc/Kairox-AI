<div align="center">

<img src="public/Kairox.svg" alt="Kairox AI" width="120" />

# Kairox AI

**AI SaaS workspace — chat, code, writing, and image tools in one dashboard.**

Built from scratch as an academic portfolio project: full-stack Nuxt application with real authentication, a database, protected server APIs, external AI and image-processing services, and subscription billing.

[Live Demo](https://kairox-ai-zeta.vercel.app/) ·
[Report Bug](https://github.com/Globaloc/Kairox-AI/issues) ·
[Request Feature](https://github.com/Globaloc/Kairox-AI/issues)

[![Nuxt 4](https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt&logoColor=white)](https://nuxt.com)
[![Vue 3](https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## Features

| Tool | Description |
|---|---|
| 💬 **Conversation** | General-purpose AI chat for product, writing, and planning tasks |
| 💻 **Code Generation** | Focused AI assistant for Nuxt, Vue, TypeScript, and shadcn/vue |
| ✍️ **AI Article Writer** | Long-form content with short / medium / long output modes |
| 📰 **Blog Title Generator** | Category-aware headline suggestions |
| 📄 **Resume Review** | Upload a PDF, get structured AI feedback |
| 🖼️ **Background Removal** | Remove image background via Cloudinary |
| ✂️ **Object Removal** | Remove specific objects from an image using a text prompt |
| 🔐 **Auth** | Email/password + Google & GitHub OAuth (Better Auth) |
| 🌍 **i18n** | English · Russian · Tatar |
| 🌗 **Dark / Light** | System-aware color mode |
| 💳 **Polar Billing** | Free plan with usage limits, Polar checkout for Pro |

---

## Tech Stack

| Layer | Tools |
|---|---|
| **Framework** | Nuxt 4 · Vue 3 · TypeScript |
| **UI** | Tailwind CSS v4 · shadcn/vue · Reka UI · Lucide icons |
| **Forms** | vee-validate · Zod |
| **Auth** | Better Auth (email + OAuth) |
| **Database** | Prisma · SQLite · libSQL / Turso adapter |
| **AI** | Gemini `2.5-flash-lite` via OpenAI-compatible SDK |
| **Images** | Cloudinary SDK |
| **Billing** | Polar SDK + Better Auth plugin |
| **i18n** | `@nuxtjs/i18n` |

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 20
- **npm** (or pnpm / yarn)

### 1. Clone

```bash
git clone https://github.com/Globaloc/Kairox-AI.git
cd Kairox-AI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your own keys — see the table below.

<details>
<summary><strong>📋 Environment variables reference</strong> (click to expand)</summary>

| Variable | Required | How to get it |
|---|---|---|
| `BETTER_AUTH_SECRET` | ✅ | Generate: `npx better-auth generate` |
| `BETTER_AUTH_URL` | ✅ | `http://localhost:3000` for local dev |
| `NUXT_TURSO_DATABASE_URL` | ✅ | `file:./dev.db` for local SQLite, or a Turso URL |
| `NUXT_TURSO_AUTH_TOKEN` | ⬜ | Turso dashboard token. Leave empty for local SQLite |
| `NUXT_PUBLIC_APP_ENV` | ⬜ | Free label, e.g. `development` |
| `NUXT_GITHUB_CLIENT_ID` | ⬜ | [GitHub OAuth Apps](https://github.com/settings/developers) → Client ID |
| `NUXT_GITHUB_CLIENT_SECRET` | ⬜ | Same page → Client Secret |
| `NUXT_GOOGLE_CLIENT_ID` | ⬜ | [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → OAuth credentials |
| `NUXT_GOOGLE_CLIENT_SECRET` | ⬜ | Same page → Client Secret |
| `NUXT_GIMINI_API_KEY` | ✅* | [Google AI Studio](https://aistudio.google.com/apikey) → Create API key. *Required for all AI tools* |
| `NUXT_CLOUDINARY_CLOUD_NAME` | ✅* | [Cloudinary Dashboard](https://console.cloudinary.com) → Cloud name |
| `NUXT_CLOUDINARY_API_KEY` | ✅* | Cloudinary Dashboard → API Key |
| `NUXT_CLOUDINARY_API_SECRET` | ✅* | Cloudinary Dashboard → API Secret |
| `NUXT_POLAR_ACCESS_TOKEN` | ⬜ | [Polar Dashboard](https://polar.sh) → Settings → Access Tokens |
| `NUXT_POLAR_SERVER` | ⬜ | `sandbox` or `production` |
| `NUXT_POLAR_WEBHOOK_SECRET` | ⬜ | Polar → Webhooks → Signing secret |
| `NUXT_POLAR_PRODUCT_ID` | ⬜ | Polar → Products → your Pro product ID |

> **Minimum to run AI tools locally:** `BETTER_AUTH_SECRET` + `BETTER_AUTH_URL` + `NUXT_GIMINI_API_KEY`.
> Image tools additionally require the three `NUXT_CLOUDINARY_*` variables.
> OAuth and Polar are optional — the app runs fine without them.

</details>

### 4. Prepare the database

The project uses a local SQLite file (`prisma/dev.db`) out of the box:

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Run

```bash
npm run dev
```

Open **http://localhost:3000** — you're in.

---

## Commands

| Command | Description |
|---|---|
| `npm run dev` | Dev server at `http://localhost:3000` |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm run generate` | Static site generation |
| `npx prisma migrate dev` | Apply or create DB migrations |
| `npx prisma generate` | Regenerate Prisma client after schema changes |
| `npx prisma studio` | Browse the database in Prisma Studio |

---

## Project Structure

```
app/
  assets/              Global CSS and Tailwind theme
  components/
    ui/                shadcn/vue primitives
  composables/         Auth and shared state helpers
  layouts/             default · dashboard
  middleware/          auth.ts · guest.ts   ← route guards
  pages/
    auth/              login · register
    dashboard/         all AI and image tools
  plugins/             Nuxt plugins

server/
  api/
    ai-tools/          conversation · code · article · blog-title · resume
    auth/              Better Auth catch-all
    cloudinary-tools/  remove-background · remove-object
    user.get.ts        usage count + subscription state
  middleware/          auth.ts   ← protects /api/* routes
  services/            auth · polar · usage limits
  utils/               prisma · gemini · cloudinary helpers

prisma/
  schema.prisma        SQLite schema
  migrations/

i18n/locales/
  en.json · ru.json · tt.json

shared/
  types/               Shared TypeScript types
  utils/               Constants
```

---

## Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/auth/login` | Guests only | Sign in — email / Google / GitHub |
| `/auth/register` | Guests only | Create an account |
| `/dashboard` | 🔒 Auth | Tool picker |
| `/dashboard/conversation` | 🔒 Auth | AI chat |
| `/dashboard/code-generation` | 🔒 Auth | Code assistant |
| `/dashboard/ai-article-writer` | 🔒 Auth | Article writer |
| `/dashboard/blog-title-generator` | 🔒 Auth | Title generator |
| `/dashboard/review-resume` | 🔒 Auth | PDF resume reviewer |
| `/dashboard/background-removal` | 🔒 Auth | Background removal |
| `/dashboard/object-removal` | 🔒 Auth | Object removal |
| `/dashboard/settings` | 🔒 Auth | Account & billing |

---

## Free Plan Limits

Non-Pro users get **5 AI / image requests** before the upgrade dialog appears.
The counter is stored per user in `UserApiLimit`. An active Polar subscription removes the limit.

---

## Security Notes

- `.env` is listed in `.gitignore` — **never commit it**.
- Server middleware (`server/middleware/auth.ts`) protects `/api/ai-tools`, `/api/cloudinary-tools`, and `/api/user`.
- Client middleware (`app/middleware/`) guards dashboard pages and auth pages.
- Store production secrets only in your hosting provider's environment settings.

---

## Live Demo

🚀 **[kairox-ai-zeta.vercel.app](https://kairox-ai-zeta.vercel.app/)**

---

<p align="center">
  Built by <strong>Dzhamil</strong> · Academic portfolio project
</p>
