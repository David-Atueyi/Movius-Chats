export interface AudioPlayerProps {
    audioUrl: string;
    audioId: string;
    isVideoPlaying: boolean;
    isCurrentUser: boolean;
    senderAvatar?: string;
    senderName?: string;
    reserveStatusSpace?: boolean;
    /** Long-press forwarded from the bubble; opens the action menu. */
    onLongPress?: () => void;
}
export declare const PLAYBACK_RATES: readonly [1, 1.5, 2];
export type PlaybackRate = (typeof PLAYBACK_RATES)[number];
