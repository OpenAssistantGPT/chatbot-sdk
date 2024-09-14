import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/icons';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { useAssistant, Message } from '@openassistantgpt/react';
import { useEffect, useRef, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FooterText } from '@/components/chat-footer-text';
import { ChatMessage } from '@/components/chat-message';
import { useEnterSubmit } from '@/hooks/use-enter-submit';
import { ChatHistory } from '@/components/chat-history';
import { ChatbotConfig } from '@/src/chatbot';
import { ChatHeader } from '@/components/chat-header';

interface ChatbotProps {
  chatbot: ChatbotConfig;
  defaultMessage: string;
  path: string;
  className?: string;
  withExitX?: boolean;
  clientSidePrompt?: string;
  extensions?: React.ReactNode[];
  onMessagesChange?: (messages: Message[]) => void;
  onThreadIdChange?: (threadId: string | undefined) => void;
}

export function OpenAssistantGPTChat({
  chatbot,
  defaultMessage,
  path,
  className,
  withExitX = false,
  clientSidePrompt,
  onMessagesChange,
  onThreadIdChange,
  extensions,
  ...props
}: ChatbotProps) {
  let inputFileRef = useRef<HTMLInputElement>(null);

  const { formRef, onKeyDown } = useEnterSubmit();

  const {
    status,
    messages,
    input,
    submitMessage,
    handleInputChange,
    error,
    threadId,
    setThreadId,
    threads,
    deleteThreadFromHistory,
    stop,
  } = useAssistant({
    id: chatbot.id,
    api: path,
    inputFile: inputFileRef.current?.files
      ? inputFileRef.current.files[0]
      : undefined,
    clientSidePrompt: clientSidePrompt,
  });

  function handleSubmitMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    submitMessage();

    setFileUploaded(false);
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  }

  useEffect(() => {
    if (status === 'awaiting_message') {
      if (inputFileRef.current) {
        inputFileRef.current.value = '';
      }
    }
  }, [status]);

  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const [fileUploaded, setFileUploaded] = useState(false);

  useEffect(() => {
    if (error) {
      console.log(error);
      toast({
        title: 'Error',
        // @ts-ignore
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [error]);

  useEffect(() => {
    if (onThreadIdChange) {
      onThreadIdChange(threadId);
    }
  }, [threadId]);

  useEffect(() => {
    // Scroll to the bottom of the container on messages update
    document.documentElement.scrollTop =
      document.getElementById('end')!.offsetTop;

    if (onMessagesChange) {
      onMessagesChange(messages);
    }
  }, [messages]);

  useEffect(() => {
    if (defaultMessage !== '') {
      input === '' &&
        handleInputChange({
          target: { value: defaultMessage },
        } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [defaultMessage]);

  function closeChat() {
    window.parent.postMessage('closeChat', '*');
  }

  function downloadTranscript() {
    const transcript =
      `assistant: ${chatbot.welcomeMessage}\n\n` +
      messages
        .map((msg: Message) => `${msg.role}: ${msg.content}`)
        .join('\n\n');
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'chat_transcript.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <>
      <TooltipProvider>
        {chatbot.chatHistoryEnabled && (
          <ChatHistory
            threads={threads}
            setThreadId={setThreadId}
            threadId={threadId}
            deleteThreadFromHistory={deleteThreadFromHistory}
          ></ChatHistory>
        )}
        <ChatHeader
          chatbot={chatbot}
          withExitX={withExitX}
          downloadTranscript={downloadTranscript}
          closeChat={closeChat}
        />

        <div className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
          <div
            className={cn(
              'pb-[200px] overflow-auto pl-6 sm:pl-20 pr-6 sm:pr-20 md:pb-[200px] pt-4 md:pt-10',
              className,
            )}
          >
            <ChatMessage
              isFirst={true}
              chatbot={chatbot}
              message={{
                id: '0',
                role: 'assistant',
                content: chatbot.welcomeMessage,
              }}
              fontSize={chatbot.fontSize}
            />
            <div className="flex-grow overflow-y-auto space-y-6 flex flex-col order-2">
              {messages.map((message: Message, index) => {
                return (
                  <ChatMessage
                    chatbot={chatbot}
                    key={index}
                    message={message}
                    fontSize={chatbot.fontSize}
                  />
                );
              })}
            </div>
            {status !== 'awaiting_message' && (
              <div className="mt-4">
                <ChatMessage
                  chatbot={chatbot}
                  message={{
                    id: 'waiting',
                    role: 'assistant',
                    content: 'loading',
                  }}
                  fontSize={chatbot.fontSize}
                />
              </div>
            )}
            <div id="end" ref={containerRef}>
              {' '}
            </div>
          </div>
          <div className="fixed inset-x-0 bottom-0 w-full ease-in-out animate-in peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
            <div
              className={`mx-auto ${
                chatbot.chatInputStyle === 'default'
                  ? 'sm:max-w-2xl sm:px-4'
                  : ''
              }`}
            >
              <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-2 px-4 ">
                {extensions}
              </div>

              <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl md:py-4">
                <form onSubmit={handleSubmitMessage} {...props} ref={formRef}>
                  {fileUploaded && (
                    <div className="flex w-full sm:w-1/2 items-center p-2 bg-white border rounded-lg shadow-sm">
                      <Icons.document className="text-gray-400 w-6 h-6 flex-shrink-0" />
                      <div className="flex flex-col pl-3 pr-6 flex-1 min-w-0">
                        <span className="font-sm text-gray-800 truncate">
                          {inputFileRef.current?.files![0].name}
                        </span>
                        <span className="text-sm text-gray-500">
                          {inputFileRef.current?.files![0].type === 'image/jpeg'
                            ? 'Image'
                            : inputFileRef.current?.files![0].type ===
                              'image/png'
                            ? 'Image'
                            : inputFileRef.current?.files![0].type ===
                              'image/svg+xml'
                            ? 'Image'
                            : 'Document'}
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="flex-shrink-0"
                        onClick={() => {
                          inputFileRef.current!.value = '';
                          setFileUploaded(false);
                        }}
                      >
                        <Icons.close className="text-gray-400 w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <div
                    className={`relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background ${
                      chatbot.chatFileAttachementEnabled
                        ? 'px-8 sm:px-12'
                        : 'px-2 sm:px-2'
                    }`}
                  >
                    {chatbot.chatFileAttachementEnabled && (
                      <div className="">
                        <Label htmlFor="file" className="">
                          <div
                            className={`p-2 absolute left-0 top-[12px] size-8 rounded-full bg-background p-0 sm:left-4 border border-input hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background`}
                          >
                            <Icons.paperclip className="text-muted-foreground h-4 w-4" />
                          </div>
                        </Label>
                        <Input
                          ref={inputFileRef}
                          id="file"
                          type="file"
                          className="hidden"
                          onChange={() => {
                            setFileUploaded(true);
                          }}
                        />
                      </div>
                    )}
                    <div
                      className={
                        chatbot.chatFileAttachementEnabled
                          ? `pl-4`
                          : `` + ` pr-8`
                      }
                    >
                      <Textarea
                        ref={inputRef}
                        tabIndex={0}
                        onKeyDown={onKeyDown}
                        placeholder={chatbot.chatMessagePlaceHolder}
                        className="border-0 border-gray-300 rounded-lg min-h-[60px] w-full resize-none bg-white pl-4 py-[1rem] shadow-sm focus-visible:ring-0"
                        style={{ fontSize: chatbot.fontSize }}
                        spellCheck={false}
                        autoComplete="off"
                        autoCorrect="off"
                        name="message"
                        rows={1}
                        value={input}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className={`absolute top-[14px] right-0`}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {status === 'awaiting_message' ? (
                            <Button
                              id="submit"
                              disabled={input === ''}
                              type="submit"
                              size="icon"
                            >
                              <Icons.arrowRight />
                              <span className="sr-only">Send message</span>
                            </Button>
                          ) : (
                            <Button
                              id="stop"
                              onClick={stop}
                              size="icon"
                              type="submit"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                width="24"
                                height="24"
                                fill="currentColor"
                              >
                                <rect
                                  x="6"
                                  y="6"
                                  width="12"
                                  height="12"
                                  rx="2"
                                  ry="2"
                                />
                              </svg>
                              <span className="sr-only">Stop message</span>
                            </Button>
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          {status === 'awaiting_message'
                            ? 'Send message'
                            : 'Stop message'}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  {chatbot.displayFooterText && (
                    <FooterText
                      link={chatbot.footerLink}
                      name={chatbot.footerTextName}
                      className="block my-2"
                    />
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
}
