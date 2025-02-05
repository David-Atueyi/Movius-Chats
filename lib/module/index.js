import React from 'react';
import { FlatList, View } from 'react-native';
import tw from 'twrnc';
import ChatBubble from './components/ChatBubble/ChatBubble';
import ChatInput from './components/ChatInput/ChatInput';
import MediaViewer from './components/MediaViewer/MediaViewer';
import { TypingIndicator } from './components/TypingComponent/TypingIndicator';
import { AudioProvider } from './context/AudioContext';
import { ChatProvider, useChatContext } from './context/ChatContext';
const ChatScreenContent = () => {
  const {
    messages,
    currentUserId,
    onMessageLongPress,
    mediaUrl,
    setMediaUrl,
    setIsVideoPlaying,
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
    CustomSendIcon
  } = useChatContext();
  return /*#__PURE__*/React.createElement(View, {
    style: tw`flex-1 px-2 pb-4 gap-2 relative`
  }, /*#__PURE__*/React.createElement(FlatList, {
    data: messages,
    keyExtractor: item => item.id,
    renderItem: ({
      item,
      index
    }) => /*#__PURE__*/React.createElement(ChatBubble, {
      message: item,
      isCurrentUser: item.senderId === currentUserId,
      onLongPress: () => onMessageLongPress?.(item),
      isFirstInSequence: index === messages.length - 1 || messages[index + 1]?.senderId !== item.senderId
    }),
    ListHeaderComponent: /*#__PURE__*/React.createElement(TypingIndicator, {
      typingUsers: typingUsers || [],
      currentUserId: currentUserId
    }),
    showsVerticalScrollIndicator: false,
    inverted: true
  }), renderCustomInput ? renderCustomInput() : /*#__PURE__*/React.createElement(ChatInput, {
    onSendMessage: onSendMessage,
    onTypingStart: onTypingStart,
    onTypingEnd: onTypingEnd,
    onAttachmentPress: onAttachmentPress,
    onAudioRecordEnd: onAudioRecordEnd,
    onAudioRecordStart: onAudioRecordStart,
    onCameraPress: onCameraPress,
    CustomEmojiIcon: CustomEmojiIcon,
    CustomAttachmentIcon: CustomAttachmentIcon,
    CustomCameraIcon: CustomCameraIcon,
    CustomMicrophoneIcon: CustomMicrophoneIcon,
    CustomSendIcon: CustomSendIcon
  }), /*#__PURE__*/React.createElement(MediaViewer, {
    imageUrl: mediaUrl.imageUrl,
    videoUrl: mediaUrl.videoUrl,
    onClose: () => {
      setMediaUrl({
        imageUrl: '',
        videoUrl: ''
      });
      setIsVideoPlaying(false);
    }
  }));
};
const ChatScreen = props => {
  return /*#__PURE__*/React.createElement(AudioProvider, null, /*#__PURE__*/React.createElement(ChatProvider, props, /*#__PURE__*/React.createElement(ChatScreenContent, null)));
};
export default ChatScreen;
//# sourceMappingURL=index.js.map