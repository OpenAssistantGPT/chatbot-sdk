import React from 'react';

import { Message } from '@openassistantgpt/react';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import { MathJax, MathJaxContext } from 'better-react-mathjax';

import { cn } from '@/lib/utils';
import { CodeBlock } from '@/components/ui/codeblock';
import { MemoizedReactMarkdown } from '@/components/markdown';
import { Icons } from '@/components/icons';
import { ExternalLink } from '@/components/external-link';
import { ChatMessageActions } from '@/components/chat-message-actions';
import { ChatbotConfig } from '@/src';
import { Attachment } from '@/types/attachements';
import { PreviewAttachment } from '@/components/preview-attachement';

export interface Reference {
  id: string;
  fileName: string;
  downloadUrl: string;
}

export interface ChatMessageProps {
  message: Message;
  messageSourceText: string;
  children?: React.ReactNode;
  chatbot: ChatbotConfig;
  attachments?: Array<Attachment>;
  isFirst?: boolean;
  fontSize: string; // Keep as string for pixel values
  references: Reference[];
}

const getDirection = (isRTL: boolean) => (isRTL ? 'rtl' : 'ltr');

export function ChatMessage({
  message,
  messageSourceText,
  children,
  chatbot,
  isFirst,
  attachments,
  references,
  fontSize = '16px', // Default font size in pixels
  ...props
}: ChatMessageProps) {
  return (
    <>
      {message.role === 'user' ? (
        <div
          className={cn('pl-10 group relative mb-4 flex justify-end items-end')}
          {...props}
        >
          <p
            style={{
              color: chatbot.userReplyTextColor,
              background: chatbot.userReplyBackgroundColor,
              fontSize, // Apply font size in pixels here
            }}
            className="p-2 rounded-lg mr-4 whitespace-pre-wrap"
            dir={getDirection(chatbot.rightToLeftLanguage)} // Set text direction
          >
            <svg
              fill={chatbot.userReplyBackgroundColor}
              className="absolute bottom-[0px] right-11"
              height="14"
              width="13"
            >
              <path d="M6 .246c-.175 5.992-1.539 8.89-5.5 13.5 6.117.073 9.128-.306 12.5-3L6 .246Z"></path>
            </svg>
            {message.content}
          </p>
          <div
            className={cn(
              'flex size-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
              'bg-background',
            )}
          >
            <Icons.user />
          </div>
        </div>
      ) : (
        <div
          className={cn('pr-10 group relative mb-4 flex items-start ')}
          {...props}
        >
          {chatbot.chatbotLogoURL ? (
            <div className="size-8" style={{ width: '30px', height: '30px' }}>
              <img
                src={chatbot.chatbotLogoURL}
                alt="chatbot logo"
                width={50}
                height={50}
              />
            </div>
          ) : (
            <div
              className={cn(
                'flex size-8 shrink-0 select-none items-center justify-center rounded-md border shadow',
                'bg-primary text-primary-foreground',
              )}
            >
              <Icons.bot />
            </div>
          )}
          <div className="flex-1 px-1 ml-4">
            {message.content == 'loading' ? (
              <Icons.loading className="animate-spin" />
            ) : (
              <>
                <MemoizedReactMarkdown
                  className={`w-full prose break-words prose-p:leading-relaxed prose-pre:p-0 text-${chatbot.fontSize}`}
                  remarkPlugins={[remarkGfm, remarkMath]}
                  components={{
                    a({ node, children, ...props }) {
                      return (
                        <ExternalLink href={props.href!}>
                          {children}
                        </ExternalLink>
                      );
                    },
                    p({ children }) {
                      return (
                        <p
                          className="mb-2 last:mb-0"
                          style={{ fontSize }} // Apply font size in pixels here
                          dir={getDirection(chatbot.rightToLeftLanguage)}
                        >
                          {children}
                        </p>
                      );
                    },
                    code({ node, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');

                      if (!match) {
                        return (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      }

                      if (
                        match &&
                        (match[1] === 'math' || match[1] === 'latex')
                      ) {
                        return (
                          <MathJaxContext>
                            {/*@ts-ignore*/}
                            <MathJax>{children || ''}</MathJax>
                          </MathJaxContext>
                        );
                      }

                      return (
                        <CodeBlock
                          key={Math.random()}
                          language={(match && match[1]) || ''}
                          value={String(children).replace(/\n$/, '')}
                          {...props}
                        />
                      );
                    },
                  }}
                >
                  {message.content.replace(/\【.*?】/g, '')}
                </MemoizedReactMarkdown>
                {attachments && (
                  <div className="flex flex-row gap-2">
                    {attachments.map(attachment => (
                      <PreviewAttachment
                        key={attachment.url}
                        attachment={attachment}
                      />
                    ))}
                  </div>
                )}
                {references.length > 0 && (
                  <div className="mt-2 text-muted-foreground text-xs space-y-1">
                    {messageSourceText}
                    {references.map((ref, i) => (
                      <p key={i}>
                        🔗{' '}
                        <a
                          href={ref.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {ref.fileName}
                        </a>
                      </p>
                    ))}
                  </div>
                )}
                {!isFirst ? (
                  <ChatMessageActions message={message} />
                ) : (
                  <div className="size-3"></div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
