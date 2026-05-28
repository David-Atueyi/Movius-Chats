import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Vibration } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import {
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
import {
  LOCK_ON_RELEASE_DELTA,
  LONG_PRESS_MS,
} from './constants';
import {
  RecordingState,
  STATE_HOLD,
  STATE_IDLE,
  stateToInt,
  VoiceRecorderFlowAudio,
} from './types';

function vibrateOnce() {
  Vibration.vibrate(15);
}

export interface FlowControllerArgs {
  // Resolved tunables
  cancelSlideDistance: number;
  lockSlideDistance: number;
  enableLockRecording: boolean;
  enableSlideToCancel: boolean;
  holdMicScale: number;

  // Callbacks
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

export function useFlowController(args: FlowControllerArgs) {
  const {
    cancelSlideDistance,
    lockSlideDistance,
    enableLockRecording,
    enableSlideToCancel,
    holdMicScale,
    onRecordingStart,
    onRecordingStop,
    onSend,
    onDelete,
    onLock,
    onCancel,
    onPauseRecording,
    onResumeRecording,
    onStateChange,
  } = args;

  // Threshold magnitudes (negative because "up" / "left" use negative deltas)
  const cancelThreshold = -Math.abs(cancelSlideDistance);
  const lockThreshold = -Math.abs(lockSlideDistance);
  const maxLeft = cancelThreshold - 30;
  const maxUp = lockThreshold - 20;

  // React state
  const [state, setState] = useState<RecordingState>('IDLE');
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const stateRef = useRef<RecordingState>('IDLE');
  const isPausedRef = useRef(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Notify parent on state changes.
  const onStateChangeRef = useRef(onStateChange);
  onStateChangeRef.current = onStateChange;
  useEffect(() => {
    onStateChangeRef.current?.(state);
  }, [state]);

  // Worklet-readable mirrors of dynamic prop values
  const stateShared = useSharedValue(STATE_IDLE);
  useEffect(() => {
    stateShared.value = stateToInt(state);
  }, [state]);

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
  const pausedAccumRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);

  // Animation shared values
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const micScale = useSharedValue(1);
  const arrowPulse = useSharedValue(0);
  const chevronPulse = useSharedValue(0);
  const pausePulse = useSharedValue(1);
  const waveTick = useSharedValue(0);
  const recBlink = useSharedValue(1);

  const cancelFiredShared = useSharedValue(0);
  const lockFiredShared = useSharedValue(0);

  // Continuous loops (start once, run for the lifetime of the component)
  useEffect(() => {
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
        withTiming(-4, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    pausePulse.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 600, easing: Easing.inOut(Easing.ease) }),
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
    recBlink.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1,
      false
    );
  }, []);

  // Mic scale tracks the active state.
  useEffect(() => {
    if (state === 'RECORDING_HOLD') {
      micScale.value = withSpring(holdMicScale, {
        damping: 14,
        stiffness: 220,
      });
    } else {
      micScale.value = withSpring(1, { damping: 16, stiffness: 220 });
    }
  }, [state, holdMicScale]);

  // Timer — pauses when `isPaused` is true (tap-mode pause/resume).
  useEffect(() => {
    const recording =
      state === 'RECORDING_TAP' ||
      state === 'RECORDING_HOLD' ||
      state === 'LOCKED_RECORDING';
    if (!recording || isPaused) return;
    const id = setInterval(() => {
      const live =
        Date.now() - startedAtRef.current - pausedAccumRef.current;
      setDuration(live / 1000);
    }, 250);
    return () => clearInterval(id);
  }, [state, isPaused]);

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
  const onPauseRef = useRef(onPauseRecording);
  onPauseRef.current = onPauseRecording;
  const onResumeRef = useRef(onResumeRecording);
  onResumeRef.current = onResumeRecording;

  // Lifecycle helpers

  const beginRecording = useCallback(() => {
    startedAtRef.current = Date.now();
    pausedAccumRef.current = 0;
    pausedAtRef.current = 0;
    setIsPaused(false);
    setDuration(0);
    cancelFiredShared.value = 0;
    lockFiredShared.value = 0;
    translateX.value = 0;
    translateY.value = 0;
    onRecordingStartRef.current?.();
  }, []);

  const finalizeReset = useCallback(() => {
    setDuration(0);
    setIsPaused(false);
    pausedAccumRef.current = 0;
    pausedAtRef.current = 0;
    translateX.value = 0;
    translateY.value = 0;
    setState('IDLE');
  }, []);

  // Transitions

  const sendNow = useCallback(() => {
    const finalDuration =
      (Date.now() - startedAtRef.current - pausedAccumRef.current) / 1000;
    setState('SENDING');
    onRecordingStopRef.current?.();
    onSendRef.current?.({ duration: finalDuration });
    finalizeReset();
  }, [finalizeReset]);

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
    translateX.value = withSpring(0, { damping: 18, stiffness: 220 });
    translateY.value = withSpring(0, { damping: 18, stiffness: 220 });
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
    finalizeReset();
  }, [finalizeReset]);

  const handleHoldEnd = useCallback(() => {
    if (stateRef.current !== 'RECORDING_HOLD') return;
    sendNow();
  }, [sendNow]);

  // Side effects MUST happen outside the setState updater so they don't
  // schedule sibling-component updates while React is preparing this render.
  const togglePause = useCallback(() => {
    const willPause = !isPausedRef.current;
    if (willPause) {
      pausedAtRef.current = Date.now();
      onPauseRef.current?.();
    } else {
      pausedAccumRef.current += Date.now() - pausedAtRef.current;
      pausedAtRef.current = 0;
      onResumeRef.current?.();
    }
    setIsPaused(willPause);
  }, []);

  // Stable refs so gesture worklets never see stale handlers
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

  // Gestures

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

        const rawTx = Math.max(
          maxLeftShared.value,
          Math.min(0, e.translationX)
        );
        const rawTy = Math.max(
          maxUpShared.value,
          Math.min(0, e.translationY)
        );
        const dominantY = Math.abs(rawTy) > Math.abs(rawTx);

        // Constrain visual movement to a single axis based on dominant
        // direction — straight up for lock, straight left for cancel.
        translateX.value = dominantY ? 0 : rawTx;
        translateY.value = dominantY ? rawTy : 0;

        if (
          dominantY &&
          enableLockShared.value === 1 &&
          lockFiredShared.value === 0 &&
          rawTy <= lockThresholdShared.value
        ) {
          lockFiredShared.value = 1;
          runOnJS(fireLock)();
        }

        if (
          !dominantY &&
          enableCancelShared.value === 1 &&
          cancelFiredShared.value === 0 &&
          rawTx <= cancelThresholdShared.value
        ) {
          cancelFiredShared.value = 1;
          runOnJS(fireCancel)();
        }
      })
      .onEnd(() => {
        'worklet';
        if (
          lockFiredShared.value === 1 ||
          cancelFiredShared.value === 1
        )
          return;

        
        if (
          enableLockShared.value === 1 &&
          translateY.value < -LOCK_ON_RELEASE_DELTA
        ) {
          lockFiredShared.value = 1;
          runOnJS(fireLock)();
          return;
        }

        runOnJS(fireHoldEnd)();
      })
      .onFinalize(() => {
        'worklet';
        if (lockFiredShared.value === 0 && cancelFiredShared.value === 0) {
          translateX.value = withSpring(0, { damping: 18, stiffness: 220 });
          translateY.value = withSpring(0, { damping: 18, stiffness: 220 });
        }
      });

    return Gesture.Race(tap, holdPan);
  }, []);

  // Animated styles

  const micWrapperStyle = useAnimatedStyle(() => {
    const isHold = stateShared.value === STATE_HOLD;
    return {
      transform: [
        { translateX: isHold ? translateX.value : 0 },
        { translateY: isHold ? translateY.value : 0 },
        { scale: micScale.value },
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
      transform: [{ translateX: translateX.value * 0.4 + arrowPulse.value }],
    };
  });

  const lockPillAnimatedStyle = useAnimatedStyle(() => {
    const lockProgress = interpolate(
      translateY.value,
      [0, lockThresholdShared.value],
      [0, 1],
      Extrapolation.CLAMP
    );
    return {
      transform: [
        { translateY: interpolate(lockProgress, [0, 1], [0, -22]) },
      ],
    };
  });

  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: chevronPulse.value }],
  }));

  const pausePulseStyle = useAnimatedStyle(() => ({
    opacity: isPaused ? 1 : pausePulse.value,
  }));

  const recDotStyle = useAnimatedStyle(() => ({
    opacity: recBlink.value,
  }));

  return {
    state,
    duration,
    isPaused,
    composedGesture,
    waveTick,
    micWrapperStyle,
    slideTextAnimatedStyle,
    lockPillAnimatedStyle,
    chevronAnimatedStyle,
    pausePulseStyle,
    recDotStyle,
    triggerCancel,
    togglePause,
  };
}
