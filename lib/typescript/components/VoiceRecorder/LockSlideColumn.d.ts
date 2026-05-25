import React from 'react';
import { RecordingUIProps, VoiceRecorderStyleOverrides } from '../../types';
interface LockSlideColumnProps {
    /** Finger vertical offset while holding (negative = sliding up) */
    slideY: number;
    lockSlideDistance: number;
    recordingUIProps?: RecordingUIProps;
    voiceRecorderStyles?: VoiceRecorderStyleOverrides;
}
export declare const LockSlideColumn: React.FC<LockSlideColumnProps>;
export {};
