
import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";
interface IconProps {
  style?: ViewStyle;
  fill?: string;
}

export const CheckIcon = ({ style, fill }: IconProps) => {
  return (
    <Svg style={style} viewBox="0 0 24 24">
      <Path d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z" fill={fill}></Path>
    </Svg>
  );
};
