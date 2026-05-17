import { ViewStyle } from 'react-native';
import { RecordingUIProps, VoiceRecorderStyleOverrides } from '../../types';

/** Shared wrapper styles for every built-in recording mode. */
export function getRecordingContainerStyle(
  voiceRecorderStyles?: VoiceRecorderStyleOverrides,
  recordingUIProps?: RecordingUIProps
): ViewStyle {
  const borderColor =
    recordingUIProps?.containerBorderTopColor ?? 'rgba(0,0,0,0.12)';

  return {
    borderTopWidth: recordingUIProps?.containerBorderTopWidth ?? 1,
    borderTopColor: borderColor,
    paddingTop: 10,
    paddingBottom: 4,
    ...voiceRecorderStyles?.container,
  };
}
