import { ViewStyle } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

export const LockIcon = ({
  style,
  color = '#6b7280',
}: {
  style?: ViewStyle;
  color?: string;
}) => (
  <Svg style={style} viewBox="0 0 24 24">
    <G fill="none" stroke={color} strokeWidth="1.5">
      <Path d="M2 16c0-2.828 0-4.243.879-5.121C3.757 10 5.172 10 8 10h8c2.828 0 4.243 0 5.121.879C22 11.757 22 13.172 22 16s0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16Z" />
      <Path strokeLinecap="round" d="M6 10V8a6 6 0 1 1 12 0v2" opacity=".5" />
    </G>
  </Svg>
);
