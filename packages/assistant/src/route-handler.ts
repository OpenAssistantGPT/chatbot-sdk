import { handleAssistant } from './assistant/route';
import { handleFile } from './assistant/file/route';

export class OpenAssistantGPT {
  constructor(private basePath: string) {
    this.basePath = this.basePath;
  }

  handler = async (req: any, res: any) => {
    // Parse the URL to get the pathname
    const pathname = new URL(req.url).pathname;

    // Split the pathname to get the parts
    const pathParts = pathname.split('/').filter(Boolean);

    if (pathParts[pathParts.length - 1] === 'assistant') {
      // Handle /api/assistant
      return handleAssistant(this.basePath, req);
    } else if (
      pathParts[pathParts.length - 1].match(/^.+$/) &&
      pathParts[pathParts.length - 2] === 'file' &&
      pathParts[pathParts.length - 3] === 'assistant'
    ) {
      // Handle /api/assistant/file/[fileId]
      return handleFile(req, res);
    } else {
      return new Response('Not Found', { status: 404 });
    }
  };
}
