import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Platform,
  Pressable,
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
import tw from 'twrnc';
import { ChevronUpIcon } from '../../assets/Icons/ChevronUpIcon';
import { LockIcon } from '../../assets/Icons/LockIcon';
import { MicrophoneIcon } from '../../assets/Icons/MicrophoneIcon';
import { PaperPlaneIcon } from '../../assets/Icons/PaperPlaneIcon';
import { PauseIcon } from '../../assets/Icons/PauseIcon';
import { PlayIcon } from '../../assets/Icons/PlayIcon';
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
  /** Background of the dark recording bar (tap / locked screen). */
  backgroundColor?: string;
  /** Background of the dark "input-shaped" pill shown while long-pressing. */
  holdPillBackground?: string;
  timerColor?: string;
  microphoneColor?: string;
  lockColor?: string;
  waveformColor?: string;
  deleteIconColor?: string;
  cancelTextColor?: string;
  chevronColor?: string;
  /** Recording-active pause/play button color. */
  pauseIconColor?: string;
  lockPillBackground?: string;

  // ── Sizes ─────────────────────────────────────────────────────────────────
  /** Height of the surrounding chat-input row (used to size the mic). */
  inputBarHeight?: number;
  /** Size of the mic / send button when idle. Defaults to `inputBarHeight`. */
  micSize?: number;
  /** Scale multiplier applied to the mic while long-pressing. Default `1.18`. */
  holdMicScale?: number;
  /** Size of glyph icons (mic, send, etc.). */
  iconSize?: number;
  lockIconSize?: number;

  // ── Behavior flags ────────────────────────────────────────────────────────
  enableLockRecording?: boolean;
  enableSlideToCancel?: boolean;
  enableWaveform?: boolean;

  // ── Thresholds (positive values; signs handled internally) ────────────────
  lockSlideDistance?: number;
  cancelSlideDistance?: number;

  // ── Waveform ──────────────────────────────────────────────────────────────
  waveCount?: number;

  // ── Render slots ──────────────────────────────────────────────────────────
  /**
   * Render the normal text input pill that lives next to the mic while idle.
   * The flow takes ownership of the row layout, so the pill is rendered as
   * the flex-1 child to the left of the mic.
   */
  renderInputPill?: () => ReactNode;

  // ── Render props (icons) ──────────────────────────────────────────────────
  renderMicIcon?: () => ReactNode;
  renderSendIcon?: () => ReactNode;
  renderLockIcon?: () => ReactNode;
  renderArrowIcon?: () => ReactNode;
  renderDeleteIcon?: () => ReactNode;
  renderPauseIcon?: () => ReactNode;
  renderPlayIcon?: () => ReactNode;
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
  /** Fired when the user taps the in-bar pause icon. */
  onPauseRecording?: () => void;
  /** Fired when the user taps the in-bar play icon to resume. */
  onResumeRecording?: () => void;
  /** Notifies the parent whenever the internal state changes. */
  onStateChange?: (state: RecordingState) => void;
}

// ─── Tunables (defaults; overridable via props) ───────────────────────────────

const DEFAULT_INPUT_BAR_HEIGHT = Platform.OS === 'ios' ? 50 : 48;
const DEFAULT_HOLD_SCALE = 1.18;

const LONG_PRESS_MS = 220;

const DEFAULT_CANCEL_DISTANCE = 90;
const DEFAULT_LOCK_DISTANCE = 70;

const DEFAULT_WAVE_COUNT = 32;
const DEFAULT_ICON_SIZE = 22;
const DEFAULT_LOCK_ICON_SIZE = 18;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function vibrateOnce() {
  Vibration.vibrate(15);
}

// ─── Component ────────────────────────────────────────────────────────────────

export const VoiceRecorderFlow: React.FC<VoiceRecorderFlowProps> = (props) => {
  const {
    primaryColor = '#16A34A',
    backgroundColor = '#0B141A',
    holdPillBackground = '#1F2C33',
    timerColor = '#FFFFFF',
    microphoneColor = '#FFFFFF',
    lockColor = '#E9EDEF',
    waveformColor = '#E9EDEF',
    deleteIconColor = '#8696A0',
    cancelTextColor = 'rgba(255,255,255,0.6)',
    chevronColor,
    pauseIconColor = '#F15C6D',
    lockPillBackground = '#1F2C33',
    inputBarHeight = DEFAULT_INPUT_BAR_HEIGHT,
    micSize: micSizeProp,
    holdMicScale = DEFAULT_HOLD_SCALE,
    iconSize = DEFAULT_ICON_SIZE,
    lockIconSize = DEFAULT_LOCK_ICON_SIZE,
    enableLockRecording = true,
    enableSlideToCancel = true,
    enableWaveform = true,
    lockSlideDistance = DEFAULT_LOCK_DISTANCE,
    cancelSlideDistance = DEFAULT_CANCEL_DISTANCE,
    waveCount = DEFAULT_WAVE_COUNT,
    renderInputPill,
    renderMicIcon,
    renderSendIcon,
    renderLockIcon,
    renderArrowIcon,
    renderDeleteIcon,
    renderPauseIcon,
    renderPlayIcon,
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
    onPauseRecording,
    onResumeRecording,
    onStateChange,
  } = props;

  const micSize = micSizeProp ?? inputBarHeight;

  // Threshold magnitudes (negative because "up" / "left" use negative deltas).
  const cancelThreshold = -Math.abs(cancelSlideDistance);
  const lockThreshold = -Math.abs(lockSlideDistance);
  const maxLeft = cancelThreshold - 30;
  const maxUp = lockThreshold - 20;

  // ── React state ────────────────────────────────────────────────────────────
  const [state, setState] = useState<RecordingState>('IDLE');
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const stateRef = useRef<RecordingState>('IDLE');
  useEffect(() => {
    stateRef.current = state;
    onStateChange?.(state);
  }, [state, onStateChange]);

  const stateShared = useSharedValue(STATE_IDLE);
  useEffect(() => {
    stateShared.value = stateToInt(state);
  }, [state]);

  // Worklet-readable mirrors of the dynamic prop values.
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

  // ── Timekeeping ────────────────────────────────────────────────────────────
  const startedAtRef = useRef<number>(0);
  const pausedAccumRef = useRef<number>(0);
  const pausedAtRef = useRef<number>(0);

  // ── Animation shared values ───────────────────────────────────────────────
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

  // Mic scale tracks the active state (idle / hold / recording).
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
      const live = Date.now() - startedAtRef.current - pausedAccumRef.current;
      setDuration(live / 1000);
    }, 250);
    return () => clearInterval(id);
  }, [state, isPaused]);

  // ── Stable callback refs (worklet-safe) ───────────────────────────────────
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

  // ─── Lifecycle helpers ──────────────────────────────────────────────────────

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

  // ─── Transitions ────────────────────────────────────────────────────────────

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

  const togglePause = useCallback(() => {
    setIsPaused((prev) => {
      const next = !prev;
      if (next) {
        pausedAtRef.current = Date.now();
        onPauseRef.current?.();
      } else {
        pausedAccumRef.current += Date.now() - pausedAtRef.current;
        pausedAtRef.current = 0;
        onResumeRef.current?.();
      }
      return next;
    });
  }, []);

  // ── Stable refs so gesture worklets never see stale handlers ─────────────
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
          translateX.value = withSpring(0, { damping: 18, stiffness: 220 });
          translateY.value = withSpring(0, { damping: 18, stiffness: 220 });
        }
      });

    return Gesture.Race(tap, holdPan);
  }, []);

  // ─── Animated styles ────────────────────────────────────────────────────────

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

  // ─── Render decisions ───────────────────────────────────────────────────────

  const isFullBar =
    state === 'RECORDING_TAP' ||
    state === 'LOCKED_RECORDING' ||
    state === 'SENDING';
  const isHold = state === 'RECORDING_HOLD';

  const resolvedChevronColor = chevronColor ?? lockColor;

  // ── Derived prop-driven styles ─────────────────────────────────────────────
  const micButtonStyle: ViewStyle = {
    height: micSize,
    width: micSize,
    backgroundColor: primaryColor,
  };

  const fullBarStyle: ViewStyle = {
    minHeight: inputBarHeight + 50,
    backgroundColor,
  };

  const holdPillStyle: ViewStyle = {
    minHeight: inputBarHeight,
    backgroundColor: holdPillBackground,
  };

  const lockPillContainerStyle: ViewStyle = {
    width: micSize - 8,
    backgroundColor: lockPillBackground,
  };

  // ─── FULL RECORDING BAR (image 5) ───────────────────────────────────────────
  if (isFullBar) {
    return (
      <View
        style={[
          tw`w-full rounded-2xl px-4 py-2.5`,
          fullBarStyle,
          containerStyleOverride,
          barStyleOverride,
        ]}
      >
        {/* Top row: timer + waveform */}
        <View style={tw`flex-row items-center gap-3 px-1 pt-1.5 pb-2`}>
          <Animated.View
            style={[
              tw`w-1.5 h-1.5 rounded-full`,
              { backgroundColor: pauseIconColor },
              recDotStyle,
            ]}
          />
          <Text
            style={[
              tw`text-base font-semibold text-white`,
              { color: timerColor, minWidth: 42 },
              timerTextStyle,
            ]}
            numberOfLines={1}
          >
            {formatDuration(duration)}
          </Text>

          {enableWaveform && (
            <View style={[tw`flex-1`, waveformStyle]}>
              {renderWaveform ? (
                renderWaveform()
              ) : (
                <Waveform color={waveformColor} tick={waveTick} count={waveCount} />
              )}
            </View>
          )}
        </View>

        {/* Bottom row: trash · pause/play · send */}
        <View style={tw`flex-row items-center justify-between mt-1`}>
          <Pressable
            onPress={triggerCancel}
            hitSlop={12}
            style={[
              tw`items-center justify-center rounded-full`,
              { width: micSize, height: micSize },
              trashButtonStyle,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Delete recording"
          >
            {renderDeleteIcon ? (
              renderDeleteIcon()
            ) : (
              <TrashIcon
                style={tw.style('w-6 h-6')}
                color={deleteIconColor}
              />
            )}
          </Pressable>

          <Pressable
            onPress={togglePause}
            hitSlop={12}
            style={tw`items-center justify-center px-4`}
            accessibilityRole="button"
            accessibilityLabel={isPaused ? 'Resume recording' : 'Pause recording'}
          >
            {isPaused ? (
              renderPlayIcon ? (
                renderPlayIcon()
              ) : (
                <PlayIcon
                  style={tw.style('w-7 h-7')}
                  color={pauseIconColor}
                />
              )
            ) : (
              <Animated.View style={pausePulseStyle}>
                {renderPauseIcon ? (
                  renderPauseIcon()
                ) : (
                  <PauseIcon
                    style={tw.style('w-7 h-7')}
                    color={pauseIconColor}
                  />
                )}
              </Animated.View>
            )}
          </Pressable>

          <GestureDetector gesture={composedGesture}>
            <Animated.View
              style={[
                tw`items-center justify-center rounded-full`,
                micButtonStyle,
                sendButtonStyle,
                micWrapperStyle,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Send recording"
            >
              {renderSendIcon ? (
                renderSendIcon()
              ) : (
                <PaperPlaneIcon
                  style={{ width: iconSize, height: iconSize }}
                  color="#FFFFFF"
                />
              )}
            </Animated.View>
          </GestureDetector>
        </View>
      </View>
    );
  }

  // ─── INLINE: IDLE / RECORDING_HOLD (image 6 + idle) ─────────────────────────
  return (
    <View
      style={[tw`flex-row items-end gap-2 relative`, containerStyleOverride]}
      pointerEvents="box-none"
    >
      {isHold ? (
        <View
          style={[
            tw`flex-1 flex-row items-center px-4 rounded-3xl`,
            holdPillStyle,
          ]}
        >
          <Text
            style={[
              tw`text-base font-semibold`,
              { color: timerColor, minWidth: 42 },
              timerTextStyle,
            ]}
            numberOfLines={1}
          >
            {formatDuration(duration)}
          </Text>

          <Animated.View
            style={[
              tw`flex-1 flex-row items-center justify-center gap-1.5`,
              slideTextAnimatedStyle,
            ]}
          >
            {renderArrowIcon ? (
              renderArrowIcon()
            ) : (
              <Text
                style={[
                  tw`text-base leading-none`,
                  { color: cancelTextColor, marginTop: -2 },
                ]}
              >
                ‹
              </Text>
            )}
            <Text
              style={[
                tw`text-sm`,
                { color: cancelTextColor },
                slideTextStyleOverride,
              ]}
            >
              Slide to cancel
            </Text>
          </Animated.View>
        </View>
      ) : (
        renderInputPill?.()
      )}

      <View
        style={[
          tw`relative items-center justify-center`,
          { height: inputBarHeight, width: inputBarHeight },
        ]}
      >
        {enableLockRecording && isHold && (
          <Animated.View
            style={[
              tw`absolute items-center justify-center rounded-2xl py-2.5`,
              lockPillContainerStyle,
              {
                bottom: micSize + 6,
                gap: 6,
              },
              lockPillStyleOverride,
              lockPillAnimatedStyle,
            ]}
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
            <Animated.View style={chevronAnimatedStyle}>
              <ChevronUpIcon
                style={{ width: 14, height: 14 }}
                color={resolvedChevronColor}
              />
            </Animated.View>
          </Animated.View>
        )}

        <GestureDetector gesture={composedGesture}>
          <Animated.View
            style={[
              tw`items-center justify-center rounded-full`,
              micButtonStyle,
              sendButtonStyle,
              micWrapperStyle,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Tap to record. Long-press and slide left to cancel or up to lock."
          >
            {renderMicIcon ? (
              renderMicIcon()
            ) : (
              <MicrophoneIcon
                style={{ width: iconSize + 6, height: iconSize + 6 }}
                color={microphoneColor}
              />
            )}
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};

// ─── Waveform (UI-thread driven) ──────────────────────────────────────────────

interface WaveformProps {
  color: string;
  tick: SharedValue<number>;
  count: number;
}

const Waveform: React.FC<WaveformProps> = ({ color, tick, count }) => {
  return (
    <View style={tw`flex-row items-center justify-between h-6`}>
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
    const amp = Math.max(0.18, Math.min(1, combined) * (0.35 + 0.65 * edge));
    return { height: `${Math.round(amp * 100)}%` };
  });
  return (
    <Animated.View
      style={[
        tw`mx-px rounded-full`,
        { width: 2, backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
};

export default VoiceRecorderFlow;
