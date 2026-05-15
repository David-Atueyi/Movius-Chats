import React, { useCallback, useEffect, useState } from 'react';
import { Platform, Pressable, TextInput, View } from 'react-native';
import tw from 'twrnc';
import { CameraIcon } from '../../assets/Icons/CameraIcon';
import { EmojiFunnySquareIcon } from '../../assets/Icons/EmojiFunnySquareIcon';
import { MicrophoneIcon } from '../../assets/Icons/MicrophoneIcon';
import { PaperClipIcon } from '../../assets/Icons/PaperClipIcon';
import { PaperPlaneIcon } from '../../assets/Icons/PaperPlaneIcon';
import { useChatContext } from '../../context/ChatContext';
import { getInputBarIconStyle, withFontFamily } from '../../utils/theme';
import FilePreview from './FilePreview';
import { ChatInputProps, InputHeightState } from './types';

const MIN_TEXT_HEIGHT = Platform.OS === 'ios' ? 22 : 20;
const MAX_TEXT_HEIGHT = 100;
/** Matches send button height for a consistent pill shape */
const BAR_HEIGHT = Platform.OS === 'ios' ? 48 : 46;
const PILL_RADIUS = BAR_HEIGHT / 2;
const EXPANDED_RADIUS = 22;

const SEND_ICON_CLASS = 'h-6 w-6';
const MIC_ICON_CLASS = 'h-8 w-8';

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
    height: MIN_TEXT_HEIGHT,
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
    closePreview,
  } = useChatContext();

  const inputBarIconSize = theme?.sizes?.inputIconSize;
  const inputBarIconStyle = getInputBarIconStyle(inputBarIconSize);
  const iconSlotSize =
    typeof inputBarIconSize === 'number' && inputBarIconSize > 0
      ? inputBarIconSize
      : 24;

  const isCompact = !inputHeight.isMultiline;
  const showCamera = showCameraButton && !inputText.trim();

  const resetInputLayout = useCallback(() => {
    setInputHeight({ height: MIN_TEXT_HEIGHT, isMultiline: false });
  }, []);

  const handleChangeText = useCallback(
    (text: string) => {
      setInputText(text);
      if (!text.trim()) {
        resetInputLayout();
      }
    },
    [resetInputLayout]
  );

  const handleContentSizeChange = useCallback(
    (event: { nativeEvent: { contentSize: { height: number } } }) => {
      const contentHeight = event.nativeEvent.contentSize.height;

      if (!inputText.trim()) {
        resetInputLayout();
        return;
      }

      const newHeight = Math.min(
        Math.max(contentHeight, MIN_TEXT_HEIGHT),
        MAX_TEXT_HEIGHT
      );
      setInputHeight({
        height: newHeight,
        isMultiline: newHeight > MIN_TEXT_HEIGHT + 4,
      });
    },
    [inputText, resetInputLayout]
  );

  const handleSendMessage = useCallback(() => {
    const trimmedText = inputText.trim();

    if (!trimmedText && !previewData) {
      return;
    }

    onSendMessage({
      text: trimmedText,
      senderId: currentUserId,
    });

    setInputText('');
    resetInputLayout();
  }, [
    inputText,
    onSendMessage,
    currentUserId,
    previewData,
    resetInputLayout,
  ]);

  useEffect(() => {
    if (inputText.trim()) {
      onTypingStart?.();
    } else {
      onTypingEnd?.();
    }
  }, [inputText, onTypingStart, onTypingEnd]);

  const renderInputBarIcon = (
    icon: React.ReactNode,
    onPress?: () => void
  ) => (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={{
        width: iconSlotSize,
        height: iconSlotSize,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </Pressable>
  );

  return (
    <View style={tw`w-full px-2`}>
      {previewData && (
        <FilePreview
          previewData={previewData}
          closePreview={closePreview}
          CustomFileIcon={CustomFileIcon}
          CustomImagePreview={CustomImagePreview}
          CustomVideoPreview={CustomVideoPreview}
          inputHeight={isCompact ? BAR_HEIGHT : inputHeight.height + 24}
        />
      )}

      <View
        style={[
          tw`flex-row items-end gap-2`,
          theme?.inputStyles?.inputSectionContainerStyle,
        ]}
      >
        <View
          style={[
            tw`flex-1 flex-row items-center bg-white px-2`,
            {
              minHeight: BAR_HEIGHT,
              borderRadius: isCompact ? PILL_RADIUS : EXPANDED_RADIUS,
              paddingVertical: isCompact ? 0 : 8,
            },
            theme?.inputStyles?.inputContainerStyle,
          ]}
        >
          {showEmojiButton &&
            renderInputBarIcon(
              CustomEmojiIcon ? (
                <CustomEmojiIcon />
              ) : (
                <EmojiFunnySquareIcon
                  style={inputBarIconStyle}
                  color={
                    theme?.colors?.inputsIconsColor || 'rgba(0,0,0,0.7)'
                  }
                />
              )
            )}

          <TextInput
            key={isCompact ? 'input-compact' : 'input-expanded'}
            value={inputText}
            onChangeText={handleChangeText}
            placeholder={placeholder || 'Message'}
            style={withFontFamily(
              [
                tw`flex-1 bg-transparent`,
                Platform.OS === 'ios' ? tw`text-[17px]` : tw`text-[16px]`,
                {
                  minHeight: MIN_TEXT_HEIGHT,
                  maxHeight: inputHeight.isMultiline
                    ? MAX_TEXT_HEIGHT
                    : MIN_TEXT_HEIGHT,
                  paddingVertical: isCompact
                    ? Platform.OS === 'ios'
                      ? 12
                      : 11
                    : 8,
                  paddingHorizontal: 4,
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
            scrollEnabled={inputHeight.isMultiline}
            textAlignVertical="center"
            onContentSizeChange={handleContentSizeChange}
          />

          <View style={tw`flex-row items-center gap-3 pr-1`}>
            {showAttachmentsButton &&
              renderInputBarIcon(
                CustomAttachmentIcon ? (
                  <CustomAttachmentIcon />
                ) : (
                  <PaperClipIcon
                    style={inputBarIconStyle}
                    color={
                      theme?.colors?.inputsIconsColor || 'rgba(0,0,0,0.7)'
                    }
                  />
                ),
                onAttachmentPress
              )}
            {showCamera &&
              renderInputBarIcon(
                CustomCameraIcon ? (
                  <CustomCameraIcon />
                ) : (
                  <CameraIcon
                    style={inputBarIconStyle}
                    color={
                      theme?.colors?.inputsIconsColor || 'rgba(0,0,0,0.7)'
                    }
                  />
                ),
                onCameraPress
              )}
          </View>
        </View>

        <Pressable
          style={[
            tw`rounded-full bg-green-600 justify-center items-center`,
            {
              height: BAR_HEIGHT,
              width: BAR_HEIGHT,
              ...theme?.inputStyles?.sendButtonStyle,
            },
          ]}
          onPress={
            inputText.trim() || previewData
              ? handleSendMessage
              : onAudioRecordStart
          }
          onLongPress={onAudioRecordStart}
          onPressOut={onAudioRecordEnd}
        >
          {inputText.trim() ? (
            CustomSendIcon ? (
              <CustomSendIcon />
            ) : (
              <PaperPlaneIcon
                style={tw.style(SEND_ICON_CLASS)}
                color={theme?.colors?.sendIconsColor || 'rgba(255,255,255,0.7)'}
              />
            )
          ) : showVoiceRecordButton ? (
            CustomMicrophoneIcon ? (
              <CustomMicrophoneIcon />
            ) : (
              <MicrophoneIcon
                style={tw.style(MIC_ICON_CLASS)}
                color={theme?.colors?.sendIconsColor || 'rgba(255,255,255,0.7)'}
              />
            )
          ) : CustomSendIcon ? (
            <CustomSendIcon />
          ) : (
            <PaperPlaneIcon
              style={tw.style(SEND_ICON_CLASS)}
              color={theme?.colors?.sendIconsColor || 'rgba(255,255,255,0.7)'}
            />
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default React.memo(ChatInput);
