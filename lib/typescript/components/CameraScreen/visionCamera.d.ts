/**
 * Lazy-loaded `react-native-vision-camera` bridge.
 *
 * The camera feature is opt-in. We use `require()` so that consumers who
 * don't use the built-in camera don't have to install the native module.
 * Everything below collapses to `null` when the module is missing; the
 * `CameraScreen` then renders a friendly "module missing" fallback.
 */
type AnyModule = Record<string, any> | null;
export declare const VisionCamera: AnyModule;
export declare const isVisionCameraInstalled: boolean;
export declare const RNVCamera: any;
export declare const useCameraDevice: any;
export declare const useCameraPermission: any;
export declare const useMicrophonePermission: any;
export {};
