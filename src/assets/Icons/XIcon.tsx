import { ViewStyle } from 'react-native';
import { Line, Svg } from 'react-native-svg';
import tw from 'twrnc';

export function XIcon({ style }: { style?: ViewStyle }) {
  return (
    <Svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="black"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={tw.style('h-6 w-6 text-black', style)}
    >
      <Line x1="18" y1="6" x2="6" y2="18" />
      <Line x1="6" y1="6" x2="18" y2="18" />
    </Svg>
  );
}
