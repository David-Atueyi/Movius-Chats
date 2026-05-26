import type { CameraCaptureResult, CameraConfig } from '../../types';
interface UseCameraControllerArgs {
    config: Required<Pick<CameraConfig, 'enablePhoto' | 'enableVideo' | 'enableZoom' | 'enableSwitchCamera' | 'enableAudio' | 'maxVideoDuration' | 'maxZoom' | 'photoQuality'>> & {
        videoQuality?: string;
    };
    onCapture: (media: CameraCaptureResult) => void;
}
export declare function useCameraController({ config, onCapture, }: UseCameraControllerArgs): {
    cameraRef: import("react").MutableRefObject<any>;
    Camera: any;
    device: any;
    cameraPerm: any;
    micPerm: any;
    facing: "front" | "back";
    isCameraReady: boolean;
    isRecording: boolean;
    zoom: number;
    elapsed: number;
    onInitialized: () => void;
    capturePhoto: () => Promise<CameraCaptureResult | null>;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<CameraCaptureResult | null>;
    switchCamera: () => void;
    setZoom: (z: number) => void;
};
export {};
