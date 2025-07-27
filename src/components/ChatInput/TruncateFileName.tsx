import React from "react";
import { StyleProp, Text, TextStyle } from "react-native";

const TruncateFileName = ({
  fileName,
  style,
}: {
  fileName: string;
  style?: StyleProp<TextStyle>;
}) => {
  const getTruncatedName = (fullName: string) => {
    const lastDot = fullName.lastIndexOf('.');
    if (lastDot === -1) return fullName;
    const name = fullName.slice(0, lastDot);
    const ext = fullName.slice(lastDot);
    const maxLength = 40;
    if (name.length > maxLength) {
      return name.slice(0, maxLength) + '...' + ext;
    }
    return name + ext;
  };
  return (
    <Text
      numberOfLines={2}
      ellipsizeMode="tail"
      style={[{ fontSize: 14, fontWeight: '600', color: 'black' }, style]}
    >
      {getTruncatedName(fileName)}
    </Text>
  );
};

export default React.memo(TruncateFileName);