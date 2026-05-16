import React from 'react';
import { ChatScreenProps, MessageMediaItem } from '../types';
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
}
export declare const ChatProvider: React.FC<ChatScreenProps & {
    children: React.ReactNode;
}>;
export declare const useChatContext: () => ChatContextType;
export {};
