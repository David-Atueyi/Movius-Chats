"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TypingIndicator = void 0;
var _reactNative = require("react-native");
var _twrnc = _interopRequireDefault(require("twrnc"));
var _ArrowBack2RoundedIcon = require("../../assets/Icons/ArrowBack2RoundedIcon");
var _ChatContext = require("../../context/ChatContext");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const TypingIndicator = ({
  typingUsers,
  currentUserId
}) => {
  const {
    theme,
    showAvatars,
    renderCustomTyping,
    showBubbleTail
  } = (0, _ChatContext.useChatContext)();
  const otherTypingUsers = typingUsers.filter(user => user.id !== currentUserId);
  if (!otherTypingUsers.length) return null;
  const displayedUsers = otherTypingUsers.slice(0, 2);
  const additionalUsers = otherTypingUsers.length - 2;
  return /*#__PURE__*/React.createElement(_reactNative.View, {
    style: (0, _twrnc.default)`my-1 max-w-[75%] self-start flex-row`
  }, showAvatars && /*#__PURE__*/React.createElement(_reactNative.View, {
    style: (0, _twrnc.default)`flex-row`
  }, displayedUsers.map((user, index) => /*#__PURE__*/React.createElement(_reactNative.View, {
    key: user.id,
    style: [(0, _twrnc.default)`bg-gray-400 w-6 h-6 rounded-full items-center`, {
      marginLeft: index > 0 ? -10 : 0,
      zIndex: displayedUsers.length + index
    }]
  }, user.avatar ? /*#__PURE__*/React.createElement(_reactNative.Image, {
    source: {
      uri: user.avatar
    },
    style: [(0, _twrnc.default)`w-full h-full object-cover rounded-full`, theme?.bubbleStyle?.avatarImageStyle]
  }) : /*#__PURE__*/React.createElement(_reactNative.Text, {
    style: [(0, _twrnc.default)`text-sm text-black font-semibold capitalize rounded-full bg-zinc-300 w-full h-full text-center pt-0.5`, theme?.bubbleStyle?.avatarTextStyle]
  }, user.name?.charAt(0)))), additionalUsers > 0 && /*#__PURE__*/React.createElement(_reactNative.View, {
    style: [(0, _twrnc.default)`bg-gray-400 w-6 h-6 rounded-full items-center justify-center`, {
      marginLeft: -10,
      zIndex: 3
    }, {
      ...theme?.bubbleStyle?.additionalTypingUsersContainerStyle
    }]
  }, /*#__PURE__*/React.createElement(_reactNative.Text, {
    style: [(0, _twrnc.default)`text-white text-xs font-semibold`, theme?.bubbleStyle?.additionalTypingUsersTextStyle]
  }, "+", additionalUsers))), showBubbleTail && /*#__PURE__*/React.createElement(_ArrowBack2RoundedIcon.ArrowBack2RoundedIcon, {
    style: _twrnc.default.style('w-6 h-6 rotate-180 fill-white mt-[1.25px] translate-x-1.5'),
    color: `${theme?.colors?.receivedMessageTailColor || 'white'}`
  }), /*#__PURE__*/React.createElement(_reactNative.View, {
    style: [(0, _twrnc.default)`px-2 my-1 bg-white rounded-tl-none rounded-lg`, theme?.bubbleStyle?.typingContainerStyle]
  }, renderCustomTyping ? renderCustomTyping() : /*#__PURE__*/React.createElement(_reactNative.View, {
    style: (0, _twrnc.default)`flex-row items-center py-3 px-2 justify-center`
  }, /*#__PURE__*/React.createElement(_reactNative.Text, {
    style: (0, _twrnc.default)`text-gray-600`
  }, "Typing..."))));
};
exports.TypingIndicator = TypingIndicator;
//# sourceMappingURL=TypingIndicator.js.map