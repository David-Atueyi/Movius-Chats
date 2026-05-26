import React, { useEffect, useMemo } from 'react';
import {
  Modal,
  Pressable,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Line } from 'react-native-svg';
import tw from 'twrnc';
import { SwitchCameraIcon } from '../../assets/Icons/SwitchCameraIcon';
import type {
  CameraCaptureResult,
  CameraConfig,
  CameraExposedState,
  CameraUIProps,
} from '../../types';
import { withFontFamily } from '../../utils/theme';
import {
  BOTTOM_INSET,
  DEFAULT_BACKGROUND,
  DEFAULT_CAPTURE_BUTTON_SIZE,
  DEFAULT_CAPTURE_RING,
  DEFAULT_CONTROL_BUTTON_SIZE,
  DEFAULT_ICON_COLOR,
  DEFAULT_INACTIVE_MODE,
  DEFAULT_MAX_VIDEO_DURATION,
  DEFAULT_MAX_ZOOM,
  DEFAULT_RECORDING_DOT,
  DEFAULT_RECORDING_RING,
  TOP_INSET,
} from './constants';
import { useCameraController } from './useCameraController';
import { isVisionCameraInstalled } from './visionCamera';

type Mode = 'photo' | 'video';

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

const formatTimer = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const resolveConfig = (cameraProps?: CameraConfig) => ({
  enablePhoto: cameraProps?.enablePhoto ?? true,
  enableVideo: cameraProps?.enableVideo ?? true,
  enableZoom: cameraProps?.enableZoom ?? true,
  enableSwitchCamera: cameraProps?.enableSwitchCamera ?? true,
  enableAudio: cameraProps?.enableAudio ?? true,
  maxVideoDuration: cameraProps?.maxVideoDuration ?? DEFAULT_MAX_VIDEO_DURATION,
  maxZoom: cameraProps?.maxZoom ?? DEFAULT_MAX_ZOOM,
  photoQuality: (cameraProps?.photoQuality ?? 'balanced') as
    | 'speed'
    | 'balanced'
    | 'quality',
  videoQuality: cameraProps?.videoQuality,
});

export const CameraScreen: React.FC<CameraScreenProps> = ({
  visible,
  onClose,
  onCapture,
  cameraProps,
  cameraUIProps,
  renderCameraScreen,
  themePrimary,
  fontFamily,
}) => {
  const config = useMemo(() => resolveConfig(cameraProps), [cameraProps]);

  if (!visible) return null;

  return (
    <Modal
      visible
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <GestureHandlerRootView style={tw`flex-1`}>
        {!isVisionCameraInstalled ? (
          <CameraMissingFallback onClose={onClose} fontFamily={fontFamily} />
        ) : (
          <CameraScreenInner
            config={config}
            cameraUIProps={cameraUIProps}
            renderCameraScreen={renderCameraScreen}
            onCapture={onCapture}
            onClose={onClose}
            themePrimary={themePrimary}
            fontFamily={fontFamily}
          />
        )}
      </GestureHandlerRootView>
    </Modal>
  );
};

// ─── Inner (vision-camera available) ─────────────────────────────────────────
interface InnerProps {
  config: ReturnType<typeof resolveConfig>;
  cameraUIProps?: CameraUIProps;
  renderCameraScreen?: (state: CameraExposedState) => React.ReactNode;
  onCapture: (media: CameraCaptureResult) => void;
  onClose: () => void;
  themePrimary?: string;
  fontFamily?: string;
}

const CameraScreenInner: React.FC<InnerProps> = ({
  config,
  cameraUIProps,
  renderCameraScreen,
  onCapture,
  onClose,
  themePrimary,
  fontFamily,
}) => {
  const ctrl = useCameraController({ config, onCapture });

  const [mode, setMode] = React.useState<Mode>(
    config.enablePhoto ? 'photo' : 'video'
  );

  // ── UI knobs ──────────────────────────────────────────────────────────────
  const captureSize =
    cameraUIProps?.captureButtonSize ?? DEFAULT_CAPTURE_BUTTON_SIZE;
  const controlSize =
    cameraUIProps?.controlButtonSize ?? DEFAULT_CONTROL_BUTTON_SIZE;
  const bgColor = cameraUIProps?.backgroundColor ?? DEFAULT_BACKGROUND;
  const ringColor = cameraUIProps?.captureRingColor ?? DEFAULT_CAPTURE_RING;
  const recRingColor =
    cameraUIProps?.recordingRingColor ?? DEFAULT_RECORDING_RING;
  const recDotColor =
    cameraUIProps?.recordingIndicatorColor ?? DEFAULT_RECORDING_DOT;
  const captureDotColor =
    cameraUIProps?.captureDotColor ?? DEFAULT_CAPTURE_RING;
  const activeModeColor =
    cameraUIProps?.activeModeTextColor ?? themePrimary ?? '#FFFFFF';
  const inactiveModeColor =
    cameraUIProps?.inactiveModeTextColor ?? DEFAULT_INACTIVE_MODE;
  const iconColor = cameraUIProps?.iconColor ?? DEFAULT_ICON_COLOR;

  // ── Pinch zoom (gesture handler) ──────────────────────────────────────────
  const zoomShared = useSharedValue(1);
  const zoomBaseShared = useSharedValue(1);

  useEffect(() => {
    zoomShared.value = ctrl.zoom;
    zoomBaseShared.value = ctrl.zoom;
  }, [ctrl.zoom, zoomShared, zoomBaseShared]);

  const pinch = Gesture.Pinch()
    .enabled(!!config.enableZoom)
    .onStart(() => {
      'worklet';
      zoomBaseShared.value = zoomShared.value;
    })
    .onUpdate((e) => {
      'worklet';
      const next = Math.max(
        1,
        Math.min(config.maxZoom, zoomBaseShared.value * e.scale)
      );
      zoomShared.value = next;
    })
    .onEnd(() => {
      'worklet';
      runOnJS(ctrl.setZoom)(zoomShared.value);
    });

  // ── Capture / recording press ─────────────────────────────────────────────
  const onCapturePress = async () => {
    if (mode === 'photo') {
      await ctrl.capturePhoto();
      return;
    }
    if (ctrl.isRecording) {
      await ctrl.stopRecording();
    } else {
      await ctrl.startRecording();
    }
  };

  // ── Permission gate ───────────────────────────────────────────────────────
  const cameraGranted = ctrl.cameraPerm?.hasPermission ?? false;
  const audioRequired = config.enableAudio && mode === 'video';
  const audioGranted =
    !audioRequired || (ctrl.micPerm?.hasPermission ?? false);

  // ── Custom renderer override ──────────────────────────────────────────────
  if (renderCameraScreen) {
    const exposed: CameraExposedState = {
      isCameraReady: ctrl.isCameraReady,
      isRecording: ctrl.isRecording,
      facing: ctrl.facing,
      zoom: ctrl.zoom,
      elapsed: ctrl.elapsed,
      capturePhoto: ctrl.capturePhoto,
      startRecording: ctrl.startRecording,
      stopRecording: ctrl.stopRecording,
      switchCamera: ctrl.switchCamera,
      setZoom: ctrl.setZoom,
      close: onClose,
    };
    return (
      <View style={[tw`flex-1`, { backgroundColor: bgColor }]}>
        {renderCameraScreen(exposed)}
      </View>
    );
  }

  // ── Default UI ────────────────────────────────────────────────────────────
  return (
    <View style={[tw`flex-1 relative`, { backgroundColor: bgColor }]}>
      <GestureDetector gesture={pinch}>
        <View style={tw`flex-1`}>
          {ctrl.device && cameraGranted ? (
            <ctrl.Camera
              ref={ctrl.cameraRef}
              style={tw`absolute inset-0`}
              device={ctrl.device}
              isActive
              photo={config.enablePhoto}
              video={config.enableVideo}
              audio={config.enableAudio}
              zoom={ctrl.zoom}
              onInitialized={ctrl.onInitialized}
            />
          ) : (
            <PermissionPlaceholder
              fontFamily={fontFamily}
              cameraGranted={cameraGranted}
              audioGranted={audioGranted}
            />
          )}
        </View>
      </GestureDetector>

      {/* Top controls */}
      <View
        style={[
          tw`absolute left-0 right-0 flex-row justify-between items-center px-4`,
          { top: TOP_INSET },
        ]}
        pointerEvents="box-none"
      >
        <RoundButton size={controlSize} onPress={onClose} bg="rgba(0,0,0,0.5)">
          <CloseIcon size={controlSize * 0.55} color={iconColor} />
        </RoundButton>

        {ctrl.isRecording && (
          <View style={tw`flex-row items-center gap-1.5 self-center`}>
            <View
              style={[
                tw`rounded-full`,
                { width: 10, height: 10, backgroundColor: recDotColor },
              ]}
            />
            <Text
              style={withFontFamily(
                [
                  tw`text-white font-semibold`,
                  cameraUIProps?.timerTextStyle as TextStyle | undefined,
                ],
                fontFamily
              )}
            >
              {formatTimer(ctrl.elapsed)}
            </Text>
          </View>
        )}

        {config.enableSwitchCamera && !ctrl.isRecording ? (
          <RoundButton
            size={controlSize}
            onPress={ctrl.switchCamera}
            bg="rgba(0,0,0,0.5)"
          >
            <SwitchCameraIcon
              style={{
                width: controlSize * 0.55,
                height: controlSize * 0.55,
              }}
              color={iconColor}
            />
          </RoundButton>
        ) : (
          <View style={{ width: controlSize, height: controlSize }} />
        )}
      </View>

      {/* Bottom controls */}
      <View
        style={[
          tw`absolute left-0 right-0 items-center`,
          { bottom: BOTTOM_INSET },
        ]}
        pointerEvents="box-none"
      >
        {!ctrl.isRecording && config.enablePhoto && config.enableVideo && (
          <View
            style={tw`flex-row mb-5 px-1.5 py-1.5 rounded-full bg-black/40`}
          >
            <ModePill
              label="Photo"
              active={mode === 'photo'}
              activeBg={activeModeColor}
              inactiveColor={inactiveModeColor}
              fontFamily={fontFamily}
              onPress={() => setMode('photo')}
            />
            <ModePill
              label="Video"
              active={mode === 'video'}
              activeBg={activeModeColor}
              inactiveColor={inactiveModeColor}
              fontFamily={fontFamily}
              onPress={() => setMode('video')}
            />
          </View>
        )}

        <CaptureButton
          size={captureSize}
          mode={mode}
          isRecording={ctrl.isRecording}
          ringColor={ringColor}
          recRingColor={recRingColor}
          captureDotColor={captureDotColor}
          recDotColor={recDotColor}
          onPress={onCapturePress}
        />
      </View>
    </View>
  );
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const RoundButton: React.FC<{
  size: number;
  onPress: () => void;
  bg: string;
  children?: React.ReactNode;
  style?: ViewStyle;
}> = ({ size, onPress, bg, children, style }) => (
  <Pressable
    onPress={onPress}
    style={[
      tw`items-center justify-center`,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
      },
      style,
    ]}
  >
    {children}
  </Pressable>
);

const ModePill: React.FC<{
  label: string;
  active: boolean;
  activeBg: string;
  inactiveColor: string;
  fontFamily?: string;
  onPress: () => void;
}> = ({ label, active, activeBg, inactiveColor, fontFamily, onPress }) => (
  <Pressable
    onPress={onPress}
    style={[
      tw`px-4 py-1.5 rounded-full`,
      active ? { backgroundColor: activeBg } : tw`bg-transparent`,
    ]}
  >
    <Text
      style={withFontFamily(
        [
          tw`text-sm font-medium`,
          { color: active ? '#000000' : inactiveColor },
        ],
        fontFamily
      )}
    >
      {label}
    </Text>
  </Pressable>
);

const CaptureButton: React.FC<{
  size: number;
  mode: Mode;
  isRecording: boolean;
  ringColor: string;
  recRingColor: string;
  captureDotColor: string;
  recDotColor: string;
  onPress: () => void;
}> = ({
  size,
  mode,
  isRecording,
  ringColor,
  recRingColor,
  captureDotColor,
  onPress,
}) => {
  const scale = useSharedValue(1);
  useEffect(() => {
    scale.value = withTiming(isRecording ? 0.55 : 1, { duration: 180 });
  }, [isRecording, scale]);

  const innerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const innerSize = size * 0.78;
  const innerColor =
    mode === 'video' && isRecording ? recRingColor : captureDotColor;

  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          tw`items-center justify-center`,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 4,
            borderColor:
              isRecording && mode === 'video' ? recRingColor : ringColor,
          },
        ]}
      >
        <Animated.View
          style={[
            innerStyle,
            {
              width: innerSize,
              height: innerSize,
              borderRadius:
                isRecording && mode === 'video' ? 8 : innerSize / 2,
              backgroundColor: innerColor,
            },
          ]}
        />
      </View>
    </Pressable>
  );
};

const CloseIcon: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Line
      x1="18"
      y1="6"
      x2="6"
      y2="18"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Line
      x1="6"
      y1="6"
      x2="18"
      y2="18"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

const PermissionPlaceholder: React.FC<{
  fontFamily?: string;
  cameraGranted: boolean;
  audioGranted: boolean;
}> = ({ fontFamily, cameraGranted, audioGranted }) => (
  <View style={tw`flex-1 items-center justify-center px-8`}>
    <Text
      style={withFontFamily(
        [tw`text-white text-base text-center`],
        fontFamily
      )}
    >
      {!cameraGranted
        ? 'Camera permission is required to use this feature.'
        : !audioGranted
          ? 'Microphone permission is required to record video.'
          : 'Initializing camera…'}
    </Text>
  </View>
);

const CameraMissingFallback: React.FC<{
  onClose: () => void;
  fontFamily?: string;
}> = ({ onClose, fontFamily }) => (
  <View style={tw`flex-1 bg-black items-center justify-center px-8`}>
    <Text
      style={withFontFamily(
        [tw`text-white text-base text-center mb-4`],
        fontFamily
      )}
    >
      `react-native-vision-camera` is not installed. Install version 4.7.3 and
      rebuild the app to use the built-in camera, or pass your own
      `renderCameraScreen` / `onCameraPress` instead.
    </Text>
    <Pressable
      onPress={onClose}
      style={tw`px-6 py-2.5 rounded-full bg-white/15`}
    >
      <Text
        style={withFontFamily(
          [tw`text-white text-sm font-medium`],
          fontFamily
        )}
      >
        Close
      </Text>
    </Pressable>
  </View>
);
