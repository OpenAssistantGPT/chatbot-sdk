import { OpenAssistantGPT } from '@openassistantgpt/assistant';

// In OpenAssistantGPT handler you must enter your base path.
// The base path is everything before the [[...openassistantgpt]] part of the route.
const httpHandler = new OpenAssistantGPT('/api/chat/').handler;

export { httpHandler as GET, httpHandler as POST };
