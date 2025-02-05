"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.XIcon = XIcon;
var _reactNativeSvg = require("react-native-svg");
var _twrnc = _interopRequireDefault(require("twrnc"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// assuming you're using twrnc for styling

function XIcon({
  style
}) {
  return /*#__PURE__*/React.createElement(_reactNativeSvg.Svg, {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: _twrnc.default.style("feather feather-x", style)
  }, /*#__PURE__*/React.createElement(_reactNativeSvg.Line, {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement(_reactNativeSvg.Line, {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }));
}
//# sourceMappingURL=XIcon.js.map