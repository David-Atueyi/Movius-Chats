import { RecordingState, VoiceRecorderFlowAudio } from './types';
export interface FlowControllerArgs {
    cancelSlideDistance: number;
    lockSlideDistance: number;
    enableLockRecording: boolean;
    enableSlideToCancel: boolean;
    holdMicScale: number;
    onRecordingStart?: () => void;
    onRecordingStop?: () => void;
    onSend?: (audio: VoiceRecorderFlowAudio) => void;
    onDelete?: () => void;
    onLock?: () => void;
    onCancel?: () => void;
    onPauseRecording?: () => void;
    onResumeRecording?: () => void;
    onStateChange?: (state: RecordingState) => void;
}
export declare function useFlowController(args: FlowControllerArgs): {
    state: RecordingState;
    duration: number;
    isPaused: boolean;
    composedGesture: import("react-native-gesture-handler/lib/typescript/handlers/gestures/gestureComposition").ComposedGesture;
    waveTick: import("react-native-reanimated").SharedValue<number>;
    micWrapperStyle: {
        transform: ({
            translateX: number;
            translateY?: undefined;
            scale?: undefined;
        } | {
            translateY: number;
            translateX?: undefined;
            scale?: undefined;
        } | {
            scale: number;
            translateX?: undefined;
            translateY?: undefined;
        })[];
    };
    slideTextAnimatedStyle: {
        opacity: number;
        transform: {
            translateX: number;
        }[];
    };
    lockPillAnimatedStyle: {
        transform: {
            translateY: number;
        }[];
    };
    chevronAnimatedStyle: {
        transform: {
            translateY: number;
        }[];
    };
    pausePulseStyle: {
        opacity: number;
    };
    recDotStyle: {
        opacity: number;
    };
    triggerCancel: () => void;
    togglePause: () => void;
};
