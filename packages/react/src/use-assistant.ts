import { isAbortError } from '@ai-sdk/provider-utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AssistantStatus,
  CreateMessage,
  Message,
  readDataStream,
  generateId,
  Attachment,
} from 'ai';

export type { Message };

export type UseAssistantHelpers = {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setThreadId: (threadId: string | undefined) => void;
  deleteThreadFromHistory: (threadId: string) => void;
  threadId: string | undefined;
  threads: Record<string, { creationDate: string; messages: Message[] }>;
  input: string;
  append: (
    message: Message | CreateMessage,
    requestOptions?: {
      data?: Record<string, string>;
    },
  ) => Promise<void>;
  stop: () => void;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleInputChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  submitMessage: (
    event?: React.FormEvent<HTMLFormElement>,
    requestOptions?: {
      data?: Record<string, string>;
    },
  ) => Promise<void>;
  status: AssistantStatus;
  error: undefined | unknown;
  attachments: Attachment[];
  setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
};

export function useAssistant({
  id,
  api,
  threadId: threadIdParam,
  credentials,
  clientSidePrompt,
  headers,
  body,
  onError,
}: any): UseAssistantHelpers {
  const localStorageName = `assistantThreads-${id}`;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentThreadId, setCurrentThreadId] = useState<string | undefined>(
    undefined,
  );

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [status, setStatus] = useState<AssistantStatus>('awaiting_message');
  const [error, setError] = useState<undefined | Error>(undefined);

  const [threads, setThreads] = useState<
    Record<string, { creationDate: string; messages: Message[] }>
  >({});

  useEffect(() => {
    const assistantThreads = localStorage.getItem(localStorageName);
    const threadsMap = JSON.parse(assistantThreads || '{}');

    if (currentThreadId && threadsMap[currentThreadId] === undefined) {
      threadsMap[currentThreadId] = {
        creationDate: new Date().toISOString(),
        messages: [],
      };
      localStorage.setItem(localStorageName, JSON.stringify(threadsMap));
    }

    setThreads(threadsMap);
  }, [currentThreadId]);

  useEffect(() => {
    const assistantThreads = localStorage.getItem(localStorageName);
    const threadsMap = JSON.parse(assistantThreads || '{}');
    if (currentThreadId && threadsMap[currentThreadId] !== undefined) {
      threadsMap[currentThreadId].messages = messages;
      localStorage.setItem(localStorageName, JSON.stringify(threadsMap));
      setThreads(threadsMap);
    }
  }, [messages]);

  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setInput(event.target.value);
  };

  const abortControllerRef = useRef<AbortController | null>(null);

  const stop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const append = async (
    message: Message | CreateMessage,
    requestOptions?: {
      data?: Record<string, string>;
    },
  ) => {
    setStatus('in_progress');

    setMessages(messages => [
      ...messages,
      {
        ...message,
        id: message.id ?? generateId(),
        //experimental_attachments: [...attachments],
      },
    ]);

    setInput('');
    setAttachments([]);

    const abortController = new AbortController();

    try {
      abortControllerRef.current = abortController;

      const result = await fetch(api, {
        method: 'POST',
        credentials,
        signal: abortController.signal,
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({
          ...body,
          // always use user-provided threadId when available:
          threadId: threadIdParam ?? currentThreadId ?? null,
          message: message.content,
          clientSidePrompt: clientSidePrompt,
          files: attachments.map(a => a.url),
          // optional request data:
          data: requestOptions?.data,
        }),
      });

      if (result.body == null) {
        throw new Error('The response body is empty.');
      }

      for await (const { type, value } of readDataStream(
        result.body.getReader(),
      )) {
        switch (type) {
          case 'assistant_message': {
            setMessages(messages => [
              ...messages,
              {
                id: value.id,
                role: value.role,
                content: value.content[0].text.value,
              },
            ]);
            break;
          }

          case 'message_annotations': {
            for (const annotation of value) {
              // @ts-ignore - this is a hack to make the type checker happy
              if (annotation && annotation.type === 'file_path') {
                setMessages(messages => {
                  const lastMessage = messages[messages.length - 1];
                  lastMessage.content = lastMessage.content.replace(
                    // @ts-ignore - this is a hack to make the type checker happy
                    annotation.text,
                    // @ts-ignore - this is a hack to make the type checker happy
                    annotation.file_path.url,
                  );
                  return [
                    ...messages.slice(0, messages.length - 1),
                    lastMessage,
                  ];
                });
              }

              // @ts-ignore - this is a hack to make the type checker happy
              if(annotation && annotation.type === "file_citation") {
                setMessages(messages => {
                  const lastMessage = messages[messages.length - 1];
                  lastMessage.annotations = annotation
                  return [
                    ...messages.slice(0, messages.length - 1),
                    lastMessage,
                  ];
                });
              }
            }
            break;
          }

          case 'text': {
            setMessages(messages => {
              const lastMessage = messages[messages.length - 1];
              return [
                ...messages.slice(0, messages.length - 1),
                {
                  id: lastMessage.id,
                  role: lastMessage.role,
                  content: lastMessage.content + value,
                },
              ];
            });

            break;
          }

          case 'data_message': {
            setMessages(messages => [
              ...messages,
              {
                id: value.id ?? generateId(),
                role: 'data',
                content: '',
                data: value.data,
              },
            ]);
            break;
          }

          case 'assistant_control_data': {
            setCurrentThreadId(value.threadId);

            setMessages(messages => {
              const lastMessage = messages[messages.length - 1];
              lastMessage.id = value.messageId;
              return [...messages.slice(0, messages.length - 1), lastMessage];
            });

            break;
          }

          case 'error': {
            setError(new Error(value));
            break;
          }
        }
      }
    } catch (error) {
      if (isAbortError(error) && abortController.signal.aborted) {
        abortControllerRef.current = null;
        return;
      }

      if (onError && error instanceof Error) {
        onError(error);
      }

      setError(error as Error);
    } finally {
      abortControllerRef.current = null;
      setStatus('awaiting_message');
    }
  };

  const submitMessage = async (
    event?: React.FormEvent<HTMLFormElement>,
    requestOptions?: {
      data?: Record<string, string>;
    },
  ) => {
    event?.preventDefault?.();

    if (input === '') {
      return;
    }

    append({ role: 'user', content: input }, requestOptions);
  };

  const setThreadId = (threadId: string | undefined) => {
    setCurrentThreadId(threadId);
    if (threadId === undefined) {
      setMessages([]);
      return;
    }

    const assistantThreads = localStorage.getItem(localStorageName);
    const threads = JSON.parse(assistantThreads || '{}');
    setThreads(threads);
    if (threads[threadId] !== undefined) {
      setMessages(threads[threadId].messages);
    } else {
      setMessages([]);
    }
  };

  const deleteThreadFromHistory = (threadId: string) => {
    const assistantThreads = localStorage.getItem(localStorageName);
    const threads = JSON.parse(assistantThreads || '{}');
    delete threads[threadId];
    localStorage.setItem(localStorageName, JSON.stringify(threads));

    // if threadId is the current thread set to undefined
    if (currentThreadId === threadId) {
      setThreadId(undefined);
    }

    setThreads(threads);
  };

  return {
    append,
    messages,
    setMessages,
    threadId: currentThreadId,
    setThreadId,
    deleteThreadFromHistory,
    threads,
    input,
    setInput,
    handleInputChange,
    submitMessage,
    status,
    error,
    stop,
    attachments,
    setAttachments,
  };
}
