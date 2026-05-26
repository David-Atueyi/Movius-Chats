import type { ReactNode } from 'react';
import type { TextStyle, ViewStyle } from 'react-native';
export type RecordingState = 'IDLE' | 'RECORDING_TAP' | 'RECORDING_HOLD' | 'LOCKED_RECORDING' | 'SENDING' | 'CANCELLED';
export declare const STATE_IDLE = 0;
export declare const STATE_TAP = 1;
export declare const STATE_HOLD = 2;
export declare const STATE_LOCKED = 3;
export declare const STATE_SENDING = 4;
export declare const STATE_CANCELLED = 5;
export declare function stateToInt(s: RecordingState): number;
export interface VoiceRecorderFlowAudio {
    /** Final recording duration in seconds. */
    duration: number;
}
export interface VoiceRecorderFlowProps {
    primaryColor?: string;
    /** Background of the dark recording bar (tap / locked screen). */
    backgroundColor?: string;
    /** Background of the dark "input-shaped" pill shown while long-pressing. */
    holdPillBackground?: string;
    timerColor?: string;
    microphoneColor?: string;
    lockColor?: string;
    waveformColor?: string;
    deleteIconColor?: string;
    cancelTextColor?: string;
    chevronColor?: string;
    /** Recording-active pause/play button color. */
    pauseIconColor?: string;
    lockPillBackground?: string;
    /** Height of the surrounding chat-input row (used to size the mic). */
    inputBarHeight?: number;
    /** Size of the mic / send button when idle. Defaults to `inputBarHeight`. */
    micSize?: number;
    /** Scale multiplier applied to the mic while long-pressing. Default `1.18`. */
    holdMicScale?: number;
    /** Size of glyph icons (mic, send, etc.). */
    iconSize?: number;
    lockIconSize?: number;
    enableLockRecording?: boolean;
    enableSlideToCancel?: boolean;
    enableWaveform?: boolean;
    lockSlideDistance?: number;
    cancelSlideDistance?: number;
    waveCount?: number;
    /**
     * Render the normal text input pill that lives next to the mic while idle.
     * The flow takes ownership of the row layout, so the pill is rendered as
     * the flex-1 child to the left of the mic.
     */
    renderInputPill?: () => ReactNode;
    renderMicIcon?: () => ReactNode;
    renderSendIcon?: () => ReactNode;
    renderLockIcon?: () => ReactNode;
    renderArrowIcon?: () => ReactNode;
    renderDeleteIcon?: () => ReactNode;
    renderPauseIcon?: () => ReactNode;
    renderPlayIcon?: () => ReactNode;
    renderWaveform?: () => ReactNode;
    containerStyle?: ViewStyle;
    barStyle?: ViewStyle;
    timerTextStyle?: TextStyle;
    slideTextStyle?: TextStyle;
    waveformStyle?: ViewStyle;
    lockPillStyle?: ViewStyle;
    trashButtonStyle?: ViewStyle;
    sendButtonStyle?: ViewStyle;
    onRecordingStart?: () => void;
    onRecordingStop?: () => void;
    onSend?: (audio: VoiceRecorderFlowAudio) => void;
    onDelete?: () => void;
    onLock?: () => void;
    onCancel?: () => void;
    /** Fired when the user taps the in-bar pause icon. */
    onPauseRecording?: () => void;
    /** Fired when the user taps the in-bar play icon to resume. */
    onResumeRecording?: () => void;
    /** Notifies the parent whenever the internal state changes. */
    onStateChange?: (state: RecordingState) => void;
}
