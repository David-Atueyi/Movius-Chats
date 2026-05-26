import { ViewStyle } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

export const TrashIcon = ({
  style,
  color = '#ef4444',
}: {
  style?: ViewStyle;
  color?: string;
}) => (
  <Svg style={style} viewBox="0 0 24 24">
    <G fill="none" stroke={color} strokeLinecap="round" strokeWidth="1.5">
      <Path d="M9.17 4a3.001 3.001 0 0 1 5.66 0" opacity=".5" />
      <Path d="M20.5 6h-17m15.333 2.5l-.46 6.9c-.177 2.654-.265 3.981-1.13 4.79s-2.195.81-4.856.81h-.774c-2.66 0-3.99 0-4.856-.81c-.865-.809-.953-2.136-1.13-4.79l-.46-6.9" />
      <Path d="m9.5 11l.5 5m4.5-5l-.5 5" opacity=".5" />
    </G>
  </Svg>
);
