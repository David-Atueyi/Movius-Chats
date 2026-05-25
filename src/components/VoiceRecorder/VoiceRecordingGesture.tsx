import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, Vibration, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ChevronUpIcon } from '../../assets/Icons/ChevronUpIcon';
import { LockIcon } from '../../assets/Icons/LockIcon';
import { MicrophoneIcon } from '../../assets/Icons/MicrophoneIcon';
import { formatDuration } from '../../utils/datefunc';

export interface VoiceRecordingGestureProps {
  /** App primary color used for the mic button background. */
  primaryColor?: string;
  /** Recording bar background. */
  backgroundColor?: string;
  /** Color of the running timer. */
  timerColor?: string;
  /** Color of the microphone glyph. */
  microphoneColor?: string;
  /** Color of the lock glyph + chevron. */
  lockColor?: string;

  /** Replace the mic icon. */
  renderMicIcon?: () => ReactNode;
  /** Replace the lock icon shown in the floating pill. */
  renderLockIcon?: () => ReactNode;
  /** Replace the "<" arrow next to "Slide to cancel". */
  renderArrowIcon?: () => ReactNode;

  /** Fired when the horizontal drag passes the cancel threshold. */
  onCancel?: () => void;
  /** Fired when the upward drag passes the lock threshold. */
  onLock?: () => void;
}

const DEFAULT_BG = '#0B141A';
const DEFAULT_PRIMARY = '#22C55E';
const DEFAULT_TIMER = '#FFFFFF';
const DEFAULT_MIC = '#FFFFFF';
const DEFAULT_LOCK = '#E9EDEF';
const SLIDE_TEXT_COLOR = 'rgba(255,255,255,0.55)';

const CONTAINER_HEIGHT = 95;
const MIC_SIZE = 72;

const CANCEL_THRESHOLD = 90;
const LOCK_THRESHOLD = 70;
const LOCK_REVEAL_TRAVEL = 12;

function vibrateOnce() {
  Vibration.vibrate(20);
}

export const VoiceRecordingGesture: React.FC<VoiceRecordingGestureProps> = ({
  primaryColor = DEFAULT_PRIMARY,
  backgroundColor = DEFAULT_BG,
  timerColor = DEFAULT_TIMER,
  microphoneColor = DEFAULT_MIC,
  lockColor = DEFAULT_LOCK,
  renderMicIcon,
  renderLockIcon,
  renderArrowIcon,
  onCancel,
  onLock,
}) => {
  const [duration, setDuration] = useState(0);
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    startedAt.current = Date.now();
    const id = setInterval(() => {
      setDuration((Date.now() - startedAt.current) / 1000);
    }, 250);
    return () => clearInterval(id);
  }, []);

  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const arrowPulse = useSharedValue(0);
  const micPulse = useSharedValue(1);
  const chevronPulse = useSharedValue(0);
  const lockHighlight = useSharedValue(0);
  const cancelFired = useSharedValue(0);
  const lockFired = useSharedValue(0);

  useEffect(() => {
    arrowPulse.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 700, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    micPulse.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 850, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 850, easing: Easing.inOut(Easing.ease) })
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
  }, []);

  const onCancelRef = useRef(onCancel);
  onCancelRef.current = onCancel;
  const onLockRef = useRef(onLock);
  onLockRef.current = onLock;

  const fireCancel = () => {
    vibrateOnce();
    onCancelRef.current?.();
  };
  const fireLock = () => {
    vibrateOnce();
    onLockRef.current?.();
  };

  const panGesture = Gesture.Pan()
    .minDistance(0)
    .onBegin(() => {
      'worklet';
      cancelFired.value = 0;
      lockFired.value = 0;
      dragX.value = 0;
      dragY.value = 0;
    })
    .onUpdate((e) => {
      'worklet';
      const x = Math.min(0, e.translationX);
      const y = Math.min(0, e.translationY);
      dragX.value = x;
      dragY.value = y;

      if (lockFired.value === 0 && y <= -LOCK_THRESHOLD) {
        lockFired.value = 1;
        lockHighlight.value = withTiming(1, { duration: 180 });
        runOnJS(fireLock)();
      }

      if (cancelFired.value === 0 && x <= -CANCEL_THRESHOLD) {
        cancelFired.value = 1;
        runOnJS(fireCancel)();
      }
    })
    .onEnd(() => {
      'worklet';
      if (lockFired.value === 0) {
        dragX.value = withSpring(0, { damping: 18, stiffness: 180 });
        dragY.value = withSpring(0, { damping: 18, stiffness: 180 });
      }
    })
    .onFinalize(() => {
      'worklet';
      if (lockFired.value === 0) {
        dragX.value = withSpring(0, { damping: 18, stiffness: 180 });
        dragY.value = withSpring(0, { damping: 18, stiffness: 180 });
      }
    });

  const slideTextStyle = useAnimatedStyle(() => {
    const progress = Math.min(1, Math.abs(dragX.value) / CANCEL_THRESHOLD);
    return {
      transform: [{ translateX: dragX.value * 0.55 + arrowPulse.value }],
      opacity: 1 - progress,
    };
  });

  const lockPillStyle = useAnimatedStyle(() => {
    const reveal = Math.min(1, Math.max(0, -dragY.value / LOCK_REVEAL_TRAVEL));
    const lockProgress = Math.min(1, Math.max(0, -dragY.value / LOCK_THRESHOLD));
    const rise = interpolate(lockProgress, [0, 1], [0, -22]);
    return {
      opacity: reveal,
      transform: [
        { scale: 0.85 + reveal * 0.15 },
        { translateY: rise },
      ],
    };
  });

  const lockBorderStyle = useAnimatedStyle(() => {
    const lockProgress = Math.min(
      1,
      Math.max(0, -dragY.value / LOCK_THRESHOLD)
    );
    return {
      borderWidth: lockProgress > 0.85 || lockHighlight.value > 0 ? 1.5 : 0,
    };
  });

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: chevronPulse.value }],
  }));

  const lockProgressFillStyle = useAnimatedStyle(() => {
    const progress = Math.min(
      1,
      Math.max(0, -dragY.value / LOCK_THRESHOLD)
    );
    return {
      height: `${Math.round(progress * 100)}%`,
    };
  });

  const micStyle = useAnimatedStyle(() => {
    const lockedScale = lockHighlight.value;
    return {
      transform: [
        { translateX: dragX.value },
        { translateY: dragY.value },
        { scale: micPulse.value * (1 + lockedScale * 0.04) },
      ],
    };
  });

  const containerStyle: ViewStyle = {
    backgroundColor,
  };

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <Animated.View
        style={[styles.lockPill, lockPillStyle, lockBorderStyle]}
        pointerEvents="none"
      >
        <Animated.View>
          {renderLockIcon ? (
            renderLockIcon()
          ) : (
            <LockIcon style={{ width: 20, height: 20 }} color={lockColor} />
          )}
        </Animated.View>

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

      <View style={[styles.bar, containerStyle]}>
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

        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={styles.micPressable}
            accessibilityRole="button"
            accessibilityLabel="Hold to record. Slide left to cancel, slide up to lock."
          >
            <Animated.View
              style={[
                styles.mic,
                { backgroundColor: primaryColor },
                micStyle,
              ]}
            >
              {renderMicIcon ? (
                renderMicIcon()
              ) : (
                <MicrophoneIcon
                  style={{ width: 30, height: 30 }}
                  color={microphoneColor}
                />
              )}
            </Animated.View>
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  lockPill: {
    position: 'absolute',
    right: 18 + (MIC_SIZE - 46) / 2,
    bottom: CONTAINER_HEIGHT + 8,
    width: 46,
    paddingVertical: 12,
    borderRadius: 28,
    backgroundColor: 'rgba(20,28,33,0.95)',
    borderColor: '#22C55E',
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
  bar: {
    width: '100%',
    height: CONTAINER_HEIGHT,
    paddingHorizontal: 18,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timer: {
    fontSize: 24,
    fontWeight: '600',
    minWidth: 50,
    letterSpacing: 0.3,
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
    color: SLIDE_TEXT_COLOR,
    fontWeight: '500',
    marginTop: -2,
  },
  slideText: {
    fontSize: 14,
    color: SLIDE_TEXT_COLOR,
    fontWeight: '500',
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
});

export default VoiceRecordingGesture;
