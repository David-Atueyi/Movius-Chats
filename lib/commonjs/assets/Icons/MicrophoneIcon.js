"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MicrophoneIcon = void 0;
var _reactNativeSvg = _interopRequireWildcard(require("react-native-svg"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const MicrophoneIcon = ({
  style,
  color
}) => {
  return /*#__PURE__*/React.createElement(_reactNativeSvg.default, {
    style: style,
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement(_reactNativeSvg.G, {
    fill: "none",
    strokeWidth: "1.5",
    stroke: color
  }, /*#__PURE__*/React.createElement(_reactNativeSvg.Path, {
    d: "M7 8a5 5 0 0 1 10 0v3a5 5 0 0 1-10 0z"
  }), /*#__PURE__*/React.createElement(_reactNativeSvg.Path, {
    strokeLinecap: "round",
    d: "M13.5 8H17m-3.5 3H17M7 8h2m-2 3h2m11-1v1a8 8 0 0 1-8 8m-8-9v1a8 8 0 0 0 8 8m0 0v3",
    opacity: ".5"
  })));
};
exports.MicrophoneIcon = MicrophoneIcon;
//# sourceMappingURL=MicrophoneIcon.js.map