import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  PanResponder,
  Platform,
  Pressable,
  TextInput,
  View,
} from 'react-native';
import tw from 'twrnc';
import { CameraIcon } from '../../assets/Icons/CameraIcon';
import { EmojiFunnySquareIcon } from '../../assets/Icons/EmojiFunnySquareIcon';
import { MicrophoneIcon } from '../../assets/Icons/MicrophoneIcon';
import { PaperClipIcon } from '../../assets/Icons/PaperClipIcon';
import { PaperPlaneIcon } from '../../assets/Icons/PaperPlaneIcon';
import { AnimatedHoldMic } from '../VoiceRecorder/AnimatedHoldMic';
import { LockSlideColumn } from '../VoiceRecorder/LockSlideColumn';
import { LongPressRecording } from '../VoiceRecorder/LongPressRecording';
import { NormalRecording } from '../VoiceRecorder/NormalRecording';
import { getRecordingContainerStyle } from '../VoiceRecorder/recordingContainerStyle';
import { useChatContext } from '../../context/ChatContext';
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder';
import { RecordingResult, VoiceRecorderExposedState } from '../../types';
import {
  getInputBarIconPixelSize,
  getInputBarIconStyle,
  withFontFamily,
} from '../../utils/theme';
import FilePreview from './FilePreview';
import { ChatInputProps, InputHeightState } from './types';

// ─── Layout constants ─────────────────────────────────────────────────────────
const MIN_INPUT_HEIGHT = Platform.OS === 'ios' ? 32 : 30;
const MAX_INPUT_HEIGHT = 118;
const INPUT_BAR_SHELL_HEIGHT = Platform.OS === 'ios' ? 50 : 48;

const SEND_ICON_CLASS = 'h-6 w-6';
const MIC_ICON_CLASS = 'h-8 w-8';

// Long-press / swipe thresholds (px)
const LONG_PRESS_MS = 500;
const CANCEL_THRESHOLD_X = -70; // slide left to cancel
const DEFAULT_LOCK_SLIDE_DISTANCE = 72; // slide up to lock (matches lock pill)

type VoiceMode = 'idle' | 'normal' | 'longPress' | 'locked';

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
    voiceRecorderProps,
    voiceRecorderStyles,
    recordingUIProps,
    renderVoiceRecorder,
    CustomPlayIcon,
    CustomPauseIcon,
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
  }, [inputText, onSendMessage, currentUserId, hasPreviewAttachments, resetInputLayout]);

  useEffect(() => {
    if (inputText.trim()) onTypingStart?.();
    else onTypingEnd?.();
  }, [inputText, onTypingStart, onTypingEnd]);

  const showSendButton = !!inputText.trim() || hasPreviewAttachments;

  // ── Voice recorder ─────────────────────────────────────────────────────────
  const [voiceMode, setVoiceModeState] = useState<VoiceMode>('idle');
  const voiceModeRef = useRef<VoiceMode>('idle');
  const setVoiceMode = useCallback((mode: VoiceMode) => {
    voiceModeRef.current = mode;
    setVoiceModeState(mode);
  }, []);

  const lockSlideDistance =
    recordingUIProps?.lockSlideDistance ?? DEFAULT_LOCK_SLIDE_DISTANCE;
  const lockSlideDistanceRef = useRef(lockSlideDistance);
  lockSlideDistanceRef.current = lockSlideDistance;

  // Track finger position for long-press UI feedback
  const [slideX, setSlideX] = useState(0);
  const [slideY, setSlideY] = useState(0);
  const slideXRef = useRef(0);
  const slideYRef = useRef(0);

  const onRecordEnd = useCallback(
    (result: RecordingResult) => {
      onAudioRecordEnd?.(result);
    },
    [onAudioRecordEnd]
  );

  const recorder = useVoiceRecorder({
    maxDuration: voiceRecorderProps?.maxDuration ?? 300,
    onRecordStart: onAudioRecordStart,
    onRecordEnd,
  });

  // Keep a stable ref to the recorder so the PanResponder closure never stales
  const recorderRef = useRef(recorder);
  recorderRef.current = recorder;

  // ── Send / cancel helpers ──────────────────────────────────────────────────
  const handleSendVoice = useCallback(async () => {
    const result = await recorderRef.current.stopRecording();
    setVoiceMode('idle');
    if (result) {
      onSendMessage({ audio: result.uri, senderId: currentUserId });
    }
  }, [onSendMessage, currentUserId, setVoiceMode]);

  const handleCancelVoice = useCallback(() => {
    recorderRef.current.cancelRecording();
    setVoiceMode('idle');
    setSlideX(0);
    setSlideY(0);
    slideXRef.current = 0;
    slideYRef.current = 0;
  }, [setVoiceMode]);

  // Stable refs for PanResponder closures
  const handleSendVoiceRef = useRef(handleSendVoice);
  handleSendVoiceRef.current = handleSendVoice;
  const handleCancelVoiceRef = useRef(handleCancelVoice);
  handleCancelVoiceRef.current = handleCancelVoice;

  // ── PanResponder for the mic button ───────────────────────────────────────
  // Created once; uses refs for all mutable values to avoid stale closures.
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const isLongPressActiveRef = useRef(false);

  const micPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => isLongPressActiveRef.current,

        onPanResponderGrant: () => {
          isLongPressActiveRef.current = false;
          slideXRef.current = 0;
          slideYRef.current = 0;
          setSlideX(0);
          setSlideY(0);

          longPressTimerRef.current = setTimeout(async () => {
            isLongPressActiveRef.current = true;
            await recorderRef.current.startRecording();
            setVoiceMode('longPress');
          }, LONG_PRESS_MS);
        },

        onPanResponderMove: (_, gestureState) => {
          if (!isLongPressActiveRef.current) return;

          slideXRef.current = gestureState.dx;
          slideYRef.current = gestureState.dy;
          setSlideX(gestureState.dx);
          setSlideY(gestureState.dy);

          const enableLock =
            voiceRecorderProps?.enableLockRecording !== false;

          // Lock only after sliding up to the lock pill (not on tiny movements)
          if (
            enableLock &&
            gestureState.dy <= -lockSlideDistanceRef.current &&
            voiceModeRef.current === 'longPress'
          ) {
            setVoiceMode('locked');
            slideYRef.current = -lockSlideDistanceRef.current;
            setSlideY(-lockSlideDistanceRef.current);
          }
        },

        onPanResponderRelease: async (_, gestureState) => {
          clearTimeout(longPressTimerRef.current);
          const wasLongPress = isLongPressActiveRef.current;
          isLongPressActiveRef.current = false;

          if (!wasLongPress) {
            // Quick tap → start normal recording mode
            await recorderRef.current.startRecording();
            setVoiceMode('normal');
            return;
          }

          // Long press released
          if (voiceModeRef.current === 'locked') {
            // Locked → stay in recording, user taps send/cancel manually
            return;
          }

          if (gestureState.dx < CANCEL_THRESHOLD_X) {
            handleCancelVoiceRef.current();
          } else {
            // Auto-send on release (WhatsApp behaviour)
            handleSendVoiceRef.current();
          }
        },

        onPanResponderTerminate: () => {
          clearTimeout(longPressTimerRef.current);
          isLongPressActiveRef.current = false;
        },
      }),
    [] // Intentional: all values accessed via refs
  );

  const recordingSendBg =
    recordingUIProps?.recordingSendButtonBackground ??
    (theme?.inputStyles?.sendButtonStyle?.backgroundColor as string) ??
    '#16a34a';
  const recordingSendFg = theme?.colors?.sendIconsColor ?? '#ffffff';
  const holdMicColor = recordingUIProps?.longPressMicColor ?? '#ef4444';

  const recordingContainerStyle = getRecordingContainerStyle(
    voiceRecorderStyles,
    recordingUIProps
  );

  // ── Render recording UI ───────────────────────────────────────────────────
  if (voiceMode !== 'idle') {
    const exposedState: VoiceRecorderExposedState = {
      isRecording: recorder.isRecording,
      isPaused: recorder.isPaused,
      duration: recorder.duration,
      isLocked: voiceMode === 'locked',
      slideOffset: { x: slideX, y: slideY },
      waveformData: [],
      startRecording: recorder.startRecording,
      stopRecording: recorder.stopRecording,
      pauseRecording: recorder.pauseRecording,
      resumeRecording: recorder.resumeRecording,
      cancelRecording: handleCancelVoice,
    };

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

        <View style={recordingContainerStyle}>
          {renderVoiceRecorder ? (
            renderVoiceRecorder(exposedState)
          ) : voiceMode === 'longPress' ? (
            <View
              style={[
                tw`flex-row items-end gap-2`,
                theme?.inputStyles?.inputSectionContainerStyle,
              ]}
            >
              <LongPressRecording
                duration={recorder.duration}
                slideX={slideX}
                containerHeight={INPUT_BAR_SHELL_HEIGHT}
                fontFamily={theme?.fontFamily}
                voiceRecorderStyles={voiceRecorderStyles}
                recordingUIProps={recordingUIProps}
              />

              <View style={{ alignItems: 'center' }}>
                <LockSlideColumn
                  slideY={slideY}
                  lockSlideDistance={lockSlideDistance}
                  recordingUIProps={recordingUIProps}
                  voiceRecorderStyles={voiceRecorderStyles}
                />
                <View
                  {...micPanResponder.panHandlers}
                  style={[
                    tw`rounded-full justify-center items-center`,
                    {
                      height: INPUT_BAR_SHELL_HEIGHT,
                      width: INPUT_BAR_SHELL_HEIGHT,
                      backgroundColor: recordingSendBg,
                    },
                    voiceRecorderStyles?.holdMicButton,
                    theme?.inputStyles?.sendButtonStyle,
                  ]}
                >
                  <AnimatedHoldMic
                    color={holdMicColor}
                    size={
                      recordingUIProps?.recordingIconSize ??
                      recordingUIProps?.iconSize ??
                      28
                    }
                  />
                </View>
              </View>
            </View>
          ) : (
            <NormalRecording
              isRecording={recorder.isRecording}
              isPaused={recorder.isPaused}
              duration={recorder.duration}
              onCancel={handleCancelVoice}
              onSend={handleSendVoice}
              onPause={recorder.pauseRecording}
              onResume={recorder.resumeRecording}
              enablePauseResume={voiceRecorderProps?.enablePauseResume ?? true}
              containerHeight={INPUT_BAR_SHELL_HEIGHT}
              fontFamily={theme?.fontFamily}
              sendButtonColor={recordingSendBg}
              sendIconColor={recordingSendFg}
              voiceRecorderStyles={voiceRecorderStyles}
              recordingUIProps={recordingUIProps}
              CustomPlayIcon={CustomPlayIcon}
              CustomPauseIcon={CustomPauseIcon}
            />
          )}
        </View>
      </View>
    );
  }

  // ── Normal input UI ───────────────────────────────────────────────────────
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
          tw`flex-row items-end gap-2`,
          theme?.inputStyles?.inputSectionContainerStyle,
        ]}
      >
        {/* ── Text input pill ── */}
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
                    color={
                      theme?.colors?.inputsIconsColor || 'rgba(0,0,0,0.7)'
                    }
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
                  color:
                    theme?.colors?.inputTextColor || 'rgba(0, 0, 0, 0.87)',
                },
              ],
              theme?.fontFamily
            )}
            placeholderTextColor={
              theme?.colors?.placeholderTextColor || 'rgba(0, 0, 0, 0.4)'
            }
            multiline
            textAlignVertical={
              inputHeight.isMultiline && inputText.length > 0
                ? 'top'
                : 'center'
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
        </View>

        {/* ── Right action button (send / mic) ── */}
        {showSendButton ? (
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
        ) : showVoiceRecordButton ? (
          // Mic button uses PanResponder for tap + long-press + drag
          <View
            {...micPanResponder.panHandlers}
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
            {CustomMicrophoneIcon ? (
              <CustomMicrophoneIcon />
            ) : (
              <MicrophoneIcon
                style={tw.style(MIC_ICON_CLASS)}
                color={theme?.colors?.sendIconsColor || 'rgba(255,255,255,0.7)'}
              />
            )}
          </View>
        ) : (
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
        )}
      </View>
    </View>
  );
};

export default React.memo(ChatInput);
