import type { Message, MessageMediaItem } from '../types';

export function isGalleryMediaItem(
  item: MessageMediaItem
): item is MessageMediaItem & { kind: 'image' | 'video' } {
  return item.kind === 'image' || item.kind === 'video';
}

export function collectMediaItems(message: Message): MessageMediaItem[] {
  return message.mediaItems ?? [];
}
