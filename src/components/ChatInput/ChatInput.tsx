import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Image,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import tw from 'twrnc';
import { CameraIcon } from '../../assets/Icons/CameraIcon';
import { ClosePreviewIcon } from '../../assets/Icons/ClosePreviewIcon';
import { EditIcon } from '../../assets/Icons/EditIcon';
import { EmojiFunnySquareIcon } from '../../assets/Icons/EmojiFunnySquareIcon';
import { MicrophoneIcon } from '../../assets/Icons/MicrophoneIcon';
import { PaperClipIcon } from '../../assets/Icons/PaperClipIcon';
import { PaperPlaneIcon } from '../../assets/Icons/PaperPlaneIcon';
import { useChatContext } from '../../context/ChatContext';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import { RecordingResult, VoiceRecorderExposedState } from '../../types';
import {
  getInputPreviewBackground,
  getRecordingPreviewBackground,
  mergeReplyUI,
  shouldShowReplyCloseButton,
} from '../../utils/replyTheme';
import {
  getInputBarIconPixelSize,
  getInputBarIconStyle,
  withFontFamily,
} from '../../utils/theme';
import type { VoiceRecorderFlowProps } from '../VoiceRecorder/VoiceRecorderFlow';
import { VoiceRecorderFlow } from '../VoiceRecorder/VoiceRecorderFlow';
import FilePreview from './FilePreview';
import { ChatInputProps, InputHeightState } from './types';

// Layout constants
const MIN_INPUT_HEIGHT = Platform.OS === 'ios' ? 32 : 30;
const MAX_INPUT_HEIGHT = 118;
const INPUT_BAR_SHELL_HEIGHT = Platform.OS === 'ios' ? 50 : 48;

const SEND_ICON_CLASS = 'h-6 w-6';
const MIC_ICON_CLASS = 'h-8 w-8';

const FALLBACK_PRIMARY = '#22c55e';

// Component
const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onTypingStart,
  onTypingEnd,
  onAttachmentPress,
  onCameraPress,
  onAudioRecordStart,
  onAudioRecordEnd,
  CustomEmojiIcon,
  CustomAttachmentIcon,
  CustomCameraIcon,
  CustomSendIcon,
  CustomMicrophoneIcon,
  CustomFileIcon,
  CustomImagePreview,
  CustomVideoPreview,
}) => {
  const [inputText, setInputText] = useState('');
  const [inputHeight, setInputHeight] = useState<InputHeightState>({
    height: MIN_INPUT_HEIGHT,
    isMultiline: false,
  });
  const inputRef = useRef<TextInput>(null);

  const {
    theme,
    currentUserId,
    showEmojiButton,
    showAttachmentsButton,
    showCameraButton,
    showVoiceRecordButton,
    placeholder,
    previewData,
    previewItems,
    closePreview,
    onRemovePreviewItem,
    CustomVoiceRecorder,
    // reply state
    replyTarget,
    cancelReply,
    replyProps,
    replyUI,
    replyStyle,
    renderReplyPreview,
    renderEditPreview,
    onReplyPress,
    CustomClosePreviewIcon,
    CustomEditPreviewIcon,
    // edit state
    editingMessage,
    cancelEdit,
    onEditMessage,
  } = useChatContext();

  const resolvedReplyUI = mergeReplyUI(theme, replyUI);
  const mergedReplyStyle = { ...theme?.reply?.styles, ...replyStyle };
  const inputPreviewBg = getInputPreviewBackground(theme, resolvedReplyUI);
  const recordingPreviewBg = getRecordingPreviewBackground(
    theme,
    resolvedReplyUI
  );
  const closePreviewColor =
    resolvedReplyUI.closeIconColor ??
    theme?.colors?.inputsIconsColor ??
    'rgba(0,0,0,0.5)';
  const previewTextColor =
    resolvedReplyUI.previewTextColor || 'rgba(0,0,0,0.55)';
  const thumbSize = resolvedReplyUI.thumbnailSize ?? 32;

  const lastEditingIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (editingMessage && editingMessage.id !== lastEditingIdRef.current) {
      lastEditingIdRef.current = editingMessage.id;
      setInputText(editingMessage.text ?? '');
      setInputHeight({ height: MIN_INPUT_HEIGHT, isMultiline: false });
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!editingMessage) {
      lastEditingIdRef.current = null;
    }
  }, [editingMessage]);

  // Preview list
  const previewList = useMemo(() => {
    if (previewItems?.length) return previewItems;
    if (previewData) return [previewData];
    return [];
  }, [previewItems, previewData]);

  const hasPreviewAttachments = previewList.length > 0;

  // Icon sizing
  const inputBarIconSize = theme?.sizes?.inputIconSize;
  const inputBarIconStyle = getInputBarIconStyle(inputBarIconSize);
  const iconPixelSize = getInputBarIconPixelSize(inputBarIconSize);

  const isCompactInput =
    inputText.trim().length === 0 && !inputHeight.isMultiline;

  const iconInset = Math.max(0, (INPUT_BAR_SHELL_HEIGHT - iconPixelSize) / 2);
  const iconSlotStyle = isCompactInput
    ? { paddingTop: iconInset, paddingBottom: iconInset }
    : { paddingBottom: iconInset };

  const isEditing = !!editingMessage;

  // Text input handlers
  const resetInputLayout = useCallback(() => {
    setInputHeight({ height: MIN_INPUT_HEIGHT, isMultiline: false });
  }, []);

  const handleChangeText = useCallback(
    (text: string) => {
      setInputText(text);
      if (text.length === 0) resetInputLayout();
    },
    [resetInputLayout]
  );

  const handleContentSizeChange = useCallback(
    (event: { nativeEvent: { contentSize: { height: number } } }) => {
      const newHeight = Math.min(
        Math.max(event.nativeEvent.contentSize.height, MIN_INPUT_HEIGHT),
        MAX_INPUT_HEIGHT
      );
      const isMultiline = newHeight > MIN_INPUT_HEIGHT;
      setInputHeight({
        height: isMultiline ? newHeight : MIN_INPUT_HEIGHT,
        isMultiline,
      });
    },
    []
  );

  const buildReplyTo = useCallback(() => {
    if (!replyTarget) return undefined;
    const firstMedia = replyTarget.mediaItems?.[0];
    const hasAudioMedia = (replyTarget.mediaItems ?? []).some(
      (m) => m.kind === 'audio'
    );
    const hasVideoMedia = (replyTarget.mediaItems ?? []).some(
      (m) => m.kind === 'video'
    );
    const hasImageMedia = (replyTarget.mediaItems ?? []).some(
      (m) => m.kind === 'image'
    );

    return {
      messageId: replyTarget.id,
      senderName: replyTarget.senderName,
      preview:
        replyTarget.text ??
        (hasAudioMedia
          ? '🎤 Audio message'
          : hasImageMedia
            ? '📷 Photo'
            : hasVideoMedia
              ? '🎥 Video'
              : replyTarget.fileAttachments?.[0]?.name
                ? `📎 ${replyTarget.fileAttachments[0].name}`
                : ''),
      mediaKind: hasAudioMedia
        ? ('audio' as const)
        : hasVideoMedia
          ? ('video' as const)
          : hasImageMedia
            ? ('image' as const)
            : (replyTarget.fileAttachments ?? []).length
              ? ('file' as const)
              : undefined,
      thumbnailUri:
        firstMedia?.kind === 'image' || firstMedia?.kind === 'video'
          ? firstMedia.uri
          : undefined,
    };
  }, [replyTarget]);

  const handleSendMessage = useCallback(() => {
    const trimmedText = inputText.trim();

    // Edit flow takes precedence: commit the edit instead of sending a new message.
    if (editingMessage) {
      if (!trimmedText) return;
      onEditMessage?.(editingMessage, trimmedText);
      setInputText('');
      resetInputLayout();
      cancelEdit();
      return;
    }

    if (!trimmedText && !hasPreviewAttachments) return;
    onSendMessage({
      text: trimmedText,
      senderId: currentUserId,
      ...(replyTarget ? { replyTo: buildReplyTo() } : {}),
    });
    setInputText('');
    resetInputLayout();
    if (replyTarget) cancelReply();
  }, [
    inputText,
    onSendMessage,
    currentUserId,
    hasPreviewAttachments,
    resetInputLayout,
    replyTarget,
    buildReplyTo,
    cancelReply,
    editingMessage,
    onEditMessage,
    cancelEdit,
  ]);

  useEffect(() => {
    if (inputText.trim()) onTypingStart?.();
    else onTypingEnd?.();
  }, [inputText, onTypingStart, onTypingEnd]);

  const showSendButton =
    !!inputText.trim() || hasPreviewAttachments || isEditing;

  // Voice recorder theming / config (theme.voiceRecorder)
  const voiceRecorderTheme = theme?.voiceRecorder;
  const mergedRecordingUIProps = voiceRecorderTheme?.ui ?? {};
  const mergedRecorderStyles = voiceRecorderTheme?.styles;
  const mergedRecorderConfig = voiceRecorderTheme?.config;

  // Voice recorder (audio engine)
  const onRecordEnd = useCallback(
    (result: RecordingResult) => {
      onAudioRecordEnd?.(result);
    },
    [onAudioRecordEnd]
  );

  const recorder = useVoiceRecorder({
    maxDuration: mergedRecorderConfig?.maxDuration ?? 300,
    onRecordStart: onAudioRecordStart,
    onRecordEnd,
  });

  const recorderRef = useRef(recorder);
  recorderRef.current = recorder;

  const handleFlowRecordingStart = useCallback(() => {
    recorderRef.current.startRecording();
  }, []);

  const handleFlowSend = useCallback(async () => {
    const result = await recorderRef.current.stopRecording();
    if (result) {
      onSendMessage({
        mediaItems: [
          {
            uri: result.uri,
            kind: 'audio',
            name: result.name,
            type: result.mimeType,
          },
        ],
        senderId: currentUserId,
        ...(replyTarget ? { replyTo: buildReplyTo() } : {}),
      });
      if (replyTarget) cancelReply();
    }
  }, [onSendMessage, currentUserId, replyTarget, buildReplyTo, cancelReply]);

  const handleFlowCancel = useCallback(() => {
    recorderRef.current.cancelRecording();
  }, []);

  const handleFlowPause = useCallback(() => {
    recorderRef.current.pauseRecording();
  }, []);

  const handleFlowResume = useCallback(() => {
    recorderRef.current.resumeRecording();
  }, []);

  const themePrimary =
    (theme?.inputStyles?.sendButtonStyle?.backgroundColor as
      | string
      | undefined) ||
    theme?.colors?.sentBubbleBackgroundColor ||
    theme?.colors?.sentMessageTailColor ||
    FALLBACK_PRIMARY;
  const themeOnPrimary = theme?.colors?.sendIconsColor || themePrimary;

  const recordingPrimary =
    mergedRecordingUIProps.recordingSendButtonBackground ?? themePrimary;
  const recordingBackground = mergedRecordingUIProps.recordingBackground;
  const recordingTimerColor =
    mergedRecordingUIProps.timerColor ?? themeOnPrimary;
  const recordingMicColor =
    mergedRecordingUIProps.longPressMicColor ?? themeOnPrimary;
  const recordingWaveformColor =
    mergedRecordingUIProps.waveformColor ?? themeOnPrimary;

  // Custom voice UI override
  const exposedState: VoiceRecorderExposedState = {
    isRecording: recorder.isRecording,
    isPaused: recorder.isPaused,
    duration: recorder.duration,
    isLocked: false,
    slideOffset: { x: 0, y: 0 },
    waveformData: [],
    startRecording: recorder.startRecording,
    stopRecording: recorder.stopRecording,
    pauseRecording: recorder.pauseRecording,
    resumeRecording: recorder.resumeRecording,
    cancelRecording: recorder.cancelRecording,
  };

  const customVoiceUI = CustomVoiceRecorder
    ? CustomVoiceRecorder(exposedState)
    : null;

  // Inline render helpers
  const replyEnabledPill = replyProps?.enableReply ?? true;
  const showInPillReply =
    !!replyTarget && replyEnabledPill && !isEditing && !renderReplyPreview;
  const showInPillEdit = isEditing;
  const hasInPillTopSection = showInPillReply || showInPillEdit;

  const inPillReplyPreview = useMemo(() => {
    if (!showInPillReply || !replyTarget) return null;
    const firstMedia = replyTarget.mediaItems?.[0];
    const thumbnail =
      firstMedia?.kind === 'image' || firstMedia?.kind === 'video'
        ? firstMedia.uri
        : undefined;

    let preview = '';
    if (replyTarget.text) preview = replyTarget.text;
    else if (firstMedia?.kind === 'audio') preview = '🎤 Audio message';
    else if (firstMedia?.kind === 'video') preview = '🎥 Video';
    else if (firstMedia?.kind === 'image') preview = '📷 Photo';
    else if ((replyTarget.fileAttachments ?? []).length)
      preview = `📎 ${replyTarget.fileAttachments?.[0]?.name ?? 'File'}`;

    const showClose = shouldShowReplyCloseButton(theme, replyUI); // NEW

    const body = (
      <View
        style={[
          tw`flex-row items-center m-2 rounded-md px-3 py-2`,
          {
            backgroundColor: inputPreviewBg || 'rgba(0, 0, 0, 0.08)',
            minHeight: 40,
          },
          mergedReplyStyle?.inputPreviewContainer,
          mergedReplyStyle?.container,
        ]}
      >
        <View style={tw`flex-1 mr-2`}>
          <Text /* sender name — unchanged */>
            {replyTarget.senderName ||
              resolvedReplyUI.defaultReplySenderName ||
              'You'}
          </Text>
          <Text
            /* preview — unchanged */ numberOfLines={
              replyProps?.previewMaxLines ?? 1
            }
          >
            {preview}
          </Text>
        </View>

        {thumbnail && <Image /* unchanged */ />}

        {/* NEW — controllable visibility */}
        {showClose && (
          <Pressable
            onPress={cancelReply}
            hitSlop={10}
            style={[
              tw`w-7 h-7 items-center justify-center`,
              mergedReplyStyle?.closeButton,
            ]}
          >
            {CustomClosePreviewIcon ? (
              <CustomClosePreviewIcon />
            ) : (
              <ClosePreviewIcon color={closePreviewColor} />
            )}
          </Pressable>
        )}
      </View>
    );

    // NEW — make the whole preview tappable (e.g. to jump to / re-focus the replied message)
    if (!onReplyPress) return body;
    return (
      <Pressable onPress={() => onReplyPress?.(buildReplyTo()!)} hitSlop={4}>
        {body}
      </Pressable>
    );
  }, [
    showInPillReply,
    replyTarget,
    replyProps?.previewMaxLines,
    mergedReplyStyle,
    resolvedReplyUI,
    theme,
    themePrimary,
    inputPreviewBg,
    previewTextColor,
    thumbSize,
    closePreviewColor,
    CustomClosePreviewIcon,
    cancelReply,
    onReplyPress,
    buildReplyTo,
    replyUI, // NEW deps
  ]);

  const inBarReplyPreview = useMemo(() => {
    if (!showInPillReply || !replyTarget) return null;
    const firstMedia = replyTarget.mediaItems?.[0];
    const thumbnail =
      firstMedia?.kind === 'image' || firstMedia?.kind === 'video'
        ? firstMedia.uri
        : undefined;

    let preview = '';
    if (replyTarget.text) preview = replyTarget.text;
    else if (firstMedia?.kind === 'audio') preview = '🎤 Audio message';
    else if (firstMedia?.kind === 'video') preview = '🎥 Video';
    else if (firstMedia?.kind === 'image') preview = '📷 Photo';
    else if ((replyTarget.fileAttachments ?? []).length)
      preview = `📎 ${replyTarget.fileAttachments?.[0]?.name ?? 'File'}`;

    return (
      <View
        style={[
          tw`flex-row items-center m-2 rounded-md px-3 py-2`,
          {
            backgroundColor: recordingPreviewBg || 'rgba(0, 0, 0, 0.08)',
            minHeight: 40,
          },
          mergedReplyStyle?.recordingPreviewContainer,
        ]}
      >
        <View style={tw`flex-1 mr-2`}>
          <Text
            numberOfLines={1}
            style={withFontFamily(
              [
                tw`text-[13px] font-semibold`,
                {
                  color: resolvedReplyUI.previewSenderNameColor || themePrimary,
                },
              ],
              theme?.fontFamily
            )}
          >
            {replyTarget.senderName ||
              resolvedReplyUI.defaultReplySenderName ||
              'You'}
          </Text>
          <Text
            numberOfLines={1}
            style={withFontFamily(
              [
                tw`text-[12.5px] mt-0.5`,
                {
                  color: resolvedReplyUI.previewTextColor || 'rgba(0,0,0,0.55)',
                },
                mergedReplyStyle?.previewText,
              ],
              theme?.fontFamily
            )}
          >
            {preview}
          </Text>
        </View>

        {thumbnail && (
          <Image
            source={{ uri: thumbnail }}
            style={[
              {
                width: thumbSize - 2,
                height: thumbSize - 2,
                borderRadius: 4,
                marginRight: 6,
              },
              mergedReplyStyle?.thumbnail,
            ]}
            resizeMode="cover"
          />
        )}

        <Pressable
          onPress={cancelReply}
          hitSlop={10}
          style={[
            tw`w-7 h-7 items-center justify-center`,
            mergedReplyStyle?.closeButton,
          ]}
        >
          {CustomClosePreviewIcon ? (
            <CustomClosePreviewIcon />
          ) : (
            <ClosePreviewIcon color={closePreviewColor} />
          )}
        </Pressable>
      </View>
    );
  }, [
    showInPillReply,
    replyTarget,
    themeOnPrimary,
    theme?.fontFamily,
    recordingPreviewBg,
    mergedReplyStyle,
    resolvedReplyUI,
    thumbSize,
    closePreviewColor,
    CustomClosePreviewIcon,
    cancelReply,
  ]);

  const inPillEditPreview = useMemo(() => {
    if (!showInPillEdit || !editingMessage) return null;
    if (renderEditPreview) {
      return renderEditPreview(editingMessage, () => {
        cancelEdit();
        setInputText('');
        resetInputLayout();
      });
    }
    return (
      <View
        style={[
          tw`flex-row items-center m-2 rounded-md px-3 py-2`,
          {
            backgroundColor: inputPreviewBg || 'rgba(0, 0, 0, 0.08)',
            minHeight: 40,
          },
          mergedReplyStyle?.editPreviewContainer,
        ]}
      >
        <View style={tw`mr-2.5`}>
          {CustomEditPreviewIcon ? (
            <CustomEditPreviewIcon />
          ) : (
            <EditIcon style={{ width: 16, height: 16 }} color={themePrimary} />
          )}
        </View>
        <View style={tw`flex-1 mr-2`}>
          <Text
            numberOfLines={1}
            style={withFontFamily(
              [tw`text-[13px] font-semibold`, { color: themePrimary }],
              theme?.fontFamily
            )}
          >
            {resolvedReplyUI.editChipTitle || 'Edit message'}
          </Text>
          <Text
            numberOfLines={1}
            style={withFontFamily(
              [
                tw`text-[12.5px] mt-0.5`,
                { color: previewTextColor },
                mergedReplyStyle?.previewText,
              ],
              theme?.fontFamily
            )}
          >
            {editingMessage.text}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            cancelEdit();
            setInputText('');
            resetInputLayout();
          }}
          hitSlop={10}
          style={[
            tw`w-7 h-7 items-center justify-center`,
            mergedReplyStyle?.closeButton,
          ]}
        >
          {CustomClosePreviewIcon ? (
            <CustomClosePreviewIcon />
          ) : (
            <ClosePreviewIcon color={closePreviewColor} />
          )}
        </Pressable>
      </View>
    );
  }, [
    showInPillEdit,
    editingMessage,
    renderEditPreview,
    mergedReplyStyle,
    resolvedReplyUI,
    themePrimary,
    theme?.fontFamily,
    inputPreviewBg,
    previewTextColor,
    closePreviewColor,
    CustomClosePreviewIcon,
    CustomEditPreviewIcon,
    cancelEdit,
    resetInputLayout,
  ]);

  const isPillRound = isCompactInput && !hasInPillTopSection;

  const renderInputPill = useCallback(
    () => (
      <View
        style={[
          tw`flex-1 flex-col bg-white overflow-hidden`,
          {
            minHeight: INPUT_BAR_SHELL_HEIGHT,
            borderRadius: isPillRound ? 9999 : 24,
          },
          theme?.inputStyles?.inputContainerStyle,
        ]}
      >
        {inPillReplyPreview}
        {inPillEditPreview}

        <View
          style={[
            tw`flex-row px-3.5`,
            {
              minHeight: INPUT_BAR_SHELL_HEIGHT,
              alignItems: isCompactInput ? 'center' : 'flex-end',
            },
          ]}
        >
          {showEmojiButton && (
            <View style={iconSlotStyle}>
              <Pressable>
                {CustomEmojiIcon ? (
                  <CustomEmojiIcon />
                ) : (
                  <EmojiFunnySquareIcon
                    style={inputBarIconStyle}
                    color={theme?.colors?.inputsIconsColor || 'rgba(0,0,0,0.7)'}
                  />
                )}
              </Pressable>
            </View>
          )}

          <TextInput
            ref={inputRef}
            value={inputText}
            onChangeText={handleChangeText}
            placeholder={placeholder || 'Message'}
            style={withFontFamily(
              [
                tw`bg-transparent flex-1 pl-2`,
                Platform.OS === 'ios' ? tw`text-[17px]` : tw`text-[16px]`,
                {
                  minHeight: MIN_INPUT_HEIGHT,
                  maxHeight: MAX_INPUT_HEIGHT,
                  paddingVertical: isCompactInput ? 0 : 8,
                  marginVertical: isCompactInput
                    ? (INPUT_BAR_SHELL_HEIGHT - MIN_INPUT_HEIGHT) / 2
                    : 4,
                },
                {
                  color: theme?.colors?.inputTextColor || 'rgba(0, 0, 0, 0.87)',
                },
              ],
              theme?.fontFamily
            )}
            placeholderTextColor={
              theme?.colors?.placeholderTextColor || 'rgba(0, 0, 0, 0.4)'
            }
            multiline
            textAlignVertical={
              inputHeight.isMultiline && inputText.length > 0 ? 'top' : 'center'
            }
            onContentSizeChange={handleContentSizeChange}
          />

          {!isEditing && (
            <View style={[tw`flex-row items-center gap-4`, iconSlotStyle]}>
              {showAttachmentsButton && (
                <Pressable onPress={onAttachmentPress}>
                  {CustomAttachmentIcon ? (
                    <CustomAttachmentIcon />
                  ) : (
                    <PaperClipIcon
                      style={inputBarIconStyle}
                      color={
                        theme?.colors?.inputsIconsColor || 'rgba(0,0,0,0.7)'
                      }
                    />
                  )}
                </Pressable>
              )}
              {showCameraButton && !inputText.trim() && (
                <Pressable onPress={onCameraPress}>
                  {CustomCameraIcon ? (
                    <CustomCameraIcon />
                  ) : (
                    <CameraIcon
                      style={inputBarIconStyle}
                      color={
                        theme?.colors?.inputsIconsColor || 'rgba(0,0,0,0.7)'
                      }
                    />
                  )}
                </Pressable>
              )}
            </View>
          )}
        </View>
      </View>
    ),
    [
      isPillRound,
      isCompactInput,
      isEditing,
      inputText,
      inputHeight.isMultiline,
      iconSlotStyle,
      handleChangeText,
      handleContentSizeChange,
      placeholder,
      showEmojiButton,
      showAttachmentsButton,
      showCameraButton,
      onAttachmentPress,
      onCameraPress,
      CustomEmojiIcon,
      CustomAttachmentIcon,
      CustomCameraIcon,
      inputBarIconStyle,
      theme,
      inPillReplyPreview,
      inPillEditPreview,
    ]
  );

  const renderSendButton = useCallback(
    () => (
      <Pressable
        onPress={handleSendMessage}
        style={[
          tw`rounded-full justify-center items-center`,
          {
            height: INPUT_BAR_SHELL_HEIGHT,
            width: INPUT_BAR_SHELL_HEIGHT,
            backgroundColor: themePrimary,
            ...theme?.inputStyles?.sendButtonStyle,
          },
        ]}
      >
        {CustomSendIcon ? (
          <CustomSendIcon />
        ) : (
          <PaperPlaneIcon
            style={tw.style(SEND_ICON_CLASS)}
            color={themeOnPrimary}
          />
        )}
      </Pressable>
    ),
    [
      handleSendMessage,
      themePrimary,
      themeOnPrimary,
      theme?.inputStyles?.sendButtonStyle,
      CustomSendIcon,
    ]
  );

  const renderCustomVoiceTrigger = () =>
    CustomMicrophoneIcon ? (
      <CustomMicrophoneIcon />
    ) : (
      <MicrophoneIcon style={tw.style(MIC_ICON_CLASS)} color={themeOnPrimary} />
    );

  const useVoiceFlow = showVoiceRecordButton && !customVoiceUI && !isEditing;

  const customReplyPreviewNode =
    replyTarget && replyEnabledPill && !isEditing && renderReplyPreview
      ? renderReplyPreview(replyTarget, cancelReply)
      : null;

  // Voice flow props (typed for safety)
  const voiceFlowProps: VoiceRecorderFlowProps = {
    inputBarHeight: INPUT_BAR_SHELL_HEIGHT,
    primaryColor: recordingPrimary,
    backgroundColor: recordingBackground,
    timerColor: recordingTimerColor,
    microphoneColor: recordingMicColor,
    waveformColor: recordingWaveformColor,
    holdPillBackground: mergedRecordingUIProps.holdPillBackground,
    cancelTextColor: mergedRecordingUIProps.cancelTextColor,
    chevronColor: mergedRecordingUIProps.chevronIconColor,
    lockColor: mergedRecordingUIProps.lockIconColor,
    lockPillBackground: mergedRecordingUIProps.lockPillBackground,
    deleteIconColor: mergedRecordingUIProps.deleteIconColor,
    pauseIconColor: mergedRecordingUIProps.pauseIconColor,
    iconSize: mergedRecordingUIProps.iconSize,
    lockSlideDistance: mergedRecordingUIProps.lockSlideDistance,
    waveCount: mergedRecordingUIProps.waveformBarCount,
    enableLockRecording: mergedRecorderConfig?.enableLockRecording,
    enableSlideToCancel: mergedRecorderConfig?.enableSlideToCancel,
    enableWaveform: mergedRecorderConfig?.enableWaveform,
    timerTextStyle:
      mergedRecordingUIProps.timerTextStyle ?? mergedRecorderStyles?.timer,
    fontFamily: theme?.fontFamily,
    containerStyle: mergedRecorderStyles?.container,
    barStyle: mergedRecorderStyles?.bar,
    slideTextStyle: mergedRecorderStyles?.slideText,
    waveformStyle: mergedRecorderStyles?.waveform,
    lockPillStyle: mergedRecorderStyles?.lockPill,
    trashButtonStyle: mergedRecorderStyles?.trashButton,
    sendButtonStyle: mergedRecorderStyles?.sendButton,
    headerSlot: inBarReplyPreview,
    showSendButton,
    onSendPress: handleSendMessage,
    sendButtonBackgroundColor: themePrimary,
    sendButtonIconColor: themeOnPrimary,
    renderInputPill,
    renderSendIcon: CustomSendIcon ? () => <CustomSendIcon /> : undefined,
    renderMicIcon: CustomMicrophoneIcon
      ? () => <CustomMicrophoneIcon />
      : undefined,
    onRecordingStart: handleFlowRecordingStart,
    onSend: handleFlowSend,
    onCancel: handleFlowCancel,
    onDelete: handleFlowCancel,
    onPauseRecording: handleFlowPause,
    onResumeRecording: handleFlowResume,
  };

  // Render
  return (
    <View style={tw`w-full px-2`}>
      {customReplyPreviewNode}
      {hasPreviewAttachments && (
        <FilePreview
          previews={previewList}
          closePreview={closePreview}
          onRemoveItem={onRemovePreviewItem}
          CustomFileIcon={CustomFileIcon}
          CustomImagePreview={CustomImagePreview}
          CustomVideoPreview={CustomVideoPreview}
          inputHeight={inputHeight.height}
        />
      )}

      <View
        style={[tw`w-full`, theme?.inputStyles?.inputSectionContainerStyle]}
      >
        {useVoiceFlow ? (
          <VoiceRecorderFlow {...voiceFlowProps} />
        ) : (
          <View style={tw`flex-row items-end gap-2`}>
            {renderInputPill()}
            {showSendButton || !showVoiceRecordButton ? (
              renderSendButton()
            ) : customVoiceUI ? (
              <View
                style={{
                  height: INPUT_BAR_SHELL_HEIGHT,
                  width: INPUT_BAR_SHELL_HEIGHT,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {renderCustomVoiceTrigger()}
              </View>
            ) : (
              renderSendButton()
            )}
          </View>
        )}
      </View>

      {customVoiceUI}
    </View>
  );
};

export default React.memo(ChatInput);
