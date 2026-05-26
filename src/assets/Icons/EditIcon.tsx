import { ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export const EditIcon = ({
  style,
  color = '#FFFFFF',
}: {
  style?: ViewStyle;
  color?: string;
}) => (
  <Svg style={style} viewBox="0 0 24 24">
    <Path
      fill={color}
      d="M5 19h1.4l8.625-8.625l-1.4-1.4L5 17.6zm-1 2q-.425 0-.712-.288T3 20v-2.825q0-.4.15-.762t.425-.638l10.3-10.3l4.25 4.275l-10.3 10.3q-.275.275-.638.425t-.762.15zM18.025 9.75l-4.25-4.25l1.4-1.4q.575-.575 1.413-.575t1.412.575l1.425 1.425q.575.575.575 1.413t-.575 1.412z"
    />
  </Svg>
);
