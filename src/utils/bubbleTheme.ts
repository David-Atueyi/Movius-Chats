import type { ChatScreenProps } from '../types';

type Theme = ChatScreenProps['theme'];
type Colors = NonNullable<Theme>['colors'];

function colors(theme?: Theme): Colors | undefined {
  return theme?.colors;
}

export function getMessageTimestampColor(
  theme: Theme | undefined,
  isCurrentUser: boolean
): string {
  const c = colors(theme);
  if (isCurrentUser) {
    return c?.sentTimestampColor ?? 'rgba(255, 255, 255, 0.75)';
  }
  return c?.receivedTimestampColor ?? 'rgba(107, 114, 128, 0.85)';
}

export function getMediaTimestampColor(
  theme: Theme | undefined,
  isCurrentUser: boolean
): string {
  const c = colors(theme);
  if (isCurrentUser) {
    return c?.sentTimestampColor ?? 'rgba(255, 255, 255, 0.75)';
  }
  return c?.receivedTimestampColor ?? 'rgba(107, 114, 128, 0.85)';
}

export function getMediaTimestampContainerStyle(
  theme: Theme | undefined,
  isCurrentUser: boolean
) {
  const base = { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 };
  const c = colors(theme);
  const bg = isCurrentUser
    ? (c?.sentMediaTimestampBackground ?? 'rgba(0,0,0,0.45)')
    : (c?.receivedMediaTimestampBackground ?? 'rgba(0,0,0,0.45)');

  const custom = isCurrentUser
    ? theme?.messageStyle?.sentMediaTimestampContainerStyle
    : theme?.messageStyle?.receivedMediaTimestampContainerStyle;

  return { ...base, backgroundColor: bg, ...custom };
}

export function getFileAttachmentBackground(
  theme: Theme | undefined,
  isCurrentUser: boolean
): string {
  const c = colors(theme);
  if (isCurrentUser) {
    return c?.sentFileAttachmentBackground ?? 'rgba(255, 255, 255, 0.15)';
  }
  return c?.receivedFileAttachmentBackground ?? 'rgba(0, 0, 0, 0.08)';
}

export function getFileAttachmentTextColor(
  theme: Theme | undefined,
  isCurrentUser: boolean
): string {
  const c = colors(theme);
  if (isCurrentUser) {
    return c?.sentFileAttachmentTextColor ?? '#ffffff';
  }
  return c?.receivedFileAttachmentTextColor ?? '#1f2937';
}

export function getFileAttachmentSubtitleColor(
  theme: Theme | undefined,
  isCurrentUser: boolean
): string {
  const c = colors(theme);
  if (isCurrentUser) {
    return c?.sentFileAttachmentSubtitleColor ?? 'rgba(255,255,255,0.7)';
  }
  return c?.receivedFileAttachmentSubtitleColor ?? 'rgba(31,41,55,0.65)';
}

export function getAudioWaveformColors(
  theme: Theme | undefined,
  isCurrentUser: boolean
): { inactive: string; active: string } {
  const c = colors(theme);
  if (isCurrentUser) {
    return {
      inactive: c?.sentAudioWaveformColor ?? 'rgba(255,255,255,0.35)',
      active: c?.sentAudioWaveformActiveColor ?? 'rgba(255,255,255,0.95)',
    };
  }
  return {
    inactive: c?.receivedAudioWaveformColor ?? 'rgba(0,0,0,0.20)',
    active: c?.receivedAudioWaveformActiveColor ?? 'rgba(0,0,0,0.60)',
  };
}

export function getAudioDurationColor(
  theme: Theme | undefined,
  isCurrentUser: boolean
): string {
  const c = colors(theme);
  if (isCurrentUser) {
    return (
      c?.sentAudioTimestampColor ??
      c?.sentTimestampColor ??
      'rgba(255,255,255,0.75)'
    );
  }
  return (
    c?.receivedAudioTimestampColor ??
    c?.receivedTimestampColor ??
    'rgba(0,0,0,0.45)'
  );
}

export function getAudioPlayIconColor(
  theme: Theme | undefined,
  isCurrentUser: boolean
): string {
  const c = colors(theme);
  if (isCurrentUser) {
    return c?.sentAudioPlayIconColor ?? '#ffffff';
  }
  return c?.receivedAudioPlayIconColor ?? '#374151';
}

export function getAudioPauseIconColor(
  theme: Theme | undefined,
  isCurrentUser: boolean
): string {
  const c = colors(theme);
  if (isCurrentUser) {
    return c?.sentAudioPauseIconColor ?? '#ffffff';
  }
  return c?.receivedAudioPauseIconColor ?? '#374151';
}

export function getAudioPlayButtonBackground(
  theme: Theme | undefined,
  isCurrentUser: boolean
): string {
  const c = colors(theme);
  if (isCurrentUser) {
    return c?.sentAudioPlayButtonBackground ?? 'rgba(0,0,0,0.35)';
  }
  return c?.receivedAudioPlayButtonBackground ?? 'rgba(0,0,0,0.08)';
}

export function getAudioSpeedTextColor(
  theme: Theme | undefined,
  isCurrentUser: boolean
): string {
  const c = colors(theme);
  if (isCurrentUser) {
    return c?.sentAudioSpeedTextColor ?? '#ffffff';
  }
  return c?.receivedAudioSpeedTextColor ?? '#e5e7eb';
}

export function getMessageTextColor(
  theme: Theme | undefined,
  isCurrentUser: boolean
): string | undefined {
  const c = colors(theme);
  return isCurrentUser ? c?.sentMessageTextColor : c?.receivedMessageTextColor;
}

export function getBubbleBackgroundColor(
  theme: Theme | undefined,
  isCurrentUser: boolean
): string | undefined {
  const c = colors(theme);
  return isCurrentUser
    ? c?.sentBubbleBackgroundColor
    : c?.receivedBubbleBackgroundColor;
}
