import { useEffect, useRef } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type LoadingIconProps = {
  style?: ViewStyle;
  spinning?: boolean;
};

export const LoadingIcon = ({ style, spinning = false }: LoadingIconProps) => {
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (spinning) {
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [spinning]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={spinning ? { transform: [{ rotate: spin }] } : undefined}
    >
      <Svg style={style} viewBox="0 0 1024 1024">
        <Path
          d="M988 548c-19.9 0-36-16.1-36-36c0-59.4-11.6-117-34.6-171.3a440.5 440.5 0 0 0-94.3-139.9a437.7 437.7 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150s83.9 101.8 109.7 162.7c26.7 63.1 40.2 130.2 40.2 199.3c.1 19.9-16 36-35.9 36"
          fill="white"
        />
      </Svg>
    </Animated.View>
  );
};
