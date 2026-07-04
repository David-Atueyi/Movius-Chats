import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  View,
  ViewToken,
} from 'react-native';
import tw from 'twrnc';
import ChatBubble from './components/ChatBubble/ChatBubble';
import ChatInput from './components/ChatInput/ChatInput';
import DateSeparator from './components/DateSeparator/DateSeparator';
import MediaViewer from './components/MediaViewer/MediaViewer';
import { LongPressOverlay, tryCopyMessage } from './components/MessageActions';
import { TypingIndicator } from './components/TypingComponent/TypingIndicator';
import { AudioProvider } from './context/AudioContext';
import { ChatProvider, useChatContext } from './context/ChatContext';
import { useKeyboardInset } from './hooks/useKeyboardInset';
import {
  ChatScreenProps,
  Message,
  MessageActionAnchor,
  MessageActionId,
} from './types';
import {
  buildChatListItems,
  getDefaultDateSeparatorLocale,
  isFirstMessageInSequence,
  resolveStickyDateLabel,
} from './utils/dateSeparator';
import {
  mergeMessageActionIcons,
  mergeMessageActionLabels,
  mergeMessageActionUI,
} from './utils/messageActions';

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
    onEndReached,
    onEndReachedThreshold = 0.5,
    isLoadingMoreMessages = false,
    renderLoadingMoreIndicator,
    loadingMoreIndicatorContainerStyle,
    loadingMoreIndicatorText,
    loadingMoreIndicatorTextStyle,
    loadingMoreIndicatorColor,
    loadingMoreIndicatorSize = 'small',

    showDateSeparators = true,
    showStickyDateHeader = true,
    formatDateSeparatorLabel,
    weekdayLabelMaxDays = 6,
    dateSeparatorLocale,
    renderDateSeparator,
    renderStickyDateHeader,
    stickyHeaderVisibilityThreshold = 20,

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

  const resolvedLocale = dateSeparatorLocale ?? getDefaultDateSeparatorLocale();

  const dateLabelOptions = useMemo(
    () => ({
      locale: resolvedLocale,
      weekdayLabelMaxDays,
      formatDateSeparatorLabel,
    }),
    [resolvedLocale, weekdayLabelMaxDays, formatDateSeparatorLabel]
  );

  const listItems = useMemo(
    () =>
      buildChatListItems(messages, {
        showDateSeparators,
        ...dateLabelOptions,
      }),
    [messages, showDateSeparators, dateLabelOptions]
  );

  const listItemsRef = useRef(listItems);
  listItemsRef.current = listItems;

  const dateLabelOptionsRef = useRef(dateLabelOptions);
  dateLabelOptionsRef.current = dateLabelOptions;

  const stickyLabelRef = useRef<string | null>(null);
  const [stickyLabel, setStickyLabel] = useState<string | null>(null);

  const showDateSeparatorsRef = useRef(showDateSeparators);
  showDateSeparatorsRef.current = showDateSeparators;
  const showStickyDateHeaderRef = useRef(showStickyDateHeader);
  showStickyDateHeaderRef.current = showStickyDateHeader;

  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: stickyHeaderVisibilityThreshold,
    }),
    [stickyHeaderVisibilityThreshold]
  );

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (!showDateSeparatorsRef.current || !showStickyDateHeaderRef.current) {
        return;
      }

      const label = resolveStickyDateLabel(
        viewableItems.map((token) => ({
          index: token.index,
          item: token.item,
          isViewable: token.isViewable,
        })),
        listItemsRef.current,
        dateLabelOptionsRef.current
      );

      if (label !== stickyLabelRef.current) {
        stickyLabelRef.current = label;
        setStickyLabel(label);
      }
    }
  ).current;

  useEffect(() => {
    if (!showDateSeparators || !showStickyDateHeader) {
      stickyLabelRef.current = null;
      setStickyLabel(null);
    }
  }, [showDateSeparators, showStickyDateHeader]);

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

  const loadingMoreIndicatorNode = renderLoadingMoreIndicator ? (
    renderLoadingMoreIndicator()
  ) : isLoadingMoreMessages ? (
    <View
      style={[
        tw`items-center justify-center py-3`,
        loadingMoreIndicatorContainerStyle,
      ]}
    >
      <ActivityIndicator
        size={loadingMoreIndicatorSize}
        color={loadingMoreIndicatorColor}
      />
      {loadingMoreIndicatorText ? (
        <Text style={[tw`mt-2 text-xs`, loadingMoreIndicatorTextStyle]}>
          {loadingMoreIndicatorText}
        </Text>
      ) : null}
    </View>
  ) : null;

  const content = (
    <View style={tw`flex-1 px-2 pb-4 gap-2 relative`}>
      <FlatList
        style={tw`flex-1`}
        data={listItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          if (item.type === 'dateSeparator') {
            return (
              <DateSeparator
                label={item.label}
                variant="inline"
                theme={theme?.dateSeparator}
                fontFamily={theme?.fontFamily}
                renderCustom={renderDateSeparator}
              />
            );
          }

          return (
            <ChatBubble
              message={item.message}
              isCurrentUser={item.message.senderId === currentUserId}
              onLongPress={(anchor) => handleLongPress(item.message, anchor)}
              isFirstInSequence={isFirstMessageInSequence(listItems, index)}
            />
          );
        }}
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
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        ListFooterComponent={
          loadingMoreIndicatorNode ? <>{loadingMoreIndicatorNode}</> : null
        }
      />

      {showDateSeparators && showStickyDateHeader && stickyLabel ? (
        <View
          pointerEvents="none"
          style={[
            tw`absolute left-0 right-0 items-center z-10`,
            {
              top: theme?.dateSeparator?.stickyTopOffset ?? 8,
            },
          ]}
        >
          <DateSeparator
            label={stickyLabel}
            variant="sticky"
            theme={theme?.dateSeparator}
            fontFamily={theme?.fontFamily}
            renderCustom={renderStickyDateHeader ?? renderDateSeparator}
          />
        </View>
      ) : null}

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
  type RecordingState,
  type VoiceRecorderFlowAudio,
  type VoiceRecorderFlowProps,
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
  DateSeparatorTheme,
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

export type { ChatListItem } from './utils/dateSeparator';

export {
  buildChatListItems,
  diffCalendarDays,
  formatDateSeparatorLabel,
  getDayKey,
  getDefaultDateSeparatorLocale,
  parseMessageDate,
  truncateToLocalMidnight,
} from './utils/dateSeparator';

export default ChatScreen;
