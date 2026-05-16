import React from 'react';
import type { MessageMediaItem } from '../../types';
export interface MediaViewerProps {
    gallery: {
        items: MessageMediaItem[];
        initialIndex: number;
    } | null;
    onClose: () => void;
}
declare const _default: React.NamedExoticComponent<MediaViewerProps>;
export default _default;
