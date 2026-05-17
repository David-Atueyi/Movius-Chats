import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { MicrophoneIcon } from '../../assets/Icons/MicrophoneIcon';

interface AnimatedHoldMicProps {
  color?: string;
  size?: number;
  style?: ViewStyle;
}

/** Breathing mic icon only — no background circle (WhatsApp-style hold). */
export const AnimatedHoldMic: React.FC<AnimatedHoldMicProps> = ({
  color = '#ef4444',
  size = 28,
  style,
}) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.22, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]}>
      <MicrophoneIcon style={{ width: size, height: size }} color={color} />
    </Animated.View>
  );
};
