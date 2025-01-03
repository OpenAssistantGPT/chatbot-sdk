'use client';

import { OpenAssistantGPTChat, ChatbotConfig } from '@openassistantgpt/ui';
import { SupportInquiry } from './button-extension';

export default function ChatPage() {
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

    fontSize: '14px',

    displayFooterText: true,
    footerLink: 'https://www.openassistantgpt.io',
    footerTextName: 'OpenAssistantGPT',

    messageSourceText: 'Chatbot source:',
    withChatMessageIcon: false,
  };

  return (
    <OpenAssistantGPTChat
      chatbot={chatbot}
      path="/api/chat/assistant"
      defaultMessage=""
      extensions={[<SupportInquiry key="first" />]}
      handleAfterChat={() => console.log('after chat')}
      handleBeforeChat={() => console.log('before chat')}
      disableInput={false}
      annotationsFiles={[
        {
          fileName: 'google',
          fileId: 'file-GMUsHaFBkyvlAHdpCvt3Hngf',
          downloadUrl: 'https://google.com',
        },
      ]}
    />
  );
}
