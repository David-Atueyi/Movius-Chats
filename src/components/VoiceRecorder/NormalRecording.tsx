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
}) => {
  const waveColor = recordingUIProps?.waveformColor ?? 'rgba(0,0,0,0.45)';
  const cancelColor = recordingUIProps?.cancelTextColor ?? '#ef4444';
  const timerColor = '#374151';
  const bg = recordingUIProps?.recordingBackground ?? 'transparent';
  const timerTextStyle = recordingUIProps?.timerTextStyle;

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          height: containerHeight,
          paddingHorizontal: 4,
          backgroundColor: bg,
          gap: 8,
        },
        voiceRecorderStyles?.container,
      ]}
    >
      {/* ── Cancel / Trash ── */}
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
          style={{ width: containerHeight * 0.44, height: containerHeight * 0.44 }}
          color={cancelColor}
        />
      </Pressable>

      {/* ── Timer ── */}
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
          timerTextStyle,
        ]}
      >
        {formatDuration(duration)}
      </Text>

      {/* ── Waveform ── */}
      <WaveformAnimation
        isActive={isRecording && !isPaused}
        color={waveColor}
        height={Math.round(containerHeight * 0.52)}
        style={[{ flex: 1 }, voiceRecorderStyles?.waveform]}
      />

      {/* ── Pause / Resume ── */}
      {enablePauseResume && (
        <Pressable
          onPress={isPaused ? onResume : onPause}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: 'rgba(0,0,0,0.08)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          hitSlop={6}
        >
          {isPaused ? (
            <PlayIcon style={{ width: 18, height: 18 }} color="#374151" />
          ) : (
            <PauseIcon style={{ width: 18, height: 18 }} color="#374151" />
          )}
        </Pressable>
      )}

      {/* ── Send ── */}
      <Pressable
        onPress={onSend}
        style={{
          width: containerHeight,
          height: containerHeight,
          borderRadius: containerHeight / 2,
          backgroundColor: sendButtonColor,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        hitSlop={4}
      >
        <PaperPlaneIcon
          style={{ width: containerHeight * 0.44, height: containerHeight * 0.44 }}
          color={sendIconColor}
        />
      </Pressable>
    </View>
  );
};
