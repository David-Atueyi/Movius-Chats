import React, { useCallback, useMemo } from 'react';
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
import { AudioProvider } from './context/AudioContext';
import { ChatProvider, useChatContext } from './context/ChatContext';
import { useKeyboardInset } from './hooks/useKeyboardInset';
import {
  mergeMessageActionIcons,
  mergeMessageActionLabels,
  mergeMessageActionUI,
} from './utils/messageActions';
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

    startReply,

    actionSheetMessage,
    actionAnchor,
    openActionSheet,
    closeActionSheet,
    messageActionProps,
    messageActionUI,
    messageActionLabels,
    messageActionIcons,
    renderMessageActions,
    onCopyMessage,
    onDeleteMessage,
    onForwardMessage,

    startEdit,
    enterSelectionMode,

    theme,
  } = useChatContext();

  const keyboardInset = useKeyboardInset(!disableKeyboardAvoiding);

  const mergedMessageActionUI = useMemo(
    () => mergeMessageActionUI(theme, messageActionUI),
    [theme, messageActionUI]
  );
  const mergedMessageActionLabels = useMemo(
    () => mergeMessageActionLabels(theme, messageActionLabels),
    [theme, messageActionLabels]
  );
  const mergedMessageActionIcons = useMemo(
    () => mergeMessageActionIcons(theme, messageActionIcons),
    [theme, messageActionIcons]
  );

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
      onCameraPress={onCameraPress}
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
        ui={mergedMessageActionUI}
        labels={mergedMessageActionLabels}
        icons={mergedMessageActionIcons}
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

export { SelectIcon } from './assets/Icons/SelectIcon';

export type {
  ChatScreenProps,
  Message,
  MessageActionAnchor,
  MessageActionFlags,
  MessageActionIconComponents,
  MessageActionId,
  MessageActionLabels,
  MessageActionUIProps,
  MessageFileAttachment,
  MessageMediaItem,
  MessageReply,
  PreviewAttachment,
  RecordingResult,
  RecordingUIProps,
  ReplyConfig,
  ReplyStyleOverrides,
  ReplyUIProps,
  SelectionUIProps,
  SwipeReplyUIProps,
  VoiceRecorderConfig,
  VoiceRecorderExposedState,
  VoiceRecorderStyleOverrides,
} from './types';

export default ChatScreen;
