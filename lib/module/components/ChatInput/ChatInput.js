import { CameraIcon } from "../../assets/Icons/CameraIcon";
import { EmojiFunnySquareIcon } from "../../assets/Icons/EmojiFunnySquareIcon";
import { MicrophoneIcon } from "../../assets/Icons/MicrophoneIcon";
import { PaperClipIcon } from "../../assets/Icons/PaperClipIcon";
import { PaperPlaneIcon } from "../../assets/Icons/PaperPlaneIcon";
import React, { useCallback, useEffect, useState } from "react";
import { Platform, Pressable, TextInput, View } from "react-native";
import { useChatContext } from "../../context/ChatContext";
import tw from 'twrnc';
const MIN_INPUT_HEIGHT = Platform.OS === "ios" ? 32 : 30;
const MAX_INPUT_HEIGHT = 118;
const ChatInput = ({
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
  CustomMicrophoneIcon
}) => {
  const [inputText, setInputText] = useState("");
  const [inputHeight, setInputHeight] = useState({
    height: MIN_INPUT_HEIGHT,
    isMultiline: false
  });
  const {
    theme,
    currentUserId,
    showEmojiButton,
    showAttachmentsButton,
    showCameraButton,
    showVoiceRecordButton,
    placeholder
  } = useChatContext();
  const handleContentSizeChange = useCallback(event => {
    const newHeight = Math.min(Math.max(event.nativeEvent.contentSize.height, MIN_INPUT_HEIGHT), MAX_INPUT_HEIGHT);
    setInputHeight({
      height: newHeight,
      isMultiline: newHeight > MIN_INPUT_HEIGHT
    });
  }, []);
  const handleSendMessage = useCallback(() => {
    if (inputText.trim()) {
      onSendMessage({
        text: inputText.trim(),
        senderId: currentUserId
      });
      setInputText("");
      setInputHeight({
        height: MIN_INPUT_HEIGHT,
        isMultiline: false
      });
    }
  }, [inputText, onSendMessage, currentUserId]);
  useEffect(() => {
    if (inputText.trim()) {
      onTypingStart?.();
    } else {
      onTypingEnd?.();
    }
  }, [inputText, onTypingStart, onTypingEnd]);
  return /*#__PURE__*/React.createElement(View, {
    style: [tw`flex-row gap-2`, theme?.inputStyles?.inputSectionContainerStyle]
  }, /*#__PURE__*/React.createElement(View, {
    style: [tw`flex-1 bg-white px-3.5 gap-1 flex-row justify-between`, inputHeight.isMultiline ? tw`rounded-3xl items-end` : tw`rounded-full items-center`, theme?.inputStyles?.inputContainerStyle]
  }, showEmojiButton && /*#__PURE__*/React.createElement(Pressable, null, CustomEmojiIcon ? /*#__PURE__*/React.createElement(CustomEmojiIcon, null) : /*#__PURE__*/React.createElement(EmojiFunnySquareIcon, {
    style: tw.style(`${Platform.OS === 'ios' ? 'h-6 w-6' : 'w-7 h-7'}`, inputHeight.isMultiline ? 'pb-14' : 'pb-0'),
    color: theme?.colors?.inputsIconsColor || 'rgba(0,0,0,0.7)'
  })), /*#__PURE__*/React.createElement(TextInput, {
    value: inputText,
    onChangeText: setInputText,
    placeholder: placeholder || 'Message',
    style: [tw`bg-transparent flex-1 pl-2 my-3`, Platform.OS === 'ios' ? tw`text-[17px]` : tw`text-[16px]`, {
      minHeight: MIN_INPUT_HEIGHT,
      maxHeight: MAX_INPUT_HEIGHT
    }],
    placeholderTextColor: theme?.colors?.placeholderTextColor || 'rgba(0, 0, 0, 0.4)',
    multiline: true,
    textAlignVertical: "center",
    onContentSizeChange: handleContentSizeChange
  }), /*#__PURE__*/React.createElement(View, {
    style: [tw`gap-4 flex-row`, inputHeight.isMultiline ? tw`pb-4` : tw`pb-0`]
  }, showAttachmentsButton && /*#__PURE__*/React.createElement(Pressable, {
    onPress: onAttachmentPress
  }, CustomAttachmentIcon ? /*#__PURE__*/React.createElement(CustomAttachmentIcon, null) : /*#__PURE__*/React.createElement(PaperClipIcon, {
    style: tw.style(Platform.OS === 'ios' ? 'h-6 w-6' : 'w-7 h-7'),
    color: theme?.colors?.inputsIconsColor || 'rgba(0,0,0,0.7)'
  })), showCameraButton && !inputText.trim() && /*#__PURE__*/React.createElement(Pressable, {
    onPress: onCameraPress
  }, CustomCameraIcon ? /*#__PURE__*/React.createElement(CustomCameraIcon, null) : /*#__PURE__*/React.createElement(CameraIcon, {
    style: tw.style(Platform.OS === 'ios' ? 'h-6 w-6' : 'w-7 h-7'),
    color: theme?.colors?.inputsIconsColor || 'rgba(0,0,0,0.7)'
  })))), /*#__PURE__*/React.createElement(Pressable, {
    style: [tw`p-2 rounded-full bg-green-600 justify-center items-center`, {
      height: Platform.OS === 'ios' ? 50 : 48,
      width: Platform.OS === 'ios' ? 50 : 48,
      ...theme?.inputStyles?.sendButtonStyle
    }],
    onPress: inputText.trim() ? handleSendMessage : onAudioRecordStart,
    onLongPress: onAudioRecordStart,
    onPressOut: onAudioRecordEnd
  }, inputText.trim() ? CustomSendIcon ? /*#__PURE__*/React.createElement(CustomSendIcon, null) : /*#__PURE__*/React.createElement(PaperPlaneIcon, {
    style: tw.style('h-6 w-6'),
    color: theme?.colors?.sendIconsColor || 'rgba(255,255,255,0.7)'
  }) : showVoiceRecordButton ? CustomMicrophoneIcon ? /*#__PURE__*/React.createElement(CustomMicrophoneIcon, null) : /*#__PURE__*/React.createElement(MicrophoneIcon, {
    style: tw.style('h-8 w-8'),
    color: theme?.colors?.sendIconsColor || 'rgba(255,255,255,0.7)'
  }) : CustomSendIcon ? /*#__PURE__*/React.createElement(CustomSendIcon, null) : /*#__PURE__*/React.createElement(PaperPlaneIcon, {
    style: tw.style('h-6 w-6'),
    color: theme?.colors?.sendIconsColor || 'rgba(255,255,255,0.7)'
  })));
};
export default /*#__PURE__*/React.memo(ChatInput);
//# sourceMappingURL=ChatInput.js.map