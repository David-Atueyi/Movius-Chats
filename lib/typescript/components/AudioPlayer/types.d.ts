export interface AudioPlayerProps {
    audioUrl: string;
    audioId: string;
    isVideoPlaying: boolean;
    isCurrentUser: boolean;
    senderAvatar?: string;
    senderName?: string;
    reserveStatusSpace?: boolean;
}
export declare const PLAYBACK_RATES: readonly [1, 1.5, 2];
export type PlaybackRate = (typeof PLAYBACK_RATES)[number];
