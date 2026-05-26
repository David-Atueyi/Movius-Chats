import { Platform } from 'react-native';

export const DEFAULT_INPUT_BAR_HEIGHT = Platform.OS === 'ios' ? 50 : 48;
export const DEFAULT_HOLD_SCALE = 1.18;

/** How long the user must hold before the long-press pan gesture activates. */
export const LONG_PRESS_MS = 220;

export const DEFAULT_CANCEL_DISTANCE = 90;
export const DEFAULT_LOCK_DISTANCE = 70;

export const DEFAULT_WAVE_COUNT = 32;
export const DEFAULT_ICON_SIZE = 22;
export const DEFAULT_LOCK_ICON_SIZE = 18;

/**
 * Any upward movement greater than this magnitude (in px) at release time
 * locks the recording instead of sending — protects users who flick up and
 * release quickly without crossing the lock threshold.
 */
export const LOCK_ON_RELEASE_DELTA = 12;

// ── Default colors ───────────────────────────────────────────────────────────
export const COLOR_PRIMARY_FALLBACK = '#16A34A';
export const COLOR_BAR_BG_FALLBACK = '#0B141A';
export const COLOR_HOLD_PILL_BG_FALLBACK = '#1F2C33';
export const COLOR_LOCK_PILL_BG_FALLBACK = '#1F2C33';
export const COLOR_WHITE = '#FFFFFF';
export const COLOR_LIGHT = '#E9EDEF';
export const COLOR_MUTED = '#8696A0';
export const COLOR_RED = '#F15C6D';
export const COLOR_CANCEL_TEXT = 'rgba(255,255,255,0.6)';
