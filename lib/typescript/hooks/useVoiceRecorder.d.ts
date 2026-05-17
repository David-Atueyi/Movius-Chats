import { RecordingResult } from '../types';
export type RecordingStatus = 'idle' | 'recording' | 'paused';
interface UseVoiceRecorderOptions {
    maxDuration?: number;
    onRecordStart?: () => void;
    onRecordEnd?: (result: RecordingResult) => void;
}
export declare function useVoiceRecorder({ maxDuration, onRecordStart, onRecordEnd, }?: UseVoiceRecorderOptions): {
    status: RecordingStatus;
    duration: number;
    isRecording: boolean;
    isPaused: boolean;
    startRecording: () => Promise<void>;
    pauseRecording: () => Promise<void>;
    resumeRecording: () => Promise<void>;
    stopRecording: () => Promise<RecordingResult | null>;
    cancelRecording: () => Promise<void>;
};
export {};
