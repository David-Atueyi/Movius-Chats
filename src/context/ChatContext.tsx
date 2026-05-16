import React, { createContext, useContext, useState } from 'react';
import { ChatScreenProps, MessageMediaItem } from '../types';

/** Full-screen swipe viewer state */
export interface MediaViewerGalleryState {
  items: MessageMediaItem[];
  initialIndex: number;
}

interface ChatContextType extends ChatScreenProps {
  mediaViewerGallery: MediaViewerGalleryState | null;
  setMediaViewerGallery: (
    items: MessageMediaItem[],
    initialIndex: number
  ) => void;
  clearMediaViewerGallery: () => void;
  isVideoPlaying: boolean;
  setIsVideoPlaying: (playing: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<
  ChatScreenProps & { children: React.ReactNode }
> = ({ children, ...props }) => {
  const [mediaViewerGallery, setMediaViewerGalleryState] =
    useState<MediaViewerGalleryState | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const setMediaViewerGallery = (
    items: MessageMediaItem[],
    initialIndex: number
  ) => {
    setMediaViewerGalleryState({ items, initialIndex });
    const cur = items[initialIndex];
    setIsVideoPlaying(cur?.kind === 'video');
  };

  const clearMediaViewerGallery = () => {
    setMediaViewerGalleryState(null);
    setIsVideoPlaying(false);
  };

  return (
    <ChatContext.Provider
      value={{
        ...props,
        mediaViewerGallery,
        setMediaViewerGallery,
        clearMediaViewerGallery,
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
