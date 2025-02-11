# React Native Modern Chats UI

A highly customizable, feature-rich chats interface component for React Native applications. Built with performance and flexibility in mind, this component provides a complete solution for implementing chats functionality in your mobile applications.

## Features

- 🚀 Full TypeScript support
- 📱 Native performance optimizations
- 🎨 Extensive theme customization
- 🖼️ Multi-media message support (text, images, video, audio)
- 👤 Avatar and username display options
- ⌨️ Typing indicators
- 📎 File attachments
- 🎥 Camera integration
- 🎤 Voice messages
- 💬 Message status indicators (sent, delivered, read)
- 🎯 Custom component injection
- 🔧 Comprehensive styling API

## Installation

```bash
npm install movius-chats
# or
yarn add movius-chats
```

### Required Dependencies

The following packages are required for movius-chats to function properly. Install them using npm or yarn:

```bash
# Using npm
npm install react-native-image-zoom-viewer react-native-reanimated react-native-sound react-native-svg react-native-video twrnc

# Using yarn
yarn add react-native-image-zoom-viewer react-native-reanimated react-native-sound react-native-svg react-native-video twrnc
```

### Additional Setup

For react-native-reanimated, add this line to your `babel.config.js`:

```javascript
module.exports = {
  plugins: ['react-native-reanimated/plugin'],
};
```

## Basic Usage

```typescript
import { ChatScreen, Message } from 'movius-chats';
import { useState } from 'react';

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (message: Omit<Message, "id" | "time" | "status">) => {
    // Handle sending message
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString(),
      status: 'sent'
    };
    setMessages(prev => [newMessage, ...prev]);
  };

  return (
    <ChatScreen
      messages={messages}
      currentUserId="user123"
      onSendMessage={handleSendMessage}
      showAvatars
    />
  );
};
```

## Props

### Core Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| messages | Message[] | Yes | Array of message objects to display |
| currentUserId | string | Yes | ID of the current user |
| onSendMessage | (message: Omit<Message, "id" \| "time" \| "status">) => void | Yes | Callback when a message is sent |

### Message Type

```typescript
interface Message {
  id: string;
  text?: string;
  image?: string;
  video?: string;
  audio?: string;
  senderId: string;
  time: string;
  status: "read" | "delivered" | "sent";
  senderName?: string;
  senderAvatar?: string;
}
```

### Feature Flags

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| showAvatars | boolean | false | Show user avatars |
| showUserNames | boolean | false | Display usernames above messages |
| showEmojiButton | boolean | true | Show emoji picker button |
| showAttachmentsButton | boolean | true | Show attachments button |
| showCameraButton | boolean | true | Show camera access button |
| showVoiceRecordButton | boolean | true | Show voice recording button |
| showBubbleTail | boolean | true | Show message bubble tails |
| showMessageStatus | boolean | true | Show message status indicators |

### Event Handlers

| Prop | Type | Description |
|------|------|-------------|
| onMessageLongPress | (message: Message) => void | Callback for long-pressing a message |
| onAttachmentPress | () => void | Callback for attachment button press |
| onAudioRecordStart | () => void | Callback when audio recording starts |
| onAudioRecordEnd | () => void | Callback when audio recording ends |
| onCameraPress | () => void | Callback for camera button press |
| onTypingStart | () => void | Callback when user starts typing |
| onTypingEnd | () => void | Callback when user stops typing |

### Theming

The component supports extensive theming through the `theme` prop:

```typescript
theme?: {
  colors?: {
    sentMessageTailColor?: string;
    receivedMessageTailColor?: string;
    timestamp?: string;
    inputsIconsColor?: string;
    sendIconsColor?: string;
    placeholderTextColor?: string;
    audioPlayIconColor?: string;
    audioPauseIconColor?: string;
    videoPlayIconColor?: string;
  };
  bubbleStyle?: {
    sent?: ViewStyle;
    received?: ViewStyle;
    // ... other bubble styles
  };
  messageStyle?: {
    textStyle?: TextStyle;
    // ... other message styles
  };
  inputStyles?: {
    inputSectionContainerStyle?: ViewStyle;
    // ... other input styles
  };
}
```

### Custom Components

You can provide custom components for various elements:

| Prop | Type | Description |
|------|------|-------------|
| renderCustomInput | () => React.ReactNode | Custom input component |
| renderCustomVideoBubbleError | () => React.ReactNode | Custom video error display |
| renderCustomTyping | () => React.ReactNode | Custom typing indicator |
| CustomEmojiIcon | () => React.ReactNode | Custom emoji picker icon |
| CustomAttachmentIcon | () => React.ReactNode | Custom attachment icon |
| CustomCameraIcon | () => React.ReactNode | Custom camera icon |
| CustomSendIcon | () => React.ReactNode | Custom send button icon |
| CustomMicrophoneIcon | () => React.ReactNode | Custom microphone icon |
| CustomPlayIcon | () => React.ReactNode | Custom play icon |
| CustomPauseIcon | () => React.ReactNode | Custom pause icon |

## Advanced Usage

### Custom Theme Example

```typescript
<ChatScreen
  messages={messages}
  currentUserId="user123"
  onSendMessage={handleSendMessage}
  theme={{
    colors: {
      sentMessageTailColor: '#007AFF',
      receivedMessageTailColor: '#E9E9EB',
      timestamp: '#8E8E93',
    },
    bubbleStyle: {
      sent: {
        backgroundColor: '#007AFF',
        borderRadius: 20,
      },
      received: {
        backgroundColor: '#E9E9EB',
        borderRadius: 20,
      },
    },
  }}
/>
```

### Custom Input Component

```typescript
<ChatScreen
  messages={messages}
  currentUserId="user123"
  onSendMessage={handleSendMessage}
  renderCustomInput={() => (
    <YourCustomInputComponent
      onSend={(text) => {
        handleSendMessage({
          text,
          senderId: 'user123',
        });
      }}
    />
  )}
/>
```

## Performance Considerations

- Messages are rendered using `FlatList` for optimal performance
- Avatar images are cached automatically
- Media messages use lazy loading
- Typing indicators are debounced

## Contributing

We welcome contributions! Please see our contributing guide for details.

## License

MIT

## Support

For issues and feature requests, please file an issue on the GitHub repository.