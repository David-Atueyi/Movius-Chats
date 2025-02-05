"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeVideo = _interopRequireDefault(require("react-native-video"));
var _twrnc = _interopRequireDefault(require("twrnc"));
var _LoadingIcon = require("../../assets/Icons/LoadingIcon");
var _PlayIcon = require("../../assets/Icons/PlayIcon");
var _ChatContext = require("../../context/ChatContext");
var _datefunc = require("../../utils/datefunc");
var _AudioPlayer = _interopRequireDefault(require("../AudioPlayer/AudioPlayer"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const MessageContent = ({
  message,
  onMediaPress,
  isVideoPlaying
}) => {
  const {
    theme,
    showMessageStatus,
    CustomPlayIcon,
    renderCustomVideoBubbleError
  } = (0, _ChatContext.useChatContext)();
  const videoRef = _react.default.useRef(null);
  const [duration, setDuration] = _react.default.useState(0);
  const [videoIsLoading, setVideoIsLoading] = _react.default.useState(false);
  const [videoHasError, setVideoHasError] = _react.default.useState(false);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, null, message.image && /*#__PURE__*/_react.default.createElement(_reactNative.Pressable, {
    onPress: () => onMediaPress('image', message.image),
    style: (0, _twrnc.default)`w-60 h-80 my-2`
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
    source: {
      uri: message.image
    },
    style: (0, _twrnc.default)`w-full h-full object-contain rounded-lg`
  })), message.video && /*#__PURE__*/_react.default.createElement(_reactNative.Pressable, {
    onPress: () => onMediaPress('video', message.video),
    style: (0, _twrnc.default)`w-60 h-80 my-2 justify-center items-center`,
    disabled: videoIsLoading
  }, /*#__PURE__*/_react.default.createElement(_reactNativeVideo.default, {
    source: {
      uri: message.video
    },
    ref: videoRef,
    paused: true,
    style: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
      position: 'relative'
    },
    resizeMode: "cover",
    onLoadStart: () => {
      setVideoIsLoading(true);
      setVideoHasError(false);
    },
    onLoad: data => {
      setDuration(data.duration);
      setVideoIsLoading(false);
    },
    onBuffer: ({
      isBuffering
    }) => setVideoIsLoading(isBuffering),
    onError: () => {
      setVideoHasError(true);
      setVideoIsLoading(false);
    }
  }), videoIsLoading ? /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: (0, _twrnc.default)`absolute inset-0 flex items-center justify-center bg-black/40 rounded-full`
  }, /*#__PURE__*/_react.default.createElement(_LoadingIcon.LoadingIcon, {
    style: _twrnc.default.style('h-12 w-12 fill-white animate-spin')
  })) : videoHasError ? renderCustomVideoBubbleError ? renderCustomVideoBubbleError() : /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: (0, _twrnc.default)`absolute inset-0 flex items-center justify-center bg-red-500/60 p-2`
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: (0, _twrnc.default)`text-white font-bold`
  }, "Failed to load video")) : /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: (0, _twrnc.default)`absolute bg-black/40 rounded-full`
  }, CustomPlayIcon ? /*#__PURE__*/_react.default.createElement(CustomPlayIcon, null) : /*#__PURE__*/_react.default.createElement(_PlayIcon.PlayIcon, {
    style: _twrnc.default.style('h-16 w-16'),
    color: theme?.colors?.audioPlayIconColor || 'white'
  })), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: (0, _twrnc.default)`absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded-md`
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: (0, _twrnc.default)`text-white text-xs font-semibold`
  }, (0, _datefunc.formatDuration)(duration))))), message.audio && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: (0, _twrnc.default)`my-2`
  }, /*#__PURE__*/_react.default.createElement(_AudioPlayer.default, {
    audioUrl: message.audio,
    audioId: message.id,
    isVideoPlaying: isVideoPlaying
  })), message.text && /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: [(0, _twrnc.default)`text-gray-800 pt-1`, showMessageStatus ? (0, _twrnc.default)`pb-0` : (0, _twrnc.default)`pb-2`, {
      wordBreak: 'break-word',
      overflowWrap: 'break-word'
    }, theme?.messageStyle?.textStyle]
  }, message.text));
};
var _default = exports.default = /*#__PURE__*/_react.default.memo(MessageContent);
//# sourceMappingURL=MessageContent.js.map