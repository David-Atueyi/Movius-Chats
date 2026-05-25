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

// Simple circular ring indicator
function TimerRing({
  color = 'rgba(255,255,255,0.5)',
  size = 26,
}: {
  color?: string;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: color,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: color,
        }}
      />
    </View>
  );
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
  const playPauseIconColor = recordingUIProps?.playPauseIconColor ?? '#ef4444';
  const playPauseSize = recordingUIProps?.playPauseIconSize ?? 24;
  const barCount = recordingUIProps?.waveformBarCount ?? 30;
  const showOuterDots = recordingUIProps?.showWaveformOuterDots ?? true;
  const showTimerRing = recordingUIProps?.showTimerRing ?? true;
  const ringColor = recordingUIProps?.timerRingColor ?? 'rgba(0,0,0,0.3)';

  return (
    <View
      style={[
        {
          backgroundColor: bg,
          paddingHorizontal: 4,
          gap: 4,
        },
        voiceRecorderStyles?.normalBar,
      ]}
    >
      {/* ── Row 1: Timer + Waveform + Ring ── */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text
          style={[
            {
              fontSize: 14,
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
          height={Math.round(containerHeight * 0.5)}
          barCount={barCount}
          showOuterDots={showOuterDots}
          style={[{ flex: 1 }, voiceRecorderStyles?.waveform]}
        />

        {showTimerRing && (
          <TimerRing color={ringColor} size={24} />
        )}
      </View>

      {/* ── Row 2: Trash | Pause | Send ── */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: containerHeight,
        }}
      >
        {/* Trash */}
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

        {/* Pause / Resume — centered */}
        {enablePauseResume && (
          <Pressable
            onPress={isPaused ? onResume : onPause}
            style={[
              {
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                height: containerHeight,
              },
              voiceRecorderStyles?.playPauseButton,
            ]}
            hitSlop={8}
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

        {/* Spacer when pause is disabled so send stays right */}
        {!enablePauseResume && <View style={{ flex: 1 }} />}

        {/* Send */}
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
    </View>
  );
};
