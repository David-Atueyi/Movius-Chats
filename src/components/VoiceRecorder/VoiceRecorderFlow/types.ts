import type { ReactNode } from 'react';
import type { TextStyle, ViewStyle } from 'react-native';

// State machine

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

// Audio payload passed to onSend

export interface VoiceRecorderFlowAudio {
  duration: number;
}

// Public props

export interface VoiceRecorderFlowProps {
  // Colors
  primaryColor?: string;
  backgroundColor?: string;
  holdPillBackground?: string;
  timerColor?: string;
  microphoneColor?: string;
  lockColor?: string;
  waveformColor?: string;
  deleteIconColor?: string;
  cancelTextColor?: string;
  chevronColor?: string;
  pauseIconColor?: string;
  lockPillBackground?: string;

  // Sizes
  inputBarHeight?: number;
  micSize?: number;
  holdMicScale?: number;
  iconSize?: number;
  lockIconSize?: number;

  // Behavior flags
  enableLockRecording?: boolean;
  enableSlideToCancel?: boolean;
  enableWaveform?: boolean;

  // Thresholds (positive values; signs handled internally)
  lockSlideDistance?: number;
  cancelSlideDistance?: number;

  // Waveform
  waveCount?: number;

  // Render slots
  renderInputPill?: () => ReactNode;

  // Render props (icons)
  renderMicIcon?: () => ReactNode;
  renderSendIcon?: () => ReactNode;
  renderLockIcon?: () => ReactNode;
  renderArrowIcon?: () => ReactNode;
  renderDeleteIcon?: () => ReactNode;
  renderPauseIcon?: () => ReactNode;
  renderPlayIcon?: () => ReactNode;
  renderWaveform?: () => ReactNode;

  // Style overrides
  containerStyle?: ViewStyle;
  barStyle?: ViewStyle;
  timerTextStyle?: TextStyle;
  slideTextStyle?: TextStyle;
  waveformStyle?: ViewStyle;
  lockPillStyle?: ViewStyle;
  trashButtonStyle?: ViewStyle;
  sendButtonStyle?: ViewStyle;
  fontFamily?: string;

  headerSlot?: ReactNode;

  // Trailing button (text mode)
  showSendButton?: boolean;
  onSendPress?: () => void;
  sendButtonBackgroundColor?: string;
  sendButtonIconColor?: string;

  // Callbacks
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  onSend?: (audio: VoiceRecorderFlowAudio) => void;
  onDelete?: () => void;
  onLock?: () => void;
  onCancel?: () => void;
  onPauseRecording?: () => void;
  onResumeRecording?: () => void;
  onStateChange?: (state: RecordingState) => void;
}
