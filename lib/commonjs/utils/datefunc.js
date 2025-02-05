"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatDuration = void 0;
const formatDuration = time => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
exports.formatDuration = formatDuration;
//# sourceMappingURL=datefunc.js.map