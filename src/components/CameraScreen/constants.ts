import { Platform } from 'react-native';

export const DEFAULT_CAPTURE_BUTTON_SIZE = 72;
export const DEFAULT_CONTROL_BUTTON_SIZE = 40;
export const DEFAULT_MAX_VIDEO_DURATION = 60;
export const DEFAULT_MAX_ZOOM = 8;
export const DEFAULT_BACKGROUND = '#000';
export const DEFAULT_CAPTURE_RING = '#FFFFFF';
export const DEFAULT_RECORDING_RING = '#EF4444';
export const DEFAULT_RECORDING_DOT = '#EF4444';
export const DEFAULT_INACTIVE_MODE = 'rgba(255,255,255,0.7)';
export const DEFAULT_ICON_COLOR = '#FFFFFF';

/** Status bar height heuristic for the close button safe area. */
export const TOP_INSET = Platform.OS === 'ios' ? 50 : 28;
export const BOTTOM_INSET = Platform.OS === 'ios' ? 34 : 18;
