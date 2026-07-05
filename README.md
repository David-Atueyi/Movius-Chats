# movius-chats

> A highly customizable, feature-rich chat interface component library for React Native applications.

A production-ready React Native chat UI library providing message bubbles, WhatsApp-style media grids, audio playback, voice recording, typing indicators, message replies, full-screen media gallery, and comprehensive theming—all wrapped in a single, powerful `ChatScreen` component. Works with both bare React Native and Expo.

**npm:** [`movius-chats`](https://www.npmjs.com/package/movius-chats)  
**Repo:** [github.com/David-Atueyi/Movius-Chats](https://github.com/David-Atueyi/Movius-Chats)  
**Version:** 1.6.0 | **License:** ISC

---

## 📋 Table of Contents

1. [Features](#features)
2. [What is included](#what-is-included)
3. [Installation](#installation)
4. [Quick start](#quick-start)
5. [Core concepts](#core-concepts)
   - [Message data model](#message-data-model)
   - [Message list order](#message-list-order)
   - [Context system](#context-system)
6. [API reference](#api-reference)
   - [ChatScreen props](#chatscreen-props)
   - [Message interface](#message-interface)
   - [Theme configuration](#theme-configuration)
7. [Features guide](#features-guide)
   - [Voice recording](#voice-recording)
   - [Audio message playback](#audio-message-playback)
   - [Media grids & gallery](#media-grids--gallery)
   - [Message replies](#message-replies)
   - [Typing indicators](#typing-indicators)
   - [File attachments](#file-attachments)
   - [Message selection & actions](#message-selection--actions)
8. [Customization](#customization)
   - [Theming & styling](#theming--styling)
   - [Custom components & icons](#custom-components--icons)
   - [Component overrides](#component-overrides)
9. [Project structure](#project-structure)
10. [Dependencies](#dependencies)
11. [Keyboard behavior](#keyboard-behavior)
12. [TypeScript support](#typescript-support)
13. [Advanced usage](#advanced-usage)
14. [Troubleshooting](#troubleshooting)
15. [Contributing](#contributing)
16. [License](#license)

---

## ✨ Features

### Core Messaging

- **Text messages** with automatic link detection and tappable URLs
- **Sent, delivered, and read status** indicators with animated checkmarks
- **Avatar display** with customizable avatars and fallback initials
- **Sender names** (optional per message or bubble)
- **Typing indicators** with avatar stacking (up to 2 avatars + "+N" badge)
- **Timestamp display** with customizable date formatting

### Media Handling

- **Image & video albums** with WhatsApp-style smart grid layouts:
  - 1×1 (single), 2×2 (two), 1+2 (three), 2×2 (four or more)
  - Automatic height fitting (320px default)
- **Full-screen media gallery** with swipe navigation and image counter
- **Video autoplay control** (disabled in gallery by default)
- **Video thumbnails** with play icon overlay
- **Video playback** within the gallery with native controls

### Audio & Voice

- **Voice recording** with multiple capture modes:
  - Tap-to-record (simple single-press)
  - Long-press recording (hold microphone for continuous capture)
  - Slide-to-cancel gesture (swipe left to cancel)
  - Lock recording (tap lock to continue hands-free)
  - Visual waveform display during recording
  - Recording timer and duration display
- **Audio message playback** with WhatsApp-style UI:
  - Animated waveform bars showing playback progress
  - Playback speed control (1.0x → 1.5x → 2.0x cycling)
  - Play/pause controls with status indicators
  - Sender avatar or current playback speed in the UI
- **Audio context** ensuring only one audio plays at a time
- **Microphone permission handling** (Android + iOS)

### Chat Input

- **Growing text field** that auto-expands (min 32-50px, max 118px)
- **Rich input bar** with customizable icon buttons:
  - Emoji picker button
  - File attachment button
  - Camera button
  - Microphone (voice record) button
  - Send button
- **File preview** with filename truncation
- **Keyboard avoiding** with per-platform tuning (iOS vs Android)
- **Custom input rendering** option for complete input override

### Message Actions

- **Long-press actions** with context menu:
  - Copy message text
  - Forward message
  - Reply to message
  - Edit message (with visual indicator)
  - Delete message
  - Customizable action order and labels
- **Customizable action sheet UI** (popover on tablet/large screens, bottom sheet on mobile)
- **Icon and label customization** per action

### Message Replies

- **Swipeable reply gesture** (right-swipe to reply on mobile)
- **Reply preview** in input with quoted context
- **Inline reply display** in message bubbles
- **Reply to any media type** (image, video, audio, file, text)
- **Customizable reply UI** colors, backgrounds, and icon sizes
- **Edit message indication** in reply context

### Selection & Batch Actions

- **Multi-select mode** for bulk operations
- **Selection UI** with checkbox indicators
- **Selection animations** and state management
- **Per-message selection state**

### Theming & Appearance

- **Dual-side coloring** with separate `sent*` and `received*` theme colors
- **Per-component theme overrides** (bubble backgrounds, text colors, borders, etc.)
- **Custom fonts** via `fontFamily` configuration
- **Icon sizing** customization for input bar and actions
- **Border radius** control for bubbles and media grids
- **Custom message styles** (shadows, padding, margin)

---

## 📦 What is Included

| Feature                      | Implementation                                                       |
| ---------------------------- | -------------------------------------------------------------------- |
| **Text rendering**           | `react-native-parsed-text` (URLs, emails, phone numbers tappable)    |
| **Image / video albums**     | `MediaGrid` — 1/2/3/4+ smart layout, 320px height                    |
| **Full-screen media viewer** | `MediaViewer` — swipe navigation, counter, selective video autoplay  |
| **Audio playback**           | `react-native-video` (hidden player) + custom waveform visualization |
| **Variable playback speed**  | 1.0x → 1.5x → 2.0x cycling during playback                           |
| **Voice recording**          | `react-native-audio-record` (optional peer) with gesture controls    |
| **File attachments**         | Tappable rows with custom handler + default URL opener               |
| **Typing indicators**        | Avatar stacking with "+N" badge for multiple typers                  |
| **Input bar**                | Growing TextField, emoji/clip/camera/send/mic buttons                |
| **Status indicators**        | Sent/delivered/read animated checkmarks                              |
| **Message replies**          | Swipe-to-reply, inline display, edit tracking                        |
| **Message actions**          | Long-press menus with copy, forward, delete, edit                    |
| **Selection mode**           | Multi-select with batch operations                                   |
| **Theming**                  | Comprehensive dual-sided (sent/received) color system                |

---

## Installation

### Prerequisites

- **React Native 0.60+**
- **Node 14+**

### Step 1: Install the package

```bash
npm install movius-chats
# or
yarn add movius-chats
```

### Step 2: Install peer dependencies

```bash
npm install react react-native react-native-gesture-handler react-native-reanimated
```

### Step 3: Install optional dependencies (feature-specific)

For **voice recording:**

```bash
npm install react-native-audio-record react-native-fs
```

For **clipboard support (copy message):**

```bash
npm install @react-native-clipboard/clipboard
```

For **file attachments** (already in React Native):

```bash
# No additional packages needed; uses Linking API
```

### Step 4: Link native modules

**Bare React Native:**

```bash
cd ios && pod install && cd ..
```

**Expo:**
No manual linking required — Expo handles native module resolution automatically.

For Android, ensure your project supports AndroidX. Update `android/gradle.properties`:

```properties
android.useAndroidX=true
android.enableJetifier=true
```

### Step 5: Configure permissions

**Android** (`AndroidManifest.xml`):

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.CAMERA" />
```

**iOS** (`Info.plist`):

```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs microphone access to record voice messages.</string>
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to take photos.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs photo library access.</string>
```

---

## Quick Start

### Basic Usage

```tsx
import React, { useState } from 'react';
import { ChatScreen } from 'movius-chats';
import type { Message } from 'movius-chats';

export const MyChatApp = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hey! How are you?',
      senderId: 'user-2',
      time: '10:30 AM',
      status: 'read',
      senderName: 'Alice',
      senderAvatar: 'https://example.com/avatar-alice.jpg',
    },
    {
      id: '2',
      text: "I'm doing great! How about you?",
      senderId: 'user-1',
      time: '10:31 AM',
      status: 'delivered',
    },
  ]);

  const currentUserId = 'user-1';

  const handleSendMessage = (messageText: string) => {
    const newMessage: Message = {
      id: String(Date.now()),
      text: messageText,
      senderId: currentUserId,
      time: new Date().toLocaleTimeString(),
      status: 'sent',
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <ChatScreen
      messages={messages}
      currentUserId={currentUserId}
      onSendMessage={handleSendMessage}
    />
  );
};
```

---

## Core Concepts

### Message Data Model

Every message in movius-chats follows this **unified interface**:

```tsx
export interface Message {
  id: string; // Unique message identifier
  text?: string; // Text content
  image?: string; // Single image URI (legacy)
  video?: string; // Single video URI (legacy)
  audio?: string; // Audio file URI
  senderId: string; // ID of message sender
  time: string; // Timestamp (e.g., "10:30 AM")
  status: 'read' | 'delivered' | 'sent'; // Message status
  senderName?: string; // Sender display name
  senderAvatar?: string; // Sender avatar URI
  mediaItems?: MessageMediaItem[]; // Array of images, videos, or audio
  fileAttachments?: MessageFileAttachment[]; // Array of file attachments
  replyTo?: MessageReply; // Reply context
  edited?: boolean; // Whether message was edited
}

// Media item in album
export interface MessageMediaItem {
  uri: string;
  kind: 'image' | 'video' | 'audio';
}

// File attachment
export interface MessageFileAttachment {
  uri: string;
  type: string; // MIME type
  name: string; // Display name
}

// Reply reference
export interface MessageReply {
  messageId: string;
  senderName?: string;
  preview?: string; // Text preview (truncated)
  mediaKind?: 'image' | 'video' | 'audio' | 'file';
  thumbnailUri?: string;
}
```

### Message List Order

By default, messages are displayed **newest-first** (reverse chronological). The component expects:

- **First message in array** = **Newest/most recent**
- **Last message in array** = **Oldest**

If your data is ordered oldest-first, reverse it before passing:

```tsx
const reversedMessages = [...messages].reverse();
<ChatScreen messages={reversedMessages} ... />
```

### Context System

movius-chats uses **React Context** to share state across components:

1. **ChatContext** — Main configuration and state:

   - Message list, current user ID
   - Media gallery state (which media is being viewed)
   - Reply target (what message is being replied to)
   - Long-press action state
   - Selection mode and selected messages
   - Edit draft state
   - Callbacks for user actions

2. **AudioContext** — Ensures single audio playback:
   - Tracks currently playing audio
   - Pauses other audios when new one starts
   - Coordinates playback speed cycling

Both contexts are automatically initialized by `ChatScreen`.

---

## API Reference

### ChatScreen Props

```tsx
interface ChatScreenProps {
  // Data
  messages: Message[]; // Message array (newest first)
  currentUserId: string; // Current user's ID
  typingUsers?: Array<{ id: string; name: string }>; // Who's typing

  // Callbacks
  onSendMessage: (text: string) => void;
  onAttachmentPress?: () => void;
  onCameraPress?: () => void;
  onAudioRecordEnd?: (result: RecordingResult) => void;
  onAudioRecordStart?: () => void;
  onMessageLongPress?: (message: Message) => void;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  onEndReached?: (info: { distanceFromEnd: number }) => void;
  onEndReachedThreshold?: number; // Default: 0.5
  isLoadingMoreMessages?: boolean;
  renderLoadingMoreIndicator?: () => React.ReactNode;
  loadingMoreIndicatorContainerStyle?: ViewStyle;
  loadingMoreIndicatorText?: string;
  loadingMoreIndicatorTextStyle?: TextStyle;
  loadingMoreIndicatorColor?: string;
  loadingMoreIndicatorSize?: number | 'small' | 'large';

  // UI Options
  showAvatars?: boolean; // Default: true
  showUserNames?: boolean; // Default: true
  showBubbleTail?: boolean; // Default: true
  renderCustomInput?: (props: InputProps) => React.ReactNode;

  // Custom Icons (optional)
  CustomEmojiIcon?: React.ComponentType;
  CustomAttachmentIcon?: React.ComponentType;
  CustomCameraIcon?: React.ComponentType;
  CustomMicrophoneIcon?: React.ComponentType;
  CustomSendIcon?: React.ComponentType;
  CustomFileIcon?: React.ComponentType;
  CustomImagePreview?: React.ComponentType;
  CustomVideoPreview?: React.ComponentType;

  // Feature Configs
  messageActionsConfig?: MessageActionsConfig;
  replyProps?: ReplyConfig;
  voiceRecorderConfig?: VoiceRecorderConfig;
  recordingUIProps?: RecordingUIProps;

  // Theming
  theme?: ChatScreenTheme;

  // Selection
  selectionUI?: SelectionUIProps;
}
```

### Message Interface

See [Message Data Model](#message-data-model) section above for full details.

### Loading More Messages

When the user reaches the top of the message list while older messages are being fetched, the component can show a loading indicator. This is controlled by the pagination props above.

```tsx
<ChatScreen
  messages={messages}
  currentUserId={currentUserId}
  onSendMessage={handleSend}
  onEndReached={() => fetchOlderMessages()}
  onEndReachedThreshold={0.5}
  isLoadingMoreMessages={isFetchingOlderMessages}
  loadingMoreIndicatorText="Loading older messages"
  loadingMoreIndicatorColor="#4F46E5"
  loadingMoreIndicatorSize="small"
  renderLoadingMoreIndicator={() => <YourCustomLoader />}
/>
```

### Theme Configuration

```tsx
interface ChatScreenTheme {
  colors?: {
    // Sent messages
    sentBubbleBackground?: string;
    sentTextColor?: string;
    sentTimestampColor?: string;
    sentStatusIconColor?: string;
    sentAudioWaveformColor?: string;
    sentAudioWaveformActiveColor?: string;
    sentFileAttachmentBackground?: string;
    sentFileAttachmentTextColor?: string;
    sentMediaTimestampBackground?: string;

    // Received messages
    receivedBubbleBackground?: string;
    receivedTextColor?: string;
    receivedTimestampColor?: string;
    receivedAudioWaveformColor?: string;
    receivedAudioWaveformActiveColor?: string;
    receivedFileAttachmentBackground?: string;
    receivedFileAttachmentTextColor?: string;
    receivedMediaTimestampBackground?: string;

    // UI elements
    inputBarBackground?: string;
    inputPlaceholderTextColor?: string;
    inputTextColor?: string;
    typingIndicatorDotColor?: string;
  };

  // Fonts & Sizes
  fontFamily?: string; // Default: system font
  fontSize?: {
    message?: number; // Default: 16
    timestamp?: number; // Default: 12
    typing?: number; // Default: 14
  };

  // Styling overrides
  messageStyle?: {
    sentBubbleStyle?: ViewStyle;
    receivedBubbleStyle?: ViewStyle;
    sentMediaTimestampContainerStyle?: ViewStyle;
    receivedMediaTimestampContainerStyle?: ViewStyle;
  };

  // Media grid
  mediaGrid?: {
    height?: number; // Default: 320
    borderRadius?: number; // Default: 12
  };

  // Input bar
  inputBar?: {
    maxHeight?: number; // Default: 118
    minHeight?: number; // Default: 32-50
    iconSize?: number; // Default: computed
  };
}
```

---

## Features Guide

### Voice Recording

Voice messages combine **gesture-based capture** with **multiple recording modes**:

#### Recording Modes

1. **Tap-to-Record** — Single press starts/stops
2. **Long-Press Record** — Hold microphone for continuous capture
3. **Slide-to-Cancel** — Swipe left while recording to cancel
4. **Lock Recording** — Tap lock icon to record hands-free

#### Configuration

```tsx
<ChatScreen
  voiceRecorderConfig={{
    maxDuration: 300, // 5 minutes max (seconds)
    enableSlideToCancel: true, // Show slide-to-cancel hint
    enableLockRecording: true, // Show lock option
    enableWaveform: true, // Show waveform during recording
  }}
  recordingUIProps={{
    timerColor: '#FFFFFF',
    waveformColor: '#E9EDEF',
    recordingBackground: '#0B141A',
    lockPillBackground: '#1F2937',
    lockIconColor: '#FFFFFF',
    chevronIconColor: '#8696A0',
    cancelTextColor: '#F15C6D',
    waveformBarCount: 32,
  }}
  onAudioRecordEnd={(result) => {
    console.log('Recording saved to:', result.uri);
    console.log('Duration:', result.duration, 'ms');
    // Upload to server, add to message, etc.
  }}
/>
```

#### Recording Result

```tsx
interface RecordingResult {
  uri: string; // File system path
  duration: number; // Milliseconds
  size?: number; // Bytes
  mimeType?: string; // e.g., 'audio/m4a'
}
```

### Audio Message Playback

Play audio messages with professional waveform visualization and playback speed control:

```tsx
// Add audio to a message
const audioMessage: Message = {
  id: '123',
  mediaItems: [{ uri: 'file:///path/to/audio.m4a', kind: 'audio' }],
  senderId: 'user-1',
  time: '10:45 AM',
  status: 'sent',
  senderAvatar: 'https://...',
};
```

**Features:**

- **Animated waveform** that fills as playback progresses
- **Playback speed cycling:** 1.0x → 1.5x → 2.0x → 1.0x
- **Sender avatar** displayed or current speed overlay
- **Pause/resume** during playback
- **Automatic pause** when another audio starts
- **Duration display** in bottom-right of bubble

### Media Grids & Gallery

Display image and video albums with smart layout:

```tsx
const albumMessage: Message = {
  id: 'msg-123',
  mediaItems: [
    { uri: 'https://example.com/photo1.jpg', kind: 'image' },
    { uri: 'https://example.com/photo2.jpg', kind: 'image' },
    { uri: 'file:///video.mp4', kind: 'video' },
  ],
  senderId: 'user-1',
  time: '2:30 PM',
  status: 'delivered',
};
```

**Smart Layouts:**
| Count | Layout |
|-------|--------|
| 1 | Full-width square |
| 2 | 50/50 side-by-side |
| 3 | Large left + 2 stacked right |
| 4+ | 2×2 grid |

**Gallery Features:**

- Swipe left/right to navigate
- Image counter (e.g., "3/5")
- Video thumbnails with play icon
- Optional video autoplay control
- Close button (X icon)
- Full-screen immersive viewing

### Message Replies

Enable conversations within conversations:

```tsx
// Reply configuration
<ChatScreen
  replyProps={{
    enableReply: true,
    swipeThreshold: 60, // Pixels to swipe for reply
    previewMaxLines: 2, // Truncate preview at N lines
    swipe: {
      iconColor: '#FFFFFF',
      iconBackground: 'rgba(0,0,0,0.3)',
      iconSize: 24,
    },
  }}
  // ... other props
/>;

// Message with reply
const repliedMessage: Message = {
  id: '456',
  text: 'Sounds good!',
  replyTo: {
    messageId: '123',
    senderName: 'Alice',
    preview: 'Want to grab coffee?',
    mediaKind: 'image',
    thumbnailUri: 'https://...',
  },
  senderId: 'user-1',
  time: '3:15 PM',
  status: 'read',
};
```

**Reply Features:**

- Swipe-right gesture to reply on mobile
- Reply preview in input bar before sending
- Inline reply display in bubbles (visual indent + border)
- Reply to any media type (image, video, audio, file)
- Edit indication ("Edited" chip in reply context)
- Customizable colors and backgrounds

### Typing Indicators

Show who's currently typing:

```tsx
<ChatScreen
  typingUsers={[
    { id: 'alice', name: 'Alice' },
    { id: 'bob', name: 'Bob' },
    // If 3+ users, shows "Alice, Bob, +2 more"
  ]}
  // ... other props
/>
```

**Features:**

- Animated dots bouncing
- Up to 2 avatars displayed inline
- "+N more" badge if 3+ users
- Customizable dot color
- Auto-dismisses when onTypingEnd called

### File Attachments

Handle any file type with custom handlers:

```tsx
const fileMessage: Message = {
  id: '789',
  fileAttachments: [
    {
      uri: 'file:///Documents/presentation.pdf',
      type: 'application/pdf',
      name: 'Q4_Presentation.pdf',
    },
  ],
  senderId: 'user-1',
  time: '4:00 PM',
  status: 'delivered',
};
```

**Default Behavior:**

- Tappable row with file icon and name
- Uses React Native's `Linking.openURL` to open
- Fallback for unsupported file types

**Customization:**

```tsx
<ChatScreen
  onAttachmentPress={() => {
    // Custom file picker/handler
  }}
  // ... other props
/>
```

### Message Selection & Actions

Enable multi-select and bulk operations:

```tsx
<ChatScreen
  onMessageLongPress={(message) => {
    // Long-press opens action menu with options:
    // - Copy
    // - Forward
    // - Reply
    // - Edit
    // - Delete
    // Customizable via messageActionsConfig
  }}
  messageActionsConfig={{
    actions: [
      'copy', // Copy text to clipboard
      'forward', // Forward message
      'reply', // Reply to message
      'edit', // Edit message content
      'delete', // Delete message
    ],
    // Custom labels
    labels: {
      copy: 'Copy Text',
      forward: 'Share',
      delete: 'Remove',
    },
    // Custom icons (SVG/images)
    icons: {
      copy: <CustomCopyIcon />,
    },
  }}
  selectionUI={{
    checkboxSize: 24,
    checkboxColor: '#22c55e',
    selectedBackground: 'rgba(34, 197, 94, 0.1)',
  }}
/>
```

---

## Customization

### Theming & Styling

#### Colors

```tsx
<ChatScreen
  theme={{
    colors: {
      // Sent messages (right-aligned, typically green)
      sentBubbleBackground: '#22c55e',
      sentTextColor: '#FFFFFF',
      sentTimestampColor: 'rgba(255, 255, 255, 0.7)',
      sentStatusIconColor: '#FFFFFF',
      sentAudioWaveformColor: 'rgba(255, 255, 255, 0.3)',
      sentAudioWaveformActiveColor: 'rgba(255, 255, 255, 0.95)',
      sentFileAttachmentBackground: 'rgba(255, 255, 255, 0.15)',
      sentFileAttachmentTextColor: '#FFFFFF',

      // Received messages (left-aligned, typically gray)
      receivedBubbleBackground: '#E5E7EB',
      receivedTextColor: '#1F2937',
      receivedTimestampColor: 'rgba(107, 114, 128, 0.85)',
      receivedAudioWaveformColor: 'rgba(0, 0, 0, 0.2)',
      receivedAudioWaveformActiveColor: 'rgba(0, 0, 0, 0.6)',
      receivedFileAttachmentBackground: 'rgba(0, 0, 0, 0.08)',
      receivedFileAttachmentTextColor: '#1F2937',

      // Input & UI
      inputBarBackground: '#FFFFFF',
      inputTextColor: '#1F2937',
      inputPlaceholderTextColor: '#9CA3AF',
      typingIndicatorDotColor: '#9CA3AF',
    },
  }}
/>
```

#### Fonts

```tsx
<ChatScreen
  theme={{
    fontFamily: 'Segoe UI', // Custom font
    fontSize: {
      message: 16,
      timestamp: 12,
      typing: 14,
    },
  }}
/>
```

#### Custom Styles

```tsx
<ChatScreen
  theme={{
    messageStyle: {
      sentBubbleStyle: {
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        paddingHorizontal: 12,
        paddingVertical: 8,
      },
      receivedBubbleStyle: {
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
      },
    },
    mediaGrid: {
      height: 320,
      borderRadius: 12,
    },
  }}
/>
```

### Custom Components & Icons

Override built-in UI icons:

```tsx
import { CustomIcon } from './CustomIcon';

<ChatScreen
  // Input bar icons
  CustomEmojiIcon={EmojiIcon}
  CustomAttachmentIcon={AttachmentIcon}
  CustomCameraIcon={CameraIcon}
  CustomMicrophoneIcon={MicrophoneIcon}
  CustomSendIcon={SendIcon}
  CustomFileIcon={FileIcon}
  // Media previews
  CustomImagePreview={CustomImagePreview}
  CustomVideoPreview={CustomVideoPreview}
  // Custom input
  renderCustomInput={(props) => <YourCustomInput {...props} />}
/>;
```

### Component Overrides

The library exposes individual components for advanced customization:

```tsx
import {
  ChatBubble,
  ChatInput,
  MediaViewer,
  AudioPlayer,
  TypingIndicator,
  VoiceRecorder,
} from 'movius-chats';

// Use individually or extend
const CustomChatBubble = (props) => <ChatBubble {...props} staticMode={true} />;
```

---

## Project Structure

```
movius-chats/
├── src/
│   ├── index.tsx                      # Main ChatScreen export
│   ├── types/
│   │   └── index.ts                   # TypeScript interfaces
│   ├── context/
│   │   ├── ChatContext.tsx            # Main chat state & props
│   │   └── AudioContext.tsx           # Audio playback coordination
│   ├── hooks/
│   │   ├── useKeyboardInset.ts        # iOS/Android keyboard height
│   │   └── useVoiceRecorder.ts        # Voice recording hook
│   ├── components/
│   │   ├── ChatBubble/
│   │   │   ├── ChatBubble.tsx         # Main bubble component
│   │   │   ├── MessageContent.tsx     # Message text/media content
│   │   │   ├── MessageStatus.tsx      # Status checkmarks
│   │   │   ├── MediaGrid.tsx          # 1/2/3/4+ grid layouts
│   │   │   └── types.ts
│   │   ├── ChatInput/
│   │   │   ├── ChatInput.tsx          # Input bar with buttons
│   │   │   ├── FilePreview.tsx        # Selected file preview
│   │   │   └── TruncateFileName.ts
│   │   ├── AudioPlayer/
│   │   │   ├── AudioPlayer.tsx        # Audio playback UI
│   │   │   └── types.ts
│   │   ├── MediaViewer/
│   │   │   └── MediaViewer.tsx        # Full-screen gallery
│   │   ├── MessageActions/
│   │   │   ├── index.ts
│   │   │   ├── LongPressOverlay.tsx   # Action menu overlay
│   │   │   ├── MessageActionsPopover.tsx  # Tablet UI
│   │   │   └── MessageActionsSheet.tsx    # Mobile bottom sheet
│   │   ├── Reply/
│   │   │   ├── index.ts
│   │   │   ├── SwipeableMessage.tsx   # Swipe gesture handler
│   │   │   ├── ReplyPreview.tsx       # Input bar reply preview
│   │   │   └── InlineReply.tsx        # Bubble reply display
│   │   ├── TypingComponent/
│   │   │   └── TypingIndicator.tsx    # Animated typing dots
│   │   └── VoiceRecorder/
│   │       ├── VoiceRecorder.tsx      # Base recorder UI
│   │       ├── VoiceRecordingGesture.tsx  # Gesture handlers
│   │       └── VoiceRecorderFlow/     # Recording modes & UI
│   ├── utils/
│   │   ├── bubbleTheme.ts             # Color helpers for sent/received
│   │   ├── messageMedia.ts            # Media collection utilities
│   │   ├── messageActions.ts          # Action merging & defaults
│   │   ├── replyTheme.ts              # Reply styling helpers
│   │   ├── theme.ts                   # Font & icon size helpers
│   │   └── datefunc.ts                # Duration formatting
│   └── assets/
│       └── Icons/
│           ├── ArrowBack2RoundedIcon.tsx
│           ├── CameraIcon.tsx
│           ├── CheckAllIcon.tsx
│           ├── CheckIcon.tsx
│           ├── ChevronUpIcon.tsx
│           ├── ClosePreviewIcon.tsx
│           ├── CopyIcon.tsx
│           ├── EditIcon.tsx
│           ├── EmojiFunnySquareIcon.tsx
│           ├── FileIcon.tsx
│           ├── ForwardIcon.tsx
│           ├── LoadingIcon.tsx
│           ├── LockIcon.tsx
│           ├── MicrophoneIcon.tsx
│           ├── PaperClipIcon.tsx
│           ├── PaperPlaneIcon.tsx
│           ├── PauseIcon.tsx
│           ├── PlayIcon.tsx
│           ├── ReplyIcon.tsx
│           ├── SelectIcon.tsx
│           ├── TrashIcon.tsx
│           └── XIcon.tsx
├── lib/
│   ├── commonjs/          # CommonJS build output
│   ├── module/            # ES Module build output
│   └── typescript/        # TypeScript declarations
├── scripts/
│   └── patchSound.js      # Audio module patching
├── babel.config.js        # Babel configuration
├── rollup.config.mjs      # Rollup bundler config
├── tsconfig.json          # TypeScript config
├── tsconfig.types.json    # TypeScript types config
├── tsconfig.build.json    # TypeScript build config
├── package.json
└── README.md
```

---

## Dependencies

### Runtime Dependencies (Bundled)

| Package                    | Version | Purpose                          |
| -------------------------- | ------- | -------------------------------- |
| `react-native-video`       | ^6.9.1  | Video/audio playback, thumbnails |
| `react-native-svg`         | 15.2.0  | Built-in icon rendering          |
| `react-native-parsed-text` | ^0.0.22 | Link/email detection in text     |
| `twrnc`                    | ^4.6.1  | Tailwind-like utility styles     |

### Peer Dependencies (Install in your app)

| Package                             | Version | Required | Purpose                        |
| ----------------------------------- | ------- | -------- | ------------------------------ |
| `react`                             | ≥16.8   | Yes      | React hooks, context           |
| `react-native`                      | \*      | Yes      | Core framework                 |
| `react-native-gesture-handler`      | ≥2.0    | Yes      | Swipe & long-press gestures    |
| `react-native-reanimated`           | \*      | Yes      | Gesture animations             |
| `react-native-audio-record`         | \*      | Optional | Voice recording capture        |
| `react-native-fs`                   | \*      | Optional | File system access (recording) |
| `@react-native-clipboard/clipboard` | \*      | Optional | Copy to clipboard              |

### Dev Dependencies

- **Build:** Rollup, Babel, TypeScript
- **Linting:** ESLint, Prettier
- **Testing:** Jest
- **Type Checking:** TypeScript

---

## Keyboard Behavior

The library handles platform-specific keyboard behavior automatically:

### iOS

- Soft keyboard slides up from bottom
- Input bar adjusts position via `KeyboardAvoidingView`
- Default offset: based on notch/safe area

### Android

- Keyboard dismisses text field focus automatically
- Input bar uses `KeyboardAvoidingView`
- Respects `android:windowSoftInputMode` setting

### Customization

```tsx
// useKeyboardInset hook provides current inset
const { keyboardHeight } = useKeyboardInset();

// Manual control via ChatInput props
<ChatScreen
  renderCustomInput={(props) => (
    <YourInput keyboardOffset={customOffset} {...props} />
  )}
/>;
```

---

## TypeScript Support

Full TypeScript support with exported types:

```tsx
import {
  ChatScreen,
  Message,
  MessageMediaItem,
  MessageFileAttachment,
  MessageReply,
  RecordingResult,
  ChatScreenProps,
  ChatScreenTheme,
  VoiceRecorderConfig,
  MessageActionsConfig,
  ReplyConfig,
} from 'movius-chats';

// Use types in your code
const message: Message = {
  id: '1',
  text: 'Hello',
  senderId: 'user-1',
  time: '10:30 AM',
  status: 'sent',
};

type Props = ChatScreenProps;
```

### Type Definitions

All types are exported from `lib/typescript/index.d.ts` and available in:

- `lib/commonjs/index.d.ts` (CommonJS version)
- `lib/module/index.d.ts` (ES Module version)

---

## Advanced Usage

### Custom Message Actions

```tsx
import {
  mergeMessageActionLabels,
  mergeMessageActionIcons,
} from 'movius-chats';

<ChatScreen
  messageActionsConfig={{
    actions: ['copy', 'reply', 'customAction', 'delete'],
    labels: mergeMessageActionLabels({
      customAction: 'Pin Message',
      delete: 'Remove',
    }),
    icons: mergeMessageActionIcons({
      customAction: <PinIcon />,
    }),
  }}
  onMessageActionTap={(action, message) => {
    if (action === 'customAction') {
      // Handle custom action
    }
  }}
/>;
```

### Static Message Display (Read-Only)

```tsx
// Disable all interactivity
import { ChatBubble } from 'movius-chats';

<ChatBubble
  message={message}
  isCurrentUser={false}
  staticMode={true}
  onLongPress={() => {}}
/>;
```

### Multi-User Typing

```tsx
<ChatScreen
  typingUsers={[
    { id: 'alice', name: 'Alice' },
    { id: 'bob', name: 'Bob' },
    { id: 'charlie', name: 'Charlie' },
  ]}
  onTypingStart={() => console.log('Typing started')}
  onTypingEnd={() => console.log('Typing ended')}
/>
```

### Custom Theme Colors (Dark Mode)

```tsx
const darkTheme: ChatScreenTheme = {
  colors: {
    sentBubbleBackground: '#128C7E',    // WhatsApp green
    sentTextColor: '#FFFFFF',
    receivedBubbleBackground: '#1F2937', // Dark gray
    receivedTextColor: '#F3F4F6',
    inputBarBackground: '#0F172A',
    inputTextColor: '#F3F4F6',
    inputPlaceholderTextColor: '#6B7280',
  },
  fontFamily: 'Roboto',
};

<ChatScreen theme={darkTheme} ... />
```

### Handling Large Message Lists

For performance with 1000+ messages:

```tsx
// 1. Use virtualization (FlatList is already virtualized)
// 2. Minimize re-renders with useMemo
// 3. Lazy-load older messages

const [messages, setMessages] = useState<Message[]>([
  // Latest 50 messages
]);

const handleScroll = (offset: number) => {
  if (offset > 500) {
    // Load older messages from backend
    loadMoreMessages();
  }
};
```

---

## Troubleshooting

### Issue: Voice recording not working

**Symptoms:** Recording button doesn't respond or crashes

**Solutions:**

1. **Check permissions:**

   ```tsx
   import { PermissionsAndroid } from 'react-native';
   const granted = await PermissionsAndroid.request(
     PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
   );
   ```

2. **Install audio dependencies:**

   ```bash
   npm install react-native-audio-record react-native-fs
   ```

3. **Verify native linking (Android):**
   ```bash
   cd android && ./gradlew clean && cd ..
   npx react-native run-android
   ```

### Issue: Media gallery doesn't display

**Symptoms:** Images/videos not showing in gallery

**Solutions:**

1. **Verify URIs are valid:**

   ```tsx
   const mediaItems = [
     { uri: 'file:///path/to/image.jpg', kind: 'image' },
     // Not 'file:///path/to/image.jpg/' (no trailing slash)
   ];
   ```

2. **Check MediaGrid height:**

   ```tsx
   theme={{
     mediaGrid: { height: 320 }
   }}
   ```

3. **Grant file permissions:**
   - **Android:** Add `READ_EXTERNAL_STORAGE` permission
   - **iOS:** Add `NSPhotoLibraryUsageDescription` to Info.plist

### Issue: Audio playback cutting off

**Symptoms:** Audio stops playing prematurely or doesn't play at all

**Solutions:**

1. **Check audio format:** Use supported formats (MP3, M4A, AAC)
2. **Verify URI is accessible:**

   ```tsx
   // Correct
   {
     mediaItems: [{ uri: 'file:///documents/voice.m4a', kind: 'audio' }],
   }

   // Wrong
   {
     mediaItems: [{ uri: 'file://documents/voice.m4a', kind: 'audio' }],
   } // Missing /
   ```

3. **Clear audio cache:**
   ```tsx
   const { clearAudioCache } = useAudio();
   clearAudioCache();
   ```

### Issue: Keyboard overlaps input

**Symptoms:** Chat input hidden when keyboard appears

**Solutions:**

1. **Verify KeyboardAvoidingView:**

   ```tsx
   // Already built-in, check if overridden
   <KeyboardAvoidingView
     behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
   >
     <ChatScreen ... />
   </KeyboardAvoidingView>
   ```

2. **Adjust offset:**

   ```tsx
   <KeyboardAvoidingView keyboardVerticalOffset={100}>...</KeyboardAvoidingView>
   ```

3. **Check AndroidManifest.xml:**
   ```xml
   <activity
     android:windowSoftInputMode="adjustResize"
   />
   ```

### Issue: Memory leaks

**Symptoms:** App crashes with large message lists, performance degrades

**Solutions:**

1. **Cleanup contexts:**

   ```tsx
   useEffect(() => {
     return () => {
       clearMediaViewerGallery?.();
       // Cleanup
     };
   }, []);
   ```

2. **Use FlatList optimizations:**

   ```tsx
   <FlatList
     removeClippedSubviews={true}
     maxToRenderPerBatch={10}
     windowSize={21}
     updateCellsBatchingPeriod={50}
   />
   ```

3. **Avoid inline function callbacks:**

   ```tsx
   // Bad
   onSendMessage={(text) => { ... }}

   // Good
   const handleSend = useCallback((text) => { ... }, []);
   <ChatScreen onSendMessage={handleSend} />
   ```

### Issue: TypeScript errors

**Symptoms:** Type checking fails, missing types

**Solutions:**

1. **Regenerate types:**

   ```bash
   npm run build:types
   ```

2. **Check tsconfig.json:**

   ```json
   {
     "compilerOptions": {
       "strict": true,
       "skipLibCheck": true
     }
   }
   ```

3. **Update type definitions:**
   ```bash
   npm install --save-dev @types/react-native@latest
   ```

### Issue: Android build fails

**Symptoms:** Gradle/NDK errors during build

**Solutions:**

1. **Enable AndroidX:**

   ```properties
   # android/gradle.properties
   android.useAndroidX=true
   android.enableJetifier=true
   ```

2. **Update Gradle:**

   ```properties
   # android/gradle/wrapper/gradle-wrapper.properties
   distributionUrl=https\://services.gradle.org/distributions/gradle-7.5-all.zip
   ```

3. **Clean build:**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   npx react-native run-android
   ```

### Issue: Reply gestures not working

**Symptoms:** Swipe-to-reply doesn't trigger

**Solutions:**

1. **Enable reply config:**

   ```tsx
   replyProps={{
     enableReply: true,
     swipeThreshold: 60,  // Pixels to swipe
   }}
   ```

2. **Check gesture handler:**

   ```bash
   npm install react-native-gesture-handler@latest
   ```

3. **Verify RectButton nesting** (GestureHandler requirement)

---

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

### Development Setup

```bash
# Clone repo
git clone https://github.com/David-Atueyi/Movius-Chats.git
cd Movius-Chats

# Install dependencies
npm install

# Run tests
npm run test

# Type check
npm run typescript

# Lint
npm run lint

# Build
npm run build

# View types
npm run build:types
```

### Build Output

```bash
npm run build
# Generates:
# - lib/commonjs/index.js (CommonJS)
# - lib/module/index.js (ES Module)
# - lib/typescript/index.d.ts (TypeScript declarations)
```

---

## License

ISC License — see [LICENSE](LICENSE) file for details.

**Copyright © 2024 David Atueyi**

---

## Support

- **Issue Tracker:** [GitHub Issues](https://github.com/David-Atueyi/Movius-Chats/issues)
- **Discussions:** [GitHub Discussions](https://github.com/David-Atueyi/Movius-Chats/discussions)
- **NPM Package:** [movius-chats on npm](https://www.npmjs.com/package/movius-chats)

---

**Built with ❤️ for React Native developers.**
|---------|----------|
| `react` ≥ 16.8 | Yes |
| `react-native` | Yes |
| `react-native-reanimated` | Yes (voice recorder animations) |

### Optional peers (voice recording only)

| Package                     | Use                              |
| --------------------------- | -------------------------------- |
| `react-native-audio-record` | Record microphone                |
| `react-native-fs`           | Delete cancelled recording files |

If these are missing, the UI still renders; starting a recording logs an install hint.

**There is no `react-native-sound`, `expo-av`, `expo-file-system`, or other Expo package in this library.**

---

## Installation

### 1. Install movius-chats

```bash
yarn add movius-chats
# or: npm install movius-chats
# or: bun add movius-chats
```

### 2. Install peers

```bash
yarn add react-native-reanimated react-native-video react-native-svg
```

`react-native-video` and `react-native-svg` are also pulled in as movius-chats dependencies, but your app should list compatible versions and link native code.

### 3. Reanimated (Babel)

Put this plugin **last** in `babel.config.js`:

```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // ...other plugins
    'react-native-reanimated/plugin',
  ],
};
```

### 4. Voice recording (optional)

```bash
yarn add react-native-audio-record react-native-fs
```

**iOS** — add to `Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs the microphone to record voice messages.</string>
```

**Android** — ensure `RECORD_AUDIO` is in `AndroidManifest.xml` (often added by the audio-record library).

Then rebuild native apps:

```bash
cd ios && pod install && cd ..
npx react-native run-ios
npx react-native run-android
```

### 5. Android keyboard

In `android/app/src/main/AndroidManifest.xml` on your main activity:

```xml
android:windowSoftInputMode="adjustResize"
```

---

## Quick start

```tsx
import React, { useState } from 'react';
import { Platform, SafeAreaView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ChatScreen from 'movius-chats';
import type { Message } from 'movius-chats/lib/typescript/types';

export default function ChatDetailScreen() {
  const insets = useSafeAreaInsets();
  const currentUserId = '1';
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ChatScreen
          messages={messages}
          currentUserId={currentUserId}
          onSendMessage={({ text, senderId }) => {
            setMessages((prev) => [
              {
                id: String(Date.now()),
                text,
                senderId,
                time: new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                status: 'sent',
              },
              ...prev,
            ]);
          }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
          showBubbleTail
          showMessageStatus
          showVoiceRecordButton
        />
      </View>
    </SafeAreaView>
  );
}
```

Wrap the screen in `flex: 1`. Load custom fonts in **your** app before passing `theme.fontFamily`.

---

## Message data model

### `Message`

| Field             | Type                              | Description                                |
| ----------------- | --------------------------------- | ------------------------------------------ |
| `id`              | `string`                          | Unique id                                  |
| `senderId`        | `string`                          | Who sent it                                |
| `time`            | `string`                          | Display time (you format it)               |
| `status`          | `'sent' \| 'delivered' \| 'read'` | Checkmarks on **your** messages only       |
| `text`            | `string`                          | Body text                                  |
| `audio`           | `string`                          | Audio file URI                             |
| `image`           | `string`                          | Single image (legacy; prefer `mediaItems`) |
| `video`           | `string`                          | Single video (legacy)                      |
| `mediaItems`      | `MessageMediaItem[]`              | Album in one bubble                        |
| `fileAttachments` | `MessageFileAttachment[]`         | PDF, doc, etc.                             |
| `senderName`      | `string`                          | Group name + audio avatar initial          |
| `senderAvatar`    | `string`                          | Image URI for audio bubble avatar          |

### `MessageMediaItem`

```ts
{
  uri: string;
  kind: 'image' | 'video' | 'audio';
}
```

### `MessageFileAttachment`

```ts
{
  uri: string;
  type: string;
  name: string;
}
```

### `PreviewAttachment` (composer)

```ts
{ uri: string; type: string; name?: string }
```

### `RecordingResult` (`onAudioRecordEnd`)

```ts
{ uri: string; duration: number; mimeType?: string; size?: number }
```

---

## Message list order

The list is **inverted**. Newest message must be **index 0**:

```ts
setMessages((prev) => [newMessage, ...prev]);
```

Avatars and bubble tails show only on the **first** message in a consecutive run from the same `senderId`.

---

## ChatScreen API

Default export: `ChatScreen`. All props are optional except `messages`, `currentUserId`, and `onSendMessage`.

### Core

| Prop                      | Type                                                  | Description                                     |
| ------------------------- | ----------------------------------------------------- | ----------------------------------------------- |
| `messages`                | `Message[]`                                           | Newest first                                    |
| `currentUserId`           | `string`                                              | Sent vs received layout                         |
| `onSendMessage`           | `(Omit<Message, 'id' \| 'time' \| 'status'>) => void` | Send button                                     |
| `onMessageLongPress`      | `(message: Message) => void`                          | Long-press bubble                               |
| `placeholder`             | `string`                                              | Input placeholder (default `"Message"`)         |
| `keyboardVerticalOffset`  | `number`                                              | **iOS only** — passed to `KeyboardAvoidingView` |
| `disableKeyboardAvoiding` | `boolean`                                             | Turn off built-in keyboard lift                 |

### Feature flags (default `false`)

`showAvatars`, `showUserNames`, `showBubbleTail`, `showMessageStatus`, `showEmojiButton`, `showAttachmentsButton`, `showCameraButton`, `showVoiceRecordButton`

### Callbacks

| Prop                            | Description                                         |
| ------------------------------- | --------------------------------------------------- |
| `onTypingStart` / `onTypingEnd` | Input text empty ↔ non-empty                       |
| `onAttachmentPress`             | Paperclip — open your picker                        |
| `onCameraPress`                 | Camera icon                                         |
| `onAudioRecordStart`            | Recording began                                     |
| `onAudioRecordEnd`              | `(RecordingResult?) => void` when done or cancelled |
| `onFileAttachmentPress`         | File chip in bubble (default: `Linking.openURL`)    |

### Composer preview

| Prop                  | Description                                  |
| --------------------- | -------------------------------------------- |
| `previewItems`        | Multiple attachments before send             |
| `previewData`         | Single attachment (legacy)                   |
| `onRemovePreviewItem` | `(uri) => void` — remove **one** card by URI |
| `closePreview`        | Clears all if `onRemovePreviewItem` not set  |

When preview or text exists, the **send** icon shows instead of the mic.

### Voice recorder customization

| Prop                         | Type                                                                        |
| ---------------------------- | --------------------------------------------------------------------------- |
| `CustomVoiceRecorder`        | `(VoiceRecorderExposedState) => ReactNode` — replace entire recorder UI     |
| `theme.voiceRecorder.config` | `VoiceRecorderConfig` — `maxDuration`, lock, slide-to-cancel, etc.          |
| `theme.voiceRecorder.ui`     | `RecordingUIProps` — colors/sizes for timer, lock pill, recorder play/pause |
| `theme.voiceRecorder.styles` | `VoiceRecorderStyleOverrides`                                               |

### Typing

| Prop          | Type                     |
| ------------- | ------------------------ |
| `typingUsers` | `{ id, avatar, name }[]` |

---

## Voice recording

Requires **`react-native-audio-record`** and **`react-native-fs`** in the host app, plus a **native rebuild**.

### Gestures

| Action                    | Result                                                                       |
| ------------------------- | ---------------------------------------------------------------------------- |
| **Tap** mic               | Normal bar: trash, timer, waveform, play/pause preview, send                 |
| **Long-press** mic        | Hold mode: “slide to cancel”, lock column above send                         |
| Slide **left**            | Cancel (file deleted via `react-native-fs`)                                  |
| Slide **up** to lock      | Switches to normal bar (`lockSlideDistance` in `theme.voiceRecorder.config`) |
| **Release** without slide | Auto-send (`onAudioRecordEnd`)                                               |

### Wiring

```tsx
<ChatScreen
  showVoiceRecordButton
  onAudioRecordEnd={(result) => {
    if (!result) return;
    setMessages((prev) => [
      {
        id: String(Date.now()),
        senderId: currentUserId,
        mediaItems: [{ uri: result.uri, kind: 'audio' }],
        time: '10:56 PM',
        status: 'sent',
        senderAvatar: myAvatarUri,
        senderName: myDisplayName,
      },
      ...prev,
    ]);
  }}
/>
```

### Custom recorder UI

```tsx
CustomVoiceRecorder={(state) => (
  <MyRecorder
    duration={state.duration}
    onStop={state.stopRecording}
    onCancel={state.cancelRecording}
  />
)}
```

---

## Audio message bubbles

WhatsApp-style row inside the bubble:

| Side         | Layout (left → right)                        |
| ------------ | -------------------------------------------- |
| **Sent**     | Avatar or speed pill → play/pause → waveform |
| **Received** | play/pause → waveform → avatar or speed pill |

| State           | Avatar slot                                             |
| --------------- | ------------------------------------------------------- |
| Idle / finished | `senderAvatar` or first letter of `senderName`          |
| Playing         | Pill showing **1x**, **1.5x**, or **2x** (tap to cycle) |
| Ended           | Avatar again                                            |

- Waveform bars with scrubber dot; tap or drag to seek
- Duration under the waveform
- Play/pause is icon-only (no filled circle)
- Only one audio plays at a time (`AudioContext`)
- Video in the gallery pauses other audio

```tsx
{
  id: 'a1',
  senderId: '2',
  mediaItems: [{ uri: 'file:///data/user/0/.../voice.wav', kind: 'audio' }],
  senderAvatar: 'https://cdn.example.com/u2.jpg',
  senderName: 'Alex',
  time: '10:23 pm',
  status: 'read',
}
```

---

## Media grids & gallery

### Grid (`mediaItems`)

| Count | Layout                 | Height |
| ----- | ---------------------- | ------ |
| 1     | Full width, cover      | 320px  |
| 2     | Two columns            | 320px  |
| 3     | One top, two bottom    | 320px  |
| 4+    | 2×2, `+N` on last cell | 320px  |

Tap opens `MediaViewer`. Thumbnail `Video` uses `pointerEvents="none"` so presses reach the parent.

### Gallery behavior

- Horizontal `FlatList`, `n / total` header
- **Videos** play only if that video was the tapped item and the page is active
- Tapping an **image** in a mixed album does not start other videos
- Composer video previews **do** autoplay in the small preview card

### Legacy single fields

Legacy `image`, `video`, and `audio` fields on `Message` are normalized into `mediaItems` internally via `collectMediaItems()`.

---

## Composer attachment preview

Controlled from your app state:

```tsx
const [previews, setPreviews] = useState<PreviewAttachment[]>([]);

<ChatScreen
  previewItems={previews}
  onRemovePreviewItem={(uri) =>
    setPreviews((p) => p.filter((x) => x.uri !== uri))
  }
  onAttachmentPress={openYourDocumentPicker}
  onSendMessage={handleSend}
/>;
```

| Preview type  | UI                                  |
| ------------- | ----------------------------------- |
| 1 image/video | Single thumb + ×                    |
| 2–3 media     | Fanned stack, × on each             |
| 4+ media      | Fan of 3 + `+N`, × per visible card |
| Documents     | Chips; scrollable after 3           |

Use any picker you want (`react-native-document-picker`, `react-native-image-picker`, etc.) — movius-chats only displays `previewItems`.

---

## Theme & styling

Pass `theme` to `ChatScreen`. `theme.fontFamily` applies to **all** `Text` in the package (load the font in your app first).

### `theme.colors` — per side (`sent*` / `received*`)

| Keys                                                                      | Used for                              |
| ------------------------------------------------------------------------- | ------------------------------------- |
| `sentTimestampColor` / `receivedTimestampColor`                           | Message & file timestamps             |
| `sentMessageTextColor` / `receivedMessageTextColor`                       | Bubble text                           |
| `sentBubbleBackgroundColor` / `receivedBubbleBackgroundColor`             | Bubble background                     |
| `sentMessageTailColor` / `receivedMessageTailColor`                       | Corner tail (`ArrowBack2RoundedIcon`) |
| `sentFileAttachmentBackground` / `receivedFileAttachmentBackground`       | File chip                             |
| `sentFileAttachmentTextColor` / `receivedFileAttachmentTextColor`         | File name                             |
| `sentFileAttachmentSubtitleColor` / `receivedFileAttachmentSubtitleColor` | MIME line                             |
| `sentAudioWaveformColor` / `receivedAudioWaveformColor`                   | Inactive waveform bars                |
| `sentAudioWaveformActiveColor` / `receivedAudioWaveformActiveColor`       | Active bars + scrubber                |
| `sentAudioTimestampColor` / `receivedAudioTimestampColor`                 | Duration under waveform               |
| `sentAudioPlayIconColor` / `receivedAudioPlayIconColor`                   | Play icon                             |
| `sentAudioPauseIconColor` / `receivedAudioPauseIconColor`                 | Pause icon                            |
| `sentAudioSpeedTextColor` / `receivedAudioSpeedTextColor`                 | **1x / 1.5x / 2x** pill text          |
| `sentMediaTimestampBackground` / `receivedMediaTimestampBackground`       | Timestamp pill on file-only bubbles   |

**Not themeable:** image/video-only messages (no text, no audio) always use **white** (`#ffffff`) for the timestamp text.

### Shared colors

`inputsIconsColor`, `sendIconsColor`, `placeholderTextColor`, `inputTextColor`, `sentIconColor`, `deliveredIconColor`, `readIconColor`, `videoPlayIconColor`

### `theme.sizes`

`inputIconSize` — number (px) or twrnc class string; affects **emoji, paperclip, camera only** (not send/mic).

### `theme.bubbleStyle`

`sent`, `received`, `avatarTextStyle`, `userNameStyle`, `avatarImageStyle`, typing styles.

### `theme.messageStyle`

Text styles, file attachment styles, `progressBarStyle`, `activeProgressBarStyle`, `audioDurationStyle`, `audioSpeedButtonStyle`, `audioSpeedTextStyle`, media timestamp container styles.

### `theme.inputStyles` / `theme.filePreviewStyle`

Input row, send button, preview strip.

### Example

```tsx
<ChatScreen
  theme={{
    fontFamily: 'Inter-Regular',
    colors: {
      sentBubbleBackgroundColor: '#005C4B',
      receivedBubbleBackgroundColor: '#1F2C34',
      sentAudioSpeedTextColor: '#FFFFFF',
      receivedAudioSpeedTextColor: '#E5E7EB',
      sentAudioWaveformActiveColor: '#53BDEB',
      receivedAudioWaveformActiveColor: '#53BDEB',
    },
    sizes: { inputIconSize: 22 },
  }}
/>
```

---

## Keyboard behavior

Built into `ChatScreen`:

| Platform    | Behavior                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------- |
| **Android** | `useKeyboardInset` sets `marginBottom` on the input row (= keyboard height)                       |
| **iOS**     | Same inset **plus** `KeyboardAvoidingView` with `behavior="padding"` and `keyboardVerticalOffset` |

If your navigator already avoids the keyboard:

```tsx
<ChatScreen disableKeyboardAvoiding />
```

---

## Custom components & icons

| Prop                                        | Replaces                                              |
| ------------------------------------------- | ----------------------------------------------------- |
| `renderCustomInput`                         | Entire input + recorder (you handle preview yourself) |
| `renderCustomTyping`                        | “Typing…” content                                     |
| `renderCustomVideoBubbleError`              | Inline video error in grid                            |
| `CustomVoiceRecorder`                       | Built-in recorder bars                                |
| `CustomEmojiIcon`                           | Emoji button                                          |
| `CustomAttachmentIcon`                      | Paperclip                                             |
| `CustomCameraIcon`                          | Camera                                                |
| `CustomSendIcon`                            | Send                                                  |
| `CustomMicrophoneIcon`                      | Mic                                                   |
| `CustomPlayIcon` / `CustomPauseIcon`        | Audio (and related) playback                          |
| `CustomFileIcon`                            | Document chip icon                                    |
| `CustomImagePreview` / `CustomVideoPreview` | Composer thumbnails                                   |

### File attachments - Custom handlers

Default tap uses React Native `Linking.openURL`. For local files or share sheets, you can implement custom handlers in your app:

```tsx
import { Linking } from 'react-native';
// or: react-native-share, react-native-blob-util, etc.

onFileAttachmentPress={async (file) => {
  const uri = file.uri.startsWith('file://') ? file.uri : `file://${file.uri}`;
  await Linking.openURL(uri);
}}
```

---

## TypeScript

```ts
import ChatScreen from 'movius-chats';

import type {
  Message,
  MessageMediaItem,
  MessageFileAttachment,
  PreviewAttachment,
  RecordingResult,
  ChatScreenProps,
  VoiceRecorderExposedState,
  VoiceRecorderConfig,
  VoiceRecorderStyleOverrides,
  RecordingUIProps,
} from 'movius-chats/lib/typescript/types';
```

Source types while developing against the repo: `movius-chats/src/types` (field `"react-native": "src"` in package.json).

---

## Troubleshooting

| Problem                                            | What to do                                                                                  |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `Cannot read property 'init' of null`              | Install `react-native-audio-record`, run `pod install`, **rebuild** the app                 |
| Recording never starts                             | Mic permission; iOS `NSMicrophoneUsageDescription`; Android `RECORD_AUDIO`                  |
| No audio playback                                  | Ensure `react-native-video` is linked; URI must be `file://` or `http(s)://`                |
| `NoSuchMethodError` `DefaultLoadControl` (Android) | Force `androidx.media3` to **1.3.1** in the app `android/build.gradle` `resolutionStrategy` |
| Reanimated error                                   | `react-native-reanimated/plugin` must be **last** in Babel plugins                          |
| Font not applied                                   | Register font in the **host** app; pass exact `fontFamily` string                           |
| `inputIconSize` ignored on send/mic                | By design                                                                                   |
| Keyboard covers input (Android)                    | `android:windowSoftInputMode="adjustResize"`; parent `flex: 1`                              |
| × clears all previews                              | Implement `onRemovePreviewItem`                                                             |
| Wrong audio avatar                                 | Set `senderAvatar` and `senderName` on the `Message`                                        |
| Messages upside down                               | Newest at `messages[0]`                                                                     |

---

## License

ISC — see [package.json](./package.json).
