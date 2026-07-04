import React, { ReactNode } from 'react';
export interface VoiceRecordingGestureProps {
    primaryColor?: string;
    backgroundColor?: string;
    timerColor?: string;
    microphoneColor?: string;
    lockColor?: string;
    lockPillBackground?: string;
    cancelTextColor?: string;
    barHeight?: number;
    micSize?: number;
    renderMicIcon?: () => ReactNode;
    renderLockIcon?: () => ReactNode;
    renderArrowIcon?: () => ReactNode;
    onCancel?: () => void;
    onLock?: () => void;
}
export declare const VoiceRecordingGesture: React.FC<VoiceRecordingGestureProps>;
export default VoiceRecordingGesture;
