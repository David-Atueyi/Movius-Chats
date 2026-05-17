import React from 'react';
import { RecordingUIProps, VoiceRecorderStyleOverrides } from '../../types';
interface NormalRecordingProps {
    isRecording: boolean;
    isPaused: boolean;
    duration: number;
    onCancel: () => void;
    onSend: () => void;
    onPause: () => void;
    onResume: () => void;
    containerHeight?: number;
    fontFamily?: string;
    sendButtonColor?: string;
    sendIconColor?: string;
    enablePauseResume?: boolean;
    voiceRecorderStyles?: VoiceRecorderStyleOverrides;
    recordingUIProps?: RecordingUIProps;
}
export declare const NormalRecording: React.FC<NormalRecordingProps>;
export {};
