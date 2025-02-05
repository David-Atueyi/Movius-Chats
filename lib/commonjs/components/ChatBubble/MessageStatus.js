"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _twrnc = _interopRequireDefault(require("twrnc"));
var _CheckAllIcon = require("../../assets/Icons/CheckAllIcon");
var _CheckIcon = require("../../assets/Icons/CheckIcon");
var _ChatContext = require("../../context/ChatContext");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const MessageStatus = ({
  time,
  status,
  isCurrentUser,
  hasText,
  hasAudio
}) => {
  const {
    theme,
    showMessageStatus
  } = (0, _ChatContext.useChatContext)();
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, showMessageStatus && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [(0, _twrnc.default)`flex-row items-center`, hasText ? (0, _twrnc.default)`justify-end pb-1 ml-4` : hasAudio ? (0, _twrnc.default)`absolute right-3 bottom-3` : (0, _twrnc.default)`absolute right-3 bottom-4 bg-black/50 px-2 py-1 rounded-md`]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: [(0, _twrnc.default)`text-xs`, {
      color: hasText || hasAudio ? theme?.colors?.timestamp || 'rgba(107, 114, 128, 0.7)' : 'white'
    }]
  }, time), isCurrentUser && /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: (0, _twrnc.default)`ml-1 flex-row items-center`
  }, status === 'sent' && /*#__PURE__*/_react.default.createElement(_CheckIcon.CheckIcon, {
    style: _twrnc.default.style('fill-gray-500/70 h-4 w-4')
  }), status === 'delivered' && /*#__PURE__*/_react.default.createElement(_CheckAllIcon.CheckAllIcon, {
    style: _twrnc.default.style('fill-gray-500/70 h-4 w-4')
  }), status === 'read' && /*#__PURE__*/_react.default.createElement(_CheckAllIcon.CheckAllIcon, {
    style: _twrnc.default.style('fill-blue-500/90 h-4 w-4')
  }))));
};
var _default = exports.default = /*#__PURE__*/_react.default.memo(MessageStatus);
//# sourceMappingURL=MessageStatus.js.map