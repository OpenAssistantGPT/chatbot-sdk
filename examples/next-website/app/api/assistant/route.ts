import OpenAI from 'openai';

import { z } from 'zod';
import { AssistantResponse } from '@openassistantgpt/assistant';
import { zfd } from 'zod-form-data';
import {
  codeInterpreterExtensionList,
  fileSearchExtensionList,
} from '@openassistantgpt/assistant';
import {
  CodeInterpreterTool,
  FileSearchTool,
} from 'openai/resources/beta/assistants';

export const maxDuration = 300;

const schema = zfd.formData({
  threadId: z.string().or(z.undefined()),
  message: zfd.text(),
  clientSidePrompt: z.string().or(z.undefined()),
  file: z.instanceof(Blob).or(z.string()),
  filename: z.string(),
});

export async function OPTIONS(req: Request) {
  return new Response('Ok', { status: 200 });
}

export async function POST(req: Request) {
  try {
    const openai = new OpenAI({
      // eslint-disable-next-line turbo/no-undeclared-env-vars
      apiKey: process.env.OPENAI_API_KEY,
    });

    const input = await req.formData();

    const data = schema.parse(input);

    // Create a thread if needed
    const threadId =
      data.threadId != ''
        ? data.threadId
        : (await openai.beta.threads.create({})).id;

    let openAiFile: OpenAI.Files.FileObject | null = null;

    if (data.filename !== '') {
      // @ts-ignore
      const file = new File([data.file], data.filename, {
        type: data.file.type,
      });

      // @ts-ignore
      if (data.file.size > 0) {
        openAiFile = await openai.files.create({
          file,
          purpose: 'assistants',
        });
      }
    }

    let fileInterpreter = false;
    let fileSearch = false;
    if (openAiFile) {
      if (
        codeInterpreterExtensionList.includes(
          data.filename.split('.').pop()?.toLocaleLowerCase()!,
        )
      ) {
        fileInterpreter = true;
      }
      if (fileSearchExtensionList.includes(data.filename.split('.').pop()!)) {
        fileSearch = true;
      }
    }

    const toolList = [
      fileInterpreter ? { type: 'code_interpreter' } : null,
      fileSearch ? { type: 'file_search' } : null,
    ].filter(Boolean);

    // Add a message to the thread
    const createdMessage = await openai.beta.threads.messages.create(
      threadId!,
      {
        role: 'user' as 'user' | 'assistant',
        content: data.message.toString(),
        attachments: openAiFile
          ? [
              {
                file_id: openAiFile.id,
                tools: toolList.filter(tool => tool !== null) as (
                  | CodeInterpreterTool
                  | FileSearchTool
                )[],
              },
            ]
          : [],
      },
    );

    return AssistantResponse(
      // @ts-ignore
      { threadId, messageId: createdMessage.id },
      async ({ sendMessage, forwardStream, sendDataMessage }) => {
        try {
          // Run the assistant on the thread
          const runStream = openai.beta.threads.runs.stream(threadId!, {
            // eslint-disable-next-line turbo/no-undeclared-env-vars
            assistant_id: process.env.OPENAI_ASSISTANT_ID!,
            instructions: (data.clientSidePrompt || '').replace('+', '') || '',
            tools: [{ type: 'file_search' }, { type: 'code_interpreter' }],
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
      return new Response(error.message, { status: 401 });
    }

    return new Response(null, { status: 500 });
  }
}
