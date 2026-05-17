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
import { formatDuration } from '../../utils/datefunc';
import { RecordingUIProps, VoiceRecorderStyleOverrides } from '../../types';

interface LongPressRecordingProps {
  duration: number;
  /** Horizontal drag (negative = sliding left to cancel) */
  slideX: number;
  containerHeight?: number;
  fontFamily?: string;
  voiceRecorderStyles?: VoiceRecorderStyleOverrides;
  recordingUIProps?: RecordingUIProps;
}

/** Center strip: timer + “slide to cancel” (mic + lock live in ChatInput). */
export const LongPressRecording: React.FC<LongPressRecordingProps> = ({
  duration,
  slideX,
  containerHeight = 50,
  fontFamily,
  voiceRecorderStyles,
  recordingUIProps,
}) => {
  const cancelTextColor =
    recordingUIProps?.cancelTextColor ?? 'rgba(107,114,128,1)';
  const timerColor = recordingUIProps?.timerColor ?? '#374151';

  const slideTextX = useSharedValue(0);
  useEffect(() => {
    slideTextX.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const cancelProgress = Math.min(1, Math.abs(Math.min(0, slideX)) / 70);

  const slideTextStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideTextX.value }],
    opacity: 1 - cancelProgress,
  }));

  return (
    <View
      style={[
        {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: containerHeight,
          paddingHorizontal: 4,
        },
        voiceRecorderStyles?.longPressBar,
      ]}
    >
      <Text
        style={[
          {
            fontSize: 15,
            fontWeight: '600',
            color: timerColor,
            minWidth: 44,
            fontFamily,
          },
          voiceRecorderStyles?.timer,
          recordingUIProps?.timerTextStyle,
        ]}
      >
        {formatDuration(duration)}
      </Text>

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
    </View>
  );
};
