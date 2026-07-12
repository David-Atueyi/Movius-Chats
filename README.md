# movius-chats

> A highly customizable, feature-rich chat interface component library for React Native applications.

A production-ready React Native chat UI library providing message bubbles, WhatsApp-style media grids, audio playback, voice recording, typing indicators, message replies, full-screen media gallery, and comprehensive theming—all wrapped in a single, powerful `ChatScreen` component. Works with both bare React Native and Expo.

**npm:** [`movius-chats`](https://www.npmjs.com/package/movius-chats)
**Repo:** [github.com/David-Atueyi/Movius-Chats](https://github.com/David-Atueyi/Movius-Chats)
**Version:** 1.17.0 | **License:** ISC

---

## 📋 Table of Contents

1. [Features](#features)
2. [What is included](#what-is-included)
3. [Installation](#installation)
4. [Quick start](#quick-start)
5. [Core concepts](#core-concepts)
   - [Message data model](#message-data-model)
   - [Audio items and bubble splitting](#audio-items-and-bubble-splitting)
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
- **Sent, delivered, failed, sending, and read status** indicators with animated checkmarks
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
- **Mixed media + audio in one message** — images/videos render in the grid, with an attached audio note rendered underneath in the same bubble
- **Multiple audio clips in one message automatically split** into a primary inline audio bubble plus standalone bubbles for each additional clip, all sharing the same timestamp/status

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
  - Natural compact sizing — audio never gets boxed into the image/video grid
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

| Feature                          | Implementation                                                               |
| -------------------------------- | ---------------------------------------------------------------------------- |
| **Text rendering**               | `react-native-parsed-text` (URLs, emails, phone numbers tappable)            |
| **Image / video albums**         | `MediaGrid` — 1/2/3/4+ smart layout, 320px height, images/videos only        |
| **Full-screen media viewer**     | `MediaViewer` — swipe navigation, counter, selective video autoplay          |
| **Audio playback**               | `react-native-video` (hidden player) + custom waveform visualization         |
| **Multi-audio bubble splitting** | Extra audio items in one message split into standalone bubbles automatically |
| **Variable playback speed**      | 1.0x → 1.5x → 2.0x cycling during playback                                   |
| **Voice recording**              | `react-native-audio-record` (optional peer) with gesture controls            |
| **File attachments**             | Tappable rows with custom handler + default URL opener                       |
| **Typing indicators**            | Avatar stacking with "+N" badge for multiple typers                          |
| **Input bar**                    | Growing TextField, emoji/clip/camera/send/mic buttons                        |
| **Status indicators**            | Sent/delivered/failed/sending/read animated checkmarks                       |
| **Message replies**              | Swipe-to-reply, inline display, edit tracking                                |
| **Message actions**              | Long-press menus with copy, forward, delete, edit                            |
| **Selection mode**               | Multi-select with batch operations                                           |
| **Theming**                      | Comprehensive dual-sided (sent/received) color system                        |

---

## Installation

### Prerequisites

- **React Native 0.60+**
- **Node 14+**

### 1. Install movius-chats

```bash
yarn add movius-chats
# or: npm install movius-chats
# or: bun add movius-chats
```

### 2. Install peers

```bash
yarn add react-native-reanimated react-native-video react-native-svg react-native-gesture-handler
```

`react-native-video` and `react-native-svg` are also pulled in as movius-chats dependencies, but your app should list compatible versions and link native code.

| Peer                                | Version | Required | Purpose                        |
| ----------------------------------- | ------- | -------- | ------------------------------ |
| `react`                             | ≥16.8   | Yes      | React hooks, context           |
| `react-native`                      | \*      | Yes      | Core framework                 |
| `react-native-gesture-handler`      | ≥2.0    | Yes      | Swipe & long-press gestures    |
| `react-native-reanimated`           | \*      | Yes      | Gesture animations             |
| `react-native-audio-record`         | \*      | Optional | Voice recording capture        |
| `react-native-fs`                   | \*      | Optional | File system access (recording) |
| `@react-native-clipboard/clipboard` | \*      | Optional | Copy to clipboard              |

If the optional voice-recording peers are missing, the UI still renders; starting a recording logs an install hint instead of crashing.

**There is no `react-native-sound`, `expo-av`, `expo-file-system`, or other Expo package in this library.**

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
<key>NSCameraUsageDescription</key>
<string>This app needs camera access to take photos.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs photo library access.</string>
```

**Android** — add to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.CAMERA" />
```

(`RECORD_AUDIO` is often added automatically by `react-native-audio-record`.)

Then rebuild native apps:

```bash
cd ios && pod install && cd ..
npx react-native run-ios
npx react-native run-android
```

### 5. Native linking

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

### 6. Android keyboard

In `android/app/src/main/AndroidManifest.xml` on your main activity:

```xml
android:windowSoftInputMode="adjustResize"
```

---

## Quick Start

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

## Core Concepts

### Message Data Model

Every message in movius-chats follows this **unified interface**:

```tsx
export interface Message {
  id: string; // Unique message identifier
  text?: string; // Text content
  senderId: string; // ID of message sender
  time: string; // Timestamp (e.g., "10:30 AM")
  status: 'read' | 'delivered' | 'sending' | 'failed' | 'sent'; // Message status
  senderName?: string; // Sender display name
  senderAvatar?: string; // Sender avatar URI
  mediaItems?: MessageMediaItem[]; // Images, videos, and/or audio — preferred way to attach media
  fileAttachments?: MessageFileAttachment[]; // Array of file attachments
  replyTo?: MessageReply; // Reply context
  edited?: boolean; // Whether message was edited
}

// Media item — image, video, or audio, all in one array
export interface MessageMediaItem {
  uri: string;
  kind: 'image' | 'video' | 'audio';
  name?: string; // optional — filename, used when uploading
  type?: string; // optional — MIME type, used when uploading
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

### Audio items and bubble splitting

A message's `mediaItems` array can contain any mix of `image`, `video`, and `audio` items. Rendering follows these rules:

- **All `image`/`video` items** render together in the media grid (1/2/3/4+ layout), exactly as before.
- **The first `audio` item** in `mediaItems` renders attached to the same bubble, directly under the media grid and/or text — this is what a voice note, or an image with an attached audio caption, looks like.
- **Any additional `audio` items** beyond the first automatically split into their own standalone bubbles, rendered immediately after the main bubble. Each split bubble inherits the same `time` and `status` as the parent message, so timestamps and read/delivered/sent checkmarks stay consistent across the whole group.
- **Audio never renders inside the image/video grid.** It always uses its own compact waveform UI (~240–280px wide) rather than being stretched into a 320px grid cell.

**Examples:**

```tsx
// Single audio message
{
  id: '123',
  mediaItems: [{ uri: 'file:///path/to/audio.m4a', kind: 'audio' }],
  senderId: 'user-1',
  time: '10:45 AM',
  status: 'sending',
}

// Images with an attached audio note — one bubble: grid on top, waveform below
{
  id: '124',
  mediaItems: [
    { uri: 'https://example.com/photo1.jpg', kind: 'image' },
    { uri: 'https://example.com/photo2.jpg', kind: 'image' },
    { uri: 'file:///path/to/note.wav', kind: 'audio' },
  ],
  senderId: 'user-1',
  time: '10:46 AM',
  status: 'sent',
}

// Multiple audio clips — first attaches inline, rest split into their own bubbles
{
  id: '125',
  mediaItems: [
    { uri: 'file:///path/to/clip1.wav', kind: 'audio' },
    { uri: 'file:///path/to/clip2.wav', kind: 'audio' },
    { uri: 'file:///path/to/clip3.wav', kind: 'audio' },
  ],
  senderId: 'user-1',
  time: '10:47 AM',
  status: 'sent',
}
```

This means: sending images + one voice note produces a single bubble with the grid on top and the waveform underneath. Sending several voice notes together produces one bubble for the first clip plus a separate standalone bubble for each additional clip — visually indistinguishable from sending them as separate messages, but grouped under one logical `Message`.

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
  typingUsers?: Array<{ id: string; avatar: string; name: string }>; // Who's typing

  // Callbacks
  onSendMessage: (message: Omit<Message, 'id' | 'time' | 'status'>) => void;
  onAttachmentPress?: () => void;
  onCameraPress?: () => void;
  onAudioRecordEnd?: (result?: RecordingResult) => void;
  onAudioRecordStart?: () => void;
  onMessageLongPress?: (message: Message) => void;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  onFileAttachmentPress?: (file: MessageFileAttachment) => void;
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
  showAvatars?: boolean;
  showUserNames?: boolean;
  showBubbleTail?: boolean;
  showMessageStatus?: boolean;
  showEmojiButton?: boolean;
  showAttachmentsButton?: boolean;
  showCameraButton?: boolean;
  showVoiceRecordButton?: boolean;
  renderCustomInput?: () => React.ReactNode;

  // Custom Icons (optional)
  CustomEmojiIcon?: () => React.ReactNode;
  CustomAttachmentIcon?: () => React.ReactNode;
  CustomCameraIcon?: () => React.ReactNode;
  CustomMicrophoneIcon?: () => React.ReactNode;
  CustomSendIcon?: () => React.ReactNode;
  CustomFileIcon?: React.ComponentType<{ style?: any }>;
  CustomImagePreview?: React.ComponentType<{ uri: string }>;
  CustomVideoPreview?: React.ComponentType<{ uri: string }>;
  CustomPlayIcon?: () => React.ReactNode;
  CustomPauseIcon?: () => React.ReactNode;
  CustomVoiceRecorder?: (state: VoiceRecorderExposedState) => React.ReactNode;

  // Reply
  onReplyMessage?: (message: Message) => void;
  replyProps?: ReplyConfig;
  replyUI?: ReplyUIProps;
  replyStyle?: ReplyStyleOverrides;
  renderReplyPreview?: (
    message: Message,
    cancel: () => void
  ) => React.ReactNode;
  renderInlineReply?: (
    reply: MessageReply,
    isCurrentUser: boolean
  ) => React.ReactNode;

  // Long-press message actions
  messageActionProps?: MessageActionFlags;
  messageActionUI?: MessageActionUIProps;
  messageActionLabels?: MessageActionLabels;
  messageActionIcons?: MessageActionIconComponents;
  renderMessageActions?: (
    message: Message,
    close: () => void,
    anchor?: MessageActionAnchor
  ) => React.ReactNode;
  onCopyMessage?: (message: Message) => void;
  onEditMessage?: (message: Message, newText: string) => void;
  onDeleteMessage?: (message: Message) => void;
  onForwardMessage?: (message: Message) => void;

  // Multi-select mode
  selectionUI?: SelectionUIProps;
  onSelectionChange?: (selectedIds: string[]) => void;
  onDeleteSelected?: (messages: Message[]) => void;
  onForwardSelected?: (messages: Message[]) => void;
  onCopySelected?: (messages: Message[]) => void;

  // "edited" indicator
  editedLabel?: string;
  editedTextStyle?: TextStyle;

  keyboardVerticalOffset?: number;
  disableKeyboardAvoiding?: boolean;

  // Composer preview
  placeholder?: string;
  previewData?: PreviewAttachment;
  previewItems?: PreviewAttachment[];
  closePreview?: () => void;
  onRemovePreviewItem?: (uri: string) => void;

  // Theming
  theme?: ChatScreenTheme;
}
```

### Message Interface

See [Message Data Model](#message-data-model) and [Audio items and bubble splitting](#audio-items-and-bubble-splitting) above for full details.

### Loading More Messages

When the user reaches the top of the message list while older messages are being fetched, the component can show a loading indicator:

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
  fontFamily?: string;

  colors?: {
    // Sent messages
    sentBubbleBackgroundColor?: string;
    sentMessageTextColor?: string;
    sentTimestampColor?: string;
    sentMessageTailColor?: string;
    sentIconColor?: string;
    sendingIconColor?: string;
    failedIconColor?: string;
    deliveredIconColor?: string;
    readIconColor?: string;
    sentAudioWaveformColor?: string;
    sentAudioWaveformActiveColor?: string;
    sentAudioTimestampColor?: string;
    sentAudioPlayIconColor?: string;
    sentAudioPauseIconColor?: string;
    sentAudioPlayButtonBackground?: string;
    sentAudioSpeedTextColor?: string;
    sentFileAttachmentBackground?: string;
    sentFileAttachmentTextColor?: string;
    sentFileAttachmentSubtitleColor?: string;
    sentMediaTimestampBackground?: string;

    // Received messages
    receivedBubbleBackgroundColor?: string;
    receivedMessageTextColor?: string;
    receivedTimestampColor?: string;
    receivedMessageTailColor?: string;
    receivedAudioWaveformColor?: string;
    receivedAudioWaveformActiveColor?: string;
    receivedAudioTimestampColor?: string;
    receivedAudioPlayIconColor?: string;
    receivedAudioPauseIconColor?: string;
    receivedAudioPlayButtonBackground?: string;
    receivedAudioSpeedTextColor?: string;
    receivedFileAttachmentBackground?: string;
    receivedFileAttachmentTextColor?: string;
    receivedFileAttachmentSubtitleColor?: string;
    receivedMediaTimestampBackground?: string;

    // Shared / UI
    videoPlayIconColor?: string;
    inputTextColor?: string;
    inputsIconsColor?: string;
    sendIconsColor?: string;
    placeholderTextColor?: string;
  };

  sizes?: {
    inputIconSize?: string | number;
  };

  bubbleStyle?: {
    sent?: ViewStyle;
    received?: ViewStyle;
    avatarTextStyle?: TextStyle;
    userNameStyle?: TextStyle;
    avatarImageStyle?: ImageStyle;
    typingContainerStyle?: ViewStyle;
    additionalTypingUsersContainerStyle?: ViewStyle;
    additionalTypingUsersTextStyle?: TextStyle;
    typingTextStyle?: TextStyle;
  };

  messageStyle?: {
    sentTextStyle?: TextStyle;
    receivedTextStyle?: TextStyle;
    sentFileAttachmentStyle?: ViewStyle;
    receivedFileAttachmentStyle?: ViewStyle;
    sentFileAttachmentTextStyle?: TextStyle;
    receivedFileAttachmentTextStyle?: TextStyle;
    sentFileAttachmentSubtitleStyle?: TextStyle;
    receivedFileAttachmentSubtitleStyle?: TextStyle;
    sentMediaTimestampContainerStyle?: ViewStyle;
    receivedMediaTimestampContainerStyle?: ViewStyle;
    progressBarStyle?: ViewStyle;
    activeProgressBarStyle?: ViewStyle;
    audioDurationStyle?: TextStyle;
    audioSpeedButtonStyle?: ViewStyle;
    audioSpeedTextStyle?: TextStyle;
    editedTextStyle?: TextStyle;
  };

  inputStyles?: {
    inputSectionContainerStyle?: ViewStyle;
    inputContainerStyle?: ViewStyle;
    sendButtonStyle?: ViewStyle;
  };

  filePreviewStyle?: {
    root?: ViewStyle;
    container?: ViewStyle;
    iconContainer?: ViewStyle;
    nameContainer?: ViewStyle;
    text?: TextStyle;
  };

  voiceRecorder?: {
    ui?: RecordingUIProps;
    styles?: VoiceRecorderStyleOverrides;
    config?: VoiceRecorderConfig;
  };

  reply?: {
    ui?: ReplyUIProps;
    styles?: ReplyStyleOverrides;
  };

  messageActions?: {
    ui?: MessageActionUIProps;
    labels?: MessageActionLabels;
    icons?: MessageActionIconComponents;
  };

  selection?: SelectionUIProps;
}
```

---

## Features Guide

### Voice Recording

Voice messages combine **gesture-based capture** with **multiple recording modes**. Requires **`react-native-audio-record`** and **`react-native-fs`** in the host app, plus a **native rebuild**.

#### Recording Modes

1. **Tap-to-Record** — Single press starts/stops
2. **Long-Press Record** — Hold microphone for continuous capture
3. **Slide-to-Cancel** — Swipe left while recording to cancel
4. **Lock Recording** — Tap lock icon to record hands-free

#### Gestures

| Action                    | Result                                                                       |
| ------------------------- | ---------------------------------------------------------------------------- |
| **Tap** mic               | Normal bar: trash, timer, waveform, play/pause preview, send                 |
| **Long-press** mic        | Hold mode: "slide to cancel", lock column above send                         |
| Slide **left**            | Cancel (file deleted via `react-native-fs`)                                  |
| Slide **up** to lock      | Switches to normal bar (`lockSlideDistance` in `theme.voiceRecorder.config`) |
| **Release** without slide | Auto-send (`onAudioRecordEnd`)                                               |

#### Configuration

```tsx
<ChatScreen
  theme={{
    voiceRecorder: {
      config: {
        maxDuration: 300, // 5 minutes max (seconds)
        enableSlideToCancel: true, // Show slide-to-cancel hint
        enableLockRecording: true, // Show lock option
        enableWaveform: true, // Show waveform during recording
      },
      ui: {
        timerColor: '#FFFFFF',
        waveformColor: '#E9EDEF',
        recordingBackground: '#0B141A',
        lockPillBackground: '#1F2937',
        lockIconColor: '#FFFFFF',
        chevronIconColor: '#8696A0',
        cancelTextColor: '#F15C6D',
        waveformBarCount: 32,
      },
    },
  }}
  onAudioRecordEnd={(result) => {
    if (!result) return;
    console.log('Recording saved to:', result.uri);
    console.log('Duration:', result.duration, 'sec');
  }}
/>
```

#### Recording Result

```tsx
interface RecordingResult {
  uri: string; // File system path (always file://...)
  duration: number; // Seconds
  mimeType?: string; // e.g. 'audio/wav'
  size?: number; // Bytes
  name?: string; // e.g. 'movius_rec_1783269276396.wav'
}
```

`name` and `mimeType` are populated automatically by the built-in recorder — pass them straight through when building your `mediaItems` entry so your upload logic has the correct filename and MIME type instead of guessing.

#### Wiring

```tsx
<ChatScreen
  showVoiceRecordButton
  onAudioRecordEnd={(result) => {
    if (!result) return;
    setMessages((prev) => [
      {
        id: String(Date.now()),
        senderId: currentUserId,
        mediaItems: [
          {
            uri: result.uri,
            kind: 'audio',
            name: result.name, // ✅ pass through for upload
            type: result.mimeType, // ✅ pass through for upload
          },
        ],
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

#### Custom recorder UI

```tsx
<ChatScreen
  CustomVoiceRecorder={(state) => (
    <MyRecorder
      duration={state.duration}
      onStop={state.stopRecording}
      onCancel={state.cancelRecording}
    />
  )}
/>
```

---

### Audio Message Playback

Audio is sent through `mediaItems` with `kind: 'audio'` — not a separate top-level field. See [Audio items and bubble splitting](#audio-items-and-bubble-splitting) for the full rendering rules.

```tsx
// Single audio message
const audioMessage: Message = {
  id: '123',
  mediaItems: [{ uri: 'file:///path/to/audio.m4a', kind: 'audio' }],
  senderId: 'user-1',
  time: '10:45 AM',
  status: 'sent',
  senderAvatar: 'https://...',
};

// Image(s) with an attached audio note — one bubble, grid on top, waveform below
const imageWithAudio: Message = {
  id: '124',
  mediaItems: [
    { uri: 'https://example.com/photo1.jpg', kind: 'image' },
    { uri: 'https://example.com/photo2.jpg', kind: 'image' },
    { uri: 'file:///path/to/note.wav', kind: 'audio' },
  ],
  senderId: 'user-1',
  time: '10:46 AM',
  status: 'sent',
};

// Multiple audio clips — first attaches inline, rest split into standalone bubbles
const multipleAudioClips: Message = {
  id: '125',
  mediaItems: [
    { uri: 'file:///path/to/clip1.wav', kind: 'audio' },
    { uri: 'file:///path/to/clip2.wav', kind: 'audio' },
    { uri: 'file:///path/to/clip3.wav', kind: 'audio' },
  ],
  senderId: 'user-1',
  time: '10:47 AM',
  status: 'sent',
};
```

**Features:**

- **Animated waveform** that fills as playback progresses
- **Playback speed cycling:** 1.0x → 1.5x → 2.0x → 1.0x
- **Sender avatar** displayed or current speed overlay
- **Pause/resume** during playback
- **Automatic pause** when another audio starts (only one plays at a time, via `AudioContext`)
- **Duration display** under the waveform
- **Natural sizing** — audio bubbles size to fit the compact waveform UI, never stretched into the image/video grid box
- **Multiple audio auto-splitting** — extra audio items beyond the first in one message become their own standalone bubbles, inheriting the parent message's `time` and `status`

WhatsApp-style row inside each audio bubble:

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
- Play/pause is icon-only (no filled circle)
- Video in the gallery pauses other audio

---

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

| Count | Layout                       | Height |
| ----- | ---------------------------- | ------ |
| 1     | Full-width square            | 320px  |
| 2     | 50/50 side-by-side           | 320px  |
| 3     | Large left + 2 stacked right | 320px  |
| 4+    | 2×2 grid, `+N` on last cell  | 320px  |

**Gallery Features:**

- Swipe left/right to navigate
- Image counter (e.g., "3/5")
- Video thumbnails with play icon
- Optional video autoplay control
- Close button (X icon)
- Full-screen immersive viewing

**Audio is never included in the grid or gallery.** Only `image`/`video` items are eligible for grid layout and full-screen viewing — audio items are filtered out and rendered via the standalone `AudioPlayer` UI instead (see [Audio items and bubble splitting](#audio-items-and-bubble-splitting)).

**Legacy single fields:** Legacy `image`, `video`, and `audio` fields on `Message` are normalized into `mediaItems` internally via `collectMediaItems()`. **New integrations should use `mediaItems` directly** rather than the legacy fields — they're kept only for backward compatibility with older message data and will not receive new features (e.g. the multi-audio splitting behavior only applies to items in `mediaItems`).

---

### Message Replies

Enable conversations within conversations:

```tsx
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

---

### Typing Indicators

```tsx
<ChatScreen
  typingUsers={[
    { id: 'alice', avatar: 'https://...', name: 'Alice' },
    { id: 'bob', avatar: 'https://...', name: 'Bob' },
    // If 3+ users, shows "Alice, Bob, +2 more"
  ]}
  onTypingStart={() => console.log('Typing started')}
  onTypingEnd={() => console.log('Typing ended')}
/>
```

**Features:**

- Animated dots bouncing
- Up to 2 avatars displayed inline
- "+N more" badge if 3+ users
- Customizable dot color
- Auto-dismisses when `onTypingEnd` called

---

### File Attachments

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
  onFileAttachmentPress={async (file) => {
    const uri = file.uri.startsWith('file://')
      ? file.uri
      : `file://${file.uri}`;
    await Linking.openURL(uri);
    // or use react-native-share, react-native-blob-util, etc.
  }}
/>
```

---

### Message Selection & Actions

```tsx
<ChatScreen
  onMessageLongPress={(message) => {
    // Long-press opens action menu with copy/forward/reply/edit/delete
  }}
  messageActionProps={{
    enableReply: true,
    enableCopy: true,
    enableEdit: true,
    enableDelete: true,
    enableForward: true,
    enableSelect: true,
  }}
  messageActionLabels={{
    copy: 'Copy Text',
    forward: 'Share',
    delete: 'Remove',
  }}
  messageActionIcons={{
    copy: CustomCopyIcon,
  }}
  selectionUI={{
    rowBackgroundColor: 'rgba(34, 197, 94, 0.1)',
  }}
  onDeleteSelected={(messages) => {
    /* ... */
  }}
  onForwardSelected={(messages) => {
    /* ... */
  }}
  onCopySelected={(messages) => {
    /* ... */
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
      sentBubbleBackgroundColor: '#22c55e',
      sentMessageTextColor: '#FFFFFF',
      sentTimestampColor: 'rgba(255, 255, 255, 0.7)',
      sentIconColor: '#FFFFFF',
      sentAudioWaveformColor: 'rgba(255, 255, 255, 0.3)',
      sentAudioWaveformActiveColor: 'rgba(255, 255, 255, 0.95)',
      sentFileAttachmentBackground: 'rgba(255, 255, 255, 0.15)',
      sentFileAttachmentTextColor: '#FFFFFF',

      // Received messages (left-aligned, typically gray)
      receivedBubbleBackgroundColor: '#E5E7EB',
      receivedMessageTextColor: '#1F2937',
      receivedTimestampColor: 'rgba(107, 114, 128, 0.85)',
      receivedAudioWaveformColor: 'rgba(0, 0, 0, 0.2)',
      receivedAudioWaveformActiveColor: 'rgba(0, 0, 0, 0.6)',
      receivedFileAttachmentBackground: 'rgba(0, 0, 0, 0.08)',
      receivedFileAttachmentTextColor: '#1F2937',

      // Input & UI
      inputTextColor: '#1F2937',
      placeholderTextColor: '#9CA3AF',
      inputsIconsColor: '#6B7280',
      sendIconsColor: '#FFFFFF',
    },
  }}
/>
```

#### Fonts

```tsx
<ChatScreen
  theme={{
    fontFamily: 'Inter-Regular', // Custom font — load it in your app first
  }}
/>
```

#### Custom Styles

```tsx
<ChatScreen
  theme={{
    bubbleStyle: {
      sent: {
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      received: {
        borderRadius: 16,
      },
    },
  }}
/>
```

### Custom Components & Icons

```tsx
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
  // Audio playback
  CustomPlayIcon={PlayIcon}
  CustomPauseIcon={PauseIcon}
  // Custom input
  renderCustomInput={() => <YourCustomInput />}
/>
```

| Prop                                        | Replaces                                              |
| ------------------------------------------- | ----------------------------------------------------- |
| `renderCustomInput`                         | Entire input + recorder (you handle preview yourself) |
| `renderCustomTyping`                        | "Typing…" content                                     |
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

### Component Overrides

The library exposes individual components for advanced customization:

```tsx
import {
  ChatBubble,
  AudioPlayer,
  VoiceRecorder,
  VoiceRecordingGesture,
  VoiceRecorderFlow,
  LongPressOverlay,
  MessageActionsPopover,
  MessageActionsSheet,
  InlineReply,
  ReplyPreview,
  SwipeableMessage,
} from 'movius-chats';

// Use individually or extend
const CustomChatBubble = (props) => <ChatBubble {...props} staticMode={true} />;
```

---

## Project Structure

movius-chats/
├── src/
│ ├── index.tsx # Main ChatScreen export
│ ├── types/
│ │ └── index.ts # TypeScript interfaces
│ ├── context/
│ │ ├── ChatContext.tsx # Main chat state & props
│ │ └── AudioContext.tsx # Audio playback coordination
│ ├── hooks/
│ │ ├── useKeyboardInset.ts # iOS/Android keyboard height
│ │ └── useVoiceRecorder.ts # Voice recording hook
│ ├── components/
│ │ ├── ChatBubble/
│ │ │ ├── ChatBubble.tsx # Main bubble + audio-split rendering
│ │ │ ├── MessageContent.tsx # Text/grid/primary-audio content
│ │ │ ├── MessageStatus.tsx # Status checkmarks
│ │ │ ├── MediaGrid.tsx # 1/2/3/4+ grid layouts (image/video only)
│ │ │ └── types.ts
│ │ ├── ChatInput/
│ │ │ ├── ChatInput.tsx # Input bar with buttons
│ │ │ ├── FilePreview.tsx # Selected file preview
│ │ │ └── TruncateFileName.ts
│ │ ├── AudioPlayer/
│ │ │ ├── AudioPlayer.tsx # Audio playback UI
│ │ │ └── types.ts
│ │ ├── MediaViewer/
│ │ │ └── MediaViewer.tsx # Full-screen gallery (image/video only)
│ │ ├── MessageActions/
│ │ │ ├── index.ts
│ │ │ ├── LongPressOverlay.tsx # Action menu overlay
│ │ │ ├── MessageActionsPopover.tsx # Tablet UI
│ │ │ └── MessageActionsSheet.tsx # Mobile bottom sheet
│ │ ├── Reply/
│ │ │ ├── index.ts
│ │ │ ├── SwipeableMessage.tsx # Swipe gesture handler
│ │ │ ├── ReplyPreview.tsx # Input bar reply preview
│ │ │ └── InlineReply.tsx # Bubble reply display
│ │ ├── TypingComponent/
│ │ │ └── TypingIndicator.tsx # Animated typing dots
│ │ └── VoiceRecorder/
│ │ ├── VoiceRecorder.tsx # Base recorder UI
│ │ ├── VoiceRecordingGesture.tsx # Gesture handlers
│ │ └── VoiceRecorderFlow/ # Recording modes & UI
│ ├── utils/
│ │ ├── bubbleTheme.ts # Color helpers for sent/received
│ │ ├── messageMedia.ts # Media collection + audio-split utilities
│ │ ├── messageActions.ts # Action merging & defaults
│ │ ├── replyTheme.ts # Reply styling helpers
│ │ ├── theme.ts # Font & icon size helpers
│ │ └── datefunc.ts # Duration formatting
│ └── assets/
│ └── Icons/ # Built-in SVG icons
├── lib/
│ ├── commonjs/ # CommonJS build output
│ ├── module/ # ES Module build output
│ └── typescript/ # TypeScript declarations
├── scripts/
│ └── patchSound.js # Audio module patching
├── babel.config.js
├── rollup.config.mjs
├── tsconfig.json
├── tsconfig.types.json
├── tsconfig.build.json
├── package.json
└── README.md

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

| Platform    | Behavior                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------- |
| **Android** | `useKeyboardInset` sets `marginBottom` on the input row (= keyboard height)                       |
| **iOS**     | Same inset **plus** `KeyboardAvoidingView` with `behavior="padding"` and `keyboardVerticalOffset` |

If your navigator already avoids the keyboard:

```tsx
<ChatScreen disableKeyboardAvoiding />
```

### Customization

```tsx
// useKeyboardInset hook provides current inset (internal — usually not needed directly)
const { keyboardHeight } = useKeyboardInset();

// Manual control via renderCustomInput
<ChatScreen
  renderCustomInput={() => <YourInput keyboardOffset={customOffset} />}
/>;
```

---

## TypeScript Support

Full TypeScript support with exported types:

```tsx
import ChatScreen from 'movius-chats';

import type {
  Message,
  MessageMediaItem,
  MessageFileAttachment,
  MessageReply,
  PreviewAttachment,
  RecordingResult,
  ChatScreenProps,
  VoiceRecorderExposedState,
  VoiceRecorderConfig,
  VoiceRecorderStyleOverrides,
  RecordingUIProps,
  MessageActionFlags,
  MessageActionUIProps,
  MessageActionLabels,
  ReplyConfig,
  ReplyUIProps,
  SelectionUIProps,
} from 'movius-chats/lib/typescript/types';

const message: Message = {
  id: '1',
  text: 'Hello',
  senderId: 'user-1',
  time: '10:30 AM',
  status: 'sent',
};

type Props = ChatScreenProps;
```

Source types while developing against the repo: `movius-chats/src/types` (field `"react-native": "src"` in `package.json`).

---

## Advanced Usage

### Custom Message Actions

```tsx
<ChatScreen
  messageActionProps={{
    enableReply: true,
    enableCopy: true,
    enableEdit: true,
    enableDelete: true,
    enableForward: true,
    enableSelect: false,
  }}
  messageActionLabels={{
    delete: 'Remove',
  }}
  onCopyMessage={(message) => {
    /* ... */
  }}
  onDeleteMessage={(message) => {
    /* ... */
  }}
  onForwardMessage={(message) => {
    /* ... */
  }}
/>
```

### Static Message Display (Read-Only)

```tsx
import { ChatBubble } from 'movius-chats';

<ChatBubble
  message={message}
  isCurrentUser={false}
  isFirstInSequence
  staticMode={true}
/>;
```

### Multi-User Typing

```tsx
<ChatScreen
  typingUsers={[
    { id: 'alice', avatar: 'https://...', name: 'Alice' },
    { id: 'bob', avatar: 'https://...', name: 'Bob' },
    { id: 'charlie', avatar: 'https://...', name: 'Charlie' },
  ]}
  onTypingStart={() => console.log('Typing started')}
  onTypingEnd={() => console.log('Typing ended')}
/>
```

### Custom Theme Colors (Dark Mode)

```tsx
const darkTheme = {
  colors: {
    sentBubbleBackgroundColor: '#128C7E',    // WhatsApp green
    sentMessageTextColor: '#FFFFFF',
    receivedBubbleBackgroundColor: '#1F2937', // Dark gray
    receivedMessageTextColor: '#F3F4F6',
    inputTextColor: '#F3F4F6',
    placeholderTextColor: '#6B7280',
  },
  fontFamily: 'Roboto',
};

<ChatScreen theme={darkTheme} ... />
```

### Handling Large Message Lists

For performance with large lists:

```tsx
// 1. The list is already virtualized via FlatList
// 2. Paginate older messages with onEndReached
// 3. Cache the most recent page locally for instant reopen (e.g. MMKV)

const [messages, setMessages] = useState<Message[]>([
  // Latest page of messages
]);

<ChatScreen
  messages={messages}
  onEndReached={loadOlderMessages}
  isLoadingMoreMessages={isFetchingOlder}
/>;
```

---

## Troubleshooting

| Problem                                                   | What to do                                                                                                                                                                                      |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Cannot read property 'init' of null`                     | Install `react-native-audio-record`, run `pod install`, **rebuild** the app                                                                                                                     |
| Recording never starts                                    | Mic permission; iOS `NSMicrophoneUsageDescription`; Android `RECORD_AUDIO`                                                                                                                      |
| No audio playback                                         | Ensure `react-native-video` is linked; URI must be `file://` or `http(s)://`                                                                                                                    |
| Audio message shows a large empty box above the waveform  | Audio items no longer render inside the image/video grid box — always uses a compact standalone UI. If seeing this, confirm you're not passing audio through the legacy `image`/`video` fields. |
| Multiple audio clips squished into one grid cell          | Fixed — any audio beyond the first in `mediaItems` splits into its own standalone bubble below the main one automatically.                                                                      |
| Standalone split audio bubble missing timestamp/checkmark | Split audio bubbles inherit `time` and `status` from the parent message automatically — no action needed.                                                                                       |
| `NoSuchMethodError` `DefaultLoadControl` (Android)        | Force `androidx.media3` to a consistent version (matching what `react-native-video` expects) in the app `android/build.gradle` `resolutionStrategy`, then clean-rebuild.                        |
| Reanimated error                                          | `react-native-reanimated/plugin` must be **last** in Babel plugins                                                                                                                              |
| Font not applied                                          | Register font in the **host** app; pass exact `fontFamily` string                                                                                                                               |
| `inputIconSize` ignored on send/mic                       | By design                                                                                                                                                                                       |
| Keyboard covers input (Android)                           | `android:windowSoftInputMode="adjustResize"`; parent `flex: 1`                                                                                                                                  |
| × clears all previews                                     | Implement `onRemovePreviewItem`                                                                                                                                                                 |
| Wrong audio avatar                                        | Set `senderAvatar` and `senderName` on the `Message`                                                                                                                                            |
| Messages upside down                                      | Newest message must be at `messages[0]`                                                                                                                                                         |
| Reply gestures not working                                | Ensure `replyProps.enableReply` is `true`, `react-native-gesture-handler` is up to date, and `GestureHandlerRootView` wraps your app                                                            |

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
git clone https://github.com/David-Atueyi/Movius-Chats.git
cd Movius-Chats

npm install
npm run test
npm run typescript
npm run lint
npm run build
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
