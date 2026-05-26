import React, { createContext, useCallback, useContext, useState } from 'react';
import { ChatScreenProps, Message, MessageMediaItem } from '../types';

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

  // ── Reply state ─────────────────────────────────────────────────────────
  /** The message currently being replied to (null when no draft reply). */
  replyTarget: Message | null;
  /** Begin a reply. Mirrors `onReplyMessage`. */
  startReply: (message: Message) => void;
  /** Cancel the current reply draft. */
  cancelReply: () => void;

  // ── Long-press action sheet state ───────────────────────────────────────
  actionSheetMessage: Message | null;
  openActionSheet: (message: Message) => void;
  closeActionSheet: () => void;

  // ── Built-in camera modal state ─────────────────────────────────────────
  cameraVisible: boolean;
  openCamera: () => void;
  closeCamera: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<
  ChatScreenProps & { children: React.ReactNode }
> = ({ children, ...props }) => {
  const [mediaViewerGallery, setMediaViewerGalleryState] =
    useState<MediaViewerGalleryState | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const [replyTarget, setReplyTarget] = useState<Message | null>(null);
  const [actionSheetMessage, setActionSheetMessage] = useState<Message | null>(
    null
  );
  const [cameraVisible, setCameraVisible] = useState(false);

  const setMediaViewerGallery = useCallback(
    (items: MessageMediaItem[], initialIndex: number) => {
      setMediaViewerGalleryState({ items, initialIndex });
      const cur = items[initialIndex];
      setIsVideoPlaying(cur?.kind === 'video');
    },
    []
  );

  const clearMediaViewerGallery = useCallback(() => {
    setMediaViewerGalleryState(null);
    setIsVideoPlaying(false);
  }, []);

  const startReply = useCallback(
    (message: Message) => {
      setReplyTarget(message);
      props.onReplyMessage?.(message);
    },
    [props]
  );

  const cancelReply = useCallback(() => {
    setReplyTarget(null);
  }, []);

  const openActionSheet = useCallback((message: Message) => {
    setActionSheetMessage(message);
  }, []);
  const closeActionSheet = useCallback(() => {
    setActionSheetMessage(null);
  }, []);

  const openCamera = useCallback(() => setCameraVisible(true), []);
  const closeCamera = useCallback(() => setCameraVisible(false), []);

  return (
    <ChatContext.Provider
      value={{
        ...props,
        mediaViewerGallery,
        setMediaViewerGallery,
        clearMediaViewerGallery,
        isVideoPlaying,
        setIsVideoPlaying,
        replyTarget,
        startReply,
        cancelReply,
        actionSheetMessage,
        openActionSheet,
        closeActionSheet,
        cameraVisible,
        openCamera,
        closeCamera,
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
