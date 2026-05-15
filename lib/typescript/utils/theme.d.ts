import { StyleProp, TextStyle, ViewStyle } from 'react-native';
export declare function getInputBarIconPixelSize(size?: string | number): number;
/** Size for emoji, attachment, and camera icons only (not send/mic). */
export declare function getInputBarIconStyle(size?: string | number): ViewStyle;
/** Applies theme.fontFamily to any Text / ParsedText style array. */
export declare function withFontFamily(style: StyleProp<TextStyle>, fontFamily?: string): StyleProp<TextStyle>;
export declare function getFontFamilyStyle(fontFamily?: string): TextStyle | undefined;
