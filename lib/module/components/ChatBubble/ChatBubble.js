import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import tw from 'twrnc';
import { ArrowBack2RoundedIcon } from '../../assets/Icons/ArrowBack2RoundedIcon';
import { useChatContext } from '../../context/ChatContext';
import MessageContent from './MessageContent';
import MessageStatus from './MessageStatus';
const ChatBubble = ({
  message,
  isCurrentUser,
  isFirstInSequence,
  onLongPress
}) => {
  const {
    theme,
    showAvatars,
    showUserNames,
    showBubbleTail,
    setMediaUrl,
    setIsVideoPlaying,
    isVideoPlaying
  } = useChatContext();
  const handleMediaPress = (type, url) => {
    setMediaUrl({
      imageUrl: type === 'image' ? url : '',
      videoUrl: type === 'video' ? url : ''
    });
    if (type === 'video') {
      setIsVideoPlaying(true);
    }
  };
  return /*#__PURE__*/React.createElement(Pressable, {
    onLongPress: onLongPress,
    style: [tw`px-2 my-1 max-w-[75%] relative`, isCurrentUser ? tw`self-end mr-3` : tw`self-start ml-9`, isFirstInSequence ? isCurrentUser ? tw`bg-green-500 rounded-tr-none` : tw`bg-white rounded-tl-none` : isCurrentUser ? tw`bg-green-500` : tw`bg-white`, {
      borderRadius: 8,
      ...(isCurrentUser ? theme?.bubbleStyle?.sent : theme?.bubbleStyle?.received)
    }]
  }, !isCurrentUser && isFirstInSequence && showAvatars && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(View, {
    style: tw`absolute w-6 h-6 rounded-full top-0 -left-9 flex-row items-center`
  }, message.senderAvatar ? /*#__PURE__*/React.createElement(Image, {
    source: {
      uri: message.senderAvatar
    },
    style: [tw`w-full h-full rounded-full`, theme?.bubbleStyle?.avatarImageStyle],
    resizeMode: "cover"
  }) : /*#__PURE__*/React.createElement(Text, {
    style: [tw`text-sm text-black font-semibold capitalize rounded-full bg-zinc-300 w-full h-full text-center pt-0.5`, theme?.bubbleStyle?.avatarTextStyle]
  }, message.senderName?.charAt(0))), showUserNames && message.senderName && /*#__PURE__*/React.createElement(Text, {
    style: [tw`text-sm text-black font-semibold mt-1 capitalize`, theme?.bubbleStyle?.userNameStyle]
  }, message.senderName)), isFirstInSequence && showBubbleTail && /*#__PURE__*/React.createElement(ArrowBack2RoundedIcon, {
    style: tw.style('absolute -top-1 w-6 h-6', isCurrentUser ? 'rotate-90 -right-3.5' : 'rotate-180 -left-3.5 mt-[1.25px]'),
    color: isCurrentUser ? `${theme?.colors?.sentMessageTailColor || 'rgba(34, 197, 94,1)'}` : `${theme?.colors?.receivedMessageTailColor || 'white'}`
  }), /*#__PURE__*/React.createElement(MessageContent, {
    message: message,
    isCurrentUser: isCurrentUser,
    isFirstInSequence: isFirstInSequence,
    onMediaPress: handleMediaPress,
    isVideoPlaying: isVideoPlaying
  }), /*#__PURE__*/React.createElement(MessageStatus, {
    time: message.time,
    status: isCurrentUser ? message.status : undefined,
    isCurrentUser: isCurrentUser,
    hasText: !!message.text,
    hasAudio: !!message.audio
  }));
};
export default /*#__PURE__*/React.memo(ChatBubble);
//# sourceMappingURL=ChatBubble.js.map