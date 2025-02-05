import { ViewStyle } from "react-native";

import Svg, { G, Path } from "react-native-svg";

export const PaperPlaneIcon = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color?: string;
}) => {
  return (
    <Svg style={style} viewBox="0 0 24 24">
      <G fill="none" strokeWidth="1.5" stroke={color}>
        <Path d="m18.636 15.67l1.716-5.15c1.5-4.498 2.25-6.747 1.062-7.934s-3.436-.438-7.935 1.062L8.33 5.364C4.7 6.574 2.885 7.18 2.37 8.067a2.72 2.72 0 0 0 0 2.73c.515.888 2.33 1.493 5.96 2.704c.584.194.875.291 1.119.454c.236.158.439.361.597.597c.163.244.26.535.454 1.118c1.21 3.63 1.816 5.446 2.703 5.962a2.72 2.72 0 0 0 2.731 0c.887-.516 1.492-2.331 2.703-5.962Z"></Path>
        <Path
          strokeLinecap="round"
          d="m17.79 6.21l-4.211 4.165"
          opacity=".5"
        ></Path>
      </G>
    </Svg>
  );
};
