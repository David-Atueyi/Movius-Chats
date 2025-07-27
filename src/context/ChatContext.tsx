import React, { createContext, useContext, useState } from 'react';
import { ChatScreenProps } from '../types';

interface ChatContextType extends ChatScreenProps {
  mediaUrl: { imageUrl: string; videoUrl: string };
  setMediaUrl: (url: { imageUrl: string; videoUrl: string }) => void;
  isVideoPlaying: boolean;
  setIsVideoPlaying: (playing: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<
  ChatScreenProps & { children: React.ReactNode }
> = ({ children, ...props }) => {
  const [mediaUrl, setMediaUrl] = useState({ imageUrl: '', videoUrl: '' });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        ...props,
        mediaUrl,
        setMediaUrl,
        isVideoPlaying,
        setIsVideoPlaying,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
