import React from 'react';
import { ChatScreenProps, Message, MessageActionAnchor, MessageMediaItem } from '../types';
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
    replyTarget: Message | null;
    startReply: (message: Message) => void;
    cancelReply: () => void;
    actionSheetMessage: Message | null;
    actionAnchor: MessageActionAnchor | null;
    openActionSheet: (message: Message, anchor?: MessageActionAnchor) => void;
    closeActionSheet: () => void;
    selectionMode: boolean;
    selectedIds: string[];
    enterSelectionMode: (initial?: Message) => void;
    exitSelectionMode: () => void;
    toggleSelection: (message: Message) => void;
    isSelected: (id: string) => boolean;
    editingMessage: Message | null;
    startEdit: (message: Message) => void;
    cancelEdit: () => void;
}
export declare const ChatProvider: React.FC<ChatScreenProps & {
    children: React.ReactNode;
}>;
export declare const useChatContext: () => ChatContextType;
export {};
