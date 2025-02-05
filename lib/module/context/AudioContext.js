import React, { createContext, useContext, useState } from "react";
const AudioContext = /*#__PURE__*/createContext(undefined);
export const AudioProvider = ({
  children
}) => {
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
  return /*#__PURE__*/React.createElement(AudioContext.Provider, {
    value: {
      currentlyPlayingId,
      setCurrentlyPlayingId
    }
  }, children);
};
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};
//# sourceMappingURL=AudioContext.js.map