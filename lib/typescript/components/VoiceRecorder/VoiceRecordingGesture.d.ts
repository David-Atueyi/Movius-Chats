import React, { ReactNode } from 'react';
export interface VoiceRecordingGestureProps {
    /** App primary color used for the mic button background. */
    primaryColor?: string;
    /** Recording bar background. */
    backgroundColor?: string;
    /** Color of the running timer. */
    timerColor?: string;
    /** Color of the microphone glyph. */
    microphoneColor?: string;
    /** Color of the lock glyph + chevron. */
    lockColor?: string;
    /** Replace the mic icon. */
    renderMicIcon?: () => ReactNode;
    /** Replace the lock icon shown in the floating pill. */
    renderLockIcon?: () => ReactNode;
    /** Replace the "<" arrow next to "Slide to cancel". */
    renderArrowIcon?: () => ReactNode;
    /** Fired when the horizontal drag passes the cancel threshold. */
    onCancel?: () => void;
    /** Fired when the upward drag passes the lock threshold. */
    onLock?: () => void;
}
export declare const VoiceRecordingGesture: React.FC<VoiceRecordingGestureProps>;
export default VoiceRecordingGesture;
