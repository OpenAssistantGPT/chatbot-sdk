import { handleAssistant } from '@openassistantgpt/assistant';
import OpenAI from 'openai';
import { z } from 'zod';

const routeContextSchema = z.object({
  params: z.object({
    assistantId: z.string(),
  }),
});

export async function POST(
  req: Request,
  context: z.infer<typeof routeContextSchema>,
) {
  const { params } = routeContextSchema.parse(context);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return handleAssistant(
    `/api/${params.assistantId}/assistant`,
    req,
    openai,
    process.env.OPENAI_ASSISTANT_ID || '',
  );
}
