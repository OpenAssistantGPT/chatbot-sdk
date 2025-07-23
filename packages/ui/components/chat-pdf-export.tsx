import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';
import { Message } from '@openassistantgpt/react';
import { ChatbotConfig } from '@/src/chatbot';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '2 solid #e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
    fontFamily: 'Helvetica-Bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 10,
    fontFamily: 'Helvetica',
  },
  chatContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  messageContainer: {
    flexDirection: 'column',
    marginBottom: 16,
    break: false, // Prevent breaking this container across pages
  },
  userMessage: {
    alignSelf: 'flex-end',
    maxWidth: '75%',
    wrap: false, // Keep the entire message together
    alignItems: 'flex-end', // Align all content to the right within the container
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
    wrap: false, // Keep the entire message together
    alignItems: 'flex-start', // Align all content to the left within the container
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  userBubble: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    padding: 12,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    break: false, // Prevent breaking the bubble across pages
  },
  assistantBubble: {
    backgroundColor: '#f3f4f6',
    color: '#1f2937',
    padding: 12,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    break: false, // Prevent breaking the bubble across pages
  },
  messageText: {
    fontSize: 11,
    lineHeight: 1.5,
    fontFamily: 'Helvetica',
  },
  roleLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Helvetica-Bold',
  },
  timestamp: {
    fontSize: 8,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'right',
    fontFamily: 'Helvetica',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 8,
    borderTop: '1 solid #e5e7eb',
    paddingTop: 10,
    fontFamily: 'Helvetica',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 8,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#9ca3af',
    fontFamily: 'Helvetica',
  },
});

interface ChatPDFDocumentProps {
  messages: Message[];
  chatbot: ChatbotConfig;
  timestamp: string;
}

const ChatPDFDocument: React.FC<ChatPDFDocumentProps> = ({
  messages,
  chatbot,
  timestamp,
}) => {
  const formatMessageContent = (content: string) => {
    // Remove markdown formatting for PDF
    return content
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/```[\s\S]*?```/g, '[Code Block]') // Replace code blocks
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links but keep text
      .replace(/#{1,6}\s/g, '') // Remove headers
      .replace(/\【.*?】/g, '') // Remove any special annotations
      .trim(); // Clean up whitespace
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Chat Conversation</Text>
          <Text style={styles.subtitle}>
            {chatbot.chatTitle || chatbot.name}
          </Text>
          <Text style={styles.subtitle}>Exported on {timestamp}</Text>
        </View>

        {/* Chat Content */}
        <View style={styles.chatContainer}>
          {/* Welcome Message */}
          <View
            style={[styles.messageContainer, styles.assistantMessage]}
            wrap={false}
          >
            <Text style={styles.roleLabel}>Assistant</Text>
            <View style={styles.assistantBubble}>
              <Text style={styles.messageText}>
                {formatMessageContent(chatbot.welcomeMessage)}
              </Text>
            </View>
          </View>

          {/* Chat Messages */}
          {messages.map((message, index) => (
            <View
              key={index}
              style={[
                styles.messageContainer,
                message.role === 'user'
                  ? styles.userMessage
                  : styles.assistantMessage,
              ]}
              wrap={false} // Prevent individual messages from breaking across pages
            >
              <Text style={styles.roleLabel}>
                {message.role === 'user' ? 'You' : 'Assistant'}
              </Text>
              <View
                style={
                  message.role === 'user'
                    ? styles.userBubble
                    : styles.assistantBubble
                }
              >
                <Text style={styles.messageText}>
                  {formatMessageContent(message.content)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            Generated by {chatbot.name || 'OpenAssistantGPT'} -{' '}
            {chatbot.footerTextName || 'OpenAssistantGPT'}
          </Text>
        </View>

        {/* Page Number */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `Page ${pageNumber} of ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export const generateChatPDF = async (
  messages: Message[],
  chatbot: ChatbotConfig,
): Promise<Blob> => {
  const timestamp = new Date().toLocaleString();

  const doc = (
    <ChatPDFDocument
      messages={messages}
      chatbot={chatbot}
      timestamp={timestamp}
    />
  );

  const pdfBlob = await pdf(doc).toBlob();
  return pdfBlob;
};

export default ChatPDFDocument;
