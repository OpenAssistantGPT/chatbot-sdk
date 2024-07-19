# OpenAssistantGPT SDK

This SDK is an extension of the vercel/ai SDK with more features, addapted to our use case and maintained by the OpenAssistantGPT team.



# Installation

You will need Node.js 18+ and pnpm install on your local development machine.

```bash
npm install @openassistantgpt
```

# Usage

## @openassistantgpt/assistant

First you need to import our library and configure the POST and GET method. This will setup the backend correctly.

```bash
npm install @openassistantgpt/assistant
```

Once the package is installed create the route file `/api/chat/[[...openassistantgpt]]/route.ts`
```js
import { OpenAssistantGPT } from '@openassistantgpt/assistant';

// In OpenAssistantGPT handler you must enter your base path. 
// The base path is everything before the [[...openassistantgpt]] part of the route.
const httpHandler = new OpenAssistantGPT('/api/chat/').handler;

export { httpHandler as GET, httpHandler as POST };
```

## @openassistantgpt/ui

First you need to import our library and configure your component to use it.

```bash
npm install @openassistantgpt/ui
```