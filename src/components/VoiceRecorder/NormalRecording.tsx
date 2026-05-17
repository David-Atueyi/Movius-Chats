import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { PaperPlaneIcon } from '../../assets/Icons/PaperPlaneIcon';
import { PauseIcon } from '../../assets/Icons/PauseIcon';
import { PlayIcon } from '../../assets/Icons/PlayIcon';
import { TrashIcon } from '../../assets/Icons/TrashIcon';
import { formatDuration } from '../../utils/datefunc';
import {
  RecordingUIProps,
  VoiceRecorderStyleOverrides,
} from '../../types';
import { WaveformAnimation } from './WaveformAnimation';

interface NormalRecordingProps {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  onCancel: () => void;
  onSend: () => void;
  onPause: () => void;
  onResume: () => void;
  containerHeight?: number;
  fontFamily?: string;
  sendButtonColor?: string;
  sendIconColor?: string;
  enablePauseResume?: boolean;
  voiceRecorderStyles?: VoiceRecorderStyleOverrides;
  recordingUIProps?: RecordingUIProps;
  CustomPlayIcon?: () => React.ReactNode;
  CustomPauseIcon?: () => React.ReactNode;
}

export const NormalRecording: React.FC<NormalRecordingProps> = ({
  isRecording,
  isPaused,
  duration,
  onCancel,
  onSend,
  onPause,
  onResume,
  containerHeight = 50,
  fontFamily,
  sendButtonColor = '#16a34a',
  sendIconColor = '#ffffff',
  enablePauseResume = true,
  voiceRecorderStyles,
  recordingUIProps,
  CustomPlayIcon,
  CustomPauseIcon,
}) => {
  const waveColor = recordingUIProps?.waveformColor ?? 'rgba(0,0,0,0.45)';
  const cancelColor = recordingUIProps?.cancelTextColor ?? '#ef4444';
  const timerColor = recordingUIProps?.timerColor ?? '#374151';
  const bg = recordingUIProps?.recordingBackground ?? 'transparent';
  const playPauseBg =
    recordingUIProps?.playPauseButtonBackground ?? 'rgba(0,0,0,0.08)';
  const playPauseIconColor =
    recordingUIProps?.playPauseIconColor ?? '#374151';
  const playPauseSize = recordingUIProps?.playPauseIconSize ?? 18;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: containerHeight,
          paddingHorizontal: 4,
          backgroundColor: bg,
          gap: 8,
        },
        voiceRecorderStyles?.normalBar,
      ]}
    >
      <Pressable
        onPress={onCancel}
        style={[
          {
            width: containerHeight,
            height: containerHeight,
            borderRadius: containerHeight / 2,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: `${cancelColor}18`,
          },
          voiceRecorderStyles?.trashButton,
        ]}
        hitSlop={6}
      >
        <TrashIcon
          style={{
            width: containerHeight * 0.44,
            height: containerHeight * 0.44,
          }}
          color={cancelColor}
        />
      </Pressable>

      <Text
        style={[
          {
            fontSize: 15,
            fontWeight: '600',
            color: timerColor,
            minWidth: 40,
            fontFamily,
          },
          voiceRecorderStyles?.timer,
          recordingUIProps?.timerTextStyle,
        ]}
      >
        {formatDuration(duration)}
      </Text>

      <WaveformAnimation
        isActive={isRecording && !isPaused}
        color={waveColor}
        height={Math.round(containerHeight * 0.52)}
        style={[{ flex: 1 }, voiceRecorderStyles?.waveform]}
      />

      {enablePauseResume && (
        <Pressable
          onPress={isPaused ? onResume : onPause}
          style={[
            {
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: playPauseBg,
              justifyContent: 'center',
              alignItems: 'center',
            },
            voiceRecorderStyles?.playPauseButton,
          ]}
          hitSlop={6}
        >
          {isPaused ? (
            CustomPlayIcon ? (
              <CustomPlayIcon />
            ) : (
              <PlayIcon
                style={{ width: playPauseSize, height: playPauseSize }}
                color={playPauseIconColor}
              />
            )
          ) : CustomPauseIcon ? (
            <CustomPauseIcon />
          ) : (
            <PauseIcon
              style={{ width: playPauseSize, height: playPauseSize }}
              color={playPauseIconColor}
            />
          )}
        </Pressable>
      )}

      <Pressable
        onPress={onSend}
        style={[
          {
            width: containerHeight,
            height: containerHeight,
            borderRadius: containerHeight / 2,
            backgroundColor: sendButtonColor,
            justifyContent: 'center',
            alignItems: 'center',
          },
          voiceRecorderStyles?.sendButton,
        ]}
        hitSlop={4}
      >
        <PaperPlaneIcon
          style={{
            width: containerHeight * 0.44,
            height: containerHeight * 0.44,
          }}
          color={sendIconColor}
        />
      </Pressable>
    </View>
  );
};
