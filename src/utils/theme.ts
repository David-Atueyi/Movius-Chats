import { Platform, StyleProp, TextStyle, ViewStyle } from 'react-native';
import tw from 'twrnc';

const DEFAULT_INPUT_ICON_CLASS =
  Platform.OS === 'ios' ? 'h-6 w-6' : 'w-6 h-6';

/** Resolves theme.sizes.inputIconSize (twrnc class string or pixel number). */
export function getInputIconStyle(
  size?: string | number,
  extraClass?: string
): ViewStyle {
  if (typeof size === 'number' && size > 0) {
    return { width: size, height: size };
  }

  const sizeClass =
    typeof size === 'string' && size.trim().length > 0
      ? size.trim()
      : DEFAULT_INPUT_ICON_CLASS;

  return tw.style(sizeClass, extraClass);
}

/** Applies theme.fontFamily to any Text / ParsedText style array. */
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
