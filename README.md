# Kairox AI

Kairox AI is an experimental AI SaaS workspace built with Nuxt, Vue 3, TypeScript, Prisma, Better Auth, Gemini, Cloudinary, and Polar.

The project combines several AI workflows in one authenticated dashboard: chat, code assistance, article writing, blog title generation, resume review, background removal, and object removal.

## Overview

Kairox AI was built as a full-stack web application, not only as a frontend prototype. It includes user authentication, protected API routes, database-backed usage limits, AI API integration, image processing, subscription logic, localization, and a responsive dashboard UI.

The main goal of the project is to provide a focused workspace where users can choose a specific AI tool, submit text or files, and receive a useful generated result from an external AI or image-processing service.

## Features

- AI conversation workspace for general product, writing, and planning tasks
- Code-focused AI chat for Nuxt, Vue, TypeScript, and shadcn/vue projects
- AI article writer with short, medium, and long output modes
- Blog title generator with category selection
- PDF resume reviewer with text extraction and AI feedback
- Background removal for uploaded images
- Object removal for uploaded images based on a text prompt
- Email/password authentication
- Google and GitHub OAuth authentication
- Protected dashboard and server API routes
- Free usage limit for non-Pro users
- Polar checkout and customer portal integration
- Multilingual interface: English, Russian, and Tatar
- Light and dark color modes
- Responsive dashboard layout with reusable UI components

## Tech Stack

### Frontend

- Nuxt 4
- Vue 3
- TypeScript
- Tailwind CSS v4
- shadcn/vue
- Reka UI
- Lucide icons
- Nuxt Image
- Nuxt Icon
- Nuxt i18n
- Nuxt Color Mode
- VueUse and VueUse Motion
- vee-validate
- Zod
- Vue Sonner
- Nuxt MDC

### Backend

- Nuxt server routes / Nitro
- Better Auth
- Prisma
- SQLite schema with libSQL/Turso runtime adapter
- OpenAI Node SDK configured for the Gemini OpenAI-compatible endpoint
- Cloudinary Node SDK
- Polar SDK and Polar Better Auth plugin
- unpdf for PDF text extraction

## Main User Flow

1. A user opens the landing page and reviews the product features.
2. The user signs in or creates an account using email/password, Google, or GitHub.
3. After authentication, the user enters the dashboard.
4. The user selects one of the available tools from the dashboard cards or sidebar.
5. The frontend validates the form input with Zod and vee-validate.
6. The request is sent to a protected Nuxt server API route.
7. The backend checks the user session and validates the user's free or Pro status.
8. The backend calls Gemini, Cloudinary, or another service depending on the selected tool.
9. The response is returned to the frontend and rendered as markdown, text, or an image preview.
10. If the free usage limit is exceeded, the user is shown an upgrade dialog connected to Polar checkout.

## Architecture

```text
app/
  assets/          Global CSS and Tailwind theme variables
  components/      Shared Vue components and dashboard components
  components/ui/   shadcn/vue UI components
  composables/     Client-side state and auth helpers
  layouts/         Default and dashboard layouts
  middleware/      Client-side route protection
  pages/           Public pages, auth pages, and dashboard tools
  plugins/         Nuxt plugins
  utils/           Client-side helpers

server/
  api/             Nuxt server API routes
  middleware/      Server-side API authentication middleware
  services/        Auth, usage limits, and Polar integration
  utils/           Prisma, Gemini/OpenAI, Cloudinary, and auth helpers

prisma/
  schema.prisma    Database schema
  migrations/      Database migrations

i18n/
  locales/         English, Russian, and Tatar translations

shared/
  types/           Shared TypeScript types
  utils/           Shared constants
```

## Backend API

The project uses file-based Nuxt server routes.

### Authentication

- `server/api/auth/[...all].ts`

Handles Better Auth requests.

### User and billing state

- `server/api/user.get.ts`

Returns the current user's API usage count, Polar customer state, active subscription, and customer portal URL.

### AI tools

- `server/api/ai-tools/conversation.post.ts`
- `server/api/ai-tools/code.post.ts`
- `server/api/ai-tools/generate-article.post.ts`
- `server/api/ai-tools/generate-blog-title.post.ts`
- `server/api/ai-tools/review-resume.post.ts`

These routes validate the authenticated user, check the free usage limit or Pro subscription, call Gemini through an OpenAI-compatible endpoint, and return the generated result.

### Image tools

- `server/api/cloudinary-tools/remove-background.post.ts`
- `server/api/cloudinary-tools/remove-object.post.ts`

These routes accept image uploads, validate file type and size, upload the image to Cloudinary, and return a transformed image URL.

## Authentication

Authentication is implemented with Better Auth.

Supported sign-in methods:

- Email and password
- Google OAuth
- GitHub OAuth

Sessions and account data are stored through the Prisma adapter. Server middleware protects API routes under:

- `/api/ai-tools`
- `/api/cloudinary-tools`
- `/api/user`

Dashboard pages also use client-side route middleware to redirect unauthenticated users to the login page.

## Database

The database layer is implemented with Prisma.

The schema includes:

- `User` - user profile data
- `Session` - active user sessions
- `Account` - OAuth and password account records
- `verification` - verification records used by Better Auth
- `UserApiLimit` - per-user usage counter for the free plan

The Prisma schema uses SQLite, while the runtime Prisma client is configured with the libSQL adapter and Turso-related environment variables.

## AI Integration

The project uses the OpenAI Node SDK with a Gemini OpenAI-compatible endpoint:

```ts
baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
```

The server routes use the `gemini-2.5-flash-lite` model for text generation tasks.

Different tools use different prompts and output limits:

- General conversation
- Code assistant
- Article writer
- Blog title generator
- Resume reviewer

The resume reviewer also extracts readable text from uploaded PDF files before sending it to the AI model.

## Image Processing

Cloudinary is used for image upload and transformation.

Implemented image workflows:

- Background removal
- Object removal using a text prompt

The frontend validates accepted file types and file size before submitting the form. The backend repeats validation before uploading the image to Cloudinary.

## Subscription and Usage Limits

The project has a free usage limit:

```ts
MAX_COUNT = 5
```

For non-Pro users, successful AI or image-processing requests increase the usage counter stored in the database.

Polar is used for:

- Checkout
- Customer portal
- Subscription status
- Webhooks
- Usage integration

If the user has an active Polar subscription, the API limit is not incremented.

## Localization

The interface supports three locales:

- English
- Russian
- Tatar

Translations are stored in `i18n/locales`.

## Environment Variables

Create a `.env` file based on `.env.example`.

```env
BETTER_AUTH_SECRET=""
BETTER_AUTH_URL=""

NUXT_TURSO_DATABASE_URL=""
NUXT_TURSO_AUTH_TOKEN=""
NUXT_PUBLIC_APP_ENV=""

NUXT_GITHUB_CLIENT_ID=""
NUXT_GITHUB_CLIENT_SECRET=""

NUXT_GOOGLE_CLIENT_ID=""
NUXT_GOOGLE_CLIENT_SECRET=""

NUXT_GIMINI_API_KEY=""

NUXT_CLOUDINARY_CLOUD_NAME=""
NUXT_CLOUDINARY_API_KEY=""
NUXT_CLOUDINARY_API_SECRET=""

NUXT_POLAR_ACCESS_TOKEN=""
NUXT_POLAR_SERVER=""
NUXT_POLAR_WEBHOOK_SECRET=""
NUXT_POLAR_PRODUCT_ID=""
```

Note: the project currently uses the environment variable name `NUXT_GIMINI_API_KEY` in the code.

## Getting Started

Install dependencies:

```bash
npm install
```

Prepare Nuxt:

```bash
npm run postinstall
```

Run the development server:

```bash
npm run dev
```

Open the local app:

```text
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Status

This is a portfolio and educational full-stack project. It demonstrates how a modern AI SaaS-style application can combine:

- authentication
- database-backed user state
- protected server APIs
- external AI APIs
- image processing APIs
- subscription logic
- localized dashboard UI

## Security Notes

Before publishing or deploying the project, make sure that:

- `.env` is not committed
- real API keys are not committed
- local database files with private data are not committed
- production secrets are stored only in the hosting provider's environment settings

## Author

Built by Dzhamil as a full-stack AI SaaS portfolio project.
