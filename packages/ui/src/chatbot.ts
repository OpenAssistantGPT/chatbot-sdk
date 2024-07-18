export type ChatbotConfig = {
  id: string;
  name: string;
  chatTitle: string;
  welcomeMessage: string;
  chatMessagePlaceHolder: string;

  rightToLeftLanguage: boolean;

  bubbleColor: string;
  bubbleTextColor: string;

  chatHeaderBackgroundColor: string;
  chatHeaderTextColor: string;

  chatbotReplyBackgroundColor: string;
  chatbotReplyTextColor: string;

  userReplyBackgroundColor: string;
  userReplyTextColor: string;

  chatbotLogoURL: string;

  chatInputStyle: string;

  chatHistoryEnabled: boolean;
  chatFileAttachementEnabled: boolean;

  displayFooterText: boolean;
  footerTextName: string;
  footerLink: string;
};
