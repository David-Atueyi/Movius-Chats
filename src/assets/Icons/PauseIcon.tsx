import { ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export const PauseIcon = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color?: string;
}) => {
  return (
    <Svg style={style} viewBox="0 0 12 12">
      <Path
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeWidth="2"
        d="M4 2v8m4-8v8"
      />
    </Svg>
  );
};
