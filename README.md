# movius-chats

A highly customizable, feature-rich chat UI for **React Native**. Drop in a single `ChatScreen` component to get message bubbles, WhatsApp-style media grids, audio/video playback, a full-screen swipe gallery, typing indicators, file attachment previews, and a smart input bar — with deep theming and custom component hooks.

**npm:** [`movius-chats`](https://www.npmjs.com/package/movius-chats)  
**Repository:** [github.com/David-Atueyi/Movius-Chats](https://github.com/David-Atueyi/Movius-Chats)

---

## Table of contents

- [Requirements & compatibility](#requirements--compatibility)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Data model](#data-model)
  - [Message](#message)
  - [MessageMediaItem](#messagemediaitem)
  - [MessageFileAttachment](#messagefileattachment)
  - [PreviewAttachment](#previewattachment)
- [Message list ordering](#message-list-ordering)
- [ChatScreen API](#chatscreen-api)
  - [Core props](#core-props)
  - [Feature flags](#feature-flags)
  - [Input & typing](#input--typing)
  - [Attachment preview (composer)](#attachment-preview-composer)
  - [Theme](#theme)
  - [Custom components & icons](#custom-components--icons)
- [Usage examples](#usage-examples)
  - [Basic text chat](#basic-text-chat)
  - [Multi-image / video album bubble](#multi-image--video-album-bubble)
  - [File attachment bubble](#file-attachment-bubble)
  - [Audio message bubble](#audio-message-bubble)
  - [Composer attachment preview (single or multiple)](#composer-attachment-preview-single-or-multiple)
  - [Send button vs microphone](#send-button-vs-microphone)
  - [Typing indicators](#typing-indicators)
  - [Custom theme](#custom-theme)
  - [Font family (all text)](#font-family-all-text)
  - [Keyboard avoiding](#keyboard-avoiding)
  - [Custom input bar](#custom-input-bar)
  - [Opening file attachments (expo-sharing)](#opening-file-attachments-expo-sharing)
  - [Long-press on a message](#long-press-on-a-message)
- [Full-screen gallery viewer](#full-screen-gallery-viewer)
- [Architecture overview](#architecture-overview)
- [TypeScript types](#typescript-types)
- [Troubleshooting](#troubleshooting)
- [Publishing a new version](#publishing-a-new-version)
- [License](#license)

---

## Requirements & compatibility

| Dependency | Role |
|------------|------|
| `react` ≥ 16.8 | Peer dependency |
| `react-native` | Peer dependency |
| `react-native-reanimated` | Audio scrubber animation (peer) |
| `react-native-sound` | Voice message playback |
| `react-native-svg` | Built-in icons |
| `react-native-video` | Video thumbnails + full-screen video |
| `react-native-parsed-text` | Tappable URLs in text messages |
| `twrnc` | Internal Tailwind-style utilities |

**Not compatible with Expo Go** — native modules require a development build or bare RN project.

---

## Installation

### 1. Install the package

```bash
npm install movius-chats
# or
yarn add movius-chats
# or
bun add movius-chats
```

### 2. Install peer / native dependencies

```bash
npm install react-native-reanimated react-native-sound react-native-svg react-native-video twrnc
```

### 3. Configure Reanimated

Add the Reanimated plugin **last** in `babel.config.js`:

```js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // other plugins
    'react-native-reanimated/plugin',
  ],
};
```

### 4. Rebuild native code

**React Native CLI:**

```bash
cd ios && pod install && cd ..
npx react-native run-ios
npx react-native run-android
```

**Expo development build:**

```bash
npx expo prebuild
npx expo run:ios   # or run:android
```

### 5. Android keyboard mode (Expo)

In `app.json` / `app.config.js` add:

```json
"android": {
  "softwareKeyboardLayoutMode": "resize"
}
```

---

## Quick start

```tsx
import React, { useState } from 'react';
import { Platform, SafeAreaView, View } from 'react-native';
import ChatScreen from 'movius-chats';
import type { Message } from 'movius-chats/lib/typescript/types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MyChatScreen() {
  const insets = useSafeAreaInsets();
  const currentUserId = 'user-1';
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
          keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 44 : 0}
          showAvatars
          showBubbleTail
          showMessageStatus
          showAttachmentsButton
          showCameraButton
          showVoiceRecordButton
        />
      </View>
    </SafeAreaView>
  );
}
```

---

## Data model

### Message

Every item in the `messages` array must match this shape:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique message id |
| `senderId` | `string` | Yes | User id of the sender |
| `time` | `string` | Yes | Display time string — you format this (e.g. `"2:30 PM"`) |
| `status` | `'sent' \| 'delivered' \| 'read'` | Yes | Shown only for current user's messages |
| `text` | `string` | No | Plain text; URLs auto-linked |
| `audio` | `string` | No | Audio file URI — renders a playable audio bubble |
| `image` | `string` | No | Single image URI (legacy; prefer `mediaItems`) |
| `video` | `string` | No | Single video URI (legacy; prefer `mediaItems`) |
| `mediaItems` | `MessageMediaItem[]` | No | Album of images/videos — renders a WhatsApp-style grid |
| `fileAttachments` | `MessageFileAttachment[]` | No | PDFs, docs, etc. — rendered as tappable file rows |
| `senderName` | `string` | No | Shown when `showUserNames` is true |
| `senderAvatar` | `string` | No | Avatar image URI; falls back to first letter of `senderName` |

A message can combine fields (e.g. `text` + `mediaItems`).

### MessageMediaItem

```ts
interface MessageMediaItem {
  uri: string;
  kind: 'image' | 'video';
}
```

Used in `message.mediaItems` for multi-media bubbles.

### MessageFileAttachment

```ts
interface MessageFileAttachment {
  uri: string;
  type: string; // MIME type, e.g. "application/pdf"
  name: string;
}
```

Each attachment is shown as a tappable chip that opens the file via `Linking.openURL`.

### PreviewAttachment

```ts
interface PreviewAttachment {
  uri: string;
  type: string; // MIME type
  name?: string;
}
```

Used in `previewData` / `previewItems` for the composer preview strip above the input.

---

## Message list ordering

`ChatScreen` uses an **inverted** `FlatList`. The **newest message must be at index `0`**:

```ts
setMessages((prev) => [newMessage, ...prev]); // correct
```

Consecutive messages from the same sender are grouped — avatars and tails appear only on the first message in each group.

---

## ChatScreen API

`ChatScreen` is the **default export** from `movius-chats`.

### Core props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `messages` | `Message[]` | Yes | Message array, newest first |
| `currentUserId` | `string` | Yes | Logged-in user id — controls bubble alignment and status icons |
| `onSendMessage` | `(msg: Omit<Message, 'id' \| 'time' \| 'status'>) => void` | Yes | Called when the user taps send |
| `onMessageLongPress` | `(message: Message) => void` | No | Called on long-press of a bubble |
| `placeholder` | `string` | No | Input placeholder text (default: `"Message"`) |
| `keyboardVerticalOffset` | `number` | No | **iOS only** — header + status bar height offset for `KeyboardAvoidingView`. Android lifts the input by the full keyboard height automatically. Default: `0` |
| `disableKeyboardAvoiding` | `boolean` | No | Set `true` if your screen already handles keyboard avoidance |

### Feature flags

All default to `false` (hidden) unless explicitly set to `true`:

| Prop | Description |
|------|-------------|
| `showAvatars` | Avatar (or initial letter) on received bubbles and typing row |
| `showUserNames` | Sender name above received bubbles |
| `showBubbleTail` | WhatsApp-style corner tail on first bubble in a sequence |
| `showMessageStatus` | Timestamp + checkmark icons on sent messages |
| `showEmojiButton` | Emoji button in the input bar (UI only — wire your own picker via `CustomEmojiIcon`) |
| `showAttachmentsButton` | Paperclip icon — triggers `onAttachmentPress` |
| `showCameraButton` | Camera icon when input is empty — triggers `onCameraPress` |
| `showVoiceRecordButton` | Mic icon when there is no text and no preview; becomes send icon otherwise |

### Input & typing

| Prop | Type | Description |
|------|------|-------------|
| `onTypingStart` | `() => void` | Called when the text input becomes non-empty |
| `onTypingEnd` | `() => void` | Called when the text input is cleared |
| `onAttachmentPress` | `() => void` | Paperclip tapped — open your file/image picker |
| `onCameraPress` | `() => void` | Camera icon tapped — open camera |
| `onAudioRecordStart` | `() => void` | Mic pressed / long-pressed — start recording |
| `onAudioRecordEnd` | `() => void` | Mic released — stop recording, upload, add message |
| `onFileAttachmentPress` | `(file: MessageFileAttachment) => void` | Tapped a file-attachment chip in a bubble. Defaults to `Linking.openURL`. Supply this to use `expo-sharing` or a custom downloader. |
| `typingUsers` | `{ id: string; avatar: string; name: string }[]` | Users currently typing (current user is excluded from display) |

### Attachment preview (composer)

Show a preview strip above the input before the user taps send.

| Prop | Type | Description |
|------|------|-------------|
| `previewItems` | `PreviewAttachment[]` | **Multiple** attachments — images/videos shown as a fanned spread; documents shown as file chips |
| `previewData` | `PreviewAttachment` | **Single** attachment (kept for backward compatibility; `previewItems` takes precedence) |
| `closePreview` | `() => void` | Fallback called when no `onRemovePreviewItem` is provided |
| `onRemovePreviewItem` | `(uri: string) => void` | Called with the URI of whichever card the user tapped × on — removes only that item |

**Per-item removal:** Every media thumbnail and every document chip shows its own × button. When `onRemovePreviewItem` is provided, tapping × on a card calls it with that card's URI so you can filter it out of your state. `closePreview` is only used as a fallback when `onRemovePreviewItem` is not supplied.

When any preview is present, the send button appears regardless of text content.

### Theme

All keys are optional. Pass a `theme` object to `ChatScreen`:

```ts
theme?: {
  fontFamily?: string;    // applied to every Text element in the package

  colors?: {
    sentMessageTailColor?: string;
    receivedMessageTailColor?: string;
    timestamp?: string;
    inputsIconsColor?: string;    // emoji, clip, camera icons
    sendIconsColor?: string;      // send / mic icons
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
    // Applies only to emoji, paperclip, and camera icons (not send/mic)
    inputIconSize?: string | number;  // number = px, string = twrnc class e.g. "h-8 w-8"
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
    inputSectionContainerStyle?: ViewStyle;   // outer row (input + send button)
    inputContainerStyle?: ViewStyle;          // the pill/rounded box
    sendButtonStyle?: ViewStyle;              // the round send/mic button
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

### Custom components & icons

| Prop | Type | Description |
|------|------|-------------|
| `renderCustomInput` | `() => React.ReactNode` | Replace the entire input bar |
| `renderCustomTyping` | `() => React.ReactNode` | Replace the typing bubble content |
| `renderCustomVideoBubbleError` | `() => React.ReactNode` | Replace the inline video error state |
| `CustomEmojiIcon` | `() => React.ReactNode` | Emoji button icon |
| `CustomAttachmentIcon` | `() => React.ReactNode` | Paperclip icon |
| `CustomCameraIcon` | `() => React.ReactNode` | Camera icon |
| `CustomSendIcon` | `() => React.ReactNode` | Send button icon |
| `CustomMicrophoneIcon` | `() => React.ReactNode` | Microphone icon |
| `CustomPlayIcon` | `() => React.ReactNode` | Play icon in audio and video |
| `CustomPauseIcon` | `() => React.ReactNode` | Pause icon in audio player |
| `CustomFileIcon` | `React.ComponentType<{ style?: any }>` | Icon inside document file chips |
| `CustomImagePreview` | `React.ComponentType<{ uri: string }>` | Replaces the composer image thumbnail |
| `CustomVideoPreview` | `React.ComponentType<{ uri: string }>` | Replaces the composer video thumbnail |

---

## Usage examples

### Basic text chat

```tsx
<ChatScreen
  messages={messages}
  currentUserId="user-1"
  onSendMessage={({ text, senderId }) => {
    setMessages((prev) => [
      {
        id: String(Date.now()),
        text,
        senderId,
        time: '10:00 AM',
        status: 'sent',
      },
      ...prev,
    ]);
  }}
/>
```

### Multi-image / video album bubble

Use `mediaItems` in the `Message` object. The bubble renders a WhatsApp-style grid:

| Count | Layout | Height |
|-------|--------|--------|
| 1 | Single full-width tile (cover) | 320 px |
| 2 | Side by side, two equal columns | 320 px |
| 3 | One on top (55%), two below (45%) | 320 px |
| 4+ | 2 × 2 grid; bottom-right cell shows `+N` overlay | 320 px |

All layouts share the same fixed height so multi-image bubbles stay visually consistent with single-image bubbles. Tapping any cell opens the full-screen swipe gallery.

```tsx
const message: Message = {
  id: '1',
  senderId: 'user-2',
  time: '11:00 AM',
  status: 'read',
  mediaItems: [
    { uri: 'https://example.com/photo1.jpg', kind: 'image' },
    { uri: 'https://example.com/photo2.jpg', kind: 'image' },
    { uri: 'https://example.com/clip.mp4',   kind: 'video' },
  ],
};
```

Legacy single-item syntax still works and is merged automatically:

```tsx
// These are equivalent for display purposes
{ image: 'https://...' }
{ mediaItems: [{ uri: 'https://...', kind: 'image' }] }
```

### File attachment bubble

```tsx
const message: Message = {
  id: '2',
  senderId: 'user-1',
  time: '11:05 AM',
  status: 'delivered',
  fileAttachments: [
    {
      uri: 'https://example.com/report.pdf',
      type: 'application/pdf',
      name: 'Q2 Report.pdf',
    },
  ],
  text: 'Here is the report',
};
```

Each attachment renders as a tappable row. By default tapping calls `Linking.openURL(uri)`. Supply `onFileAttachmentPress` to override this with your own handler (e.g. `expo-sharing`).

### Audio message bubble

```tsx
const message: Message = {
  id: '3',
  senderId: 'user-2',
  audio: 'file:///path/to/recording.m4a',
  time: '11:10 AM',
  status: 'read',
};
```

The audio player has a scrubable progress bar, a play/pause button, and a duration counter.  
Only one audio message plays at a time — starting a new one automatically stops the previous one.

### Composer attachment preview (single or multiple)

Use `previewItems` (array) for multi-select, or `previewData` (single) for back-compat:

```tsx
const [previews, setPreviews] = useState<PreviewAttachment[]>([]);

<ChatScreen
  previewItems={previews}
  closePreview={() => setPreviews([])}
  // Remove only the card whose × was tapped:
  onRemovePreviewItem={(uri) =>
    setPreviews((prev) => prev.filter((p) => p.uri !== uri))
  }
  onAttachmentPress={async () => {
    const picked = await myPicker.pick(); // returns an array
    setPreviews(
      picked.map((f) => ({ uri: f.uri, type: f.type, name: f.name }))
    );
  }}
  onSendMessage={({ text, senderId }) => {
    const media = previews
      .filter((p) => p.type.startsWith('image/') || p.type.startsWith('video/'))
      .map((p) => ({
        uri: p.uri,
        kind: p.type.startsWith('video/') ? 'video' : 'image',
      } as MessageMediaItem));

    const files = previews
      .filter((p) => !p.type.startsWith('image/') && !p.type.startsWith('video/'))
      .map((p) => ({ uri: p.uri, type: p.type, name: p.name ?? 'file' }));

    setMessages((prev) => [
      {
        id: String(Date.now()),
        senderId,
        time: '...',
        status: 'sent',
        text: text || undefined,
        mediaItems: media.length ? media : undefined,
        fileAttachments: files.length ? files : undefined,
      },
      ...prev,
    ]);

    setPreviews([]);
  }}
/>
```

Preview UI:
- **1 image/video** — single thumbnail with × in the top-right corner.
- **2–3 images/videos** — overlapping fan spread; each card has its own ×.
- **4+ images/videos** — fan of 3 with a `+N` badge; each visible card has its own ×.
- **Documents** — file chips, each with their own ×. If more than 3 documents are selected the list becomes scrollable.

Tapping × on any card calls `onRemovePreviewItem(uri)` for that specific file. When the last item is removed the preview strip disappears automatically.

### Send button vs microphone

The send button (green circle, right of input) shows:

| Condition | Icon shown |
|-----------|------------|
| Input has text | Send icon |
| `previewItems` / `previewData` is set | Send icon |
| Neither, `showVoiceRecordButton` true | Microphone icon |
| Neither, `showVoiceRecordButton` false | Send icon |

No extra work needed — the package handles this automatically.

### Typing indicators

```tsx
const [typingUsers, setTypingUsers] = useState([]);

// When your socket receives "user X is typing":
setTypingUsers([{ id: 'user-2', avatar: 'https://...', name: 'Alex' }]);

<ChatScreen
  typingUsers={typingUsers}
  onTypingStart={() => socket.emit('typing-start')}
  onTypingEnd={() => socket.emit('typing-end')}
/>
```

Up to two avatars are shown side-by-side; additional users appear as a `+N` badge.

### Custom theme

```tsx
<ChatScreen
  theme={{
    fontFamily: 'Outfit-Regular',
    colors: {
      sentMessageTailColor: '#007AFF',
      receivedMessageTailColor: '#E5E5EA',
      timestamp: '#8E8E93',
      inputsIconsColor: '#6C808E',
      sendIconsColor: '#FFFFFF',
      inputTextColor: '#000000',
      readIconColor: '#34C759',
    },
    bubbleStyle: {
      sent: { backgroundColor: '#007AFF' },
      received: { backgroundColor: '#E5E5EA' },
    },
    messageStyle: {
      sentTextStyle: { color: '#FFFFFF' },
      receivedTextStyle: { color: '#000000' },
    },
    inputStyles: {
      inputContainerStyle: { backgroundColor: '#F2F2F7' },
      sendButtonStyle: { backgroundColor: '#007AFF' },
    },
    sizes: {
      inputIconSize: 22,  // emoji, clip, camera only — not send/mic
    },
  }}
/>
```

### Font family (all text)

`theme.fontFamily` applies to **every** `Text` element inside the package: bubble text, timestamps, sender names, audio duration, typing label, file names, error messages, and the input field.

**You must load the font in your app before using it.** The package only sets the style name.

**Expo `expo-font` plugin approach:**

In `app.json`:

```json
"plugins": [
  ["expo-font", {
    "fonts": ["./assets/fonts/Outfit-Regular.ttf"]
  }]
]
```

Then pass the font name (usually the file name without `.ttf`):

```tsx
theme={{ fontFamily: 'Outfit-Regular' }}
```

**Expo `useFonts` hook approach (custom name):**

```tsx
import { useFonts } from 'expo-font';

const [loaded] = useFonts({
  'my-custom-font': require('./assets/fonts/MyFont.ttf'),
});

if (!loaded) return null;

return <ChatScreen theme={{ fontFamily: 'my-custom-font' }} />;
```

### Keyboard avoiding

The package lifts the input bar automatically when the keyboard opens:

- **Android** — full keyboard height via a keyboard listener, applied as `marginBottom` on the input row.
- **iOS** — `KeyboardAvoidingView` with `behavior="padding"` plus the same keyboard listener.

In your screen:

```tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const insets = useSafeAreaInsets();

<View style={{ flex: 1 }}>
  <ChatScreen
    keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top + 44 : 0}
    // ...
  />
</View>
```

If your screen or navigator already handles the keyboard (e.g. wraps in its own `KeyboardAvoidingView`), pass `disableKeyboardAvoiding`:

```tsx
<ChatScreen disableKeyboardAvoiding />
```

### Custom input bar

```tsx
<ChatScreen
  renderCustomInput={() => <MyOwnComposer onSend={handleSend} />}
/>
```

When `renderCustomInput` is provided the default `ChatInput` is not mounted. Preview props (`previewItems`, `closePreview`) are not wired automatically — handle them inside your custom component.

### Opening file attachments (expo-sharing)

By default tapping a file-attachment chip in a bubble calls `Linking.openURL`. For Expo apps that need to share or download local files, supply `onFileAttachmentPress`:

```bash
yarn add expo-sharing
```

```tsx
import * as Sharing from 'expo-sharing';
import { Linking } from 'react-native';
import type { MessageFileAttachment } from 'movius-chats/lib/typescript/types';

const handleFilePress = async (file: MessageFileAttachment) => {
  const uri =
    file.uri.startsWith('http') || file.uri.startsWith('file:')
      ? file.uri
      : `file://${file.uri}`;

  const available = await Sharing.isAvailableAsync();
  if (available) {
    await Sharing.shareAsync(uri, { dialogTitle: file.name });
  } else {
    Linking.openURL(uri);
  }
};

<ChatScreen
  onFileAttachmentPress={handleFilePress}
  // ...
/>
```

### Long-press on a message

```tsx
<ChatScreen
  onMessageLongPress={(message) => {
    // show action sheet: reply, copy, delete, etc.
    Alert.alert(message.id, message.text ?? '');
  }}
/>
```

---

## Full-screen gallery viewer

Tapping any image or video in a bubble opens a full-screen modal viewer:

- **Horizontal swipe** (`FlatList` paginated) moves between items in the same message.
- **Counter** `n / total` shown at the top when there are multiple items.
- **Images** fill the screen (`resizeMode: contain`).
- **Videos** use native controls (play, pause, seek, full-screen).
- **Close** with the × button in the top-right corner.

The viewer opens automatically — no extra code needed in your app.

---

## Architecture overview

```
ChatScreen
├── AudioProvider           one audio plays at a time (context)
├── ChatProvider            all props + gallery state (context)
│
├── FlatList (inverted)
│   └── ChatBubble          per message
│       ├── MediaGrid       WhatsApp-style 1/2/3/4+ image-video grid
│       ├── MessageContent  file chips, audio player, parsed text
│       └── MessageStatus   timestamp + sent/delivered/read icons
│
├── ChatInput (optional)
│   ├── TextInput           auto-grows, resets on clear or send
│   ├── EmojiFunnySquareIcon / PaperClipIcon / CameraIcon
│   │    (sized by theme.sizes.inputIconSize — not send/mic)
│   ├── PaperPlaneIcon / MicrophoneIcon (fixed size)
│   └── FilePreview         fan spread for images/videos, chips for docs
│
└── MediaViewer             full-screen horizontal pager (Modal)
    └── ViewerPage          Image (contain) or Video (native controls)
```

---

## TypeScript types

Import all types from the build output:

```ts
import ChatScreen from 'movius-chats';

import type {
  Message,
  MessageMediaItem,
  MessageFileAttachment,
  PreviewAttachment,
  ChatScreenProps,
} from 'movius-chats/lib/typescript/types';
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Native module not found` | Rebuild the app after install — run `pod install` (iOS) and rebuild Android |
| Crashes in Expo Go | Use a development build — this package uses native modules not in Expo Go |
| Audio silent on iOS | Add `[[AVAudioSession sharedInstance] setCategory:AVAudioSessionCategoryPlayback error:nil]` in your `AppDelegate` |
| Video/audio URL not loading | Check URI scheme (`https://`, `file://`) and `INTERNET` permission on Android |
| Reanimated worklet error | Move `'react-native-reanimated/plugin'` to the **last** position in Babel plugins |
| Font has no effect | Load the font in your app first (Expo: `expo-font` plugin or `useFonts`); use the exact registered name |
| Input icon size not changing | `inputIconSize` only affects emoji, clip, and camera — not the send or mic button |
| Input doesn't return to pill shape | Happens when text is deleted character by character. In the latest version the layout resets when the field empties and on send |
| Keyboard overlaps input (Android) | Add `"softwareKeyboardLayoutMode": "resize"` to `app.json`; wrap `ChatScreen` in `flex: 1` |
| Keyboard offset wrong (iOS) | Tune `keyboardVerticalOffset` — it should equal your header height + status bar height |
| Messages appear in wrong order | Newest message must be at `messages[0]` (inverted FlatList) |
| Feature buttons missing | Feature flags (`showAttachmentsButton`, etc.) default to `false` — pass `true` to show them |
| Gallery does not swipe | Ensure `mediaItems` is an array; single `image`/`video` strings open the viewer for that single item |
| File attachment tap does nothing | Default is `Linking.openURL`. For local files on iOS/Android use `onFileAttachmentPress` with `expo-sharing` |
| Tapping × removes all previews | Supply `onRemovePreviewItem` — without it the fallback `closePreview` clears everything |

---

## Publishing a new version

```bash
# 1. Bump version in package.json (follow semver)
npm version patch   # or minor / major

# 2. Build
yarn build          # runs rollup + tsc

# 3. Dry run to confirm what's included
npm pack --dry-run

# 4. Publish (use --otp if 2FA is on)
npm publish --access public --otp=YOUR_CODE

# 5. Tag the release
git push && git push --tags
```

After publishing, update the package in your consumer app:

```bash
npm install movius-chats@latest
```

If native dependencies changed, run `pod install` and rebuild the app.

---

## License

ISC — see [package.json](./package.json).
