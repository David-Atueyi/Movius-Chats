import React, { ReactNode } from 'react';
export interface VoiceRecorderProps {
    primaryColor?: string;
    backgroundColor?: string;
    waveformColor?: string;
    timerColor?: string;
    sendButtonColor?: string;
    deleteIconColor?: string;
    pauseIconColor?: string;
    borderRadius?: number;
    sendButtonSize?: number;
    waveCount?: number;
    renderDeleteIcon?: () => ReactNode;
    renderSendIcon?: () => ReactNode;
    renderPauseIcon?: () => ReactNode;
    renderPlayIcon?: () => ReactNode;
    renderWaveform?: () => ReactNode;
    onSend?: () => void;
    onDelete?: () => void;
    onPause?: () => void;
    onResume?: () => void;
}
export declare const VoiceRecorder: React.FC<VoiceRecorderProps>;
export default VoiceRecorder;
