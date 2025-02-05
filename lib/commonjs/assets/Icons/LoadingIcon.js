"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoadingIcon = void 0;
var _reactNativeSvg = _interopRequireWildcard(require("react-native-svg"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const LoadingIcon = ({
  style
}) => {
  return /*#__PURE__*/React.createElement(_reactNativeSvg.default, {
    style: style,
    viewBox: "0 0 1024 1024"
  }, /*#__PURE__*/React.createElement(_reactNativeSvg.Path, {
    d: "M988 548c-19.9 0-36-16.1-36-36c0-59.4-11.6-117-34.6-171.3a440.5 440.5 0 0 0-94.3-139.9a437.7 437.7 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150s83.9 101.8 109.7 162.7c26.7 63.1 40.2 130.2 40.2 199.3c.1 19.9-16 36-35.9 36"
  }));
};
exports.LoadingIcon = LoadingIcon;
//# sourceMappingURL=LoadingIcon.js.map