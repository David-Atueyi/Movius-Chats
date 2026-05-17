import React from 'react';
import { RecordingUIProps, VoiceRecorderStyleOverrides } from '../../types';
interface LongPressRecordingProps {
    duration: number;
    /** Horizontal drag (negative = sliding left to cancel) */
    slideX: number;
    containerHeight?: number;
    fontFamily?: string;
    voiceRecorderStyles?: VoiceRecorderStyleOverrides;
    recordingUIProps?: RecordingUIProps;
}
/** Center strip: timer + “slide to cancel” (mic + lock live in ChatInput). */
export declare const LongPressRecording: React.FC<LongPressRecordingProps>;
export {};
