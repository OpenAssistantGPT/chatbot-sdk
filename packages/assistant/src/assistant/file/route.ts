import { OpenAI } from 'openai';
import { i } from 'vitest/dist/reporters-yx5ZTtEV';
import { z } from 'zod';

const routeContextSchema = z.object({
  params: z.object({
    openassistantgpt: z.array(z.string()),
  }),
});

export async function handleFile(
  request: Request,
  context: z.infer<typeof routeContextSchema>,
  openai: OpenAI,
) {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { params } = routeContextSchema.parse(context);

  return handleFileFunction(
    openai,
    params.openassistantgpt[params.openassistantgpt.length - 1],
  );
}

export async function handleFileFunction(openai: OpenAI, fileId: string) {
  const [file, fileContent] = await Promise.all([
    openai.files.retrieve(fileId),
    openai.files.content(fileId),
  ]);

  return new Response(fileContent.body, {
    headers: {
      'Content-Disposition': `attachment; filename="${file.filename}"`,
    },
  });
}
