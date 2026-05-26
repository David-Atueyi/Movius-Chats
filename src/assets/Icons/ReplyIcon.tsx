import { ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export const ReplyIcon = ({
  style,
  color = '#FFFFFF',
}: {
  style?: ViewStyle;
  color?: string;
}) => (
  <Svg style={style} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M10 9V5l-7 7l7 7v-4.1c5 0 8.5 1.6 11 5.1c-1-5-4-10-11-11"
    />
  </Svg>
);
