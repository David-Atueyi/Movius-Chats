"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _LoadingIcon = require("../../assets/Icons/LoadingIcon");
var _XIcon = require("../../assets/Icons/XIcon");
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeImageZoomViewer = _interopRequireDefault(require("react-native-image-zoom-viewer"));
var _reactNativeVideo = _interopRequireDefault(require("react-native-video"));
var _twrnc = _interopRequireDefault(require("twrnc"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const MediaViewer = ({
  imageUrl,
  videoUrl,
  onClose
}) => {
  const videoRef = (0, _react.useRef)(null);
  const [videoIsLoading, setVideoIsLoading] = (0, _react.useState)(false);
  const [videoHasError, setVideoHasError] = (0, _react.useState)(false);
  if (!imageUrl && !videoUrl) return null;
  return /*#__PURE__*/_react.default.createElement(_reactNative.Modal, {
    visible: !!imageUrl || !!videoUrl,
    transparent: true
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: (0, _twrnc.default)`top-0 bottom-0 left-0 right-0 bg-black/80 flex-1 absolute`
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Pressable, {
    onPress: onClose,
    style: (0, _twrnc.default)`absolute right-4 top-4 p-2 rounded-full bg-slate-100/70 z-10`
  }, /*#__PURE__*/_react.default.createElement(_XIcon.XIcon, {
    style: (0, _twrnc.default)`h-8 w-8 stroke-black`
  })), imageUrl && /*#__PURE__*/_react.default.createElement(_reactNativeImageZoomViewer.default, {
    imageUrls: [{
      url: imageUrl
    }],
    enableSwipeDown: true,
    onSwipeDown: onClose,
    backgroundColor: "rgba(0,0,0,0.8)",
    enableImageZoom: true,
    onSave: () => imageUrl,
    renderIndicator: () => /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null)
  }), videoUrl && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: (0, _twrnc.default)`justify-center items-center`
  }, /*#__PURE__*/_react.default.createElement(_reactNativeVideo.default, {
    source: {
      uri: videoUrl
    },
    ref: videoRef,
    shutterColor: "transparent",
    controls: true,
    style: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
      position: 'relative',
      marginHorizontal: 48
    },
    controlsStyles: {
      hideSettingButton: false,
      hideNext: true,
      hidePrevious: true
    },
    resizeMode: "contain",
    onLoadStart: () => {
      setVideoIsLoading(true);
      setVideoHasError(false);
    },
    onLoad: () => setVideoIsLoading(false),
    onBuffer: ({
      isBuffering
    }) => setVideoIsLoading(isBuffering),
    onError: () => {
      setVideoHasError(true);
      setVideoIsLoading(false);
    }
  }), videoIsLoading && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: (0, _twrnc.default)`absolute inset-0 flex items-center justify-center bg-black/40 rounded-full`
  }, /*#__PURE__*/_react.default.createElement(_LoadingIcon.LoadingIcon, {
    style: _twrnc.default.style('h-12 w-12 fill-white animate-spin')
  })), videoHasError && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: (0, _twrnc.default)`absolute inset-0 flex items-center justify-center bg-red-500/60 p-2`
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: (0, _twrnc.default)`text-white font-bold`
  }, "Failed to load video")))));
};
var _default = exports.default = /*#__PURE__*/_react.default.memo(MediaViewer);
//# sourceMappingURL=MediaViewer.js.map