
import { ViewStyle } from "react-native";
import Svg, { G, Path } from "react-native-svg";

export const MicrophoneIcon = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color?: string;
}) => {
  return (
    <Svg style={style} viewBox="0 0 24 24">
      <G fill="none" strokeWidth="1.5" stroke={color}>
        <Path d="M7 8a5 5 0 0 1 10 0v3a5 5 0 0 1-10 0z"></Path>
        <Path
          strokeLinecap="round"
          d="M13.5 8H17m-3.5 3H17M7 8h2m-2 3h2m11-1v1a8 8 0 0 1-8 8m-8-9v1a8 8 0 0 0 8 8m0 0v3"
          opacity=".5"
        ></Path>
      </G>
    </Svg>
  );
};
