import { ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export const ChevronUpIcon = ({
  style,
  color = '#6b7280',
}: {
  style?: ViewStyle;
  color?: string;
}) => (
  <Svg style={style} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 15l6-6 6 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
