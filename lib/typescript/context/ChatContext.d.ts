import React from 'react';
import { ChatScreenProps, Message, MessageMediaItem } from '../types';
/** Full-screen swipe viewer state */
export interface MediaViewerGalleryState {
    items: MessageMediaItem[];
    initialIndex: number;
}
interface ChatContextType extends ChatScreenProps {
    mediaViewerGallery: MediaViewerGalleryState | null;
    setMediaViewerGallery: (items: MessageMediaItem[], initialIndex: number) => void;
    clearMediaViewerGallery: () => void;
    isVideoPlaying: boolean;
    setIsVideoPlaying: (playing: boolean) => void;
    /** The message currently being replied to (null when no draft reply). */
    replyTarget: Message | null;
    /** Begin a reply. Mirrors `onReplyMessage`. */
    startReply: (message: Message) => void;
    /** Cancel the current reply draft. */
    cancelReply: () => void;
    actionSheetMessage: Message | null;
    openActionSheet: (message: Message) => void;
    closeActionSheet: () => void;
    cameraVisible: boolean;
    openCamera: () => void;
    closeCamera: () => void;
}
export declare const ChatProvider: React.FC<ChatScreenProps & {
    children: React.ReactNode;
}>;
export declare const useChatContext: () => ChatContextType;
export {};
