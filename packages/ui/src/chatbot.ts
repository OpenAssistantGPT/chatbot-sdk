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

  inquiryEnabled: boolean;
  inquiryLinkText: string;
  inquiryTitle: string;
  inquirySubtitle: string;
  inquiryEmailLabel: string;
  inquiryMessageLabel: string;
  inquirySendButtonText: string;
  inquiryAutomaticReplyText: string;
  inquiryDisplayLinkAfterXMessage: number;

  chatHistoryEnabled: boolean;
  displayBranding: boolean;
  chatFileAttachementEnabled: boolean;
};
