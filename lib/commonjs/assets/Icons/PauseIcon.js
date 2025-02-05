"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PauseIcon = void 0;
var _reactNativeSvg = _interopRequireWildcard(require("react-native-svg"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const PauseIcon = ({
  style,
  color
}) => {
  return /*#__PURE__*/React.createElement(_reactNativeSvg.default, {
    style: style,
    viewBox: "0 0 15 15"
  }, /*#__PURE__*/React.createElement(_reactNativeSvg.Path, {
    fill: color,
    fillRule: "evenodd",
    d: "M6.05 2.75a.55.55 0 0 0-1.1 0v9.5a.55.55 0 0 0 1.1 0zm4 0a.55.55 0 0 0-1.1 0v9.5a.55.55 0 0 0 1.1 0z",
    clipRule: "evenodd"
  }));
};
exports.PauseIcon = PauseIcon;
//# sourceMappingURL=PauseIcon.js.map