import React, { useCallback, useEffect, useState } from 'react';
import { Platform, Pressable, TextInput, View } from 'react-native';
import tw from 'twrnc';
import { CameraIcon } from '../../assets/Icons/CameraIcon';
import { EmojiFunnySquareIcon } from '../../assets/Icons/EmojiFunnySquareIcon';
import { MicrophoneIcon } from '../../assets/Icons/MicrophoneIcon';
import { PaperClipIcon } from '../../assets/Icons/PaperClipIcon';
import { PaperPlaneIcon } from '../../assets/Icons/PaperPlaneIcon';
import { useChatContext } from '../../context/ChatContext';
import FilePreview from './FilePreview';
import { ChatInputProps, InputHeightState } from './types';

const MIN_INPUT_HEIGHT = Platform.OS === 'ios' ? 32 : 30;
const MAX_INPUT_HEIGHT = 118;

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

  return (
    <View
      style={[
        tw`flex-row gap-2`,
        theme?.inputStyles?.inputSectionContainerStyle,
      ]}
    >
      {/* File Preview above the input */}
      {previewData && (
        <FilePreview
          previewData={previewData}
          closePreview={closePreview}
          CustomFileIcon={CustomFileIcon}
          CustomImagePreview={CustomImagePreview}
          CustomVideoPreview={CustomVideoPreview}
        />
      )}
      <View
        style={[
          tw`flex-1 bg-white px-3.5 gap-1 flex-row justify-between`,
          inputHeight.isMultiline
            ? tw`rounded-3xl items-end`
            : tw`rounded-full items-center`,
          theme?.inputStyles?.inputContainerStyle,
        ]}
      >
        {showEmojiButton && (
          <Pressable>
            {CustomEmojiIcon ? (
              <CustomEmojiIcon />
            ) : (
              <EmojiFunnySquareIcon
                style={tw.style(
                  `${Platform.OS === 'ios' ? 'h-6 w-6' : 'w-7 h-7'}`,
                  inputHeight.isMultiline ? 'pb-14' : 'pb-0'
                )}
                color={theme?.colors?.inputsIconsColor || 'rgba(0,0,0,0.7)'}
              />
            )}
          </Pressable>
        )}

        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder={placeholder || 'Message'}
          style={[
            tw`bg-transparent flex-1 pl-2 my-3`,
            Platform.OS === 'ios' ? tw`text-[17px]` : tw`text-[16px]`,
            { minHeight: MIN_INPUT_HEIGHT, maxHeight: MAX_INPUT_HEIGHT },
          ]}
          placeholderTextColor={
            theme?.colors?.placeholderTextColor || 'rgba(0, 0, 0, 0.4)'
          }
          multiline
          textAlignVertical="center"
          onContentSizeChange={handleContentSizeChange}
        />

        <View
          style={[
            tw`gap-4 flex-row`,
            inputHeight.isMultiline ? tw`pb-4` : tw`pb-0`,
          ]}
        >
          {showAttachmentsButton && (
            <Pressable onPress={onAttachmentPress}>
              {CustomAttachmentIcon ? (
                <CustomAttachmentIcon />
              ) : (
                <PaperClipIcon
                  style={tw.style(
                    Platform.OS === 'ios' ? 'h-6 w-6' : 'w-7 h-7'
                  )}
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
                  style={tw.style(
                    Platform.OS === 'ios' ? 'h-6 w-6' : 'w-7 h-7'
                  )}
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
              style={tw.style('h-6 w-6')}
              color={theme?.colors?.sendIconsColor || 'rgba(255,255,255,0.7)'}
            />
          )
        ) : showVoiceRecordButton ? (
          CustomMicrophoneIcon ? (
            <CustomMicrophoneIcon />
          ) : (
            <MicrophoneIcon
              style={tw.style('h-8 w-8')}
              color={theme?.colors?.sendIconsColor || 'rgba(255,255,255,0.7)'}
            />
          )
        ) : CustomSendIcon ? (
          <CustomSendIcon />
        ) : (
          <PaperPlaneIcon
            style={tw.style('h-6 w-6')}
            color={theme?.colors?.sendIconsColor || 'rgba(255,255,255,0.7)'}
          />
        )}
      </Pressable>
    </View>
  );
};

export default React.memo(ChatInput);
