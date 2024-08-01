'use client';

import { ChatbotConfig, Message, OpenAssistantGPTChat } from 'openassistantgpt';
import { useEffect, useState } from 'react';
import { SupportInquiry } from './components/inquiry';
import { Button } from './components/ui/button';

export default function ChatPage() {
  const [count, setMessagesCount] = useState(0);
  const [defaultMessage, setDefaultMessage] = useState('');

  const chatbot: ChatbotConfig = {
    id: '12345',
    name: 'OpenAssistantGPT',

    chatTitle: 'Chat with OpenAssistantGPT',
    welcomeMessage:
      "Welcome to OpenAssistantGPT! 🚀 I'm your AI assistant, crafted using this platform. How may I assist you today?",
    chatMessagePlaceHolder: 'Ask us any question...',

    rightToLeftLanguage: false,

    bubbleColor: 'linear-gradient(to top left, #003366, #336699)',
    bubbleTextColor: '#FFFFFF',

    chatHeaderBackgroundColor: '#FFFFFF',
    chatHeaderTextColor: '#52525b',

    chatbotReplyBackgroundColor: '#e4e4e7',
    chatbotReplyTextColor: '#000000',

    userReplyBackgroundColor: '#e4e4e7',
    userReplyTextColor: '#000000',

    chatbotLogoURL:
      'https://gwetfkan2dovfoiz.public.blob.vercel-storage.com/search-8jZhOvOBPxuTmohrup5TPvSzrjsyog.png',
    chatInputStyle: 'default',

    chatHistoryEnabled: true,
    chatFileAttachementEnabled: true,

    displayFooterText: true,
    footerLink: 'https://www.openassistantgpt.io',
    footerTextName: 'OpenAssistantGPT',
  };

  useEffect(() => {
    console.log('Messages count:', count);
  }, [count]);

  function handleMessagesChange(messages: Message[]) {
    setMessagesCount(messages.length);
  }

  return (
    <OpenAssistantGPTChat
      chatbot={chatbot}
      path="/api/chat/assistant"
      defaultMessage={defaultMessage}
      withExitX={true}
      onMessagesChange={handleMessagesChange}
      extensions={[
        count == 0 && (
          <Button
            key="1"
            className="w-full bg-white"
            variant="outline"
            onClick={() =>
              setDefaultMessage('How many chatbot can I created on free plan?')
            }
          >
            How many chatbot can I created on free plan?
          </Button>
        ),
        count == 0 && (
          <Button
            key="2"
            className="w-full bg-white"
            variant="outline"
            onClick={() => setDefaultMessage('How to create a chatbot?')}
          >
            How to create a chatbot?
          </Button>
        ),
        count == 0 && (
          <Button
            key="3"
            className="w-full bg-white"
            variant="outline"
            onClick={() =>
              setDefaultMessage('How to integrate chatbot in website?')
            }
          >
            How to integrate chatbot in website?
          </Button>
        ),
        count == 0 && (
          <Button
            key="4"
            className="w-full bg-white"
            variant="outline"
            onClick={() => setDefaultMessage('What is a SDK?')}
          >
            What is a SDK?
          </Button>
        ),
        count > 1 && <SupportInquiry key="5" />,
      ]}
    />
  );
}
