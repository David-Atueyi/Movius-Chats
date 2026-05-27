import type { ChatScreenProps, ReplyUIProps } from '../types';
import { getFileAttachmentBackground } from './bubbleTheme';

type Theme = ChatScreenProps['theme'];

export function mergeReplyUI(
  theme?: Theme,
  replyUI?: ReplyUIProps
): ReplyUIProps {
  return { ...theme?.reply?.ui, ...replyUI };
}

export function getInlineReplyBackground(
  theme: Theme | undefined,
  isCurrentUser: boolean,
  replyUI?: ReplyUIProps
): string {
  const ui = mergeReplyUI(theme, replyUI);
  if (isCurrentUser) {
    return (
      ui.sentInlineBackground ??
      getFileAttachmentBackground(theme, true)
    );
  }
  return (
    ui.receivedInlineBackground ??
    getFileAttachmentBackground(theme, false)
  );
}

export function getInlineReplySenderColor(
  theme: Theme | undefined,
  isCurrentUser: boolean,
  replyUI?: ReplyUIProps
): string {
  const ui = mergeReplyUI(theme, replyUI);
  const c = theme?.colors;
  if (isCurrentUser) {
    return (
      ui.sentSenderNameColor ??
      c?.sentMessageTextColor ??
      'rgba(255,255,255,0.95)'
    );
  }
  return (
    ui.receivedSenderNameColor ??
    c?.sentBubbleBackgroundColor ??
    c?.sentMessageTailColor ??
    '#22c55e'
  );
}

export function getInlineReplyPreviewColor(
  theme: Theme | undefined,
  isCurrentUser: boolean,
  replyUI?: ReplyUIProps
): string {
  const ui = mergeReplyUI(theme, replyUI);
  if (isCurrentUser) {
    return (
      ui.sentPreviewTextColor ??
      theme?.colors?.sentMessageTextColor ??
      'rgba(255,255,255,0.85)'
    );
  }
  return (
    ui.receivedPreviewTextColor ??
    theme?.colors?.receivedMessageTextColor ??
    'rgba(0,0,0,0.75)'
  );
}

export function getInputPreviewBackground(
  theme?: Theme,
  replyUI?: ReplyUIProps
): string {
  const ui = mergeReplyUI(theme, replyUI);
  return ui.inputPreviewBackground ?? 'rgba(0, 0, 0, 0.08)';
}

export function getRecordingPreviewBackground(
  theme?: Theme,
  replyUI?: ReplyUIProps
): string {
  const ui = mergeReplyUI(theme, replyUI);
  return ui.recordingPreviewBackground ?? 'rgba(255, 255, 255, 0.12)';
}
