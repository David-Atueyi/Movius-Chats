import React, { useEffect, useState } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

const DEFAULT_BAR_COUNT = 30;

function buildStaticBars(count: number, showOuterDots: boolean): number[] {
  return Array.from({ length: count }, (_, i): number => {
    if (!showOuterDots) return 0.3;
    const pos = i / (count - 1);
    if (pos < 0.12 || pos > 0.88) return 0.08;
    if (pos < 0.22 || pos > 0.78) return 0.18;
    return 0.3;
  });
}

function nextBars(prev: number[], showOuterDots: boolean): number[] {
  const count = prev.length;
  return Array.from({ length: count }, (_, i): number => {
    if (!showOuterDots) return 0.15 + Math.random() * 0.85;
    const pos = i / (count - 1);
    if (pos < 0.12 || pos > 0.88) return prev[i]!;
    if (pos < 0.22 || pos > 0.78) return 0.12 + Math.random() * 0.35;
    return 0.2 + Math.random() * 0.8;
  });
}

interface WaveformAnimationProps {
  isActive: boolean;
  color?: string;
  height?: number;
  style?: StyleProp<ViewStyle>;
  barCount?: number;
  showOuterDots?: boolean;
}

export const WaveformAnimation: React.FC<WaveformAnimationProps> = ({
  isActive,
  color = 'rgba(0,0,0,0.45)',
  height = 26,
  style,
  barCount = DEFAULT_BAR_COUNT,
  showOuterDots = false,
}) => {
  const [bars, setBars] = useState<number[]>(() =>
    buildStaticBars(barCount, showOuterDots)
  );

  useEffect(() => {
    setBars(buildStaticBars(barCount, showOuterDots));
  }, [barCount, showOuterDots]);

  useEffect(() => {
    if (!isActive) {
      setBars(buildStaticBars(barCount, showOuterDots));
      return;
    }
    const id = setInterval(
      () => setBars((prev) => nextBars(prev, showOuterDots)),
      110
    );
    return () => clearInterval(id);
  }, [isActive, barCount, showOuterDots]);

  return (
    <View
      style={[
        { flexDirection: 'row', alignItems: 'center', height, gap: 2 },
        style,
      ]}
    >
      {bars.map((amp, i) => {
        const barH = Math.max(3, Math.round(amp * height));
        const isOuter =
          showOuterDots &&
          (i / (bars.length - 1) < 0.22 || i / (bars.length - 1) > 0.78);
        return (
          <View
            key={i}
            style={{
              flex: 1,
              height: barH,
              borderRadius: isOuter ? barH / 2 : 2,
              backgroundColor: color,
            }}
          />
        );
      })}
    </View>
  );
};
