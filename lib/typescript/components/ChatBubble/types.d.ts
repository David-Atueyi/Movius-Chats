import type { MessageActionAnchor, MessageMediaItem } from '../../types';
import { Message } from '../../types';
export interface ChatBubbleProps {
    message: Message;
    isCurrentUser: boolean;
    isFirstInSequence: boolean;
    /** Long-press handler. Receives the bubble's screen-space anchor for positioning popovers. */
    onLongPress?: (anchor: MessageActionAnchor) => void;
    /**
     * Render the bubble as a static visual (no gestures, no selection overlay).
     * Used by the long-press overlay to lift a copy of the bubble above the scrim.
     */
    staticMode?: boolean;
}
export interface MessageContentProps extends ChatBubbleProps {
    onGalleryOpen: (items: MessageMediaItem[], index: number) => void;
    isVideoPlaying?: boolean;
    /**
     * Long-press handler forwarded from the parent ChatBubble. Inner
     * Pressables (file rows, media tiles) call this so a long-press on a
     * file / image / video opens the action menu just like a long-press on
     * the bubble shell.
     */
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
    /** Render the small italic "edited" indicator before the timestamp. */
    edited?: boolean;
}
