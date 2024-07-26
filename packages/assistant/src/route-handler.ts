import { handleAssistant } from './assistant/route';
import { handleFile } from './assistant/file/route';
import OpenAI from 'openai';

export class OpenAssistantGPT {
  constructor(private basePath: string) {
    this.basePath = this.basePath;
  }

  handler = async (req: any, res: any) => {
    // Parse the URL to get the pathname
    const pathname = new URL(req.url).pathname;

    // Split the pathname to get the parts
    const pathParts = pathname.split('/').filter(Boolean);

    const openai = new OpenAI({
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      apiKey: process.env.OPENAI_API_KEY,
    });

    if (pathParts[pathParts.length - 1] === 'assistant') {
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      // Handle /api/assistant
      const assistantId = process.env.OPENAI_ASSISTANT_ID || '';
      return handleAssistant(this.basePath, req, openai, assistantId);
    } else if (
      pathParts[pathParts.length - 1].match(/^.+$/) &&
      pathParts[pathParts.length - 2] === 'file' &&
      pathParts[pathParts.length - 3] === 'assistant'
    ) {
      // Handle /api/assistant/file/[fileId]
      return handleFile(req, res, openai);
    } else {
      return new Response('Not Found', { status: 404 });
    }
  };
}
