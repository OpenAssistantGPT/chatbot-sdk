import {
  OpenAssistantGPTChat as chat,
  ChatbotConfig as chatbotConfig,
} from '@openassistantgpt/ui';
export const OpenAssistantGPTChat = chat;
export type { ChatbotConfig } from '@openassistantgpt/ui';

import { useAssistant as assistant } from '@openassistantgpt/react';
export const useAssistant = assistant;
export type { Message } from '@openassistantgpt/react';

import {
  AssistantResponse as response,
  fileSearchExtensionList as fileSearchList,
  codeInterpreterExtensionList as codeInterpreterList,
  handleAssistant as assistantHandler,
  handleFile as fileHandler,
  handleFileFunction as fileFunction,
} from '@openassistantgpt/assistant';

export const AssistantResponse = response;
export const codeInterpreterExtensionList = codeInterpreterList;
export const handleAssistant = assistantHandler;
export const handleFile = fileHandler;
export const handleFileFunction = fileFunction;
export const fileSearchExtensionList = fileSearchList;

export type { OpenAssistantGPT } from '@openassistantgpt/assistant';
