import { ViewStyle } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

export const LockIcon = ({
  style,
  color = '#6b7280',
}: {
  style?: ViewStyle;
  color?: string;
}) => (
  <Svg style={style} viewBox="0 0 24 24" fill="none">
    <Rect
      x="5"
      y="11"
      width="14"
      height="10"
      rx="2"
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8 11V7a4 4 0 0 1 8 0v4"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);
