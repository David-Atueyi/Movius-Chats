import { Platform, StyleProp, TextStyle, ViewStyle } from 'react-native';
import tw from 'twrnc';

const DEFAULT_INPUT_BAR_ICON_CLASS =
  Platform.OS === 'ios' ? 'h-6 w-6' : 'w-6 h-6';

const DEFAULT_INPUT_BAR_ICON_PX = 24;

export function getInputBarIconPixelSize(size?: string | number): number {
  if (typeof size === 'number' && size > 0) {
    return size;
  }
  return DEFAULT_INPUT_BAR_ICON_PX;
}

export function getInputBarIconStyle(size?: string | number): ViewStyle {
  if (typeof size === 'number' && size > 0) {
    return { width: size, height: size };
  }

  const sizeClass =
    typeof size === 'string' && size.trim().length > 0
      ? size.trim()
      : DEFAULT_INPUT_BAR_ICON_CLASS;

  return tw.style(sizeClass);
}

export function withFontFamily(
  style: StyleProp<TextStyle>,
  fontFamily?: string
): StyleProp<TextStyle> {
  if (!fontFamily) {
    return style;
  }
  return [style, { fontFamily }];
}

export function getFontFamilyStyle(fontFamily?: string): TextStyle | undefined {
  return fontFamily ? { fontFamily } : undefined;
}
