import React from 'react';
// @ts-ignore - Type conflicts with React 19 RC
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  pdf 
} from '@react-pdf/renderer';
import { Message } from '@openassistantgpt/react';
import { ChatbotConfig } from '../src/chatbot';

// Define styles for the PDF with bubble layout
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
    color: '#2563eb',
  },
  subtitle: {
    fontSize: 10,
    textAlign: 'center',
    color: '#6b7280',
    marginBottom: 20,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 20,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 15,
    width: '100%',
  },
  // Assistant messages - left aligned
  assistantRow: {
    justifyContent: 'flex-start',
  },
  assistantBubble: {
    backgroundColor: '#f3f4f6',
    borderRadius: 15,
    borderTopLeftRadius: 5,
    padding: 12,
    maxWidth: '70%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  assistantLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 4,
  },
  assistantText: {
    fontSize: 11,
    lineHeight: 1.4,
    color: '#374151',
  },
  // User messages - right aligned
  userRow: {
    justifyContent: 'flex-end',
  },
  userBubble: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 15,
    borderTopRightRadius: 5,
    padding: 12,
    maxWidth: '70%',
  },
  userLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 4,
  },
  userText: {
    fontSize: 11,
    lineHeight: 1.4,
    color: '#374151',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
  },
});

// Clean message content from markdown and special characters
function cleanMessageContent(content: string): string {
  return content
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
    .replace(/`(.*?)`/g, '$1') // Remove inline code markdown
    .replace(/```[\s\S]*?```/g, '[Code Block]') // Replace code blocks
    .replace(/#{1,6}\s*(.*)/g, '$1') // Remove headers
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1 ($2)') // Convert links
    .replace(/\【.*?】/g, '') // Remove citation markers
    .replace(/loading/g, 'Generating response...')
    .trim();
}

// Function to generate and download PDF
export async function generatePDFTranscript(
  messages: Message[],
  chatbot: ChatbotConfig
): Promise<void> {
  try {
    // @ts-ignore - Working around React 19 RC type conflicts
    const PDFDocument = React.createElement(Document as any, {},
      // @ts-ignore
      React.createElement(Page as any, { size: 'A4', style: styles.page },
        // Header
        // @ts-ignore
        React.createElement(Text as any, { style: styles.header }, 'Chat Transcript'),
        // @ts-ignore
        React.createElement(Text as any, { style: styles.subtitle }, 
          `Generated: ${new Date().toLocaleString()}`
        ),
        // @ts-ignore
        React.createElement(View as any, { style: styles.divider }),
        
        // Welcome Message - styled like assistant bubble
        ...(chatbot.welcomeMessage ? [
          // @ts-ignore
          React.createElement(View as any, { 
            style: [styles.messageRow, styles.assistantRow],
            key: 'welcome' 
          },
            // @ts-ignore
            React.createElement(View as any, { style: styles.assistantBubble },
              // @ts-ignore
              React.createElement(Text as any, { style: styles.assistantLabel }, 'Assistant:'),
              // @ts-ignore
              React.createElement(Text as any, { style: styles.assistantText }, 
                cleanMessageContent(chatbot.welcomeMessage)
              )
            )
          )
        ] : []),
        
        // Messages with bubble layout
        ...messages.map((message, index) => {
          const isUser = message.role === 'user';
          // @ts-ignore
          return React.createElement(View as any, { 
            style: [styles.messageRow, isUser ? styles.userRow : styles.assistantRow],
            key: index.toString()
          },
            // @ts-ignore
            React.createElement(View as any, { 
              style: isUser ? styles.userBubble : styles.assistantBubble 
            },
              // @ts-ignore
              React.createElement(Text as any, { 
                style: isUser ? styles.userLabel : styles.assistantLabel 
              }, isUser ? 'You:' : 'Assistant:'),
              // @ts-ignore
              React.createElement(Text as any, { 
                style: isUser ? styles.userText : styles.assistantText 
              }, cleanMessageContent(message.content))
            )
          );
        }),
        
        // Footer
        // @ts-ignore
        React.createElement(Text as any, {
          style: styles.footer,
          render: ({ pageNumber, totalPages }: any) => 
            `Page ${pageNumber} of ${totalPages}`,
          fixed: true
        })
      )
    );

    // Generate PDF blob
    // @ts-ignore - Final type assertion for React 19 RC compatibility
    const blob = await pdf(PDFDocument as any).toBlob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-transcript-${new Date().toISOString().split('T')[0]}.pdf`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF transcript');
  }
} 