# Tork CRM (Next.js Application)

## Overview
Tork CRM is a white-labeled customer relationship management interface built with Next.js 14, designed to consume the Chatwoot API. It serves as a "Command Center" for managing contacts and conversations with a custom, premium UI.

## Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS (with Shadcn/UI for components)
- **Language:** TypeScript
- **State Management:** React Query (recommended for API caching)

## Integration with Chatwoot
This frontend connects to your existing Chatwoot instance.

### key Environment Variables (.env.local)
```bash
# URL of your self-hosted Chatwoot instance (e.g., in Docker)
NEXT_PUBLIC_CHATWOOT_API_URL=https://chat.davicode.me/api/v1

# Access Token for server-side API calls (if needed)
CHATWOOT_ACCESS_TOKEN=your_access_token_here

# Account ID context
NEXT_PUBLIC_CHATWOOT_ACCOUNT_ID=1
```

## Folder Structure
- `/app` - App Router pages and layouts.
- `/components/branding` - Custom white-label assets (Logos, Color definitions).
- `/lib/api` - Typed API clients for Chatwoot endpoints.
- `/public` - Static assets.

## Getting Started
1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
