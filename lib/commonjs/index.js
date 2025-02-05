"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _twrnc = _interopRequireDefault(require("twrnc"));
var _ChatBubble = _interopRequireDefault(require("./components/ChatBubble/ChatBubble"));
var _ChatInput = _interopRequireDefault(require("./components/ChatInput/ChatInput"));
var _MediaViewer = _interopRequireDefault(require("./components/MediaViewer/MediaViewer"));
var _TypingIndicator = require("./components/TypingComponent/TypingIndicator");
var _AudioContext = require("./context/AudioContext");
var _ChatContext = require("./context/ChatContext");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
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
  } = (0, _ChatContext.useChatContext)();
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: (0, _twrnc.default)`flex-1 px-2 pb-4 gap-2 relative`
  }, /*#__PURE__*/_react.default.createElement(_reactNative.FlatList, {
    data: messages,
    keyExtractor: item => item.id,
    renderItem: ({
      item,
      index
    }) => /*#__PURE__*/_react.default.createElement(_ChatBubble.default, {
      message: item,
      isCurrentUser: item.senderId === currentUserId,
      onLongPress: () => onMessageLongPress?.(item),
      isFirstInSequence: index === messages.length - 1 || messages[index + 1]?.senderId !== item.senderId
    }),
    ListHeaderComponent: /*#__PURE__*/_react.default.createElement(_TypingIndicator.TypingIndicator, {
      typingUsers: typingUsers || [],
      currentUserId: currentUserId
    }),
    showsVerticalScrollIndicator: false,
    inverted: true
  }), renderCustomInput ? renderCustomInput() : /*#__PURE__*/_react.default.createElement(_ChatInput.default, {
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
  }), /*#__PURE__*/_react.default.createElement(_MediaViewer.default, {
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
  return /*#__PURE__*/_react.default.createElement(_AudioContext.AudioProvider, null, /*#__PURE__*/_react.default.createElement(_ChatContext.ChatProvider, props, /*#__PURE__*/_react.default.createElement(ChatScreenContent, null)));
};
var _default = exports.default = ChatScreen;
//# sourceMappingURL=index.js.map