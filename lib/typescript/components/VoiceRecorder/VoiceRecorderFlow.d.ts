import React, { ReactNode } from 'react';
export type RecordingState = 'IDLE' | 'RECORDING_TAP' | 'RECORDING_HOLD' | 'LOCKED_RECORDING' | 'SENDING' | 'CANCELLED';
export interface VoiceRecorderFlowAudio {
    /** Final recording duration in seconds. */
    duration: number;
}
export interface VoiceRecorderFlowProps {
    primaryColor?: string;
    backgroundColor?: string;
    timerColor?: string;
    microphoneColor?: string;
    lockColor?: string;
    waveformColor?: string;
    deleteIconColor?: string;
    renderMicIcon?: () => ReactNode;
    renderSendIcon?: () => ReactNode;
    renderLockIcon?: () => ReactNode;
    renderArrowIcon?: () => ReactNode;
    renderDeleteIcon?: () => ReactNode;
    renderWaveform?: () => ReactNode;
    onRecordingStart?: () => void;
    onRecordingStop?: () => void;
    onSend?: (audio: VoiceRecorderFlowAudio) => void;
    onDelete?: () => void;
    onLock?: () => void;
    onCancel?: () => void;
}
export declare const VoiceRecorderFlow: React.FC<VoiceRecorderFlowProps>;
export default VoiceRecorderFlow;
