import OpenAI from 'openai';

import { z } from 'zod';
import { AssistantResponse } from '../assistant-response';
import {
  codeInterpreterExtensionList,
  fileSearchExtensionList,
} from '../file-extensions-list';
import {
  CodeInterpreterTool,
  FileSearchTool,
} from 'openai/resources/beta/assistants';
import path from 'path';
import { File } from 'buffer';

const schema = z.object({
  threadId: z.string().or(z.null()),
  message: z.string(),
  clientSidePrompt: z.string().or(z.undefined()),
  files: z.array(z.string()),
  data: z.record(z.string()).or(z.undefined()),
});

export async function handleAssistant(
  basePath: string,
  req: Request,
  openai: OpenAI,
  assistantId: string,
) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const requestBody = await req.json();
    const data = schema.parse(requestBody);

    // Create a thread if needed
    const threadId = data.threadId
      ? data.threadId
      : (await openai.beta.threads.create({})).id;

    let openAiFiles: OpenAI.Files.FileObject[] | null = null;
    if (data.files.length > 0) {
      openAiFiles = await Promise.all(
        data.files.map(async fileUrl => {
          const response = await fetch(fileUrl);
          const fileBuffer = await response.arrayBuffer();
          const filename = fileUrl.split('/').pop() || 'unknown_file';

          const file = new File([fileBuffer], filename, {
            type:
              response.headers.get('Content-Type') ||
              'application/octet-stream',
          });

          return await openai.files.create({
            file,
            purpose: 'assistants',
          });
        }),
      );
    }

    const attachments = openAiFiles?.map(file => ({
      file_id: file.id,
      tools: [
        codeInterpreterExtensionList.includes(
          file.filename.split('.').pop()?.toLocaleLowerCase()!,
        )
          ? { type: 'code_interpreter' }
          : null,
        fileSearchExtensionList.includes(file.filename.split('.').pop()!)
          ? { type: 'file_search' }
          : null,
      ].filter(Boolean),
    }));

    // Add a message to the thread
    const createdMessage = await openai.beta.threads.messages.create(
      threadId!,
      {
        role: 'user' as 'user' | 'assistant',
        content: data.message.toString(),
        attachments: openAiFiles
          ? attachments?.map(attachment => ({
              ...attachment,
              tools: attachment.tools.filter(tool => tool !== null) as (
                | CodeInterpreterTool
                | FileSearchTool
              )[],
            }))
          : [],
      },
    );

    return AssistantResponse(
      {
        // @ts-ignore
        threadId,
        messageId: createdMessage.id,
        fileUrlPath: path.join(basePath, '/assistant/file/%ID%'),
      },
      async ({ sendMessage, forwardStream, sendDataMessage }) => {
        try {
          // Run the assistant on the thread
          const runStream = openai.beta.threads.runs.stream(threadId!, {
            assistant_id: assistantId,
            instructions: (data.clientSidePrompt || '').replace('+', '') || '',
          });

          let runResult = await forwardStream(runStream);

          // validate if there is any error
          if (runResult == undefined) {
            console.log(`Error running assistant on thread ${threadId}`);

            // set the error if last_error is not null
            let errorMessage = 'Unknown error';
            // @ts-ignore
            if (runStream.currentEvent()?.data.last_error) {
              // @ts-ignore
              errorMessage = runStream.currentEvent()?.data.last_error.message;
            }

            sendMessage({
              id: 'end',
              role: 'assistant',
              content: [
                {
                  type: 'text',
                  text: { value: 'An error orrcured please try again later.' },
                },
              ],
            });
            return;
          }
        } catch (error) {
          console.error(error);
          sendMessage({
            id: 'end',
            role: 'assistant',
            content: [
              {
                type: 'text',
                text: { value: 'An error orrcured please try again later.' },
              },
            ],
          });
        }
      },
    );
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 422 });
    }

    if (error instanceof OpenAI.APIError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response(null, { status: 500 });
  }
}
