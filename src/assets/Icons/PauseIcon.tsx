import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

export const PauseIcon = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color?: string;
}) => {
  return (
    <Svg style={style} viewBox="0 0 15 15">
      <Path
        fill={color}
        fillRule="evenodd"
        d="M6.05 2.75a.55.55 0 0 0-1.1 0v9.5a.55.55 0 0 0 1.1 0zm4 0a.55.55 0 0 0-1.1 0v9.5a.55.55 0 0 0 1.1 0z"
        clipRule="evenodd"
      ></Path>
    </Svg>
  );
};
