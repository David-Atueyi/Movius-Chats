import React, { useCallback } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, View } from 'react-native';
import tw from 'twrnc';
import ChatBubble from './components/ChatBubble/ChatBubble';
import ChatInput from './components/ChatInput/ChatInput';
import {
  LongPressOverlay,
  tryCopyMessage,
} from './components/MessageActions';
import MediaViewer from './components/MediaViewer/MediaViewer';
import { TypingIndicator } from './components/TypingComponent/TypingIndicator';
import { CameraScreen } from './components/CameraScreen';
import { AudioProvider } from './context/AudioContext';
import { ChatProvider, useChatContext } from './context/ChatContext';
import { useKeyboardInset } from './hooks/useKeyboardInset';
import {
  ChatScreenProps,
  Message,
  MessageActionAnchor,
  MessageActionId,
} from './types';

const ChatScreenContent = () => {
  const {
    messages,
    currentUserId,
    onMessageLongPress,
    mediaViewerGallery,
    clearMediaViewerGallery,
    typingUsers,
    onSendMessage,
    onTypingStart,
    onTypingEnd,
    onAttachmentPress,
    onAudioRecordEnd,
    onAudioRecordStart,
    onCameraPress,
    renderCustomInput,
    CustomEmojiIcon,
    CustomAttachmentIcon,
    CustomCameraIcon,
    CustomMicrophoneIcon,
    CustomSendIcon,
    CustomFileIcon,
    CustomImagePreview,
    CustomVideoPreview,
    keyboardVerticalOffset = 0,
    disableKeyboardAvoiding = false,

    // ── Reply
    startReply,

    // ── Action popover
    actionSheetMessage,
    actionAnchor,
    openActionSheet,
    closeActionSheet,
    messageActionProps,
    messageActionUI,
    renderMessageActions,
    onCopyMessage,
    onDeleteMessage,
    onForwardMessage,

    // ── Edit flow
    startEdit,

    // ── Selection mode
    enterSelectionMode,

    // ── Camera
    cameraVisible,
    openCamera,
    closeCamera,
    enableBuiltInCamera,
    cameraProps,
    cameraUIProps,
    renderCameraScreen,
    onCameraCapture,
    theme,
  } = useChatContext();

  const keyboardInset = useKeyboardInset(!disableKeyboardAvoiding);

  // ── Long-press handler: capture anchor and open the popover ──────────────
  const handleLongPress = useCallback(
    (message: Message, anchor: MessageActionAnchor) => {
      if (onMessageLongPress) {
        onMessageLongPress(message);
        return;
      }
      openActionSheet(message, anchor);
    },
    [onMessageLongPress, openActionSheet]
  );

  // ── Default action handler ────────────────────────────────────────────────
  const handleAction = useCallback(
    (id: MessageActionId, message: Message) => {
      closeActionSheet();
      switch (id) {
        case 'reply':
          startReply(message);
          break;
        case 'copy':
          if (onCopyMessage) onCopyMessage(message);
          else tryCopyMessage(message);
          break;
        case 'edit':
          startEdit(message);
          break;
        case 'delete':
          onDeleteMessage?.(message);
          break;
        case 'forward':
          onForwardMessage?.(message);
          break;
        case 'select':
          enterSelectionMode(message);
          break;
      }
    },
    [
      closeActionSheet,
      startReply,
      onCopyMessage,
      onDeleteMessage,
      onForwardMessage,
      startEdit,
      enterSelectionMode,
    ]
  );

  // ── Camera button handler ─────────────────────────────────────────────────
  const handleCameraPress = useCallback(() => {
    if (onCameraPress) {
      onCameraPress();
      return;
    }
    if (enableBuiltInCamera) {
      openCamera();
    }
  }, [onCameraPress, enableBuiltInCamera, openCamera]);

  const inputSection = renderCustomInput ? (
    renderCustomInput()
  ) : (
    <ChatInput
      onSendMessage={onSendMessage}
      onTypingStart={onTypingStart}
      onTypingEnd={onTypingEnd}
      onAttachmentPress={onAttachmentPress}
      onAudioRecordEnd={onAudioRecordEnd}
      onAudioRecordStart={onAudioRecordStart}
      onCameraPress={handleCameraPress}
      CustomEmojiIcon={CustomEmojiIcon}
      CustomAttachmentIcon={CustomAttachmentIcon}
      CustomCameraIcon={CustomCameraIcon}
      CustomMicrophoneIcon={CustomMicrophoneIcon}
      CustomSendIcon={CustomSendIcon}
      CustomFileIcon={CustomFileIcon}
      CustomImagePreview={CustomImagePreview}
      CustomVideoPreview={CustomVideoPreview}
    />
  );

  const themePrimary = (theme?.inputStyles?.sendButtonStyle?.backgroundColor ??
    theme?.colors?.sentBubbleBackgroundColor ??
    undefined) as string | undefined;

  // ── Long-press overlay (scrim + lifted bubble + anchored menu) ───────────
  const actionSheetNode = (() => {
    if (!actionSheetMessage) return null;
    if (renderMessageActions) {
      return renderMessageActions(
        actionSheetMessage,
        closeActionSheet,
        actionAnchor ?? undefined
      );
    }
    return (
      <LongPressOverlay
        message={actionSheetMessage}
        anchor={actionAnchor}
        visible
        onClose={closeActionSheet}
        flags={messageActionProps}
        ui={messageActionUI}
        fontFamily={theme?.fontFamily}
        onAction={handleAction}
      />
    );
  })();

  const content = (
    <View style={tw`flex-1 px-2 pb-4 gap-2 relative`}>
      <FlatList
        style={tw`flex-1`}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ChatBubble
            message={item}
            isCurrentUser={item.senderId === currentUserId}
            onLongPress={(anchor) => handleLongPress(item, anchor)}
            isFirstInSequence={
              index === messages.length - 1 ||
              messages[index + 1]?.senderId !== item.senderId
            }
          />
        )}
        ListHeaderComponent={
          <TypingIndicator
            typingUsers={typingUsers || []}
            currentUserId={currentUserId}
          />
        }
        showsVerticalScrollIndicator={false}
        inverted
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      />

      <View
        style={
          !disableKeyboardAvoiding && keyboardInset > 0
            ? { marginBottom: keyboardInset }
            : undefined
        }
      >
        {inputSection}
      </View>

      <MediaViewer
        gallery={mediaViewerGallery}
        onClose={clearMediaViewerGallery}
      />

      {actionSheetNode}

      {enableBuiltInCamera && (
        <CameraScreen
          visible={cameraVisible}
          onClose={closeCamera}
          onCapture={(media) => {
            closeCamera();
            onCameraCapture?.(media);
          }}
          cameraProps={cameraProps}
          cameraUIProps={cameraUIProps}
          renderCameraScreen={renderCameraScreen}
          themePrimary={themePrimary}
          fontFamily={theme?.fontFamily}
        />
      )}
    </View>
  );

  if (disableKeyboardAvoiding) {
    return <View style={tw`flex-1`}>{content}</View>;
  }

  if (Platform.OS === 'android') {
    return <View style={tw`flex-1`}>{content}</View>;
  }

  return (
    <KeyboardAvoidingView
      style={tw`flex-1`}
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {content}
    </KeyboardAvoidingView>
  );
};

const ChatScreen: React.FC<ChatScreenProps> = (props) => {
  return (
    <AudioProvider>
      <ChatProvider {...props}>
        <ChatScreenContent />
      </ChatProvider>
    </AudioProvider>
  );
};

export {
  VoiceRecorder,
  type VoiceRecorderProps,
} from './components/VoiceRecorder/VoiceRecorder';

export {
  VoiceRecordingGesture,
  type VoiceRecordingGestureProps,
} from './components/VoiceRecorder/VoiceRecordingGesture';

export {
  VoiceRecorderFlow,
  type VoiceRecorderFlowProps,
  type VoiceRecorderFlowAudio,
  type RecordingState,
} from './components/VoiceRecorder/VoiceRecorderFlow';

export { CameraScreen } from './components/CameraScreen';
export type { CameraScreenProps } from './components/CameraScreen';

export {
  LongPressOverlay,
  MessageActionsPopover,
  MessageActionsSheet,
  tryCopyMessage,
} from './components/MessageActions';

export {
  InlineReply,
  ReplyPreview,
  SwipeableMessage,
} from './components/Reply';

// Chat + voice recorder configuration types (public API)
export type {
  CameraCaptureResult,
  CameraConfig,
  CameraExposedState,
  CameraUIProps,
  ChatScreenProps,
  Message,
  MessageActionAnchor,
  MessageActionFlags,
  MessageActionId,
  MessageActionUIProps,
  MessageFileAttachment,
  MessageMediaItem,
  MessageReply,
  PreviewAttachment,
  RecordingResult,
  RecordingUIProps,
  ReplyConfig,
  ReplyStyleOverrides,
  SelectionUIProps,
  VoiceRecorderConfig,
  VoiceRecorderExposedState,
  VoiceRecorderStyleOverrides,
} from './types';

export default ChatScreen;
