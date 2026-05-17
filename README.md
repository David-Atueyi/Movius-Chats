# movius-chats

A customizable React Native chat UI library. One `ChatScreen` component: message bubbles, WhatsApp-style media grids, audio playback, voice recording, composer previews, typing indicators, and a full-screen media gallery — with per-side theming and replaceable UI pieces.

**npm:** [`movius-chats`](https://www.npmjs.com/package/movius-chats)  
**Repo:** [github.com/David-Atueyi/Movius-Chats](https://github.com/David-Atueyi/Movius-Chats)

This package is built for **plain React Native** (CLI / bare workflow). It does **not** depend on any Expo module.

---

## Table of contents

1. [What is included](#what-is-included)
2. [Package layout](#package-layout)
3. [Dependencies](#dependencies)
4. [Installation](#installation)
5. [Quick start](#quick-start)
6. [Message data model](#message-data-model)
7. [Message list order](#message-list-order)
8. [ChatScreen API](#chatscreen-api)
9. [Voice recording](#voice-recording)
10. [Audio message bubbles](#audio-message-bubbles)
11. [Media grids & gallery](#media-grids--gallery)
12. [Composer attachment preview](#composer-attachment-preview)
13. [Theme & styling](#theme--styling)
14. [Keyboard behavior](#keyboard-behavior)
15. [Custom components & icons](#custom-components--icons)
16. [TypeScript](#typescript)
17. [Troubleshooting](#troubleshooting)
18. [Publishing](#publishing)
19. [License](#license)

---

## What is included

| Feature | Implementation |
|---------|----------------|
| Text messages | `react-native-parsed-text` (URLs tappable) |
| Image / video albums | `MediaGrid` — 1 / 2 / 3 / 4+ layout, 320px height |
| Full-screen viewer | `MediaViewer` — swipe, counter, selective video autoplay |
| Audio messages | `react-native-video` (hidden player) + waveform UI |
| Playback speed | 1x → 1.5x → 2x while playing |
| Voice recording | `react-native-audio-record` (optional peer) |
| File attachments | Tappable rows; default `Linking.openURL` |
| Typing indicator | Up to 2 avatars + `+N` badge |
| Input bar | Growing text field, emoji / clip / camera / send / mic |
| Status icons | Sent / delivered / read checkmarks |
| Theming | Separate `sent*` / `received*` colors for most bubble parts |

---

## Package layout

```
src/
├── index.tsx                 # ChatScreen entry
├── types/index.ts            # Message, ChatScreenProps, recorder types
├── context/
│   ├── ChatContext.tsx       # Props + gallery state
│   └── AudioContext.tsx      # One audio plays at a time
├── hooks/
│   ├── useKeyboardInset.ts   # Keyboard height → input margin
│   └── useVoiceRecorder.ts   # Mic capture (audio-record + fs)
├── utils/
│   ├── bubbleTheme.ts        # sent/received color helpers
│   ├── messageMedia.ts       # collectMediaItems()
│   ├── theme.ts              # fontFamily, input icon size
│   └── datefunc.ts           # formatDuration()
├── assets/Icons/             # SVG icons (play, mic, tail, etc.)
└── components/
    ├── ChatBubble/           # Bubble, content, status, media grid
    ├── ChatInput/            # Input, FilePreview, voice gestures
    ├── AudioPlayer/          # WhatsApp-style audio UI
    ├── MediaViewer/          # Full-screen gallery modal
    ├── TypingComponent/
    └── VoiceRecorder/        # Normal + long-press recording UI
```

Published build output: `lib/commonjs`, `lib/module`, `lib/typescript`.

---

## Dependencies

### Bundled (installed with movius-chats)

| Package | Use |
|---------|-----|
| `react-native-video` | Video thumbnails, gallery video, **audio playback** |
| `react-native-svg` | Built-in icons |
| `react-native-parsed-text` | Link detection in text |
| `twrnc` | Internal styles |

### Peer dependencies (your app must install)

| Package | Required |
|---------|----------|
| `react` ≥ 16.8 | Yes |
| `react-native` | Yes |
| `react-native-reanimated` | Yes (voice recorder animations) |

### Optional peers (voice recording only)

| Package | Use |
|---------|-----|
| `react-native-audio-record` | Record microphone |
| `react-native-fs` | Delete cancelled recording files |

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

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique id |
| `senderId` | `string` | Who sent it |
| `time` | `string` | Display time (you format it) |
| `status` | `'sent' \| 'delivered' \| 'read'` | Checkmarks on **your** messages only |
| `text` | `string` | Body text |
| `audio` | `string` | Audio file URI |
| `image` | `string` | Single image (legacy; prefer `mediaItems`) |
| `video` | `string` | Single video (legacy) |
| `mediaItems` | `MessageMediaItem[]` | Album in one bubble |
| `fileAttachments` | `MessageFileAttachment[]` | PDF, doc, etc. |
| `senderName` | `string` | Group name + audio avatar initial |
| `senderAvatar` | `string` | Image URI for audio bubble avatar |

### `MessageMediaItem`

```ts
{ uri: string; kind: 'image' | 'video' }
```

### `MessageFileAttachment`

```ts
{ uri: string; type: string; name: string }
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

| Prop | Type | Description |
|------|------|-------------|
| `messages` | `Message[]` | Newest first |
| `currentUserId` | `string` | Sent vs received layout |
| `onSendMessage` | `(Omit<Message, 'id' \| 'time' \| 'status'>) => void` | Send button |
| `onMessageLongPress` | `(message: Message) => void` | Long-press bubble |
| `placeholder` | `string` | Input placeholder (default `"Message"`) |
| `keyboardVerticalOffset` | `number` | **iOS only** — passed to `KeyboardAvoidingView` |
| `disableKeyboardAvoiding` | `boolean` | Turn off built-in keyboard lift |

### Feature flags (default `false`)

`showAvatars`, `showUserNames`, `showBubbleTail`, `showMessageStatus`, `showEmojiButton`, `showAttachmentsButton`, `showCameraButton`, `showVoiceRecordButton`

### Callbacks

| Prop | Description |
|------|-------------|
| `onTypingStart` / `onTypingEnd` | Input text empty ↔ non-empty |
| `onAttachmentPress` | Paperclip — open your picker |
| `onCameraPress` | Camera icon |
| `onAudioRecordStart` | Recording began |
| `onAudioRecordEnd` | `(RecordingResult?) => void` when done or cancelled |
| `onFileAttachmentPress` | File chip in bubble (default: `Linking.openURL`) |

### Composer preview

| Prop | Description |
|------|-------------|
| `previewItems` | Multiple attachments before send |
| `previewData` | Single attachment (legacy) |
| `onRemovePreviewItem` | `(uri) => void` — remove **one** card by URI |
| `closePreview` | Clears all if `onRemovePreviewItem` not set |

When preview or text exists, the **send** icon shows instead of the mic.

### Voice recorder customization

| Prop | Type |
|------|------|
| `renderVoiceRecorder` | `(VoiceRecorderExposedState) => ReactNode` — replace entire recorder UI |
| `voiceRecorderProps` | `VoiceRecorderConfig` — `maxDuration`, lock, slide-to-cancel, etc. |
| `voiceRecorderStyles` | `VoiceRecorderStyleOverrides` |
| `recordingUIProps` | Colors/sizes for timer, lock pill, recorder play/pause |

### Typing

| Prop | Type |
|------|------|
| `typingUsers` | `{ id, avatar, name }[]` |

---

## Voice recording

Requires **`react-native-audio-record`** and **`react-native-fs`** in the host app, plus a **native rebuild**.

### Gestures

| Action | Result |
|--------|--------|
| **Tap** mic | Normal bar: trash, timer, waveform, play/pause preview, send |
| **Long-press** mic | Hold mode: “slide to cancel”, lock column above send |
| Slide **left** | Cancel (file deleted via `react-native-fs`) |
| Slide **up** to lock | Switches to normal bar (`lockSlideDistance` in `recordingUIProps`) |
| **Release** without slide | Auto-send (`onAudioRecordEnd`) |

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
        audio: result.uri,
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
renderVoiceRecorder={(state) => (
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

| Side | Layout (left → right) |
|------|------------------------|
| **Sent** | Avatar or speed pill → play/pause → waveform |
| **Received** | play/pause → waveform → avatar or speed pill |

| State | Avatar slot |
|-------|-------------|
| Idle / finished | `senderAvatar` or first letter of `senderName` |
| Playing | Pill showing **1x**, **1.5x**, or **2x** (tap to cycle) |
| Ended | Avatar again |

- Waveform bars with scrubber dot; tap or drag to seek  
- Duration under the waveform  
- Play/pause is icon-only (no filled circle)  
- Only one audio plays at a time (`AudioContext`)  
- Video in the gallery pauses other audio  

```tsx
{
  id: 'a1',
  senderId: '2',
  audio: 'file:///data/user/0/.../voice.wav',
  senderAvatar: 'https://cdn.example.com/u2.jpg',
  senderName: 'Alex',
  time: '10:23 pm',
  status: 'read',
}
```

---

## Media grids & gallery

### Grid (`mediaItems`)

| Count | Layout | Height |
|-------|--------|--------|
| 1 | Full width, cover | 320px |
| 2 | Two columns | 320px |
| 3 | One top, two bottom | 320px |
| 4+ | 2×2, `+N` on last cell | 320px |

Tap opens `MediaViewer`. Thumbnail `Video` uses `pointerEvents="none"` so presses reach the parent.

### Gallery behavior

- Horizontal `FlatList`, `n / total` header  
- **Videos** play only if that video was the tapped item and the page is active  
- Tapping an **image** in a mixed album does not start other videos  
- Composer video previews **do** autoplay in the small preview card  

### Legacy single fields

`image` and `video` on `Message` are merged into `mediaItems` internally via `collectMediaItems()`.

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
/>
```

| Preview type | UI |
|--------------|-----|
| 1 image/video | Single thumb + × |
| 2–3 media | Fanned stack, × on each |
| 4+ media | Fan of 3 + `+N`, × per visible card |
| Documents | Chips; scrollable after 3 |

Use any picker you want (`react-native-document-picker`, `react-native-image-picker`, etc.) — movius-chats only displays `previewItems`.

---

## Theme & styling

Pass `theme` to `ChatScreen`. `theme.fontFamily` applies to **all** `Text` in the package (load the font in your app first).

### `theme.colors` — per side (`sent*` / `received*`)

| Keys | Used for |
|------|----------|
| `sentTimestampColor` / `receivedTimestampColor` | Message & file timestamps |
| `sentMessageTextColor` / `receivedMessageTextColor` | Bubble text |
| `sentBubbleBackgroundColor` / `receivedBubbleBackgroundColor` | Bubble background |
| `sentMessageTailColor` / `receivedMessageTailColor` | Corner tail (`ArrowBack2RoundedIcon`) |
| `sentFileAttachmentBackground` / `receivedFileAttachmentBackground` | File chip |
| `sentFileAttachmentTextColor` / `receivedFileAttachmentTextColor` | File name |
| `sentFileAttachmentSubtitleColor` / `receivedFileAttachmentSubtitleColor` | MIME line |
| `sentAudioWaveformColor` / `receivedAudioWaveformColor` | Inactive waveform bars |
| `sentAudioWaveformActiveColor` / `receivedAudioWaveformActiveColor` | Active bars + scrubber |
| `sentAudioTimestampColor` / `receivedAudioTimestampColor` | Duration under waveform |
| `sentAudioPlayIconColor` / `receivedAudioPlayIconColor` | Play icon |
| `sentAudioPauseIconColor` / `receivedAudioPauseIconColor` | Pause icon |
| `sentAudioSpeedTextColor` / `receivedAudioSpeedTextColor` | **1x / 1.5x / 2x** pill text |
| `sentMediaTimestampBackground` / `receivedMediaTimestampBackground` | Timestamp pill on file-only bubbles |

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

| Platform | Behavior |
|----------|----------|
| **Android** | `useKeyboardInset` sets `marginBottom` on the input row (= keyboard height) |
| **iOS** | Same inset **plus** `KeyboardAvoidingView` with `behavior="padding"` and `keyboardVerticalOffset` |

If your navigator already avoids the keyboard:

```tsx
<ChatScreen disableKeyboardAvoiding />
```

---

## Custom components & icons

| Prop | Replaces |
|------|----------|
| `renderCustomInput` | Entire input + recorder (you handle preview yourself) |
| `renderCustomTyping` | “Typing…” content |
| `renderCustomVideoBubbleError` | Inline video error in grid |
| `renderVoiceRecorder` | Built-in recorder bars |
| `CustomEmojiIcon` | Emoji button |
| `CustomAttachmentIcon` | Paperclip |
| `CustomCameraIcon` | Camera |
| `CustomSendIcon` | Send |
| `CustomMicrophoneIcon` | Mic |
| `CustomPlayIcon` / `CustomPauseIcon` | Audio (and related) playback |
| `CustomFileIcon` | Document chip icon |
| `CustomImagePreview` / `CustomVideoPreview` | Composer thumbnails |

### File attachments without Expo

Default tap uses React Native `Linking.openURL`. For local files or share sheets, use your own module in the host app:

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

| Problem | What to do |
|---------|------------|
| `Cannot read property 'init' of null` | Install `react-native-audio-record`, run `pod install`, **rebuild** the app |
| Recording never starts | Mic permission; iOS `NSMicrophoneUsageDescription`; Android `RECORD_AUDIO` |
| No audio playback | Ensure `react-native-video` is linked; URI must be `file://` or `http(s)://` |
| `NoSuchMethodError` `DefaultLoadControl` (Android) | Force `androidx.media3` to **1.3.1** in the app `android/build.gradle` `resolutionStrategy` |
| Reanimated error | `react-native-reanimated/plugin` must be **last** in Babel plugins |
| Font not applied | Register font in the **host** app; pass exact `fontFamily` string |
| `inputIconSize` ignored on send/mic | By design |
| Keyboard covers input (Android) | `android:windowSoftInputMode="adjustResize"`; parent `flex: 1` |
| × clears all previews | Implement `onRemovePreviewItem` |
| Wrong audio avatar | Set `senderAvatar` and `senderName` on the `Message` |
| Messages upside down | Newest at `messages[0]` |

---


## License

ISC — see [package.json](./package.json).
