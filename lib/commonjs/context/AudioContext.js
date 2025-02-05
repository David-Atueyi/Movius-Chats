"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAudio = exports.AudioProvider = void 0;
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const AudioContext = /*#__PURE__*/(0, _react.createContext)(undefined);
const AudioProvider = ({
  children
}) => {
  const [currentlyPlayingId, setCurrentlyPlayingId] = (0, _react.useState)(null);
  return /*#__PURE__*/_react.default.createElement(AudioContext.Provider, {
    value: {
      currentlyPlayingId,
      setCurrentlyPlayingId
    }
  }, children);
};
exports.AudioProvider = AudioProvider;
const useAudio = () => {
  const context = (0, _react.useContext)(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
exports.useAudio = useAudio;
//# sourceMappingURL=AudioContext.js.map