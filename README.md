# movius-chats

A highly customizable, feature-rich chat UI for **React Native**. Drop in a single `ChatScreen` component to get message bubbles, media (images, video, audio), typing indicators, attachment previews, and a full input bar—with deep theming and custom icon/component hooks.

**npm:** [`movius-chats`](https://www.npmjs.com/package/movius-chats)  
**Repository:** [github.com/David-Atueyi/Movius-Chats](https://github.com/David-Atueyi/Movius-Chats)

---

## Table of contents

- [Requirements](#requirements)
- [Important: native modules & Expo](#important-native-modules--expo)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Message data model](#message-data-model)
- [Message list ordering](#message-list-ordering)
- [ChatScreen API](#chatscreen-api)
  - [Core props](#core-props)
  - [Feature flags](#feature-flags)
  - [Input & typing](#input--typing)
  - [Attachment preview](#attachment-preview)
  - [Theming](#theming)
  - [Custom components & icons](#custom-components--icons)
- [Usage examples](#usage-examples)
  - [Text messages](#text-messages)
  - [Media messages](#media-messages)
  - [Typing indicators](#typing-indicators)
  - [Attachments & camera (parent-controlled)](#attachments--camera-parent-controlled)
  - [Attachment preview before send](#attachment-preview-before-send)
  - [Custom theme](#custom-theme)
  - [Custom input bar](#custom-input-bar)
  - [Long-press actions](#long-press-actions)
- [TypeScript](#typescript)
- [Architecture overview](#architecture-overview)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Requirements

| Dependency | Role |
|------------|------|
| `react` ≥ 16.8 | Peer dependency |
| `react-native` | Peer dependency |
| `react-native-reanimated` | Audio scrubber animations (peer) |
| `react-native-image-zoom-viewer` | Full-screen image viewer |
| `react-native-parsed-text` | Clickable URLs in messages |
| `react-native-sound` | Voice message playback |
| `react-native-svg` | Built-in icons |
| `react-native-video` | Video bubbles & preview |
| `twrnc` | Tailwind-style utility classes |

---

## Important: native modules & Expo

- **Rebuild required** after install. This library uses native modules (`react-native-sound`, `react-native-video`, etc.).
- **Not compatible with Expo Go.** Use a [development build](https://docs.expo.dev/develop/development-builds/introduction/) or a bare React Native app.
- **iOS:** run `pod install` in the `ios` folder after adding dependencies.

---

## Installation

### 1. Install the package

```bash
npm install movius-chats
# or
yarn add movius-chats
# or
bun install movius-chats
```

### 2. Install peer & native dependencies

These are required in **your app** (some are bundled as dependencies of `movius-chats`, but you must still link/native-build them in the host app):

```bash
npm install react-native-reanimated react-native-image-zoom-viewer react-native-sound react-native-svg react-native-video twrnc
# or
yarn add react-native-reanimated react-native-image-zoom-viewer react-native-sound react-native-svg react-native-video twrnc
#or
bun install react-native-reanimated react-native-image-zoom-viewer react-native-sound react-native-svg react-native-video twrnc
```

> `react-native-parsed-text` is pulled in transitively; no extra install step unless your bundler requires it.

### 3. Configure Reanimated

Add the Reanimated Babel plugin **last** in `babel.config.js`:

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // ...other plugins
    'react-native-reanimated/plugin',
  ],
};
```

### 4. Configure react-native-sound (recommended)

**iOS** — enable playback in silent mode (optional, in `AppDelegate`):

```objc
#import <AVFoundation/AVFoundation.h>

// inside didFinishLaunchingWithOptions:
[[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error:nil];
```

**Android** — ensure internet permission if loading remote audio URLs in `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

### 5. Rebuild the native app

**React Native CLI:**

```bash
cd ios && pod install && cd ..
npx react-native run-ios
npx react-native run-android
```

**Expo (development build):**

```bash
npx expo prebuild
npx expo run:ios
# or
npx expo run:android
```

After native dependency updates:

```bash
npx expo prebuild --clean
```

---

## Quick start

```tsx
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native';
import ChatScreen from 'movius-chats';
import type { Message } from 'movius-chats/lib/typescript/types';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const currentUserId = 'user-1';

  const handleSendMessage = (
    payload: Omit<Message, 'id' | 'time' | 'status'>
  ) => {
    const newMessage: Message = {
      ...payload,
      id: String(Date.now()),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'sent',
    };
    // Newest first — see "Message list ordering"
    setMessages((prev) => [newMessage, ...prev]);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ChatScreen
        messages={messages}
        currentUserId={currentUserId}
        onSendMessage={handleSendMessage}
        placeholder="Type a message..."
        showAvatars
        showBubbleTail
        showMessageStatus
        showEmojiButton
        showAttachmentsButton
        showCameraButton
        showVoiceRecordButton
      />
    </SafeAreaView>
  );
}
```

---

## Message data model

Each item in `messages` must match the `Message` interface:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique message id |
| `senderId` | `string` | Yes | User id of the sender |
| `time` | `string` | Yes | Display time (e.g. `"2:30 PM"`) — you format this |
| `status` | `'sent' \| 'delivered' \| 'read'` | Yes | Delivery state (shown only for current user) |
| `text` | `string` | No | Plain text; URLs are auto-linked |
| `image` | `string` | No | Image URI |
| `video` | `string` | No | Video URI |
| `audio` | `string` | No | Audio file URI |
| `senderName` | `string` | No | Shown when `showUserNames` is true |
| `senderAvatar` | `string` | No | Avatar image URI; falls back to first letter of `senderName` |

A message can combine fields (e.g. text + image), but typically you use one primary content type per bubble.

```typescript
import type { Message } from 'movius-chats/lib/typescript/types';

const example: Message = {
  id: '1',
  senderId: 'user-2',
  senderName: 'Alex',
  senderAvatar: 'https://example.com/avatar.jpg',
  text: 'Check this out https://example.com',
  time: '10:42 AM',
  status: 'read',
};
```

---

## Message list ordering

`ChatScreen` uses an **inverted** `FlatList`. Put the **newest message at index `0`** of the `messages` array:

```typescript
setMessages((prev) => [newMessage, ...prev]); // ✅ correct
```

Older messages sit at higher indices and appear higher on screen.

**Grouping:** consecutive messages from the same sender share bubble styling; avatars and bubble tails show on the first message of a sequence (`isFirstInSequence`).

---

## ChatScreen API

`ChatScreen` is the **default export** from `movius-chats`. It wraps your chat in `AudioProvider` + `ChatProvider` and renders the message list, typing indicator, input (or custom input), and full-screen media viewer.

### Core props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `messages` | `Message[]` | Yes | Messages to render (newest first) |
| `currentUserId` | `string` | Yes | Logged-in user id; used for bubble alignment & status |
| `onSendMessage` | `(msg: Omit<Message, 'id' \| 'time' \| 'status'>) => void` | Yes | Fired when user taps send with text and/or `previewData` |
| `onMessageLongPress` | `(message: Message) => void` | No | Long-press on a bubble (reply, delete, etc.) |
| `placeholder` | `string` | No | Input placeholder (default: `"Message"`) |
| `keyboardVerticalOffset` | `number` | No | Subtract from keyboard height (header + tab bar + safe area). Default: `0` |
| `disableKeyboardAvoiding` | `boolean` | No | Set `true` if your screen already handles the keyboard |

### Feature flags

All flags below default to **falsy** (hidden) unless you pass `true`:

| Prop | Description |
|------|-------------|
| `showAvatars` | Avatar (or initial) on received messages & typing row |
| `showUserNames` | Sender name above received bubbles |
| `showBubbleTail` | WhatsApp-style tail on first bubble in a sequence |
| `showMessageStatus` | Timestamp + checkmarks for sent messages |
| `showEmojiButton` | Emoji button in input (UI only; wire your own picker) |
| `showAttachmentsButton` | Paperclip → calls `onAttachmentPress` |
| `showCameraButton` | Camera icon when input is empty → `onCameraPress` |
| `showVoiceRecordButton` | Mic when input empty; send when text present |

### Input & typing

| Prop | Type | Description |
|------|------|-------------|
| `onTypingStart` | `() => void` | Called when input has non-empty text |
| `onTypingEnd` | `() => void` | Called when input is cleared |
| `onAttachmentPress` | `() => void` | User tapped attachment — open document picker, etc. |
| `onCameraPress` | `() => void` | User tapped camera — open camera / image picker |
| `onAudioRecordStart` | `() => void` | Mic press / long-press start |
| `onAudioRecordEnd` | `() => void` | Mic release — upload recorded audio and append to messages |
| `typingUsers` | `Array<{ id: string; avatar: string; name: string }>` | Users currently typing (excludes `currentUserId` in UI) |

**Note:** Built-in `onSendMessage` from the default input only includes `{ text, senderId }`. Recording, camera, and file picking are **intentionally delegated** to your app via the callbacks above.

### Attachment preview

Show a file/image/video preview above the input before sending:

| Prop | Type | Description |
|------|------|-------------|
| `previewData` | `{ uri: string; type: string; name: string }` | MIME type in `type` (e.g. `image/jpeg`, `video/mp4`, `application/pdf`) |
| `closePreview` | `() => void` | Clear preview when user taps X |

When `previewData` is set, send is enabled even if text is empty. Your `onSendMessage` handler should read `previewData` from closure/state and attach `image`, `video`, or file metadata to the outgoing message.

### Theming

Pass a `theme` object to customize colors, typography, and styles. All keys are optional.

```typescript
theme?: {
  fontFamily?: string;

  colors?: {
    sentMessageTailColor?: string;
    receivedMessageTailColor?: string;
    timestamp?: string;
    inputsIconsColor?: string;
    sendIconsColor?: string;
    placeholderTextColor?: string;
    inputTextColor?: string;
    audioPlayIconColor?: string;
    audioPauseIconColor?: string;
    videoPlayIconColor?: string;
    sentIconColor?: string;
    deliveredIconColor?: string;
    readIconColor?: string;
  };

    sizes?: {
      /** Twrnc classes (`"h-8 w-8"`) or pixels (`28`) for input-bar icons */
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
  };

  messageStyle?: {
    sentTextStyle?: TextStyle;
    receivedTextStyle?: TextStyle;
    audioPlayButtonStyle?: ViewStyle;
    audioKnobStyle?: ViewStyle;
    progressBarStyle?: ViewStyle;
    activeProgressBarStyle?: ViewStyle;
    audioDurationStyle?: TextStyle;
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
}
```

Default bubble colors (before `theme` overrides): sent ≈ green (`bg-green-500`), received ≈ white.

#### Custom font (`theme.fontFamily`)

`fontFamily` applies to **all text** in the package (messages, timestamps, typing label, input, file names, errors).

**You must load the font in your app first** — the library only sets the `fontFamily` style name.

**Expo:**

```tsx
import { useFonts } from 'expo-font';

export default function App() {
  const [loaded] = useFonts({
  InterRegular: require('./assets/fonts/Inter-Regular.ttf'),
  });

  if (!loaded) return null;

  return (
    <ChatScreen
      theme={{ fontFamily: 'InterRegular' }}
      // ...
    />
  );
}
```

**React Native CLI:** follow [react-native custom fonts](https://reactnative.dev/docs/custom-fonts) and use the exact font family name registered on each platform.

#### Input icon size (`theme.sizes.inputIconSize`)

Use either **pixels** (recommended) or **twrnc classes**:

```tsx
<ChatScreen
  theme={{
    sizes: {
      inputIconSize: 28,        // 28×28 px — attachment, camera, emoji, send, mic
      // inputIconSize: 'h-8 w-8', // alternative: tailwind classes via twrnc
    },
  }}
/>
```

#### Keyboard avoiding

The package lifts the chat when the keyboard opens (keyboard listeners + `KeyboardAvoidingView` on iOS).

1. Wrap `ChatScreen` in a parent with `flex: 1` (e.g. `SafeAreaView style={{ flex: 1 }}`).
2. Set `keyboardVerticalOffset` to your header + top inset (try `60`–`100` on iOS with a stack header):

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();

<ChatScreen
  keyboardVerticalOffset={insets.top + 44}
  // ...
/>
```

3. **Android (Expo):** in `app.json`:

```json
"android": {
  "softwareKeyboardLayoutMode": "resize"
}
```

4. If your navigator already uses `KeyboardAvoidingView`, pass `disableKeyboardAvoiding` to avoid double offset.

### Custom components & icons

| Prop | Type | Description |
|------|------|-------------|
| `renderCustomInput` | `() => React.ReactNode` | Replace entire input bar |
| `renderCustomTyping` | `() => React.ReactNode` | Replace typing bubble content |
| `renderCustomVideoBubbleError` | `() => React.ReactNode` | Replace inline video error UI |
| `CustomEmojiIcon` | `() => React.ReactNode` | Emoji button |
| `CustomAttachmentIcon` | `() => React.ReactNode` | Attachment button |
| `CustomCameraIcon` | `() => React.ReactNode` | Camera button |
| `CustomSendIcon` | `() => React.ReactNode` | Send button |
| `CustomMicrophoneIcon` | `() => React.ReactNode` | Microphone button |
| `CustomPlayIcon` | `() => React.ReactNode` | Play icon in video/audio bubbles |
| `CustomPauseIcon` | `() => React.ReactNode` | Pause icon in audio player |
| `CustomFileIcon` | `React.ComponentType<{ style?: any }>` | Generic file preview icon |
| `CustomImagePreview` | `React.ComponentType<{ uri: string }>` | Image attachment preview |
| `CustomVideoPreview` | `React.ComponentType<{ uri: string }>` | Video attachment preview |

---

## Usage examples

### Text messages

```tsx
onSendMessage={({ text, senderId }) => {
  addMessage({ text, senderId, status: 'sent' });
}}
```

### Media messages

Add URIs when building the `Message` object (usually after upload):

```tsx
const imageMessage: Message = {
  id: '2',
  senderId: currentUserId,
  image: 'https://cdn.example.com/photo.jpg',
  time: '11:00 AM',
  status: 'delivered',
};

const audioMessage: Message = {
  id: '3',
  senderId: 'user-2',
  audio: 'file:///path/to/recording.m4a',
  time: '11:05 AM',
  status: 'read',
};
```

Tap image/video bubbles to open the built-in **MediaViewer** (pinch-zoom for images, native controls for video).

### Typing indicators

```tsx
const [typingUsers, setTypingUsers] = useState<
  { id: string; avatar: string; name: string }[]
>([]);

<ChatScreen
  typingUsers={typingUsers}
  onTypingStart={() => notifyServer('typing-start')}
  onTypingEnd={() => notifyServer('typing-end')}
  // ...
/>
```

When your socket receives “user X is typing”, push into `typingUsers`. The component shows up to two avatars plus a “+N” badge.

### Attachments & camera (parent-controlled)

```tsx
import { launchImageLibrary } from 'react-native-image-picker';

<ChatScreen
  showAttachmentsButton
  showCameraButton
  onAttachmentPress={async () => {
    const result = await launchImageLibrary({ mediaType: 'mixed' });
  }}
  onCameraPress={async () => {
    // open camera, then add message with image/video URI
  }}
  onAudioRecordStart={() => {
    // start native recorder
  }}
  onAudioRecordEnd={async () => {
    // stop recorder, upload, then:
    // addMessage({ audio: uploadedUrl, senderId: currentUserId, ... });
  }}
/>
```

### Attachment preview before send

```tsx
const [previewData, setPreviewData] = useState<{
  uri: string;
  type: string;
  name: string;
} | null>(null);

<ChatScreen
  previewData={previewData ?? undefined}
  closePreview={() => setPreviewData(null)}
  onAttachmentPress={async () => {
    const asset = await pickDocument();
    setPreviewData({
      uri: asset.uri,
      type: asset.type ?? 'application/octet-stream',
      name: asset.name ?? 'file',
    });
  }}
  onSendMessage={({ text, senderId }) => {
    const msg: Message = {
      id: String(Date.now()),
      senderId,
      text: text || undefined,
      image: previewData?.type.startsWith('image/')
        ? previewData.uri
        : undefined,
      video: previewData?.type.startsWith('video/')
        ? previewData.uri
        : undefined,
      time: formatTime(new Date()),
      status: 'sent',
    };
    setMessages((prev) => [msg, ...prev]);
    setPreviewData(null);
  }}
/>
```

### Custom theme

```tsx
<ChatScreen
  theme={{
    fontFamily: 'Inter-Regular',
    colors: {
      sentMessageTailColor: '#007AFF',
      receivedMessageTailColor: '#E9E9EB',
      timestamp: '#8E8E93',
      readIconColor: '#34C759',
      inputTextColor: '#000000',
    },
    bubbleStyle: {
      sent: { backgroundColor: '#007AFF' },
      received: { backgroundColor: '#E9E9EB' },
    },
    messageStyle: {
      sentTextStyle: { color: '#FFFFFF' },
      receivedTextStyle: { color: '#000000' },
    },
    inputStyles: {
      sendButtonStyle: { backgroundColor: '#007AFF' },
    },
  }}
  // ...
/>
```

### Custom input bar

```tsx
<ChatScreen
  renderCustomInput={() => <MyComposer />}
  // Still use messages / currentUserId / onSendMessage via your own state
/>
```

When using `renderCustomInput`, you are responsible for calling your send logic; the default `ChatInput` is not mounted.

### Long-press actions

```tsx
<ChatScreen
  onMessageLongPress={(message) => {
  }}
/>
```

---

## TypeScript

The main export is the default `ChatScreen` component. Types live in the build output:

```typescript
import ChatScreen from 'movius-chats';
import type {
  Message,
  ChatScreenProps,
} from 'movius-chats/lib/typescript/types';
```

`ChatScreenProps` is the full props interface for `ChatScreen`.

---

## Architecture overview

```
ChatScreen
├── AudioProvider          # one audio message plays at a time
├── ChatProvider           # props, theme, media viewer state
├── FlatList (inverted)    # ChatBubble per message
│   └── ListHeaderComponent → TypingIndicator
├── ChatInput (optional)   # text, icons, file preview
└── MediaViewer (Modal)    # full-screen image / video
```

Internal pieces (not exported from the package entry, but useful when reading source):

- **ChatBubble** — layout, tail, avatar, `MessageContent`, `MessageStatus`
- **MessageContent** — image, video thumbnail, `AudioPlayer`, parsed text
- **AudioPlayer** — `react-native-sound` + Reanimated scrubber
- **FilePreview** — pre-send attachment chip above input

---

## Troubleshooting

| Issue | What to try |
|-------|-------------|
| `Native module not found` | Rebuild iOS/Android after install; run `pod install` on iOS |
| Crashes in Expo Go | Use a development build; native modules are not in Expo Go |
| Audio silent on iOS | Set `AVAudioSession` category to playback (see installation) |
| Video/audio won’t load | Check URI scheme (`https://`, `file://`) and Android `INTERNET` permission |
| Reanimated worklet errors | Ensure `react-native-reanimated/plugin` is **last** in Babel config |
| Types not found | Import from `movius-chats/lib/typescript/types` |
| Messages appear in wrong order | Newest item must be `messages[0]` (inverted list) |
| Icons/buttons missing | Pass feature flags (`showEmojiButton`, etc.) — they default to off |

---

## Contributing

Issues and pull requests are welcome on [GitHub](https://github.com/David-Atueyi/Movius-Chats/issues).

---

## License

ISC — see [package.json](./package.json).
