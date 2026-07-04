import React from 'react';
import { Platform, Text, View } from 'react-native';
import tw from 'twrnc';
import type { DateSeparatorTheme } from '../../types';
import { withFontFamily } from '../../utils/theme';

export interface DateSeparatorProps {
  label: string;
  variant?: 'inline' | 'sticky';
  theme?: DateSeparatorTheme;
  fontFamily?: string;
  renderCustom?: (label: string) => React.ReactNode;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({
  label,
  variant = 'inline',
  theme,
  fontFamily,
  renderCustom,
}) => {
  if (renderCustom) {
    return <>{renderCustom(label)}</>;
  }

  const isSticky = variant === 'sticky';
  const backgroundColor = isSticky
    ? theme?.stickyBackgroundColor ??
      theme?.backgroundColor ??
      'rgba(0, 0, 0, 0.55)'
    : theme?.backgroundColor ?? 'rgba(0, 0, 0, 0.55)';
  const textColor = isSticky
    ? theme?.stickyTextColor ?? theme?.textColor ?? '#FFFFFF'
    : theme?.textColor ?? '#FFFFFF';
  const fontSize = theme?.fontSize ?? 12;
  const borderRadius = theme?.borderRadius ?? 8;
  const paddingHorizontal = theme?.paddingHorizontal ?? 12;
  const paddingVertical = theme?.paddingVertical ?? 4;
  const marginVertical = isSticky ? 0 : (theme?.marginVertical ?? 8);
  const stickyShadow = theme?.stickyShadow !== false;

  const pillStyle = [
    {
      backgroundColor,
      borderRadius,
      paddingHorizontal,
      paddingVertical,
    },
    isSticky &&
      stickyShadow &&
      Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.18,
          shadowRadius: 2,
        },
        android: { elevation: 3 },
        default: {},
      }),
  ];

  const content = (
    <View style={pillStyle}>
      <Text
        style={withFontFamily(
          [
            {
              color: textColor,
              fontSize,
              textAlign: 'center',
            },
          ],
          fontFamily
        )}
      >
        {label}
      </Text>
    </View>
  );

  if (isSticky) {
    return content;
  }

  return (
    <View
      style={[
        tw`items-center justify-center w-full`,
        { marginVertical },
      ]}
      pointerEvents="none"
    >
      {content}
    </View>
  );
};

export default React.memo(DateSeparator);
