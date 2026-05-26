import { ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export const ForwardIcon = ({
  style,
  color = '#FFFFFF',
}: {
  style?: ViewStyle;
  color?: string;
}) => (
  <Svg style={style} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M14 9V5l7 7l-7 7v-4.1c-5 0-8.5 1.6-11 5.1c1-5 4-10 11-11"
    />
  </Svg>
);
