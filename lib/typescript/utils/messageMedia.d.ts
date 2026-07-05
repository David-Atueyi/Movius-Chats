import type { Message, MessageMediaItem } from '../types';
export declare function isGalleryMediaItem(item: MessageMediaItem): item is MessageMediaItem & {
    kind: 'image' | 'video';
};
export declare function collectMediaItems(message: Message): MessageMediaItem[];
