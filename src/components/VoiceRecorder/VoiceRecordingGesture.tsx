import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Text, Vibration, View } from 'react-native';
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
import tw from 'twrnc';
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
  /** Background of the floating lock pill. */
  lockPillBackground?: string;
  /** Color used for the "Slide to cancel" text. */
  cancelTextColor?: string;

  /** Bar height. Default `48` (input-row sized). */
  barHeight?: number;
  /** Mic size. Defaults to `barHeight`. */
  micSize?: number;

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

const CANCEL_THRESHOLD = 90;
const LOCK_THRESHOLD = 70;

function vibrateOnce() {
  Vibration.vibrate(15);
}

export const VoiceRecordingGesture: React.FC<VoiceRecordingGestureProps> = ({
  primaryColor = '#16A34A',
  backgroundColor = '#1F2C33',
  timerColor = '#FFFFFF',
  microphoneColor = '#FFFFFF',
  lockColor = '#E9EDEF',
  lockPillBackground = '#1F2C33',
  cancelTextColor = 'rgba(255,255,255,0.6)',
  barHeight = 48,
  micSize: micSizeProp,
  renderMicIcon,
  renderLockIcon,
  renderArrowIcon,
  onCancel,
  onLock,
}) => {
  const micSize = micSizeProp ?? barHeight;

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
        withTiming(1.18, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.12, { duration: 700, easing: Easing.inOut(Easing.ease) })
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
        runOnJS(fireLock)();
      }
      if (cancelFired.value === 0 && x <= -CANCEL_THRESHOLD) {
        cancelFired.value = 1;
        runOnJS(fireCancel)();
      }
    })
    .onFinalize(() => {
      'worklet';
      if (lockFired.value === 0 && cancelFired.value === 0) {
        dragX.value = withSpring(0, { damping: 18, stiffness: 220 });
        dragY.value = withSpring(0, { damping: 18, stiffness: 220 });
      }
    });

  const slideTextStyle = useAnimatedStyle(() => {
    const progress = Math.min(1, Math.abs(dragX.value) / CANCEL_THRESHOLD);
    return {
      transform: [{ translateX: dragX.value * 0.4 + arrowPulse.value }],
      opacity: 1 - progress,
    };
  });

  const lockPillStyle = useAnimatedStyle(() => {
    const lockProgress = Math.min(
      1,
      Math.max(0, -dragY.value / LOCK_THRESHOLD)
    );
    return {
      transform: [{ translateY: interpolate(lockProgress, [0, 1], [0, -22]) }],
    };
  });

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: chevronPulse.value }],
  }));

  const micStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: dragX.value },
      { translateY: dragY.value },
      { scale: micPulse.value },
    ],
  }));

  return (
    <View style={tw`w-full flex-row items-end gap-2 relative`} pointerEvents="box-none">
      {/* Dark "input pill" with timer + slide-to-cancel */}
      <View
        style={[
          tw`flex-1 flex-row items-center px-4 rounded-3xl`,
          { minHeight: barHeight, backgroundColor },
        ]}
      >
        <Text
          style={[
            tw`text-base font-semibold`,
            { color: timerColor, minWidth: 42 },
          ]}
          numberOfLines={1}
        >
          {formatDuration(duration)}
        </Text>

        <Animated.View
          style={[
            tw`flex-1 flex-row items-center justify-center gap-1.5`,
            slideTextStyle,
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
          <Text style={[tw`text-sm`, { color: cancelTextColor }]}>
            Slide to cancel
          </Text>
        </Animated.View>
      </View>

      {/* Mic + lock pill stack */}
      <View
        style={[
          tw`relative items-center justify-center`,
          { height: barHeight, width: barHeight },
        ]}
      >
        <Animated.View
          style={[
            tw`absolute items-center justify-center rounded-2xl py-2.5`,
            {
              width: micSize - 8,
              backgroundColor: lockPillBackground,
              bottom: micSize + 6,
              gap: 6,
            },
            lockPillStyle,
          ]}
          pointerEvents="none"
        >
          {renderLockIcon ? (
            renderLockIcon()
          ) : (
            <LockIcon
              style={{ width: 18, height: 18 }}
              color={lockColor}
            />
          )}
          <Animated.View style={chevronStyle}>
            <ChevronUpIcon
              style={{ width: 14, height: 14 }}
              color={lockColor}
            />
          </Animated.View>
        </Animated.View>

        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              tw`items-center justify-center rounded-full`,
              {
                width: micSize,
                height: micSize,
                backgroundColor: primaryColor,
              },
              micStyle,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Hold to record. Slide left to cancel, slide up to lock."
          >
            {renderMicIcon ? (
              renderMicIcon()
            ) : (
              <MicrophoneIcon
                style={{ width: 26, height: 26 }}
                color={microphoneColor}
              />
            )}
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};

export default VoiceRecordingGesture;
