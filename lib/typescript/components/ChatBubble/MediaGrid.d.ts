import React from 'react';
import type { MessageMediaItem } from '../../types';
interface MediaGridProps {
    items: MessageMediaItem[];
    onOpenGallery: (items: MessageMediaItem[], index: number) => void;
}
export declare const MediaGrid: React.FC<MediaGridProps>;
export {};
