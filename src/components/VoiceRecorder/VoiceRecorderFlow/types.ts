import type { ReactNode } from 'react';
import type { TextStyle, ViewStyle } from 'react-native';

// ─── State machine ────────────────────────────────────────────────────────────

export type RecordingState =
  | 'IDLE'
  | 'RECORDING_TAP'
  | 'RECORDING_HOLD'
  | 'LOCKED_RECORDING'
  | 'SENDING'
  | 'CANCELLED';

export const STATE_IDLE = 0;
export const STATE_TAP = 1;
export const STATE_HOLD = 2;
export const STATE_LOCKED = 3;
export const STATE_SENDING = 4;
export const STATE_CANCELLED = 5;

export function stateToInt(s: RecordingState): number {
  switch (s) {
    case 'IDLE':
      return STATE_IDLE;
    case 'RECORDING_TAP':
      return STATE_TAP;
    case 'RECORDING_HOLD':
      return STATE_HOLD;
    case 'LOCKED_RECORDING':
      return STATE_LOCKED;
    case 'SENDING':
      return STATE_SENDING;
    case 'CANCELLED':
      return STATE_CANCELLED;
  }
}

// ─── Audio payload passed to onSend ───────────────────────────────────────────

export interface VoiceRecorderFlowAudio {
  /** Final recording duration in seconds. */
  duration: number;
}

// ─── Public props ─────────────────────────────────────────────────────────────

export interface VoiceRecorderFlowProps {
  // ── Colors ────────────────────────────────────────────────────────────────
  primaryColor?: string;
  /** Background of the dark recording bar (tap / locked screen). */
  backgroundColor?: string;
  /** Background of the dark "input-shaped" pill shown while long-pressing. */
  holdPillBackground?: string;
  timerColor?: string;
  microphoneColor?: string;
  lockColor?: string;
  waveformColor?: string;
  deleteIconColor?: string;
  cancelTextColor?: string;
  chevronColor?: string;
  /** Recording-active pause/play button color. */
  pauseIconColor?: string;
  lockPillBackground?: string;

  // ── Sizes ─────────────────────────────────────────────────────────────────
  /** Height of the surrounding chat-input row (used to size the mic). */
  inputBarHeight?: number;
  /** Size of the mic / send button when idle. Defaults to `inputBarHeight`. */
  micSize?: number;
  /** Scale multiplier applied to the mic while long-pressing. Default `1.18`. */
  holdMicScale?: number;
  /** Size of glyph icons (mic, send, etc.). */
  iconSize?: number;
  lockIconSize?: number;

  // ── Behavior flags ────────────────────────────────────────────────────────
  enableLockRecording?: boolean;
  enableSlideToCancel?: boolean;
  enableWaveform?: boolean;

  // ── Thresholds (positive values; signs handled internally) ────────────────
  lockSlideDistance?: number;
  cancelSlideDistance?: number;

  // ── Waveform ──────────────────────────────────────────────────────────────
  waveCount?: number;

  // ── Render slots ──────────────────────────────────────────────────────────
  /**
   * Render the normal text input pill that lives next to the mic while idle.
   * The flow takes ownership of the row layout, so the pill is rendered as
   * the flex-1 child to the left of the mic.
   */
  renderInputPill?: () => ReactNode;

  // ── Render props (icons) ──────────────────────────────────────────────────
  renderMicIcon?: () => ReactNode;
  renderSendIcon?: () => ReactNode;
  renderLockIcon?: () => ReactNode;
  renderArrowIcon?: () => ReactNode;
  renderDeleteIcon?: () => ReactNode;
  renderPauseIcon?: () => ReactNode;
  renderPlayIcon?: () => ReactNode;
  renderWaveform?: () => ReactNode;

  // ── Style overrides ───────────────────────────────────────────────────────
  containerStyle?: ViewStyle;
  barStyle?: ViewStyle;
  timerTextStyle?: TextStyle;
  slideTextStyle?: TextStyle;
  waveformStyle?: ViewStyle;
  lockPillStyle?: ViewStyle;
  trashButtonStyle?: ViewStyle;
  sendButtonStyle?: ViewStyle;
  /** Theme font family applied to every text element (timer, slide-to-cancel). */
  fontFamily?: string;

  // ── Trailing button (text mode) ───────────────────────────────────────────
  /**
   * When `true`, the IDLE-state trailing slot renders a send button instead of
   * the recording mic. Recording-state UIs are unaffected. Use this so the
   * input pill stays mounted in the same parent across the
   * "empty input" ↔ "user is typing" transition (otherwise the TextInput
   * unmounts and the keyboard dismisses on the first character).
   */
  showSendButton?: boolean;
  /** Fired when the user taps the trailing send button (only meaningful when `showSendButton` is true). */
  onSendPress?: () => void;
  /** Background color for the trailing send button (defaults to `primaryColor`). */
  sendButtonBackgroundColor?: string;
  /** Color for the default paper-plane icon. */
  sendButtonIconColor?: string;

  // ── Callbacks ─────────────────────────────────────────────────────────────
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  onSend?: (audio: VoiceRecorderFlowAudio) => void;
  onDelete?: () => void;
  onLock?: () => void;
  onCancel?: () => void;
  /** Fired when the user taps the in-bar pause icon. */
  onPauseRecording?: () => void;
  /** Fired when the user taps the in-bar play icon to resume. */
  onResumeRecording?: () => void;
  /** Notifies the parent whenever the internal state changes. */
  onStateChange?: (state: RecordingState) => void;
}
