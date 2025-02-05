import { ViewStyle } from "react-native";
import { Line, Svg } from "react-native-svg";
import tw from "twrnc"; // assuming you're using twrnc for styling

export function XIcon({ style }: { style?: ViewStyle }) {
  return (
    <Svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={tw.style("feather feather-x", style)} 
    >
      <Line x1="18" y1="6" x2="6" y2="18"></Line>
      <Line x1="6" y1="6" x2="18" y2="18"></Line>
    </Svg>
  );
}
