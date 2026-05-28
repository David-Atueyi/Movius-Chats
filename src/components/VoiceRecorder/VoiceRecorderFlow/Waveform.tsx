import React from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import tw from 'twrnc';

interface WaveformProps {
  color: string;
  tick: SharedValue<number>;
  count: number;
}

export const Waveform: React.FC<WaveformProps> = ({ color, tick, count }) => {
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
