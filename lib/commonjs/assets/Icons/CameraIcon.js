"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CameraIcon = void 0;
var _reactNativeSvg = require("react-native-svg");
const CameraIcon = ({
  style,
  color
}) => {
  return /*#__PURE__*/React.createElement(_reactNativeSvg.Svg, {
    style: style,
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement(_reactNativeSvg.G, {
    fill: "none",
    strokeWidth: "1.5",
    stroke: color
  }, /*#__PURE__*/React.createElement(_reactNativeSvg.Circle, {
    cx: "12",
    cy: "13",
    r: "3"
  }), /*#__PURE__*/React.createElement(_reactNativeSvg.Path, {
    d: "M9.778 21h4.444c3.121 0 4.682 0 5.803-.735a4.4 4.4 0 0 0 1.226-1.204c.749-1.1.749-2.633.749-5.697s0-4.597-.749-5.697a4.4 4.4 0 0 0-1.226-1.204c-.72-.473-1.622-.642-3.003-.702c-.659 0-1.226-.49-1.355-1.125A2.064 2.064 0 0 0 13.634 3h-3.268c-.988 0-1.839.685-2.033 1.636c-.129.635-.696 1.125-1.355 1.125c-1.38.06-2.282.23-3.003.702A4.4 4.4 0 0 0 2.75 7.667C2 8.767 2 10.299 2 13.364s0 4.596.749 5.697c.324.476.74.885 1.226 1.204C5.096 21 6.657 21 9.778 21Z"
  }), /*#__PURE__*/React.createElement(_reactNativeSvg.Path, {
    strokeLinecap: "round",
    d: "M19 10h-1"
  })));
};
exports.CameraIcon = CameraIcon;
//# sourceMappingURL=CameraIcon.js.map