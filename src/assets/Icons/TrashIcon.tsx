import { ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export const TrashIcon = ({
  style,
  color = '#ef4444',
}: {
  style?: ViewStyle;
  color?: string;
}) => (
  <Svg style={style} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 11v6M14 11v6"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);
