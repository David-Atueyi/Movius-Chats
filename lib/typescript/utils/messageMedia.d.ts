import type { Message, MessageMediaItem } from '../types';
/** Merge legacy `image` / `video` with `mediaItems` (array wins when non-empty). */
export declare function collectMediaItems(message: Message): MessageMediaItem[];
