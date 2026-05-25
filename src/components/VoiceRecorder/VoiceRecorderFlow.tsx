import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  Vibration,
  View,
  ViewStyle,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import type { SharedValue } from 'react-native-reanimated';
import { ChevronUpIcon } from '../../assets/Icons/ChevronUpIcon';
import { LockIcon } from '../../assets/Icons/LockIcon';
import { MicrophoneIcon } from '../../assets/Icons/MicrophoneIcon';
import { PaperPlaneIcon } from '../../assets/Icons/PaperPlaneIcon';
import { TrashIcon } from '../../assets/Icons/TrashIcon';
import { formatDuration } from '../../utils/datefunc';

// ─── State machine ────────────────────────────────────────────────────────────

export type RecordingState =
  | 'IDLE'
  | 'RECORDING_TAP'
  | 'RECORDING_HOLD'
  | 'LOCKED_RECORDING'
  | 'SENDING'
  | 'CANCELLED';

const STATE_IDLE = 0;
const STATE_TAP = 1;
const STATE_HOLD = 2;
const STATE_LOCKED = 3;
const STATE_SENDING = 4;
const STATE_CANCELLED = 5;

function stateToInt(s: RecordingState): number {
  switch (s) {
    case 'IDLE':
      return STATE_IDLE;
    case 'RECORDING_TAP':
      return STATE_TAP;
    case 'RECORDING_HOLD':
      return STATE_HOLD;
    case 'LOCKED_RECORDING':
      return STATE_LOCKED;
    case 'SENDING':
      return STATE_SENDING;
    case 'CANCELLED':
      return STATE_CANCELLED;
  }
}

// ─── Audio payload passed to onSend ───────────────────────────────────────────

export interface VoiceRecorderFlowAudio {
  /** Final recording duration in seconds. */
  duration: number;
}

// ─── Public props ─────────────────────────────────────────────────────────────

export interface VoiceRecorderFlowProps {
  // ── Colors ────────────────────────────────────────────────────────────────
  primaryColor?: string;
  backgroundColor?: string;
  timerColor?: string;
  microphoneColor?: string;
  lockColor?: string;
  waveformColor?: string;
  deleteIconColor?: string;
  cancelTextColor?: string;
  chevronColor?: string;
  lockPillBackground?: string;
  lockPillActiveBorderColor?: string;
  borderTopColor?: string;
  borderTopWidth?: number;

  // ── Sizes ─────────────────────────────────────────────────────────────────
  containerHeight?: number;
  micSize?: number;
  iconSize?: number;
  sendIconSize?: number;
  lockIconSize?: number;

  // ── Behavior flags ────────────────────────────────────────────────────────
  enableLockRecording?: boolean;
  enableSlideToCancel?: boolean;
  enableWaveform?: boolean;

  // ── Thresholds (positive values; signs handled internally) ────────────────
  lockSlideDistance?: number;
  cancelSlideDistance?: number;

  // ── Lock pill layout ──────────────────────────────────────────────────────
  lockPillGap?: number;
  lockPillMarginBottom?: number;

  // ── Waveform ──────────────────────────────────────────────────────────────
  waveCount?: number;

  // ── Render props ──────────────────────────────────────────────────────────
  renderMicIcon?: () => ReactNode;
  renderSendIcon?: () => ReactNode;
  renderLockIcon?: () => ReactNode;
  renderArrowIcon?: () => ReactNode;
  renderDeleteIcon?: () => ReactNode;
  renderWaveform?: () => ReactNode;

  // ── Style overrides ───────────────────────────────────────────────────────
  containerStyle?: ViewStyle;
  barStyle?: ViewStyle;
  timerTextStyle?: TextStyle;
  slideTextStyle?: TextStyle;
  waveformStyle?: ViewStyle;
  lockPillStyle?: ViewStyle;
  trashButtonStyle?: ViewStyle;
  sendButtonStyle?: ViewStyle;

  // ── Callbacks ─────────────────────────────────────────────────────────────
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  onSend?: (audio: VoiceRecorderFlowAudio) => void;
  onDelete?: () => void;
  onLock?: () => void;
  onCancel?: () => void;
}

// ─── Tunables (defaults; overridable via props) ───────────────────────────────

const DEFAULT_CONTAINER_HEIGHT = 110;
const DEFAULT_MIC_SIZE = 72;
const MIC_RIGHT = 18;

const LONG_PRESS_MS = 300;

const DEFAULT_CANCEL_DISTANCE = 120;
const DEFAULT_LOCK_DISTANCE = 100;
const LOCK_REVEAL_TRAVEL = -10;

const DEFAULT_LOCK_PILL_GAP = 10;
const DEFAULT_LOCK_PILL_MARGIN_BOTTOM = 8;
const DEFAULT_WAVE_COUNT = 28;
const DEFAULT_ICON_SIZE = 30;
const DEFAULT_LOCK_ICON_SIZE = 20;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function vibrateOnce() {
  Vibration.vibrate(20);
}

// ─── Component ────────────────────────────────────────────────────────────────

export const VoiceRecorderFlow: React.FC<VoiceRecorderFlowProps> = (props) => {
  const {
    primaryColor = '#22C55E',
    backgroundColor = '#0B141A',
    timerColor = '#FFFFFF',
    microphoneColor = '#FFFFFF',
    lockColor = '#E9EDEF',
    waveformColor = '#E9EDEF',
    deleteIconColor = '#8696A0',
    cancelTextColor = 'rgba(255,255,255,0.55)',
    chevronColor,
    lockPillBackground = 'rgba(20,28,33,0.95)',
    lockPillActiveBorderColor = '#22C55E',
    borderTopColor,
    borderTopWidth = 0,
    containerHeight = DEFAULT_CONTAINER_HEIGHT,
    micSize = DEFAULT_MIC_SIZE,
    iconSize = DEFAULT_ICON_SIZE,
    sendIconSize,
    lockIconSize = DEFAULT_LOCK_ICON_SIZE,
    enableLockRecording = true,
    enableSlideToCancel = true,
    enableWaveform = true,
    lockSlideDistance = DEFAULT_LOCK_DISTANCE,
    cancelSlideDistance = DEFAULT_CANCEL_DISTANCE,
    lockPillGap = DEFAULT_LOCK_PILL_GAP,
    lockPillMarginBottom = DEFAULT_LOCK_PILL_MARGIN_BOTTOM,
    waveCount = DEFAULT_WAVE_COUNT,
    renderMicIcon,
    renderSendIcon,
    renderLockIcon,
    renderArrowIcon,
    renderDeleteIcon,
    renderWaveform,
    containerStyle: containerStyleOverride,
    barStyle: barStyleOverride,
    timerTextStyle,
    slideTextStyle: slideTextStyleOverride,
    waveformStyle,
    lockPillStyle: lockPillStyleOverride,
    trashButtonStyle,
    sendButtonStyle,
    onRecordingStart,
    onRecordingStop,
    onSend,
    onDelete,
    onLock,
    onCancel,
  } = props;

  // Resolve threshold magnitudes (signs handled internally)
  const cancelThreshold = -Math.abs(cancelSlideDistance);
  const lockThreshold = -Math.abs(lockSlideDistance);
  const maxLeft = cancelThreshold - 30;
  const maxUp = lockThreshold - 20;
  const resolvedSendIconSize = sendIconSize ?? iconSize;

  // Reactive state
  const [state, setState] = useState<RecordingState>('IDLE');
  const [duration, setDuration] = useState(0);

  // Mirrors of state for closures / worklets
  const stateRef = useRef<RecordingState>('IDLE');
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const stateShared = useSharedValue(STATE_IDLE);
  useEffect(() => {
    stateShared.value = stateToInt(state);
  }, [state]);

  // Threshold mirrors so gesture worklets always read the latest prop values
  const cancelThresholdShared = useSharedValue(cancelThreshold);
  const lockThresholdShared = useSharedValue(lockThreshold);
  const maxLeftShared = useSharedValue(maxLeft);
  const maxUpShared = useSharedValue(maxUp);
  const enableLockShared = useSharedValue(enableLockRecording ? 1 : 0);
  const enableCancelShared = useSharedValue(enableSlideToCancel ? 1 : 0);
  useEffect(() => {
    cancelThresholdShared.value = cancelThreshold;
    lockThresholdShared.value = lockThreshold;
    maxLeftShared.value = maxLeft;
    maxUpShared.value = maxUp;
    enableLockShared.value = enableLockRecording ? 1 : 0;
    enableCancelShared.value = enableSlideToCancel ? 1 : 0;
  }, [
    cancelThreshold,
    lockThreshold,
    maxLeft,
    maxUp,
    enableLockRecording,
    enableSlideToCancel,
  ]);

  // Timekeeping
  const startedAtRef = useRef<number>(0);

  // Animation shared values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const containerOpacity = useSharedValue(0);
  const containerY = useSharedValue(120);

  const micPulse = useSharedValue(1);
  const arrowPulse = useSharedValue(0);
  const chevronPulse = useSharedValue(0);
  const pauseOpacity = useSharedValue(1);
  const waveTick = useSharedValue(0);

  const cancelFiredShared = useSharedValue(0);
  const lockFiredShared = useSharedValue(0);

  // Continuous loop animations
  useEffect(() => {
    micPulse.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 850, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 850, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    arrowPulse.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 700, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    chevronPulse.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    pauseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.45, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    waveTick.value = withRepeat(
      withTiming(1, { duration: 4500, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  // Timer — single source of truth across HOLD ↔ LOCKED transitions
  useEffect(() => {
    const recording =
      state === 'RECORDING_TAP' ||
      state === 'RECORDING_HOLD' ||
      state === 'LOCKED_RECORDING';
    if (!recording) return;
    const id = setInterval(() => {
      setDuration((Date.now() - startedAtRef.current) / 1000);
    }, 250);
    return () => clearInterval(id);
  }, [state]);

  // Stable callback refs (worklet-safe)
  const onRecordingStartRef = useRef(onRecordingStart);
  onRecordingStartRef.current = onRecordingStart;
  const onRecordingStopRef = useRef(onRecordingStop);
  onRecordingStopRef.current = onRecordingStop;
  const onSendRef = useRef(onSend);
  onSendRef.current = onSend;
  const onDeleteRef = useRef(onDelete);
  onDeleteRef.current = onDelete;
  const onLockRef = useRef(onLock);
  onLockRef.current = onLock;
  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;

  // ─── Lifecycle helpers ──────────────────────────────────────────────────────

  const beginRecording = useCallback(() => {
    startedAtRef.current = Date.now();
    setDuration(0);
    cancelFiredShared.value = 0;
    lockFiredShared.value = 0;
    translateX.value = 0;
    translateY.value = 0;
    containerOpacity.value = withTiming(1, { duration: 280 });
    containerY.value = withSpring(0, { damping: 18, stiffness: 180 });
    onRecordingStartRef.current?.();
  }, []);

  const finalizeReset = useCallback(() => {
    setDuration(0);
    translateX.value = 0;
    translateY.value = 0;
    containerY.value = 120;
    containerOpacity.value = 0;
    setState('IDLE');
  }, []);

  const closeOut = useCallback(() => {
    containerOpacity.value = withTiming(0, { duration: 280 });
    containerY.value = withTiming(
      120,
      { duration: 280, easing: Easing.in(Easing.cubic) },
      (finished) => {
        'worklet';
        if (finished) {
          runOnJS(finalizeReset)();
        }
      }
    );
  }, [finalizeReset]);

  // ─── Transitions ────────────────────────────────────────────────────────────

  const sendNow = useCallback(() => {
    const finalDuration = (Date.now() - startedAtRef.current) / 1000;
    setState('SENDING');
    onRecordingStopRef.current?.();
    onSendRef.current?.({ duration: finalDuration });
    closeOut();
  }, [closeOut]);

  const handleQuickTap = useCallback(() => {
    const s = stateRef.current;
    if (s === 'IDLE') {
      setState('RECORDING_TAP');
      beginRecording();
      return;
    }
    if (s === 'RECORDING_TAP' || s === 'LOCKED_RECORDING') {
      sendNow();
    }
  }, [beginRecording, sendNow]);

  const handleHoldStart = useCallback(() => {
    if (stateRef.current !== 'IDLE') return;
    setState('RECORDING_HOLD');
    beginRecording();
  }, [beginRecording]);

  const triggerLock = useCallback(() => {
    if (stateRef.current !== 'RECORDING_HOLD') return;
    vibrateOnce();
    setState('LOCKED_RECORDING');
    translateX.value = withSpring(0, { damping: 18, stiffness: 180 });
    translateY.value = withSpring(0, { damping: 18, stiffness: 180 });
    onLockRef.current?.();
  }, []);

  const triggerCancel = useCallback(() => {
    const s = stateRef.current;
    if (
      s !== 'RECORDING_HOLD' &&
      s !== 'RECORDING_TAP' &&
      s !== 'LOCKED_RECORDING'
    )
      return;
    vibrateOnce();
    setState('CANCELLED');
    onRecordingStopRef.current?.();
    onCancelRef.current?.();
    onDeleteRef.current?.();
    closeOut();
  }, [closeOut]);

  const handleHoldEnd = useCallback(() => {
    if (stateRef.current !== 'RECORDING_HOLD') return;
    sendNow();
  }, [sendNow]);

  // Stable refs for worklets (avoid recomputing gesture on every render)
  const handleQuickTapRef = useRef(handleQuickTap);
  handleQuickTapRef.current = handleQuickTap;
  const handleHoldStartRef = useRef(handleHoldStart);
  handleHoldStartRef.current = handleHoldStart;
  const handleHoldEndRef = useRef(handleHoldEnd);
  handleHoldEndRef.current = handleHoldEnd;
  const triggerLockRef = useRef(triggerLock);
  triggerLockRef.current = triggerLock;
  const triggerCancelRef = useRef(triggerCancel);
  triggerCancelRef.current = triggerCancel;

  const fireQuickTap = () => handleQuickTapRef.current();
  const fireHoldStart = () => handleHoldStartRef.current();
  const fireHoldEnd = () => handleHoldEndRef.current();
  const fireLock = () => triggerLockRef.current();
  const fireCancel = () => triggerCancelRef.current();

  // ─── Gestures ───────────────────────────────────────────────────────────────

  const composedGesture = useMemo(() => {
    const tap = Gesture.Tap()
      .maxDuration(LONG_PRESS_MS - 10)
      .onEnd((_e, success) => {
        'worklet';
        if (success) runOnJS(fireQuickTap)();
      });

    const holdPan = Gesture.Pan()
      .activateAfterLongPress(LONG_PRESS_MS)
      .onStart(() => {
        'worklet';
        runOnJS(fireHoldStart)();
      })
      .onUpdate((e) => {
        'worklet';
        if (stateShared.value !== STATE_HOLD) return;

        const tx = Math.max(maxLeftShared.value, Math.min(0, e.translationX));
        const ty = Math.max(maxUpShared.value, Math.min(0, e.translationY));
        translateX.value = tx;
        translateY.value = ty;

        const dominantY = Math.abs(ty) > Math.abs(tx);

        if (
          dominantY &&
          enableLockShared.value === 1 &&
          lockFiredShared.value === 0 &&
          ty <= lockThresholdShared.value
        ) {
          lockFiredShared.value = 1;
          runOnJS(fireLock)();
        }

        if (
          !dominantY &&
          enableCancelShared.value === 1 &&
          cancelFiredShared.value === 0 &&
          tx <= cancelThresholdShared.value
        ) {
          cancelFiredShared.value = 1;
          runOnJS(fireCancel)();
        }
      })
      .onEnd(() => {
        'worklet';
        runOnJS(fireHoldEnd)();
      })
      .onFinalize(() => {
        'worklet';
        if (lockFiredShared.value === 0 && cancelFiredShared.value === 0) {
          translateX.value = withSpring(0, { damping: 18, stiffness: 180 });
          translateY.value = withSpring(0, { damping: 18, stiffness: 180 });
        }
      });

    return Gesture.Race(tap, holdPan);
  }, []);

  // ─── Animated styles ────────────────────────────────────────────────────────

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{ translateY: containerY.value }],
  }));

  const micButtonStyle = useAnimatedStyle(() => {
    const isHold = stateShared.value === STATE_HOLD;
    const pulse = stateShared.value === STATE_IDLE ? 1 : micPulse.value;
    return {
      transform: [
        { translateX: isHold ? translateX.value : 0 },
        { translateY: isHold ? translateY.value : 0 },
        { scale: pulse },
      ],
    };
  });

  const slideTextAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, cancelThresholdShared.value],
      [1, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ translateX: translateX.value * 0.55 + arrowPulse.value }],
    };
  });

  const lockPillAnimatedStyle = useAnimatedStyle(() => {
    const reveal = interpolate(
      translateY.value,
      [0, LOCK_REVEAL_TRAVEL],
      [0, 1],
      Extrapolation.CLAMP
    );
    const lockProgress = interpolate(
      translateY.value,
      [0, lockThresholdShared.value],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity: reveal,
      transform: [
        { scale: 0.7 + reveal * 0.3 },
        { translateY: interpolate(lockProgress, [0, 1], [0, -22]) },
      ],
    };
  });

  const lockProgressFillStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      translateY.value,
      [0, lockThresholdShared.value],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { height: `${Math.round(progress * 100)}%` };
  });

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: chevronPulse.value }],
  }));

  const pauseAnimatedStyle = useAnimatedStyle(() => ({
    opacity: pauseOpacity.value,
  }));

  // ─── Render decisions ───────────────────────────────────────────────────────

  const showBar = state !== 'IDLE';
  const showLockPill = state === 'RECORDING_HOLD';
  const isScreenOne =
    state === 'RECORDING_TAP' ||
    state === 'LOCKED_RECORDING' ||
    state === 'SENDING';

  // ── Computed style fragments ───────────────────────────────────────────────
  const dynamicBarStyle: ViewStyle = {
    height: containerHeight,
    backgroundColor,
    ...(borderTopWidth > 0 && borderTopColor
      ? { borderTopWidth, borderTopColor }
      : null),
  };

  const buttonAnchorStyle: ViewStyle = {
    position: 'absolute',
    right: MIC_RIGHT,
    bottom: (containerHeight - micSize) / 2,
  };

  const micPressableStyle: ViewStyle = {
    width: micSize,
    height: micSize,
    justifyContent: 'center',
    alignItems: 'center',
  };

  const micCircleStyle: ViewStyle = {
    width: micSize,
    height: micSize,
    borderRadius: micSize / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    backgroundColor: primaryColor,
  };

  const lockPillBaseStyle: ViewStyle = {
    position: 'absolute',
    right: MIC_RIGHT + (micSize - 46) / 2,
    bottom: containerHeight + lockPillMarginBottom,
    width: 46,
    paddingVertical: 12,
    borderRadius: 28,
    backgroundColor: lockPillBackground,
    borderColor: lockPillActiveBorderColor,
    alignItems: 'center',
    justifyContent: 'center',
    gap: lockPillGap,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  };

  const resolvedChevronColor = chevronColor ?? lockColor;
  const showLockPillNode = enableLockRecording && showLockPill;

  return (
    <View
      style={[styles.root, containerStyleOverride]}
      pointerEvents="box-none"
    >
      {showBar && (
        <Animated.View
          style={[
            styles.bar,
            dynamicBarStyle,
            barStyleOverride,
            containerAnimatedStyle,
          ]}
        >
          {isScreenOne ? (
            <ScreenOneCenter
              duration={duration}
              timerColor={timerColor}
              waveformColor={waveformColor}
              deleteIconColor={deleteIconColor}
              waveTick={waveTick}
              pauseAnimatedStyle={pauseAnimatedStyle}
              renderDeleteIcon={renderDeleteIcon}
              renderWaveform={renderWaveform}
              onDeletePress={triggerCancel}
              waveCount={waveCount}
              showWaveform={enableWaveform}
              micSize={micSize}
              timerTextStyleOverride={timerTextStyle}
              waveformStyle={waveformStyle}
              trashButtonStyleOverride={trashButtonStyle}
            />
          ) : (
            <ScreenTwoCenter
              duration={duration}
              timerColor={timerColor}
              slideTextAnimatedStyle={slideTextAnimatedStyle}
              renderArrowIcon={renderArrowIcon}
              cancelTextColor={cancelTextColor}
              micSize={micSize}
              timerTextStyleOverride={timerTextStyle}
              slideTextStyleOverride={slideTextStyleOverride}
            />
          )}
        </Animated.View>
      )}

      {showLockPillNode && (
        <Animated.View
          style={[lockPillBaseStyle, lockPillAnimatedStyle, lockPillStyleOverride]}
          pointerEvents="none"
        >
          {renderLockIcon ? (
            renderLockIcon()
          ) : (
            <LockIcon
              style={{ width: lockIconSize, height: lockIconSize }}
              color={lockColor}
            />
          )}
          <View style={styles.lockProgressTrack}>
            <Animated.View
              style={[
                styles.lockProgressFill,
                { backgroundColor: primaryColor },
                lockProgressFillStyle,
              ]}
            />
          </View>
          <Animated.View style={chevronStyle}>
            <ChevronUpIcon
              style={{ width: 16, height: 16 }}
              color={resolvedChevronColor}
            />
          </Animated.View>
        </Animated.View>
      )}

      <View style={buttonAnchorStyle} pointerEvents="box-none">
        <GestureDetector gesture={composedGesture}>
          <Animated.View
            style={[micPressableStyle, micButtonStyle]}
            accessibilityRole="button"
            accessibilityLabel={
              isScreenOne
                ? 'Send recording'
                : 'Tap to record. Long-press and slide left to cancel or up to lock.'
            }
          >
            <View style={[micCircleStyle, sendButtonStyle]}>
              {isScreenOne
                ? renderSendIcon
                  ? renderSendIcon()
                  : (
                    <PaperPlaneIcon
                      style={{
                        width: resolvedSendIconSize,
                        height: resolvedSendIconSize,
                      }}
                      color="#FFFFFF"
                    />
                  )
                : renderMicIcon
                  ? renderMicIcon()
                  : (
                    <MicrophoneIcon
                      style={{ width: iconSize, height: iconSize }}
                      color={microphoneColor}
                    />
                  )}
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ScreenOneCenterProps {
  duration: number;
  timerColor: string;
  waveformColor: string;
  deleteIconColor: string;
  waveTick: SharedValue<number>;
  pauseAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  renderDeleteIcon?: () => ReactNode;
  renderWaveform?: () => ReactNode;
  onDeletePress: () => void;
  waveCount: number;
  showWaveform: boolean;
  micSize: number;
  timerTextStyleOverride?: TextStyle;
  waveformStyle?: ViewStyle;
  trashButtonStyleOverride?: ViewStyle;
}

const ScreenOneCenter: React.FC<ScreenOneCenterProps> = ({
  duration,
  timerColor,
  waveformColor,
  deleteIconColor,
  waveTick,
  pauseAnimatedStyle,
  renderDeleteIcon,
  renderWaveform,
  onDeletePress,
  waveCount,
  showWaveform,
  micSize,
  timerTextStyleOverride,
  waveformStyle,
  trashButtonStyleOverride,
}) => {
  return (
    <View style={styles.screenOneRow}>
      <Pressable
        onPress={onDeletePress}
        hitSlop={10}
        style={[styles.deleteWrapper, trashButtonStyleOverride]}
        accessibilityRole="button"
        accessibilityLabel="Delete recording"
      >
        {renderDeleteIcon ? (
          renderDeleteIcon()
        ) : (
          <TrashIcon
            style={{ width: 26, height: 26 }}
            color={deleteIconColor}
          />
        )}
      </Pressable>

      <View style={styles.screenOneCenter}>
        <View style={styles.timerRow}>
          <Text
            style={[styles.timer, { color: timerColor }, timerTextStyleOverride]}
            numberOfLines={1}
          >
            {formatDuration(duration)}
          </Text>
          {showWaveform && (
            <View style={[styles.waveformWrapper, waveformStyle]}>
              {renderWaveform ? (
                renderWaveform()
              ) : (
                <Waveform
                  color={waveformColor}
                  tick={waveTick}
                  count={waveCount}
                />
              )}
            </View>
          )}
        </View>

        <Animated.View style={[styles.pauseRow, pauseAnimatedStyle]}>
          <View style={styles.pauseBar} />
          <View style={styles.pauseBar} />
        </Animated.View>
      </View>

      <View style={{ width: micSize, height: micSize }} />
    </View>
  );
};

interface ScreenTwoCenterProps {
  duration: number;
  timerColor: string;
  slideTextAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  renderArrowIcon?: () => ReactNode;
  cancelTextColor: string;
  micSize: number;
  timerTextStyleOverride?: TextStyle;
  slideTextStyleOverride?: TextStyle;
}

const ScreenTwoCenter: React.FC<ScreenTwoCenterProps> = ({
  duration,
  timerColor,
  slideTextAnimatedStyle,
  renderArrowIcon,
  cancelTextColor,
  micSize,
  timerTextStyleOverride,
  slideTextStyleOverride,
}) => {
  return (
    <View style={styles.screenTwoRow}>
      <Text
        style={[styles.timer, { color: timerColor }, timerTextStyleOverride]}
        numberOfLines={1}
      >
        {formatDuration(duration)}
      </Text>

      <Animated.View style={[styles.slideArea, slideTextAnimatedStyle]}>
        {renderArrowIcon ? (
          renderArrowIcon()
        ) : (
          <Text style={[styles.slideArrow, { color: cancelTextColor }]}>
            ‹
          </Text>
        )}
        <Text
          style={[
            styles.slideText,
            { color: cancelTextColor },
            slideTextStyleOverride,
          ]}
        >
          Slide to cancel
        </Text>
      </Animated.View>

      <View style={{ width: micSize, height: micSize }} />
    </View>
  );
};

// ─── Waveform (UI-thread driven) ──────────────────────────────────────────────

const WAVE_BAR_WIDTH = 3;
const WAVE_SPACING = 3;

interface WaveformProps {
  color: string;
  tick: SharedValue<number>;
  count: number;
}

const Waveform: React.FC<WaveformProps> = ({ color, tick, count }) => {
  return (
    <View style={styles.waveform}>
      {Array.from({ length: count }).map((_, i) => (
        <WaveBar key={i} index={i} total={count} color={color} tick={tick} />
      ))}
    </View>
  );
};

interface WaveBarProps {
  index: number;
  total: number;
  color: string;
  tick: SharedValue<number>;
}

const WaveBar: React.FC<WaveBarProps> = ({ index, total, color, tick }) => {
  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const t = tick.value * Math.PI * 2;
    const phase1 = Math.sin(t * 2 + index * 0.55);
    const phase2 = Math.sin(t * 4 + index * 1.3);
    const phase3 = Math.sin(t * 0.9 + index * 0.27);
    const combined = (phase1 * 0.55 + phase2 * 0.3 + phase3 * 0.4) * 0.5 + 0.5;
    const edge = Math.sin((index / Math.max(1, total - 1)) * Math.PI);
    const amp = Math.max(0.15, Math.min(1, combined) * (0.35 + 0.65 * edge));
    return { height: `${Math.round(amp * 100)}%` };
  });
  return (
    <Animated.View
      style={[
        {
          width: WAVE_BAR_WIDTH,
          marginHorizontal: WAVE_SPACING / 2,
          backgroundColor: color,
          borderRadius: WAVE_BAR_WIDTH,
        },
        animatedStyle,
      ]}
    />
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bar: {
    width: '100%',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockProgressTrack: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  lockProgressFill: {
    width: '100%',
    borderRadius: 2,
  },
  screenOneRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  screenOneCenter: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  screenTwoRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  deleteWrapper: {
    width: 26,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingBottom: 4,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timer: {
    fontSize: 24,
    fontWeight: '600',
    minWidth: 50,
    letterSpacing: 0.3,
  },
  waveformWrapper: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  waveform: {
    width: 200,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pauseRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  pauseBar: {
    width: 3,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#F15C6D',
  },
  slideArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  slideArrow: {
    fontSize: 18,
    lineHeight: 18,
    fontWeight: '500',
    marginTop: -2,
  },
  slideText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default VoiceRecorderFlow;
