import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, TextInput, View } from 'react-native';
import tw from 'twrnc';
import { CameraIcon } from '../../assets/Icons/CameraIcon';
import { EmojiFunnySquareIcon } from '../../assets/Icons/EmojiFunnySquareIcon';
import { MicrophoneIcon } from '../../assets/Icons/MicrophoneIcon';
import { PaperClipIcon } from '../../assets/Icons/PaperClipIcon';
import { PaperPlaneIcon } from '../../assets/Icons/PaperPlaneIcon';
import { useChatContext } from '../../context/ChatContext';
import {
  getInputBarIconPixelSize,
  getInputBarIconStyle,
  withFontFamily,
} from '../../utils/theme';
import FilePreview from './FilePreview';
import { ChatInputProps, InputHeightState } from './types';

const MIN_INPUT_HEIGHT = Platform.OS === 'ios' ? 32 : 30;
const MAX_INPUT_HEIGHT = 118;
/** Visual height of the pill bar (icons stay vertically centered in this band). */
const INPUT_BAR_SHELL_HEIGHT = Platform.OS === 'ios' ? 50 : 48;

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
  } = useChatContext();

  const previewList = useMemo(() => {
    if (previewItems?.length) return previewItems;
    if (previewData) return [previewData];
    return [];
  }, [previewItems, previewData]);

  const hasPreviewAttachments = previewList.length > 0;

  const inputBarIconSize = theme?.sizes?.inputIconSize;
  const inputBarIconStyle = getInputBarIconStyle(inputBarIconSize);
  const iconPixelSize = getInputBarIconPixelSize(inputBarIconSize);

  const isCompactInput =
    inputText.trim().length === 0 && !inputHeight.isMultiline;

  const iconInset = Math.max(0, (INPUT_BAR_SHELL_HEIGHT - iconPixelSize) / 2);
  const iconSlotStyle = isCompactInput
    ? { paddingTop: iconInset, paddingBottom: iconInset }
    : { paddingBottom: iconInset };

  const resetInputLayout = useCallback(() => {
    setInputHeight({ height: MIN_INPUT_HEIGHT, isMultiline: false });
    setInputResetKey((key) => key + 1);
  }, []);

  const handleChangeText = useCallback(
    (text: string) => {
      setInputText(text);
      if (text.length === 0) {
        resetInputLayout();
      }
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

    if (!trimmedText && !hasPreviewAttachments) {
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
    hasPreviewAttachments,
    resetInputLayout,
  ]);

  useEffect(() => {
    if (inputText.trim()) {
      onTypingStart?.();
    } else {
      onTypingEnd?.();
    }
  }, [inputText, onTypingStart, onTypingEnd]);

  const showSendButton = !!inputText.trim() || hasPreviewAttachments;

  return (
    <View style={tw`w-full px-2`}>
      {hasPreviewAttachments && (
        <FilePreview
          previews={previewList}
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

        <Pressable
          style={[
            tw`p-2 rounded-full bg-green-600 justify-center items-center`,
            {
              height: INPUT_BAR_SHELL_HEIGHT,
              width: INPUT_BAR_SHELL_HEIGHT,
              ...theme?.inputStyles?.sendButtonStyle,
            },
          ]}
          onPress={showSendButton ? handleSendMessage : onAudioRecordStart}
          onLongPress={onAudioRecordStart}
          onPressOut={onAudioRecordEnd}
        >
          {showSendButton ? (
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
