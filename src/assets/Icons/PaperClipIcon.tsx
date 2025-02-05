
import { ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";

export const PaperClipIcon = ({
  style,
  color,
}: {
  style?: ViewStyle;
  color?: string;
}) => {
  return (
    <Svg style={style} fill={color} viewBox="0 0 24 24">
      <Path d="M17.346 15.539q0 2.271-1.565 3.866T11.952 21t-3.838-1.595t-1.576-3.867v-8.73q0-1.587 1.092-2.697Q8.72 3 10.308 3t2.678 1.11t1.091 2.698v8.269q0 .88-.615 1.517q-.614.637-1.498.637t-1.52-.627t-.636-1.527V6.769h1v8.308q0 .479.327.816q.328.338.807.338t.807-.338t.328-.816V6.789q-.006-1.166-.802-1.977Q11.48 4 10.308 4q-1.163 0-1.966.821q-.804.821-.804 1.987v8.73q-.005 1.853 1.283 3.157Q10.11 20 11.96 20q1.823 0 3.1-1.305t1.287-3.156v-8.77h1z"></Path>
    </Svg>
  );
};
