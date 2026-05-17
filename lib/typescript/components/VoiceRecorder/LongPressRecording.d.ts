import React from 'react';
import { RecordingUIProps, VoiceRecorderStyleOverrides } from '../../types';
interface LongPressRecordingProps {
    duration: number;
    /** Current horizontal drag offset (negative = sliding left to cancel) */
    slideX: number;
    containerHeight?: number;
    fontFamily?: string;
    voiceRecorderStyles?: VoiceRecorderStyleOverrides;
    recordingUIProps?: RecordingUIProps;
}
export declare const LongPressRecording: React.FC<LongPressRecordingProps>;
export {};
