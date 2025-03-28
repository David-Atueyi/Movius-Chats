import { ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export const ArrowBack2RoundedIcon = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color?: string;
}) => {
  return (
    <Svg style={style} viewBox="0 0 48 48">
      <Path
        fill={color}
        fillRule="evenodd"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="4"
        d="M8 9.115c0-1.82 2.235-2.694 3.47-1.356l29.432 31.884c1.182 1.282.273 3.357-1.47 3.357H10a2 2 0 0 1-2-2z"
        clipRule="evenodd"
      ></Path>
    </Svg>
  );
};
