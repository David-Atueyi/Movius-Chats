import React from 'react';
import type { CameraCaptureResult, CameraConfig, CameraExposedState, CameraUIProps } from '../../types';
export interface CameraScreenProps {
    visible: boolean;
    onClose: () => void;
    onCapture: (media: CameraCaptureResult) => void;
    cameraProps?: CameraConfig;
    cameraUIProps?: CameraUIProps;
    renderCameraScreen?: (state: CameraExposedState) => React.ReactNode;
    /** Optional theme primary used for the active mode pill background. */
    themePrimary?: string;
    /** Optional fontFamily forwarded to all text. */
    fontFamily?: string;
}
export declare const CameraScreen: React.FC<CameraScreenProps>;
