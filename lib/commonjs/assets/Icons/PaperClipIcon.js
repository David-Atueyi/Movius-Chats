"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PaperClipIcon = void 0;
var _reactNativeSvg = _interopRequireWildcard(require("react-native-svg"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const PaperClipIcon = ({
  style,
  color
}) => {
  return /*#__PURE__*/React.createElement(_reactNativeSvg.default, {
    style: style,
    fill: color,
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement(_reactNativeSvg.Path, {
    d: "M17.346 15.539q0 2.271-1.565 3.866T11.952 21t-3.838-1.595t-1.576-3.867v-8.73q0-1.587 1.092-2.697Q8.72 3 10.308 3t2.678 1.11t1.091 2.698v8.269q0 .88-.615 1.517q-.614.637-1.498.637t-1.52-.627t-.636-1.527V6.769h1v8.308q0 .479.327.816q.328.338.807.338t.807-.338t.328-.816V6.789q-.006-1.166-.802-1.977Q11.48 4 10.308 4q-1.163 0-1.966.821q-.804.821-.804 1.987v8.73q-.005 1.853 1.283 3.157Q10.11 20 11.96 20q1.823 0 3.1-1.305t1.287-3.156v-8.77h1z"
  }));
};
exports.PaperClipIcon = PaperClipIcon;
//# sourceMappingURL=PaperClipIcon.js.map