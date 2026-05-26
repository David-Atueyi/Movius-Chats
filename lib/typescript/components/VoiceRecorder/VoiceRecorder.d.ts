import React, { ReactNode } from 'react';
export interface VoiceRecorderProps {
    /** App primary color used for the circular send button. */
    primaryColor?: string;
    /** Bar background color. */
    backgroundColor?: string;
    /** Color of the animated waveform bars. */
    waveformColor?: string;
    /** Color of the running timer. */
    timerColor?: string;
    /** Override the send-button background. Falls back to `primaryColor`. */
    sendButtonColor?: string;
    /** Stroke color of the trash / delete icon. */
    deleteIconColor?: string;
    /** Color of the pause / play icon. */
    pauseIconColor?: string;
    /** Top corner radius. Bottom corners always stay square. Default `16`. */
    borderRadius?: number;
    /** Size of the circular send button. Default `50`. */
    sendButtonSize?: number;
    /** Number of bars rendered inside the waveform. Default `32`. */
    waveCount?: number;
    /** Override the entire delete icon (keeps press handling intact). */
    renderDeleteIcon?: () => ReactNode;
    /** Override the entire send icon (keeps press handling intact). */
    renderSendIcon?: () => ReactNode;
    /** Override the pause / play icon. */
    renderPauseIcon?: () => ReactNode;
    renderPlayIcon?: () => ReactNode;
    /** Replace the built-in waveform with any node. */
    renderWaveform?: () => ReactNode;
    /** Fired when the user taps the send button. */
    onSend?: () => void;
    /** Fired when the user taps the trash / cancel icon. */
    onDelete?: () => void;
    /** Fired when the user taps pause. */
    onPause?: () => void;
    /** Fired when the user taps play (resume). */
    onResume?: () => void;
}
export declare const VoiceRecorder: React.FC<VoiceRecorderProps>;
export default VoiceRecorder;
