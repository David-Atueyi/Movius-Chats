import React from 'react';
import type { MessageMediaItem } from '../../types';
interface MediaGridProps {
    items: MessageMediaItem[];
    onOpenGallery: (items: MessageMediaItem[], index: number) => void;
    /** Long-press handler forwarded from the bubble. */
    onLongPress?: () => void;
}
export declare const MediaGrid: React.FC<MediaGridProps>;
export {};
