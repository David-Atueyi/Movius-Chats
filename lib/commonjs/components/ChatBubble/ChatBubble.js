"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _twrnc = _interopRequireDefault(require("twrnc"));
var _ArrowBack2RoundedIcon = require("../../assets/Icons/ArrowBack2RoundedIcon");
var _ChatContext = require("../../context/ChatContext");
var _MessageContent = _interopRequireDefault(require("./MessageContent"));
var _MessageStatus = _interopRequireDefault(require("./MessageStatus"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
  } = (0, _ChatContext.useChatContext)();
  const handleMediaPress = (type, url) => {
    setMediaUrl({
      imageUrl: type === 'image' ? url : '',
      videoUrl: type === 'video' ? url : ''
    });
    if (type === 'video') {
      setIsVideoPlaying(true);
    }
  };
  return /*#__PURE__*/_react.default.createElement(_reactNative.Pressable, {
    onLongPress: onLongPress,
    style: [(0, _twrnc.default)`px-2 my-1 max-w-[75%] relative`, isCurrentUser ? (0, _twrnc.default)`self-end mr-3` : (0, _twrnc.default)`self-start ml-9`, isFirstInSequence ? isCurrentUser ? (0, _twrnc.default)`bg-green-500 rounded-tr-none` : (0, _twrnc.default)`bg-white rounded-tl-none` : isCurrentUser ? (0, _twrnc.default)`bg-green-500` : (0, _twrnc.default)`bg-white`, {
      borderRadius: 8,
      ...(isCurrentUser ? theme?.bubbleStyle?.sent : theme?.bubbleStyle?.received)
    }]
  }, !isCurrentUser && isFirstInSequence && showAvatars && /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: (0, _twrnc.default)`absolute w-6 h-6 rounded-full top-0 -left-9 flex-row items-center`
  }, message.senderAvatar ? /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
    source: {
      uri: message.senderAvatar
    },
    style: [(0, _twrnc.default)`w-full h-full rounded-full`, theme?.bubbleStyle?.avatarImageStyle],
    resizeMode: "cover"
  }) : /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: [(0, _twrnc.default)`text-sm text-black font-semibold capitalize rounded-full bg-zinc-300 w-full h-full text-center pt-0.5`, theme?.bubbleStyle?.avatarTextStyle]
  }, message.senderName?.charAt(0))), showUserNames && message.senderName && /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: [(0, _twrnc.default)`text-sm text-black font-semibold mt-1 capitalize`, theme?.bubbleStyle?.userNameStyle]
  }, message.senderName)), isFirstInSequence && showBubbleTail && /*#__PURE__*/_react.default.createElement(_ArrowBack2RoundedIcon.ArrowBack2RoundedIcon, {
    style: _twrnc.default.style('absolute -top-1 w-6 h-6', isCurrentUser ? '-right-3.5' : '-left-3.5 mt-[1.25px]', {
      transform: [{
        rotate: isCurrentUser ? '90deg' : '180deg'
      }]
    }),
    color: isCurrentUser ? `${theme?.colors?.sentMessageTailColor || 'rgba(34, 197, 94,1)'}` : `${theme?.colors?.receivedMessageTailColor || 'white'}`
  }), /*#__PURE__*/_react.default.createElement(_MessageContent.default, {
    message: message,
    isCurrentUser: isCurrentUser,
    isFirstInSequence: isFirstInSequence,
    onMediaPress: handleMediaPress,
    isVideoPlaying: isVideoPlaying
  }), /*#__PURE__*/_react.default.createElement(_MessageStatus.default, {
    time: message.time,
    status: isCurrentUser ? message.status : undefined,
    isCurrentUser: isCurrentUser,
    hasText: !!message.text,
    hasAudio: !!message.audio
  }));
};
var _default = exports.default = /*#__PURE__*/_react.default.memo(ChatBubble);
//# sourceMappingURL=ChatBubble.js.map