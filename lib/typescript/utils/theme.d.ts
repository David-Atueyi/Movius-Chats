import { StyleProp, TextStyle, ViewStyle } from 'react-native';
/** Resolves theme.sizes.inputIconSize (twrnc class string or pixel number). */
export declare function getInputIconStyle(size?: string | number, extraClass?: string): ViewStyle;
/** Applies theme.fontFamily to any Text / ParsedText style array. */
export declare function withFontFamily(style: StyleProp<TextStyle>, fontFamily?: string): StyleProp<TextStyle>;
export declare function getFontFamilyStyle(fontFamily?: string): TextStyle | undefined;
