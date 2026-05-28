import React from 'react';
import { View } from 'react-native';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import tw from 'twrnc';
import { ReplyIcon } from '../../assets/Icons/ReplyIcon';

interface SwipeableMessageProps {
  isCurrentUser: boolean;
  enabled: boolean;
  swipeThreshold: number;
  onReply: () => void;
  iconColor?: string;
  iconBackground?: string;
  iconSize?: number;
  children: React.ReactNode;
}

const ICON_SIZE = 36;

export const SwipeableMessage: React.FC<SwipeableMessageProps> = ({
  isCurrentUser,
  enabled,
  swipeThreshold,
  onReply,
  iconColor = 'rgba(255,255,255,0.95)',
  iconBackground = 'rgba(0,0,0,0.35)',
  iconSize: iconSizeProp,
  children,
}) => {
  const iconSize = iconSizeProp ?? ICON_SIZE;
  const translateX = useSharedValue(0);
  const triggered = useSharedValue(0);

  // Outgoing: drag must be negative (right→left). Incoming: positive (left→right).
  const direction = isCurrentUser ? -1 : 1;

  const triggerReply = () => {
    onReply();
  };

  const pan = Gesture.Pan()
    .enabled(enabled)
    .activeOffsetX(isCurrentUser ? [-12, 9999] : [-9999, 12])
    .failOffsetY([-12, 12])
    .onUpdate((e) => {
      'worklet';
      const t = e.translationX;
      // Only allow movement in the "valid" direction.
      if ((isCurrentUser && t < 0) || (!isCurrentUser && t > 0)) {
        // Apply some resistance after the threshold.
        const abs = Math.abs(t);
        const resisted =
          abs <= swipeThreshold
            ? abs
            : swipeThreshold + (abs - swipeThreshold) * 0.35;
        translateX.value = direction * resisted;
        if (abs >= swipeThreshold && triggered.value === 0) {
          triggered.value = 1;
          runOnJS(triggerReply)();
        }
      } else {
        translateX.value = 0;
      }
    })
    .onEnd(() => {
      'worklet';
      translateX.value = withSpring(0, { damping: 20, stiffness: 220 });
      triggered.value = withTiming(0, { duration: 200 });
    })
    .onFinalize(() => {
      'worklet';
      translateX.value = withSpring(0, { damping: 20, stiffness: 220 });
      triggered.value = withTiming(0, { duration: 200 });
    });

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const iconStyle = useAnimatedStyle(() => {
    const abs = Math.abs(translateX.value);
    const opacity = interpolate(
      abs,
      [0, swipeThreshold * 0.4, swipeThreshold],
      [0, 0.6, 1],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      abs,
      [0, swipeThreshold],
      [0.6, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <View style={tw`relative`}>
      <Animated.View
        pointerEvents="none"
        style={[
          tw`absolute top-0 bottom-0 items-center justify-center`,
          isCurrentUser ? { right: 8 } : { left: 8 },
          iconStyle,
        ]}
      >
        <View
          style={[
            tw`rounded-full items-center justify-center`,
            {
              width: iconSize,
              height: iconSize,
              backgroundColor: iconBackground,
            },
          ]}
        >
          <ReplyIcon
            style={{ width: iconSize * 0.55, height: iconSize * 0.55 }}
            color={iconColor}
          />
        </View>
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View style={bubbleStyle}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
};
