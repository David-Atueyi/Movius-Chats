
import { ViewStyle } from "react-native";

import Svg, { Path } from "react-native-svg";

export const FileIcon = ({
  style,
  fill = "currentColor",
}: {
  style?: ViewStyle;
  fill?: string;
}) => {
  return (
    <Svg style={style} viewBox="0 0 24 24">
      <Path fill={fill} d="M13 4H6v16h12V9h-5z" opacity=".3" />
      <Path
        fill={fill}
        d="m20 8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2zm-2 12H6V4h7v5h5z"
      />
    </Svg>
  );
};
