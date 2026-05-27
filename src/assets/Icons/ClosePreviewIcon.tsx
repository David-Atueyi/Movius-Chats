import { ViewStyle } from 'react-native';
import Svg, { Line } from 'react-native-svg';

export const ClosePreviewIcon = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color?: string;
}) => {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" style={style}>
      <Line
        x1="18"
        y1="6"
        x2="6"
        y2="18"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
      <Line
        x1="6"
        y1="6"
        x2="18"
        y2="18"
        stroke={color}
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </Svg>
  );
};
