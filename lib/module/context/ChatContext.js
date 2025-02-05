import React, { createContext, useContext, useState } from "react";
const ChatContext = /*#__PURE__*/createContext(undefined);
export const ChatProvider = ({
  children,
  ...props
}) => {
  const [mediaUrl, setMediaUrl] = useState({
    imageUrl: "",
    videoUrl: ""
  });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  return /*#__PURE__*/React.createElement(ChatContext.Provider, {
    value: {
      ...props,
      mediaUrl,
      setMediaUrl,
      isVideoPlaying,
      setIsVideoPlaying
    }
  }, children);
};
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
//# sourceMappingURL=ChatContext.js.map