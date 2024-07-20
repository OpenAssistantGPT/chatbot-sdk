# OpenAssistantGPT SDK, Next.js, and OpenAI Chat Example

This example shows how to use the [OpenAssistantGPT SDK](https://openassistantgpt.io/), [Vercel AI SDK](https://sdk.vercel.ai/docs), [Next.js](https://nextjs.org/) and [OpenAI](https://openai.com) to create a ChatGPT-like AI-powered streaming chat bot.

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FOpenAssistantGPT%2FOpenAssistantGPT-SDK%2Ftree%2Fmain%2Fexamples%2Fnext-website&env=OPENAI_ASSISTANT_ID,OPENAI_API_KEY&envDescription=Find%20all%20informations%20in%20OpenAI%20Platform.&envLink=https%3A%2F%2Fplatform.openai.com%2F)

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init), [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/), or [pnpm](https://pnpm.io) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/OpenAssistantGPT/OpenAssistantGPT-SDK/tree/main/examples/next-website next-openassistantgpt-app
```

```bash
yarn create next-app --example https://github.com/OpenAssistantGPT/OpenAssistantGPT-SDK/tree/main/examples/next-website next-openassistantgpt-app
```

```bash
pnpm create next-app --example https://github.com/OpenAssistantGPT/OpenAssistantGPT-SDK/tree/main/examples/next-website next-openassistantgpt-app
```

To run the example locally you need to:

1. Sign up at [OpenAI's Developer Platform](https://platform.openai.com/signup).
2. Go to [OpenAI's dashboard](https://platform.openai.com/account/api-keys) and create an API KEY.
3. Set the required OpenAI environment variable as the token value as shown [the example env file](./.env.local.example) but in a new file called `.env.local`
4. `pnpm install` to install the required dependencies.
5. `pnpm dev` to launch the development server.

## Learn More

To learn more about OpenAssistantGPT take a look at the following resources:

- [OpenAssistantGPT](https://www.openassistantgpt.io/)
