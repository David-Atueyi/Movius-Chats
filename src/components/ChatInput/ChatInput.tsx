import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform, Pressable, Text, TextInput, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import tw from 'twrnc';
import { CameraIcon } from '../../assets/Icons/CameraIcon';
import { EditIcon } from '../../assets/Icons/EditIcon';
import { EmojiFunnySquareIcon } from '../../assets/Icons/EmojiFunnySquareIcon';
import { MicrophoneIcon } from '../../assets/Icons/MicrophoneIcon';
import { PaperClipIcon } from '../../assets/Icons/PaperClipIcon';
import { PaperPlaneIcon } from '../../assets/Icons/PaperPlaneIcon';
import { useChatContext } from '../../context/ChatContext';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import { RecordingResult, VoiceRecorderExposedState } from '../../types';
import {
  getInputBarIconPixelSize,
  getInputBarIconStyle,
  withFontFamily,
} from '../../utils/theme';
import { ReplyPreview } from '../Reply/ReplyPreview';
import { VoiceRecorderFlow } from '../VoiceRecorder/VoiceRecorderFlow';
import type { VoiceRecorderFlowProps } from '../VoiceRecorder/VoiceRecorderFlow';
import FilePreview from './FilePreview';
import { ChatInputProps, InputHeightState } from './types';

// ─── Layout constants ─────────────────────────────────────────────────────────
const MIN_INPUT_HEIGHT = Platform.OS === 'ios' ? 32 : 30;
const MAX_INPUT_HEIGHT = 118;
const INPUT_BAR_SHELL_HEIGHT = Platform.OS === 'ios' ? 50 : 48;

const SEND_ICON_CLASS = 'h-6 w-6';
const MIC_ICON_CLASS = 'h-8 w-8';

const FALLBACK_PRIMARY = '#22c55e';

// ─── Component ────────────────────────────────────────────────────────────────
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
    replyStyle,
    renderReplyPreview,
    // edit state
    editingMessage,
    cancelEdit,
    onEditMessage,
  } = useChatContext();

  // ── Edit-mode autofill ─────────────────────────────────────────────────────
  // When the user picks "Edit" we pre-fill the input with the original text
  // so they can amend it. Re-runs every time we enter a fresh edit session.
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

  // ── Preview list ───────────────────────────────────────────────────────────
  const previewList = useMemo(() => {
    if (previewItems?.length) return previewItems;
    if (previewData) return [previewData];
    return [];
  }, [previewItems, previewData]);

  const hasPreviewAttachments = previewList.length > 0;

  // ── Icon sizing ────────────────────────────────────────────────────────────
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

  // ── Text input handlers ────────────────────────────────────────────────────
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
    return {
      messageId: replyTarget.id,
      senderName: replyTarget.senderName,
      preview:
        replyTarget.text ??
        (replyTarget.audio
          ? '🎤 Audio message'
          : replyTarget.image
            ? '📷 Photo'
            : replyTarget.video
              ? '🎥 Video'
              : replyTarget.fileAttachments?.[0]?.name
                ? `📎 ${replyTarget.fileAttachments[0].name}`
                : ''),
      mediaKind: replyTarget.audio
        ? ('audio' as const)
        : replyTarget.video
          ? ('video' as const)
          : replyTarget.image ||
              (replyTarget.mediaItems ?? []).some((m) => m.kind === 'image')
            ? ('image' as const)
            : (replyTarget.fileAttachments ?? []).length
              ? ('file' as const)
              : undefined,
      thumbnailUri:
        replyTarget.image ??
        (firstMedia?.kind === 'image' || firstMedia?.kind === 'video'
          ? firstMedia.uri
          : undefined),
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

  // ── Voice recorder theming / config (theme.voiceRecorder) ────────────────
  const voiceRecorderTheme = theme?.voiceRecorder;
  const mergedRecordingUIProps = voiceRecorderTheme?.ui ?? {};
  const mergedRecorderStyles = voiceRecorderTheme?.styles;
  const mergedRecorderConfig = voiceRecorderTheme?.config;

  // ── Voice recorder (audio engine) ──────────────────────────────────────────
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
        audio: result.uri,
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

  // ── Resolve the package primary (bubble) color and use it as the default
  //    for trailing buttons + reply previews. This keeps the recently-added
  //    UIs aligned with the host app's bubble theme instead of hard-coded
  //    green.
  const themePrimary =
    (theme?.inputStyles?.sendButtonStyle?.backgroundColor as
      | string
      | undefined) ||
    theme?.colors?.sentBubbleBackgroundColor ||
    theme?.colors?.sentMessageTailColor ||
    FALLBACK_PRIMARY;
  const themeOnPrimary =
    theme?.colors?.sendIconsColor || 'rgba(255,255,255,0.95)';

  const recordingPrimary =
    mergedRecordingUIProps.recordingSendButtonBackground ?? themePrimary;
  const recordingBackground = mergedRecordingUIProps.recordingBackground;
  const recordingTimerColor =
    mergedRecordingUIProps.timerColor ?? themeOnPrimary;
  const recordingMicColor =
    mergedRecordingUIProps.longPressMicColor ?? themeOnPrimary;
  const recordingWaveformColor =
    mergedRecordingUIProps.waveformColor ?? themeOnPrimary;

  // ── Custom voice UI override ──────────────────────────────────────────────
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

  // ── Inline render helpers ──────────────────────────────────────────────────
  const renderInputPill = useCallback(
    () => (
      <View
        style={[
          tw`flex-1 flex-row bg-white overflow-hidden px-3.5`,
          {
            minHeight: INPUT_BAR_SHELL_HEIGHT,
            borderRadius: isCompactInput ? 9999 : 24,
            alignItems: isCompactInput ? 'center' : 'flex-end',
          },
          theme?.inputStyles?.inputContainerStyle,
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
    ),
    [
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
      <MicrophoneIcon
        style={tw.style(MIC_ICON_CLASS)}
        color={themeOnPrimary}
      />
    );

  /**
   * Voice flow is always mounted when voice support is on (regardless of
   * whether the user has typed). This keeps the TextInput inside a stable
   * parent and prevents the keyboard from dismissing on the first keystroke.
   *
   * When `showSendButton` is true (text/preview/edit), the flow renders a
   * send button in its trailing slot instead of the recording mic.
   */
  const useVoiceFlow = showVoiceRecordButton && !customVoiceUI && !isEditing;

  // ── Reply preview row ────────────────────────────────────────────────────
  const replyEnabled = replyProps?.enableReply ?? true;
  const replyPreviewNode =
    replyTarget && replyEnabled && !isEditing ? (
      renderReplyPreview ? (
        renderReplyPreview(replyTarget, cancelReply)
      ) : (
        <ReplyPreview
          message={replyTarget}
          onCancel={cancelReply}
          previewMaxLines={replyProps?.previewMaxLines}
          replyStyle={replyStyle}
          fontFamily={theme?.fontFamily}
          accentColor={themePrimary}
          senderNameColor={themePrimary}
          previewTextColor={
            theme?.colors?.placeholderTextColor || 'rgba(0,0,0,0.55)'
          }
          closeIconColor={
            theme?.colors?.inputsIconsColor || 'rgba(0,0,0,0.5)'
          }
          backgroundColor="#FFFFFF"
        />
      )
    ) : null;

  // ── Edit-mode chip (replaces reply preview while editing) ────────────────
  const editChipNode = isEditing ? (
    <View
      style={[
        tw`flex-row items-stretch mx-2 mb-1 rounded-xl overflow-hidden`,
        {
          backgroundColor: '#FFFFFF',
          minHeight: 52,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 1 },
          elevation: 1,
        },
      ]}
    >
      <View
        style={[tw`w-[3px] self-stretch`, { backgroundColor: themePrimary }]}
      />
      <View style={tw`flex-1 flex-row items-center pl-3 pr-2 py-2`}>
        <View style={tw`mr-3`}>
          <EditIcon
            style={{ width: 18, height: 18 }}
            color={themePrimary}
          />
        </View>
        <View style={tw`flex-1 mr-2`}>
          <Text
            numberOfLines={1}
            style={withFontFamily(
              [tw`text-[13.5px] font-semibold`, { color: themePrimary }],
              theme?.fontFamily
            )}
          >
            Edit message
          </Text>
          <Text
            numberOfLines={1}
            style={withFontFamily(
              [tw`text-[12.5px] mt-0.5`, { color: 'rgba(0,0,0,0.55)' }],
              theme?.fontFamily
            )}
          >
            {editingMessage?.text}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            cancelEdit();
            setInputText('');
            resetInputLayout();
          }}
          hitSlop={10}
          style={tw`w-7 h-7 items-center justify-center`}
        >
          <Svg width={14} height={14} viewBox="0 0 24 24">
            <Line
              x1="18"
              y1="6"
              x2="6"
              y2="18"
              stroke="rgba(0,0,0,0.5)"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <Line
              x1="6"
              y1="6"
              x2="18"
              y2="18"
              stroke="rgba(0,0,0,0.5)"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          </Svg>
        </Pressable>
      </View>
    </View>
  ) : null;

  // ── Voice flow props (typed for safety) ──────────────────────────────────
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

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={tw`w-full px-2`}>
      {editChipNode}
      {replyPreviewNode}
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
