import { OpenAI } from 'openai';
import { z } from 'zod';

const routeContextSchema = z.object({
  params: z.object({
    openassistantgpt: z.array(z.string()),
  }),
});

export async function handleFile(
  request: Request,
  context: z.infer<typeof routeContextSchema>,
) {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const { params } = routeContextSchema.parse(context);

  const openai = new OpenAI({
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    apiKey: process.env.OPENAI_API_KEY,
  });

  const [file, fileContent] = await Promise.all([
    openai.files.retrieve(
      params.openassistantgpt[params.openassistantgpt.length - 1],
    ),
    openai.files.content(
      params.openassistantgpt[params.openassistantgpt.length - 1],
    ),
  ]);

  return new Response(fileContent.body, {
    headers: {
      'Content-Disposition': `attachment; filename="${file.filename}"`,
    },
  });
}
