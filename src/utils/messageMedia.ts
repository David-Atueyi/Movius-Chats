import type { Message, MessageMediaItem } from '../types';

export function collectMediaItems(message: Message): MessageMediaItem[] {
  if (message.mediaItems && message.mediaItems.length > 0) {
    return message.mediaItems;
  }
  const out: MessageMediaItem[] = [];
  if (message.image) {
    out.push({ uri: message.image, kind: 'image' });
  }
  if (message.video) {
    out.push({ uri: message.video, kind: 'video' });
  }
  return out;
}
