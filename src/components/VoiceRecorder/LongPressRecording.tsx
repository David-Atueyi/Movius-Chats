import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { ChevronUpIcon } from '../../assets/Icons/ChevronUpIcon';
import { LockIcon } from '../../assets/Icons/LockIcon';
import { MicrophoneIcon } from '../../assets/Icons/MicrophoneIcon';
import { formatDuration } from '../../utils/datefunc';
import { RecordingUIProps, VoiceRecorderStyleOverrides } from '../../types';

interface LongPressRecordingProps {
  duration: number;
  /** Current horizontal drag offset (negative = sliding left to cancel) */
  slideX: number;
  containerHeight?: number;
  fontFamily?: string;
  voiceRecorderStyles?: VoiceRecorderStyleOverrides;
  recordingUIProps?: RecordingUIProps;
}

export const LongPressRecording: React.FC<LongPressRecordingProps> = ({
  duration,
  slideX,
  containerHeight = 50,
  fontFamily,
  voiceRecorderStyles,
  recordingUIProps,
}) => {
  const micPulseColor = recordingUIProps?.micPulseColor ?? '#ef4444';
  const cancelTextColor = recordingUIProps?.cancelTextColor ?? '#6b7280';

  // ── Mic breathing ─────────────────────────────────────────────────────────
  const micScale = useSharedValue(1);
  useEffect(() => {
    micScale.value = withRepeat(
      withSequence(
        withTiming(1.28, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  // ── "Slide to cancel" text oscillation ───────────────────────────────────
  const slideTextX = useSharedValue(0);
  useEffect(() => {
    slideTextX.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  // ── Chevron bounce ────────────────────────────────────────────────────────
  const chevronY = useSharedValue(0);
  useEffect(() => {
    chevronY.value = withRepeat(
      withSequence(
        withTiming(-5, { duration: 450, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 450, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  // ── Lock open/close ───────────────────────────────────────────────────────
  const lockScale = useSharedValue(0.8);
  useEffect(() => {
    lockScale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 550, easing: Easing.out(Easing.ease) }),
        withTiming(0.8, { duration: 550, easing: Easing.in(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const micStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micScale.value }],
  }));

  // Fade + shift the "slide to cancel" text as user drags left
  const cancelProgress = Math.min(1, Math.abs(Math.min(0, slideX)) / 70);

  const slideTextStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideTextX.value }],
    opacity: 1 - cancelProgress,
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: chevronY.value }],
  }));

  const lockStyle = useAnimatedStyle(() => ({
    transform: [{ scale: lockScale.value }],
  }));

  const micSize = containerHeight * 0.5;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          height: containerHeight,
          paddingHorizontal: 8,
        },
        voiceRecorderStyles?.container,
      ]}
    >
      {/* ── Animated mic (breathing) ── */}
      <Animated.View
        style={[
          micStyle,
          {
            width: containerHeight,
            height: containerHeight,
            borderRadius: containerHeight / 2,
            backgroundColor: `${micPulseColor}22`,
            justifyContent: 'center',
            alignItems: 'center',
          },
          voiceRecorderStyles?.micButton,
        ]}
      >
        <MicrophoneIcon
          style={{ width: micSize, height: micSize }}
          color={micPulseColor}
        />
      </Animated.View>

      {/* ── Timer ── */}
      <Text
        style={[
          {
            fontSize: 15,
            fontWeight: '600',
            color: '#374151',
            marginLeft: 8,
            fontFamily,
          },
          voiceRecorderStyles?.timer,
        ]}
      >
        {formatDuration(duration)}
      </Text>

      {/* ── "Slide to cancel" text ── */}
      <Animated.View
        style={[slideTextStyle, { flex: 1, alignItems: 'center' }]}
      >
        <Text
          style={[
            {
              fontSize: 14,
              color: cancelTextColor,
              fontFamily,
            },
            voiceRecorderStyles?.slideText,
          ]}
        >
          {'< Slide to cancel'}
        </Text>
      </Animated.View>

      {/* ── Lock + Chevron column ── */}
      <View
        style={[
          { alignItems: 'center', marginRight: 4 },
          voiceRecorderStyles?.lockContainer,
        ]}
      >
        <Animated.View style={lockStyle}>
          <LockIcon style={{ width: 18, height: 18 }} color="#6b7280" />
        </Animated.View>
        <Animated.View style={chevronStyle}>
          <ChevronUpIcon style={{ width: 18, height: 18 }} color="#6b7280" />
        </Animated.View>
      </View>
    </View>
  );
};
