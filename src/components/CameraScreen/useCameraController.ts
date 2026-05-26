import { useCallback, useEffect, useRef, useState } from 'react';
import type { CameraCaptureResult, CameraConfig } from '../../types';
import {
  RNVCamera,
  useCameraDevice,
  useCameraPermission,
  useMicrophonePermission,
} from './visionCamera';

interface UseCameraControllerArgs {
  config: Required<
    Pick<
      CameraConfig,
      | 'enablePhoto'
      | 'enableVideo'
      | 'enableZoom'
      | 'enableSwitchCamera'
      | 'enableAudio'
      | 'maxVideoDuration'
      | 'maxZoom'
      | 'photoQuality'
    >
  > & {
    videoQuality?: string;
  };
  onCapture: (media: CameraCaptureResult) => void;
}

export function useCameraController({
  config,
  onCapture,
}: UseCameraControllerArgs) {
  const cameraRef = useRef<any>(null);

  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const device = useCameraDevice(facing);

  const cameraPerm = useCameraPermission();
  const micPerm = useMicrophonePermission();

  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [elapsed, setElapsed] = useState(0);

  const recordingResolverRef = useRef<{
    resolve: (r: CameraCaptureResult | null) => void;
  } | null>(null);

  // ── Permissions: request on mount ──────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        if (cameraPerm?.requestPermission && !cameraPerm.hasPermission) {
          await cameraPerm.requestPermission();
        }
        if (
          config.enableAudio &&
          micPerm?.requestPermission &&
          !micPerm.hasPermission
        ) {
          await micPerm.requestPermission();
        }
      } catch (err) {
        console.warn('[movius-chats] camera permission error', err);
      }
    })();
  }, [cameraPerm, micPerm, config.enableAudio]);

  // ── Recording timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!isRecording) return;
    setElapsed(0);
    const start = Date.now();
    const id = setInterval(() => {
      const sec = Math.floor((Date.now() - start) / 1000);
      setElapsed(sec);
      if (sec >= config.maxVideoDuration) {
        stopRecording();
      }
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording, config.maxVideoDuration]);

  // ── Capture photo ─────────────────────────────────────────────────────────
  const capturePhoto = useCallback(async (): Promise<
    CameraCaptureResult | null
  > => {
    if (!cameraRef.current || !config.enablePhoto) return null;
    try {
      const photo = await cameraRef.current.takePhoto({
        qualityPrioritization: config.photoQuality,
      });
      const uri = photo.path.startsWith('file://')
        ? photo.path
        : `file://${photo.path}`;
      const result: CameraCaptureResult = {
        uri,
        type: 'image',
        width: photo.width,
        height: photo.height,
      };
      onCapture(result);
      return result;
    } catch (err) {
      console.warn('[movius-chats] capturePhoto failed', err);
      return null;
    }
  }, [config.enablePhoto, config.photoQuality, onCapture]);

  // ── Recording controls ────────────────────────────────────────────────────
  const startRecording = useCallback(async () => {
    if (!cameraRef.current || !config.enableVideo) return;
    setIsRecording(true);
    try {
      cameraRef.current.startRecording({
        fileType: 'mp4',
        flash: 'off',
        onRecordingFinished: (video: any) => {
          const uri = video.path.startsWith('file://')
            ? video.path
            : `file://${video.path}`;
          const result: CameraCaptureResult = {
            uri,
            type: 'video',
            duration: video.duration,
            width: video.width,
            height: video.height,
          };
          setIsRecording(false);
          setElapsed(0);
          onCapture(result);
          recordingResolverRef.current?.resolve(result);
          recordingResolverRef.current = null;
        },
        onRecordingError: (err: any) => {
          console.warn('[movius-chats] recording error', err);
          setIsRecording(false);
          setElapsed(0);
          recordingResolverRef.current?.resolve(null);
          recordingResolverRef.current = null;
        },
      });
    } catch (err) {
      console.warn('[movius-chats] startRecording failed', err);
      setIsRecording(false);
    }
  }, [config.enableVideo, onCapture]);

  const stopRecording = useCallback(async (): Promise<
    CameraCaptureResult | null
  > => {
    if (!cameraRef.current) return null;
    return new Promise<CameraCaptureResult | null>((resolve) => {
      recordingResolverRef.current = { resolve };
      try {
        cameraRef.current.stopRecording();
      } catch (err) {
        console.warn('[movius-chats] stopRecording failed', err);
        recordingResolverRef.current = null;
        resolve(null);
      }
    });
  }, []);

  const switchCamera = useCallback(() => {
    if (!config.enableSwitchCamera) return;
    setFacing((f) => (f === 'back' ? 'front' : 'back'));
  }, [config.enableSwitchCamera]);

  const onInitialized = useCallback(() => {
    setIsCameraReady(true);
  }, []);

  const clampedSetZoom = useCallback(
    (z: number) => {
      if (!config.enableZoom) return;
      const clamped = Math.max(1, Math.min(config.maxZoom, z));
      setZoom(clamped);
    },
    [config.enableZoom, config.maxZoom]
  );

  return {
    cameraRef,
    Camera: RNVCamera,
    device,
    cameraPerm,
    micPerm,
    facing,
    isCameraReady,
    isRecording,
    zoom,
    elapsed,
    onInitialized,
    capturePhoto,
    startRecording,
    stopRecording,
    switchCamera,
    setZoom: clampedSetZoom,
  };
}
