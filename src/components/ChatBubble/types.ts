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
