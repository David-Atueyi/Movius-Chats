import React, { useEffect } from 'react';
import { View } from 'react-native';
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
import { RecordingUIProps, VoiceRecorderStyleOverrides } from '../../types';

interface LockSlideColumnProps {
  /** Finger vertical offset while holding (negative = sliding up) */
  slideY: number;
  lockSlideDistance: number;
  recordingUIProps?: RecordingUIProps;
  voiceRecorderStyles?: VoiceRecorderStyleOverrides;
}

export const LockSlideColumn: React.FC<LockSlideColumnProps> = ({
  slideY,
  lockSlideDistance,
  recordingUIProps,
  voiceRecorderStyles,
}) => {
  const pillBg =
    recordingUIProps?.lockPillBackground ?? 'rgba(30,30,30,0.88)';
  const lockColor = recordingUIProps?.lockIconColor ?? '#e5e7eb';
  const chevronColor = recordingUIProps?.chevronIconColor ?? '#9ca3af';
  const gap = recordingUIProps?.lockPillGap ?? 8;
  const marginBelow = recordingUIProps?.lockPillMarginBottom ?? 10;

  const chevronY = useSharedValue(0);
  useEffect(() => {
    chevronY.value = withRepeat(
      withSequence(
        withTiming(-4, { duration: 450, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 450, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const lockScale = useSharedValue(0.92);
  useEffect(() => {
    lockScale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 550, easing: Easing.out(Easing.ease) }),
        withTiming(0.92, { duration: 550, easing: Easing.in(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: chevronY.value }],
  }));

  const lockStyle = useAnimatedStyle(() => ({
    transform: [{ scale: lockScale.value }],
  }));

  // 0 → 1 as the finger approaches the lock threshold
  const lockProgress = Math.min(
    1,
    Math.max(0, -slideY / lockSlideDistance)
  );

  return (
    <View
      style={[
        {
          alignItems: 'center',
          marginBottom: marginBelow,
        },
        voiceRecorderStyles?.lockContainer,
      ]}
      pointerEvents="none"
    >
      <View
        style={[
          {
            backgroundColor: pillBg,
            borderRadius: 22,
            paddingVertical: 10,
            paddingHorizontal: 14,
            alignItems: 'center',
            gap,
            opacity: 0.85 + lockProgress * 0.15,
            borderWidth: lockProgress > 0.85 ? 1.5 : 0,
            borderColor:
              recordingUIProps?.lockPillActiveBorderColor ?? '#22c55e',
          },
          voiceRecorderStyles?.lockPill,
        ]}
      >
        <Animated.View style={lockStyle}>
          <LockIcon style={{ width: 20, height: 20 }} color={lockColor} />
        </Animated.View>
        <Animated.View style={chevronStyle}>
          <ChevronUpIcon
            style={{ width: 18, height: 18 }}
            color={chevronColor}
          />
        </Animated.View>
      </View>
    </View>
  );
};
