"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _CameraIcon = require("../../assets/Icons/CameraIcon");
var _EmojiFunnySquareIcon = require("../../assets/Icons/EmojiFunnySquareIcon");
var _MicrophoneIcon = require("../../assets/Icons/MicrophoneIcon");
var _PaperClipIcon = require("../../assets/Icons/PaperClipIcon");
var _PaperPlaneIcon = require("../../assets/Icons/PaperPlaneIcon");
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _ChatContext = require("../../context/ChatContext");
var _twrnc = _interopRequireDefault(require("twrnc"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const MIN_INPUT_HEIGHT = _reactNative.Platform.OS === "ios" ? 32 : 30;
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
  const [inputText, setInputText] = (0, _react.useState)("");
  const [inputHeight, setInputHeight] = (0, _react.useState)({
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
  } = (0, _ChatContext.useChatContext)();
  const handleContentSizeChange = (0, _react.useCallback)(event => {
    const newHeight = Math.min(Math.max(event.nativeEvent.contentSize.height, MIN_INPUT_HEIGHT), MAX_INPUT_HEIGHT);
    setInputHeight({
      height: newHeight,
      isMultiline: newHeight > MIN_INPUT_HEIGHT
    });
  }, []);
  const handleSendMessage = (0, _react.useCallback)(() => {
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
  (0, _react.useEffect)(() => {
    if (inputText.trim()) {
      onTypingStart?.();
    } else {
      onTypingEnd?.();
    }
  }, [inputText, onTypingStart, onTypingEnd]);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [(0, _twrnc.default)`flex-row gap-2`, theme?.inputStyles?.inputSectionContainerStyle]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [(0, _twrnc.default)`flex-1 bg-white px-3.5 gap-1 flex-row justify-between`, inputHeight.isMultiline ? (0, _twrnc.default)`rounded-3xl items-end` : (0, _twrnc.default)`rounded-full items-center`, theme?.inputStyles?.inputContainerStyle]
  }, showEmojiButton && /*#__PURE__*/_react.default.createElement(_reactNative.Pressable, null, CustomEmojiIcon ? /*#__PURE__*/_react.default.createElement(CustomEmojiIcon, null) : /*#__PURE__*/_react.default.createElement(_EmojiFunnySquareIcon.EmojiFunnySquareIcon, {
    style: _twrnc.default.style(`${_reactNative.Platform.OS === 'ios' ? 'h-6 w-6' : 'w-7 h-7'}`, inputHeight.isMultiline ? 'pb-14' : 'pb-0'),
    color: theme?.colors?.inputsIconsColor || 'rgba(0,0,0,0.7)'
  })), /*#__PURE__*/_react.default.createElement(_reactNative.TextInput, {
    value: inputText,
    onChangeText: setInputText,
    placeholder: placeholder || 'Message',
    style: [(0, _twrnc.default)`bg-transparent flex-1 pl-2 my-3`, _reactNative.Platform.OS === 'ios' ? (0, _twrnc.default)`text-[17px]` : (0, _twrnc.default)`text-[16px]`, {
      minHeight: MIN_INPUT_HEIGHT,
      maxHeight: MAX_INPUT_HEIGHT
    }],
    placeholderTextColor: theme?.colors?.placeholderTextColor || 'rgba(0, 0, 0, 0.4)',
    multiline: true,
    textAlignVertical: "center",
    onContentSizeChange: handleContentSizeChange
  }), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [(0, _twrnc.default)`gap-4 flex-row`, inputHeight.isMultiline ? (0, _twrnc.default)`pb-4` : (0, _twrnc.default)`pb-0`]
  }, showAttachmentsButton && /*#__PURE__*/_react.default.createElement(_reactNative.Pressable, {
    onPress: onAttachmentPress
  }, CustomAttachmentIcon ? /*#__PURE__*/_react.default.createElement(CustomAttachmentIcon, null) : /*#__PURE__*/_react.default.createElement(_PaperClipIcon.PaperClipIcon, {
    style: _twrnc.default.style(_reactNative.Platform.OS === 'ios' ? 'h-6 w-6' : 'w-7 h-7'),
    color: theme?.colors?.inputsIconsColor || 'rgba(0,0,0,0.7)'
  })), showCameraButton && !inputText.trim() && /*#__PURE__*/_react.default.createElement(_reactNative.Pressable, {
    onPress: onCameraPress
  }, CustomCameraIcon ? /*#__PURE__*/_react.default.createElement(CustomCameraIcon, null) : /*#__PURE__*/_react.default.createElement(_CameraIcon.CameraIcon, {
    style: _twrnc.default.style(_reactNative.Platform.OS === 'ios' ? 'h-6 w-6' : 'w-7 h-7'),
    color: theme?.colors?.inputsIconsColor || 'rgba(0,0,0,0.7)'
  })))), /*#__PURE__*/_react.default.createElement(_reactNative.Pressable, {
    style: [(0, _twrnc.default)`p-2 rounded-full bg-green-600 justify-center items-center`, {
      height: _reactNative.Platform.OS === 'ios' ? 50 : 48,
      width: _reactNative.Platform.OS === 'ios' ? 50 : 48,
      ...theme?.inputStyles?.sendButtonStyle
    }],
    onPress: inputText.trim() ? handleSendMessage : onAudioRecordStart,
    onLongPress: onAudioRecordStart,
    onPressOut: onAudioRecordEnd
  }, inputText.trim() ? CustomSendIcon ? /*#__PURE__*/_react.default.createElement(CustomSendIcon, null) : /*#__PURE__*/_react.default.createElement(_PaperPlaneIcon.PaperPlaneIcon, {
    style: _twrnc.default.style('h-6 w-6'),
    color: theme?.colors?.sendIconsColor || 'rgba(255,255,255,0.7)'
  }) : showVoiceRecordButton ? CustomMicrophoneIcon ? /*#__PURE__*/_react.default.createElement(CustomMicrophoneIcon, null) : /*#__PURE__*/_react.default.createElement(_MicrophoneIcon.MicrophoneIcon, {
    style: _twrnc.default.style('h-8 w-8'),
    color: theme?.colors?.sendIconsColor || 'rgba(255,255,255,0.7)'
  }) : CustomSendIcon ? /*#__PURE__*/_react.default.createElement(CustomSendIcon, null) : /*#__PURE__*/_react.default.createElement(_PaperPlaneIcon.PaperPlaneIcon, {
    style: _twrnc.default.style('h-6 w-6'),
    color: theme?.colors?.sendIconsColor || 'rgba(255,255,255,0.7)'
  })));
};
var _default = exports.default = /*#__PURE__*/_react.default.memo(ChatInput);
//# sourceMappingURL=ChatInput.js.map