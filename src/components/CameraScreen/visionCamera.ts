/**
 * Lazy-loaded `react-native-vision-camera` bridge.
 *
 * The camera feature is opt-in. We use `require()` so that consumers who
 * don't use the built-in camera don't have to install the native module.
 * Everything below collapses to `null` when the module is missing; the
 * `CameraScreen` then renders a friendly "module missing" fallback.
 */

type AnyModule = Record<string, any> | null;

let RNVC: AnyModule = null;
try {
  RNVC = require('react-native-vision-camera');
} catch {
  RNVC = null;
}

export const VisionCamera: AnyModule = RNVC;

export const isVisionCameraInstalled = RNVC != null;

export const RNVCamera: any = RNVC?.Camera;
export const useCameraDevice: any = RNVC?.useCameraDevice;
export const useCameraPermission: any = RNVC?.useCameraPermission;
export const useMicrophonePermission: any = RNVC?.useMicrophonePermission;
