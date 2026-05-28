export interface AudioPlayerProps {
  audioUrl: string;
  audioId: string;
  isVideoPlaying: boolean;
  isCurrentUser: boolean;
  senderAvatar?: string;
  senderName?: string;
  reserveStatusSpace?: boolean;
  onLongPress?: () => void;
}

export const PLAYBACK_RATES = [1, 1.5, 2] as const;
export type PlaybackRate = (typeof PLAYBACK_RATES)[number];
