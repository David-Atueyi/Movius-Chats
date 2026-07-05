import React from 'react';
import type { MessageMediaItem } from '../../types';
interface MediaGridProps {
    items: (MessageMediaItem & {
        kind: 'image' | 'video';
    })[];
    onOpenGallery: (items: MessageMediaItem[], index: number) => void;
    onLongPress?: () => void;
    messageId?: string;
    isCurrentUser?: boolean;
    senderAvatar?: string;
    senderName?: string;
    isVideoPlaying?: boolean;
}
export declare const MediaGrid: React.FC<MediaGridProps>;
export {};
