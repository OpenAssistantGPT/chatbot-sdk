# @openassistantgpt/ui

## 0.3.14

### Patch Changes

- 9882a3e: Enable spellcheck

## 0.3.13

### Patch Changes

- d252e75: Remove option to stop the api and make sure a user can't send a message twice

## 0.3.12

### Patch Changes

- 344f91c: Handle after chat to actually call the function after the chat is completed
- Updated dependencies [344f91c]
  - @openassistantgpt/react@0.3.3

## 0.3.11

### Patch Changes

- 116076b: Add new feature to disable chat inputs

## 0.3.10

### Patch Changes

- 5481399: add a parameter to be able to call a function before and after submitting a message

## 0.3.9

### Patch Changes

- 2626b91: Update marging and padding issue

## 0.3.8

### Patch Changes

- d61426f: Adjust pading in chat window when disabeling icon.

## 0.3.7

### Patch Changes

- 91497dc: Add feature to remove all icons from chat

## 0.3.6

### Patch Changes

- b7910da: Send message to parent window on message sent

## 0.3.5

### Patch Changes

- d287b92: Fix scrolling animation that makes parent window scroll

## 0.3.4

### Patch Changes

- 4bbfa94: Improve scrolling. Disable autoscroll when user is trying to scroll up when generating a message and add a button to scroll down when you are not at the buttom

## 0.3.3

### Patch Changes

- 0043c44: feat: remove console log that is spamming the console

## 0.3.2

### Patch Changes

- 2fcbfad: Add support for multiple sources and custom text before displaying the sources
- Updated dependencies [2fcbfad]
  - @openassistantgpt/react@0.3.2

## 0.3.1

### Patch Changes

- d020f27: update issue with types on file handle function
- Updated dependencies [d020f27]
  - @openassistantgpt/react@0.3.1

## 0.3.0

### Minor Changes

- 8d62b91: Add support for file references. You can now display the document where the assistant chatbot got his information from.

### Patch Changes

- Updated dependencies [8d62b91]
  - @openassistantgpt/react@0.3.0

## 0.2.5

### Patch Changes

- 5da68eb: fix issue when the copy in CodeBlock was breaking the page

## 0.2.4

### Patch Changes

- 0387c04: Export toast to be able to use them in app

## 0.2.3

### Patch Changes

- 994197f: Add scroll when there is too much attachments

## 0.2.2

### Patch Changes

- d9169e0: Add max height and width to attachment preview

## 0.2.1

### Patch Changes

- bed19ad: Use path in file upload

## 0.2.0

### Minor Changes

- 3f4f1d7: Support upload of multiple attachments and improve validation

### Patch Changes

- Updated dependencies [3f4f1d7]
  - @openassistantgpt/react@0.2.0

## 0.1.9

### Patch Changes

- e4d2713: add feature to configure the fontsize

## 0.1.8

### Patch Changes

- a55c6e7: Add option to stop the message generation when it is being generated

## 0.1.7

### Patch Changes

- dadc8fd: Update icons

## 0.1.6

### Patch Changes

- bdafd7c: Fix frontend error while copying message

## 0.1.5

### Patch Changes

- 2635c63: Fix type error from String to string

## 0.1.4

### Patch Changes

- 7303695: add parameters to support threadId changes

## 0.1.3

### Patch Changes

- 675d106: Fix more scrolling issue

## 0.1.2

### Patch Changes

- 4e5c500: Fix issue when chat history wasnt showing all items

## 0.1.1

### Patch Changes

- 4b57e1e: add support for extensions in the chat and improve mobile UX
- Updated dependencies [4b57e1e]
  - @openassistantgpt/react@0.1.1

## 0.1.0

### Minor Changes

- 9aaa198: Add feature to support extensions in our chat compoenent, improve chat header in mobile mode.

### Patch Changes

- Updated dependencies [9aaa198]
  - @openassistantgpt/react@0.1.0

## 0.0.7

### Patch Changes

- ba1155a: Override max width of attribute prose

## 0.0.6

### Patch Changes

- df7561e: Add download transcript option and fix width of assistant reply
- Updated dependencies [df7561e]
  - @openassistantgpt/react@0.0.4

## 0.0.5

### Patch Changes

- 4737746: Update handlers to support parameters instead of having to use environment variable. You can now provide assistantId and OpenAI object in the function parameters.

## 0.0.4

### Patch Changes

- e14ba89: The tooltip component is now wrapped in the chat component, it is not exported anymore

## 0.0.3

### Patch Changes

- 2a9002e: finish last doc update, fix latest bug there is no new feature in this release
- Updated dependencies [2a9002e]
  - @openassistantgpt/react@0.0.3

## 0.0.2

### Patch Changes

- fcacff1: Update all Git repository link
- Updated dependencies [fcacff1]
  - @openassistantgpt/react@0.0.2

## 0.0.1

### Patch Changes

- 151c8b0: Create the default library for the Official OpenAssistant SDK library and created all the required package to run a chatbot in few steps.
- Updated dependencies [151c8b0]
  - @openassistantgpt/react@0.0.1
