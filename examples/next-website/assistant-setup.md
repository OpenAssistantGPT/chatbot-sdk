# Home Automation Assistant Example

## Setup

### Create OpenAI Assistant

[OpenAI Assistant Website](https://platform.openai.com/assistants)

Create a new assistant. Enable Code interpreter. Add the following functions and instructions to the assistant.

Then add the assistant id to the `.env.local` file as `OPENAI_ASSISTANT_ID=your-assistant-id`.

## Run

1. Run `pnpm run dev` in `examples/next-webiste`
2. Go to http://localhost:3000/
