import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform, Pressable, TextInput, View } from 'react-native';
import tw from 'twrnc';
import { CameraIcon } from '../../assets/Icons/CameraIcon';
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
import { VoiceRecorderFlow } from '../VoiceRecorder/VoiceRecorderFlow';
import FilePreview from './FilePreview';
import { ChatInputProps, InputHeightState } from './types';

// ─── Layout constants ─────────────────────────────────────────────────────────
const MIN_INPUT_HEIGHT = Platform.OS === 'ios' ? 32 : 30;
const MAX_INPUT_HEIGHT = 118;
const INPUT_BAR_SHELL_HEIGHT = Platform.OS === 'ios' ? 50 : 48;

const SEND_ICON_CLASS = 'h-6 w-6';
const MIC_ICON_CLASS = 'h-8 w-8';

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
  // ── Text input state ───────────────────────────────────────────────────────
  const [inputText, setInputText] = useState('');
  const [inputResetKey, setInputResetKey] = useState(0);
  const [inputHeight, setInputHeight] = useState<InputHeightState>({
    height: MIN_INPUT_HEIGHT,
    isMultiline: false,
  });

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
  } = useChatContext();

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

  // ── Text input handlers ────────────────────────────────────────────────────
  const resetInputLayout = useCallback(() => {
    setInputHeight({ height: MIN_INPUT_HEIGHT, isMultiline: false });
    setInputResetKey((k) => k + 1);
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

  const handleSendMessage = useCallback(() => {
    const trimmedText = inputText.trim();
    if (!trimmedText && !hasPreviewAttachments) return;
    onSendMessage({ text: trimmedText, senderId: currentUserId });
    setInputText('');
    resetInputLayout();
  }, [
    inputText,
    onSendMessage,
    currentUserId,
    hasPreviewAttachments,
    resetInputLayout,
  ]);

  useEffect(() => {
    if (inputText.trim()) onTypingStart?.();
    else onTypingEnd?.();
  }, [inputText, onTypingStart, onTypingEnd]);

  const showSendButton = !!inputText.trim() || hasPreviewAttachments;

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

  // VoiceRecorderFlow → audio engine wiring
  const handleFlowRecordingStart = useCallback(() => {
    recorderRef.current.startRecording();
  }, []);

  const handleFlowSend = useCallback(async () => {
    const result = await recorderRef.current.stopRecording();
    if (result) {
      onSendMessage({ audio: result.uri, senderId: currentUserId });
    }
  }, [onSendMessage, currentUserId]);

  const handleFlowCancel = useCallback(() => {
    recorderRef.current.cancelRecording();
  }, []);

  const handleFlowPause = useCallback(() => {
    recorderRef.current.pauseRecording();
  }, []);

  const handleFlowResume = useCallback(() => {
    recorderRef.current.resumeRecording();
  }, []);

  const themePrimary = theme?.inputStyles?.sendButtonStyle?.backgroundColor as
    | string
    | undefined;
  const themeOnPrimary = theme?.colors?.sendIconsColor;

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
  const renderInputPill = () => (
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
        key={`chat-input-${inputResetKey}`}
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

      <View style={[tw`flex-row items-center gap-4`, iconSlotStyle]}>
        {showAttachmentsButton && (
          <Pressable onPress={onAttachmentPress}>
            {CustomAttachmentIcon ? (
              <CustomAttachmentIcon />
            ) : (
              <PaperClipIcon
                style={inputBarIconStyle}
                color={theme?.colors?.inputsIconsColor || 'rgba(0,0,0,0.7)'}
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
                color={theme?.colors?.inputsIconsColor || 'rgba(0,0,0,0.7)'}
              />
            )}
          </Pressable>
        )}
      </View>
    </View>
  );

  const renderSendButton = () => (
    <Pressable
      onPress={handleSendMessage}
      style={[
        tw`rounded-full justify-center items-center`,
        {
          height: INPUT_BAR_SHELL_HEIGHT,
          width: INPUT_BAR_SHELL_HEIGHT,
          backgroundColor: '#16a34a',
          ...theme?.inputStyles?.sendButtonStyle,
        },
      ]}
    >
      {CustomSendIcon ? (
        <CustomSendIcon />
      ) : (
        <PaperPlaneIcon
          style={tw.style(SEND_ICON_CLASS)}
          color={theme?.colors?.sendIconsColor || 'rgba(255,255,255,0.7)'}
        />
      )}
    </Pressable>
  );

  const renderCustomVoiceTrigger = () =>
    CustomMicrophoneIcon ? (
      <CustomMicrophoneIcon />
    ) : (
      <MicrophoneIcon
        style={tw.style(MIC_ICON_CLASS)}
        color={theme?.colors?.sendIconsColor || 'rgba(255,255,255,0.7)'}
      />
    );

  const useVoiceFlowRow =
    !showSendButton && showVoiceRecordButton && !customVoiceUI;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <View style={tw`w-full px-2`}>
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
        style={[
          tw`w-full`,
          theme?.inputStyles?.inputSectionContainerStyle,
        ]}
      >
        {useVoiceFlowRow ? (
          <VoiceRecorderFlow
            inputBarHeight={INPUT_BAR_SHELL_HEIGHT}
            primaryColor={recordingPrimary}
            backgroundColor={recordingBackground}
            timerColor={recordingTimerColor}
            microphoneColor={recordingMicColor}
            waveformColor={recordingWaveformColor}
            holdPillBackground={mergedRecordingUIProps.holdPillBackground}
            cancelTextColor={mergedRecordingUIProps.cancelTextColor}
            chevronColor={mergedRecordingUIProps.chevronIconColor}
            lockColor={mergedRecordingUIProps.lockIconColor}
            lockPillBackground={mergedRecordingUIProps.lockPillBackground}
            deleteIconColor={mergedRecordingUIProps.deleteIconColor}
            pauseIconColor={mergedRecordingUIProps.pauseIconColor}
            iconSize={mergedRecordingUIProps.iconSize}
            lockSlideDistance={mergedRecordingUIProps.lockSlideDistance}
            waveCount={mergedRecordingUIProps.waveformBarCount}
            enableLockRecording={mergedRecorderConfig?.enableLockRecording}
            enableSlideToCancel={mergedRecorderConfig?.enableSlideToCancel}
            enableWaveform={mergedRecorderConfig?.enableWaveform}
            timerTextStyle={
              mergedRecordingUIProps.timerTextStyle ??
              mergedRecorderStyles?.timer
            }
            containerStyle={mergedRecorderStyles?.container}
            barStyle={mergedRecorderStyles?.bar}
            slideTextStyle={mergedRecorderStyles?.slideText}
            waveformStyle={mergedRecorderStyles?.waveform}
            lockPillStyle={mergedRecorderStyles?.lockPill}
            trashButtonStyle={mergedRecorderStyles?.trashButton}
            sendButtonStyle={mergedRecorderStyles?.sendButton}
            renderInputPill={renderInputPill}
            renderSendIcon={CustomSendIcon ? () => <CustomSendIcon /> : undefined}
            renderMicIcon={
              CustomMicrophoneIcon ? () => <CustomMicrophoneIcon /> : undefined
            }
            onRecordingStart={handleFlowRecordingStart}
            onSend={handleFlowSend}
            onCancel={handleFlowCancel}
            onDelete={handleFlowCancel}
            onPauseRecording={handleFlowPause}
            onResumeRecording={handleFlowResume}
          />
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
