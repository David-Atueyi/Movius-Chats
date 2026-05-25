import React, { ReactNode } from 'react';
import { TextStyle, ViewStyle } from 'react-native';
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
    cancelTextColor?: string;
    chevronColor?: string;
    lockPillBackground?: string;
    lockPillActiveBorderColor?: string;
    borderTopColor?: string;
    borderTopWidth?: number;
    containerHeight?: number;
    micSize?: number;
    iconSize?: number;
    sendIconSize?: number;
    lockIconSize?: number;
    enableLockRecording?: boolean;
    enableSlideToCancel?: boolean;
    enableWaveform?: boolean;
    lockSlideDistance?: number;
    cancelSlideDistance?: number;
    lockPillGap?: number;
    lockPillMarginBottom?: number;
    waveCount?: number;
    renderMicIcon?: () => ReactNode;
    renderSendIcon?: () => ReactNode;
    renderLockIcon?: () => ReactNode;
    renderArrowIcon?: () => ReactNode;
    renderDeleteIcon?: () => ReactNode;
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
}
export declare const VoiceRecorderFlow: React.FC<VoiceRecorderFlowProps>;
export default VoiceRecorderFlow;
