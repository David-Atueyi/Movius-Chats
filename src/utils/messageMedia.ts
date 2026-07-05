import type { Message, MessageMediaItem } from '../types';

export function isGalleryMediaItem(
  item: MessageMediaItem
): item is MessageMediaItem & { kind: 'image' | 'video' } {
  return item.kind === 'image' || item.kind === 'video';
}

export function isAudioMediaItem(
  item: MessageMediaItem
): item is MessageMediaItem & { kind: 'audio' } {
  return item.kind === 'audio';
}

export function collectMediaItems(message: Message): MessageMediaItem[] {
  return message.mediaItems ?? [];
}

export interface SplitMediaResult {
  galleryItems: (MessageMediaItem & { kind: 'image' | 'video' })[];
  primaryAudio: MessageMediaItem | null;
  extraAudios: MessageMediaItem[];
}

export function splitMediaForRender(message: Message): SplitMediaResult {
  const items = collectMediaItems(message);
  const galleryItems = items.filter(isGalleryMediaItem);
  const audioItems = items.filter(isAudioMediaItem);

  const [primaryAudio = null, ...extraAudios] = audioItems;

  return { galleryItems, primaryAudio, extraAudios };
}