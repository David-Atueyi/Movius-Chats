"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaperPlaneIcon = void 0;
var _reactNativeSvg = _interopRequireWildcard(require("react-native-svg"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const PaperPlaneIcon = ({
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
    d: "m18.636 15.67l1.716-5.15c1.5-4.498 2.25-6.747 1.062-7.934s-3.436-.438-7.935 1.062L8.33 5.364C4.7 6.574 2.885 7.18 2.37 8.067a2.72 2.72 0 0 0 0 2.73c.515.888 2.33 1.493 5.96 2.704c.584.194.875.291 1.119.454c.236.158.439.361.597.597c.163.244.26.535.454 1.118c1.21 3.63 1.816 5.446 2.703 5.962a2.72 2.72 0 0 0 2.731 0c.887-.516 1.492-2.331 2.703-5.962Z"
  }), /*#__PURE__*/React.createElement(_reactNativeSvg.Path, {
    strokeLinecap: "round",
    d: "m17.79 6.21l-4.211 4.165",
    opacity: ".5"
  })));
};
exports.PaperPlaneIcon = PaperPlaneIcon;
//# sourceMappingURL=PaperPlaneIcon.js.map