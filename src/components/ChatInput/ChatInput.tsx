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

const MIN_INPUT_HEIGHT = Platform.OS === 'ios' ? 32 : 30;
const MAX_INPUT_HEIGHT = 118;

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
    closePreview,
  } = useChatContext();

  const inputBarIconStyle = getInputBarIconStyle(theme?.sizes?.inputIconSize);
  const isSingleLine = !inputHeight.isMultiline;

  const handleContentSizeChange = useCallback(
    (event: { nativeEvent: { contentSize: { height: number } } }) => {
      const newHeight = Math.min(
        Math.max(event.nativeEvent.contentSize.height, MIN_INPUT_HEIGHT),
        MAX_INPUT_HEIGHT
      );
      setInputHeight({
        height: newHeight,
        isMultiline: newHeight > MIN_INPUT_HEIGHT,
      });
    },
    []
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
    setInputHeight({ height: MIN_INPUT_HEIGHT, isMultiline: false });
  }, [inputText, onSendMessage, currentUserId, previewData]);

  useEffect(() => {
    if (inputText.trim()) {
      onTypingStart?.();
    } else {
      onTypingEnd?.();
    }
  }, [inputText, onTypingStart, onTypingEnd]);

  // Collapse back to pill shape when user clears all text (no remount — keeps keyboard open)
  useEffect(() => {
    if (!inputText.length) {
      setInputHeight({ height: MIN_INPUT_HEIGHT, isMultiline: false });
    }
  }, [inputText]);

  return (
    <View style={tw`w-full px-2`}>
      {previewData && (
        <FilePreview
          previewData={previewData}
          closePreview={closePreview}
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
        <View
          style={[
            tw`flex-1 px-3.5 bg-white flex-row gap-1`,
            isSingleLine
              ? tw`rounded-full items-center`
              : tw`rounded-3xl items-end`,
            theme?.inputStyles?.inputContainerStyle,
          ]}
        >
          {showEmojiButton && (
            <Pressable style={tw`justify-center`}>
              {CustomEmojiIcon ? (
                <CustomEmojiIcon />
              ) : (
                <EmojiFunnySquareIcon
                  style={inputBarIconStyle}
                  color={theme?.colors?.inputsIconsColor || 'rgba(0,0,0,0.7)'}
                />
              )}
            </Pressable>
          )}

          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder={placeholder || 'Message'}
            style={withFontFamily(
              [
                tw`bg-transparent flex-1 pl-2 my-3`,
                Platform.OS === 'ios' ? tw`text-[17px]` : tw`text-[16px]`,
                { minHeight: MIN_INPUT_HEIGHT, maxHeight: MAX_INPUT_HEIGHT },
                {
                  color:
                    theme?.colors?.inputTextColor || 'rgba(247, 247, 247, 0.9)',
                },
              ],
              theme?.fontFamily
            )}
            placeholderTextColor={
              theme?.colors?.placeholderTextColor || 'rgba(0, 0, 0, 0.4)'
            }
            multiline
            textAlignVertical="center"
            onContentSizeChange={handleContentSizeChange}
          />

          <View style={tw`flex-row items-center gap-4`}>
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

        <Pressable
          style={[
            tw`p-2 rounded-full bg-green-600 justify-center items-center`,
            {
              height: Platform.OS === 'ios' ? 50 : 48,
              width: Platform.OS === 'ios' ? 50 : 48,
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
