"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmojiFunnySquareIcon = void 0;
var _reactNativeSvg = _interopRequireWildcard(require("react-native-svg"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const EmojiFunnySquareIcon = ({
  style,
  color
}) => {
  return /*#__PURE__*/React.createElement(_reactNativeSvg.default, {
    style: style,
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement(_reactNativeSvg.G, {
    fill: "none",
    stroke: color
  }, /*#__PURE__*/React.createElement(_reactNativeSvg.Path, {
    strokeLinecap: "round",
    strokeWidth: "1.5",
    d: "M8.913 15.934c1.258.315 2.685.315 4.122-.07s2.673-1.099 3.605-2.001"
  }), /*#__PURE__*/React.createElement(_reactNativeSvg.Ellipse, {
    cx: "14.509",
    cy: "9.774",
    fill: "currentColor",
    rx: "1",
    ry: "1.5",
    transform: "rotate(-15 14.51 9.774)"
  }), /*#__PURE__*/React.createElement(_reactNativeSvg.Ellipse, {
    cx: "8.714",
    cy: "11.328",
    fill: "currentColor",
    rx: "1",
    ry: "1.5",
    transform: "rotate(-15 8.714 11.328)"
  }), /*#__PURE__*/React.createElement(_reactNativeSvg.Path, {
    strokeWidth: "1.5",
    d: "M3.204 14.357c-1.112-4.147-1.667-6.22-.724-7.853s3.016-2.19 7.163-3.3c4.147-1.112 6.22-1.667 7.853-.724s2.19 3.016 3.3 7.163c1.111 4.147 1.667 6.22.724 7.853s-3.016 2.19-7.163 3.3c-4.147 1.111-6.22 1.667-7.853.724s-2.19-3.016-3.3-7.163Z"
  }), /*#__PURE__*/React.createElement(_reactNativeSvg.Path, {
    strokeWidth: "1.5",
    d: "m13 16l.478.974a1.5 1.5 0 1 0 2.693-1.322l-.46-.935"
  })));
};
exports.EmojiFunnySquareIcon = EmojiFunnySquareIcon;
//# sourceMappingURL=EmojiFunnySquareIcon.js.map