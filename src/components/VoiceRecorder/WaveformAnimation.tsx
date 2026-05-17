import React, { useEffect, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

const BAR_COUNT = 22;

function randomBars(): number[] {
  return Array.from({ length: BAR_COUNT }, () => 0.15 + Math.random() * 0.85);
}

interface WaveformAnimationProps {
  isActive: boolean;
  color?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
}

export const WaveformAnimation: React.FC<WaveformAnimationProps> = ({
  isActive,
  color = 'rgba(0,0,0,0.45)',
  height = 26,
  style,
}) => {
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: BAR_COUNT }, () => 0.3)
  );

  useEffect(() => {
    if (!isActive) {
      setBars(Array.from({ length: BAR_COUNT }, () => 0.3));
      return;
    }
    const id = setInterval(() => setBars(randomBars()), 110);
    return () => clearInterval(id);
  }, [isActive]);

  return (
    <View
      style={[
        { flexDirection: 'row', alignItems: 'center', height, gap: 2 },
        style,
      ]}
    >
      {bars.map((amp, i) => (
        <View
          key={i}
          style={{
            flex: 1,
            height: Math.max(3, Math.round(amp * height)),
            borderRadius: 2,
            backgroundColor: color,
          }}
        />
      ))}
    </View>
  );
};
