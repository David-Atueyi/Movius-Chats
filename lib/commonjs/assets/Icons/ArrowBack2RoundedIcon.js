"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArrowBack2RoundedIcon = void 0;
var _reactNativeSvg = _interopRequireWildcard(require("react-native-svg"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const ArrowBack2RoundedIcon = ({
  style,
  color
}) => {
  return /*#__PURE__*/React.createElement(_reactNativeSvg.default, {
    style: style,
    fill: color,
    viewBox: "0 0 48 48"
  }, /*#__PURE__*/React.createElement(_reactNativeSvg.Path, {
    fillRule: "evenodd",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "4",
    d: "M8 9.115c0-1.82 2.235-2.694 3.47-1.356l29.432 31.884c1.182 1.282.273 3.357-1.47 3.357H10a2 2 0 0 1-2-2z",
    clipRule: "evenodd"
  }));
};
exports.ArrowBack2RoundedIcon = ArrowBack2RoundedIcon;
//# sourceMappingURL=ArrowBack2RoundedIcon.js.map