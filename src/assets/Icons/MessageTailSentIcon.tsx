import { ViewStyle } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

const TAIL_PATH =
  'M8 9.115c0-1.82 2.235-2.694 3.47-1.356l29.432 31.884c1.182 1.282.273 3.357-1.47 3.357H10a2 2 0 0 1-2-2z';

export const MessageTailSentIcon = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color?: string;
}) => (
  <Svg style={style} viewBox="0 0 48 48">
    <G rotation={90} origin="24, 24">
      <Path
        fill={color}
        fillRule="evenodd"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={4}
        d={TAIL_PATH}
        clipRule="evenodd"
      />
    </G>
  </Svg>
);
