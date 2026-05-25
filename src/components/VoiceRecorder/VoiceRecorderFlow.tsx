import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Pressable, StyleSheet, Text, Vibration, View } from 'react-native';
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
  primaryColor?: string;
  backgroundColor?: string;
  timerColor?: string;
  microphoneColor?: string;
  lockColor?: string;
  waveformColor?: string;
  deleteIconColor?: string;

  renderMicIcon?: () => ReactNode;
  renderSendIcon?: () => ReactNode;
  renderLockIcon?: () => ReactNode;
  renderArrowIcon?: () => ReactNode;
  renderDeleteIcon?: () => ReactNode;
  renderWaveform?: () => ReactNode;

  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  onSend?: (audio: VoiceRecorderFlowAudio) => void;
  onDelete?: () => void;
  onLock?: () => void;
  onCancel?: () => void;
}

// ─── Tunables ─────────────────────────────────────────────────────────────────

const CONTAINER_HEIGHT = 110;
const MIC_SIZE = 72;
const MIC_RIGHT = 18;

const LONG_PRESS_MS = 300;

const MAX_LEFT = -150;
const MAX_UP = -120;
const CANCEL_THRESHOLD = -120;
const LOCK_THRESHOLD = -100;
const LOCK_REVEAL_TRAVEL = -10;

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
    renderMicIcon,
    renderSendIcon,
    renderLockIcon,
    renderArrowIcon,
    renderDeleteIcon,
    renderWaveform,
    onRecordingStart,
    onRecordingStop,
    onSend,
    onDelete,
    onLock,
    onCancel,
  } = props;

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

        const tx = Math.max(MAX_LEFT, Math.min(0, e.translationX));
        const ty = Math.max(MAX_UP, Math.min(0, e.translationY));
        translateX.value = tx;
        translateY.value = ty;

        const dominantY = Math.abs(ty) > Math.abs(tx);

        if (
          dominantY &&
          lockFiredShared.value === 0 &&
          ty <= LOCK_THRESHOLD
        ) {
          lockFiredShared.value = 1;
          runOnJS(fireLock)();
        }

        if (
          !dominantY &&
          cancelFiredShared.value === 0 &&
          tx <= CANCEL_THRESHOLD
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

  const containerStyle = useAnimatedStyle(() => ({
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

  const slideTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, CANCEL_THRESHOLD],
      [1, 0],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ translateX: translateX.value * 0.55 + arrowPulse.value }],
    };
  });

  const lockPillStyle = useAnimatedStyle(() => {
    const reveal = interpolate(
      translateY.value,
      [0, LOCK_REVEAL_TRAVEL],
      [0, 1],
      Extrapolation.CLAMP
    );
    const lockProgress = interpolate(
      translateY.value,
      [0, LOCK_THRESHOLD],
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
      [0, LOCK_THRESHOLD],
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

  return (
    <View style={styles.root} pointerEvents="box-none">
      {showBar && (
        <Animated.View
          style={[styles.bar, { backgroundColor }, containerStyle]}
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
            />
          ) : (
            <ScreenTwoCenter
              duration={duration}
              timerColor={timerColor}
              slideTextStyle={slideTextStyle}
              renderArrowIcon={renderArrowIcon}
            />
          )}
        </Animated.View>
      )}

      {showLockPill && (
        <Animated.View style={[styles.lockPill, lockPillStyle]} pointerEvents="none">
          {renderLockIcon ? (
            renderLockIcon()
          ) : (
            <LockIcon style={{ width: 20, height: 20 }} color={lockColor} />
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
              color={lockColor}
            />
          </Animated.View>
        </Animated.View>
      )}

      <View style={styles.buttonAnchor} pointerEvents="box-none">
        <GestureDetector gesture={composedGesture}>
          <Animated.View
            style={[styles.micPressable, micButtonStyle]}
            accessibilityRole="button"
            accessibilityLabel={
              isScreenOne
                ? 'Send recording'
                : 'Tap to record. Long-press and slide left to cancel or up to lock.'
            }
          >
            <View
              style={[styles.mic, { backgroundColor: primaryColor }]}
            >
              {isScreenOne
                ? renderSendIcon
                  ? renderSendIcon()
                  : (
                    <PaperPlaneIcon
                      style={{ width: 30, height: 30 }}
                      color="#FFFFFF"
                    />
                  )
                : renderMicIcon
                  ? renderMicIcon()
                  : (
                    <MicrophoneIcon
                      style={{ width: 30, height: 30 }}
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
}) => {
  return (
    <View style={styles.screenOneRow}>
      <Pressable
        onPress={onDeletePress}
        hitSlop={10}
        style={styles.deleteWrapper}
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
            style={[styles.timer, { color: timerColor }]}
            numberOfLines={1}
          >
            {formatDuration(duration)}
          </Text>
          <View style={styles.waveformWrapper}>
            {renderWaveform ? (
              renderWaveform()
            ) : (
              <Waveform color={waveformColor} tick={waveTick} />
            )}
          </View>
        </View>

        <Animated.View style={[styles.pauseRow, pauseAnimatedStyle]}>
          <View style={styles.pauseBar} />
          <View style={styles.pauseBar} />
        </Animated.View>
      </View>

      <View style={styles.micSpacer} />
    </View>
  );
};

interface ScreenTwoCenterProps {
  duration: number;
  timerColor: string;
  slideTextStyle: ReturnType<typeof useAnimatedStyle>;
  renderArrowIcon?: () => ReactNode;
}

const ScreenTwoCenter: React.FC<ScreenTwoCenterProps> = ({
  duration,
  timerColor,
  slideTextStyle,
  renderArrowIcon,
}) => {
  return (
    <View style={styles.screenTwoRow}>
      <Text
        style={[styles.timer, { color: timerColor }]}
        numberOfLines={1}
      >
        {formatDuration(duration)}
      </Text>

      <Animated.View style={[styles.slideArea, slideTextStyle]}>
        {renderArrowIcon ? (
          renderArrowIcon()
        ) : (
          <Text style={styles.slideArrow}>‹</Text>
        )}
        <Text style={styles.slideText}>Slide to cancel</Text>
      </Animated.View>

      <View style={styles.micSpacer} />
    </View>
  );
};

// ─── Waveform (UI-thread driven) ──────────────────────────────────────────────

const WAVE_COUNT = 28;
const WAVE_BAR_WIDTH = 3;
const WAVE_SPACING = 3;

interface WaveformProps {
  color: string;
  tick: SharedValue<number>;
}

const Waveform: React.FC<WaveformProps> = ({ color, tick }) => {
  return (
    <View style={styles.waveform}>
      {Array.from({ length: WAVE_COUNT }).map((_, i) => (
        <WaveBar key={i} index={i} total={WAVE_COUNT} color={color} tick={tick} />
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
    height: CONTAINER_HEIGHT,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonAnchor: {
    position: 'absolute',
    right: MIC_RIGHT,
    bottom: (CONTAINER_HEIGHT - MIC_SIZE) / 2,
  },
  micPressable: {
    width: MIC_SIZE,
    height: MIC_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mic: {
    width: MIC_SIZE,
    height: MIC_SIZE,
    borderRadius: MIC_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  micSpacer: {
    width: MIC_SIZE,
    height: MIC_SIZE,
  },
  lockPill: {
    position: 'absolute',
    right: MIC_RIGHT + (MIC_SIZE - 46) / 2,
    bottom: CONTAINER_HEIGHT + 8,
    width: 46,
    paddingVertical: 12,
    borderRadius: 28,
    backgroundColor: 'rgba(20,28,33,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
    marginTop: -2,
  },
  slideText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
  },
});

export default VoiceRecorderFlow;
