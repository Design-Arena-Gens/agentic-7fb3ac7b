# WhatsApp Lead Registration Agent

Capture lead submissions from a web form and instantly deliver a personalized WhatsApp message using the Cloud API. This project ships a production-ready Next.js app styled with Tailwind CSS and wired to Meta's WhatsApp Business platform.

## Features

- Responsive lead intake form with validation powered by Zod
- Server Action that posts to the WhatsApp Cloud API
- Inline success/error feedback with request tracking IDs
- Tailwind-powered UI optimized for quick customization

## Prerequisites

- Node.js 18+
- WhatsApp Business Cloud API credentials:
  - `WHATSAPP_ACCESS_TOKEN`
  - `WHATSAPP_PHONE_NUMBER_ID`

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy the environment template and add your credentials:
   ```bash
   cp .env.example .env.local
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3000` to submit test leads.

## Production Build

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Description |
| --- | --- |
| `WHATSAPP_ACCESS_TOKEN` | Permanent user access token generated from Meta |
| `WHATSAPP_PHONE_NUMBER_ID` | WhatsApp Business phone number ID |

Ensure the phone numbers you message have opted in to receive notifications per WhatsApp's policies.

## Deployment

The project is optimized for Vercel. After setting the required environment variables in the Vercel dashboard or CLI, deploy with:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-7fb3ac7b
```

## License

MIT © 2024
