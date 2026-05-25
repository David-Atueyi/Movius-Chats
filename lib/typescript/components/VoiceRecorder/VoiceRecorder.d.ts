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
    /** Container height. Default `110`. */
    height?: number;
    /** Top corner radius. Bottom corners always stay square. Default `18`. */
    borderRadius?: number;
    /** Number of bars rendered inside the waveform. Default `28`. */
    waveCount?: number;
    /** Horizontal gap between waveform bars. Default `3`. */
    waveSpacing?: number;
    /** Width of each waveform bar. Default `3`. */
    waveWidth?: number;
    /** Override the entire delete icon (keeps press handling intact). */
    renderDeleteIcon?: () => ReactNode;
    /** Override the entire send icon (keeps press handling intact). */
    renderSendIcon?: () => ReactNode;
    /** Replace the built-in waveform with any node. */
    renderWaveform?: () => ReactNode;
    /** Fired when the user taps the send button. */
    onSend?: () => void;
    /** Fired when the user taps the trash / cancel icon. */
    onDelete?: () => void;
}
export declare const VoiceRecorder: React.FC<VoiceRecorderProps>;
export default VoiceRecorder;
