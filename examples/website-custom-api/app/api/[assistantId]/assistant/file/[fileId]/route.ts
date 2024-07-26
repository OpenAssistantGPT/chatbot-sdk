import { handleFileFunction } from '@openassistantgpt/assistant';
import OpenAI from 'openai';
import { z } from 'zod';

const routeContextSchema = z.object({
  params: z.object({
    assistantId: z.string(),
    fileId: z.string(),
  }),
});

export async function GET(
  req: Request,
  context: z.infer<typeof routeContextSchema>,
) {
  const { params } = routeContextSchema.parse(context);

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return handleFileFunction(openai, params.fileId);
}
