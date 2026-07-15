import type { Message, MessageMediaItem } from '../types';
export declare function isGalleryMediaItem(item: MessageMediaItem): item is MessageMediaItem & {
    kind: 'image' | 'video';
};
export declare function isAudioMediaItem(item: MessageMediaItem): item is MessageMediaItem & {
    kind: 'audio';
};
export declare function collectMediaItems(message: Message): MessageMediaItem[];
export interface SplitMediaResult {
    galleryItems: (MessageMediaItem & {
        kind: 'image' | 'video';
    })[];
    primaryAudio: MessageMediaItem | null;
    extraAudios: MessageMediaItem[];
}
export declare function splitMediaForRender(message: Message): SplitMediaResult;
