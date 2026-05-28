import { ViewStyle } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

export const SelectIcon = ({
  style,
  color = '#FFFFFF',
}: {
  style?: ViewStyle;
  color?: string;
}) => {
  return (
    <Svg style={style} viewBox="0 0 24 24">
      <G fill="none" stroke={color} strokeLinecap="round" strokeWidth="1.5">
        <Path strokeLinejoin="round" d="m14 16l2.1 2.5l3.9-5" />
        <Path d="M21 6H3m18 4H3m7 4H3m7 4H3" opacity=".5" />
      </G>
    </Svg>
  );
};
