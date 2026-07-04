import type { MessageActionAnchor, MessageMediaItem } from '../../types';
import { Message } from '../../types';
export interface ChatBubbleProps {
    message: Message;
    isCurrentUser: boolean;
    isFirstInSequence: boolean;
    onLongPress?: (anchor: MessageActionAnchor) => void;
    staticMode?: boolean;
}
export interface MessageContentProps extends ChatBubbleProps {
    onGalleryOpen: (items: MessageMediaItem[], index: number) => void;
    isVideoPlaying?: boolean;
    onLongPress?: () => void;
}
export interface MessageStatusProps {
    time: string;
    status?: 'read' | 'delivered' | 'sent';
    isCurrentUser: boolean;
    hasText: boolean;
    hasAudio: boolean;
    hasGalleryMedia?: boolean;
    hasFileAttachments?: boolean;
    edited?: boolean;
}
