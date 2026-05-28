import React, { ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import tw from 'twrnc';
import { ChevronUpIcon } from '../../../assets/Icons/ChevronUpIcon';
import { LockIcon } from '../../../assets/Icons/LockIcon';

interface LockPillProps {
  width: number;
  bottomOffset: number;
  background: string;
  lockColor: string;
  chevronColor: string;
  lockIconSize: number;
  pillAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  chevronAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  styleOverride?: ViewStyle;
  renderLockIcon?: () => ReactNode;
}

export const LockPill: React.FC<LockPillProps> = ({
  width,
  bottomOffset,
  background,
  lockColor,
  chevronColor,
  lockIconSize,
  pillAnimatedStyle,
  chevronAnimatedStyle,
  styleOverride,
  renderLockIcon,
}) => {
  return (
    <Animated.View
      style={[
        tw`absolute items-center justify-center rounded-2xl py-2.5`,
        {
          width,
          backgroundColor: background,
          bottom: bottomOffset,
          gap: 6,
        },
        styleOverride,
        pillAnimatedStyle,
      ]}
      pointerEvents="none"
    >
      {renderLockIcon ? (
        renderLockIcon()
      ) : (
        <LockIcon
          style={{ width: lockIconSize, height: lockIconSize }}
          color={lockColor}
        />
      )}
      <Animated.View style={chevronAnimatedStyle}>
        <ChevronUpIcon
          style={{ width: 14, height: 14 }}
          color={chevronColor}
        />
      </Animated.View>
    </Animated.View>
  );
};
