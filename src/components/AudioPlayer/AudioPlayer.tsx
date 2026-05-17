import React, { useCallback, useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, Text, View } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import tw from 'twrnc';
import { PauseIcon } from '../../assets/Icons/PauseIcon';
import { PlayIcon } from '../../assets/Icons/PlayIcon';
import { useAudio } from '../../context/AudioContext';
import { useChatContext } from '../../context/ChatContext';
import { formatDuration } from '../../utils/datefunc';
import {
  getAudioDurationColor,
  getAudioPauseIconColor,
  getAudioPlayButtonBackground,
  getAudioPlayIconColor,
  getAudioWaveformColors,
} from '../../utils/bubbleTheme';
import { withFontFamily } from '../../utils/theme';
import { AudioPlayerProps } from './types';

const WAVEFORM_BARS = 34;
const WAVEFORM_H = 34;

function generateWaveform(url: string, count: number): number[] {
  let h = 5381;
  for (let i = 0; i < url.length; i++) {
    h = ((h << 5) + h + url.charCodeAt(i)) | 0;
  }
  return Array.from({ length: count }, (_, i) => {
    h = (Math.imul(h ^ (h >>> 16), 0x45d9f3b + i * 31337)) | 0;
    h = h ^ (h >>> 13);
    return 0.18 + ((Math.abs(h) % 100) / 100) * 0.82;
  });
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  audioId,
  isVideoPlaying,
  isCurrentUser,
}) => {
  const { theme, CustomPlayIcon, CustomPauseIcon } = useChatContext();
  const { currentlyPlayingId, setCurrentlyPlayingId } = useAudio();

  const videoRef = useRef<VideoRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const waveformWidth = useRef(0);
  const seekPendingRef = useRef<number | null>(null);

  const waveform = useMemo(() => generateWaveform(audioUrl, WAVEFORM_BARS), [audioUrl]);

  const { inactive: inactiveBarColor, active: activeBarColor } =
    getAudioWaveformColors(theme, isCurrentUser);
  const timestampColor = getAudioDurationColor(theme, isCurrentUser);
  const playIconColor = getAudioPlayIconColor(theme, isCurrentUser);
  const pauseIconColor = getAudioPauseIconColor(theme, isCurrentUser);
  const playButtonBg = getAudioPlayButtonBackground(theme, isCurrentUser);

  const shouldPause =
    isVideoPlaying ||
    (!!currentlyPlayingId && currentlyPlayingId !== audioId);

  const effectivePlaying = isPlaying && !shouldPause;

  const handleLoad = useCallback(
    (data: { duration: number }) => {
      setDuration(data.duration);
      if (seekPendingRef.current !== null) {
        videoRef.current?.seek(seekPendingRef.current);
        seekPendingRef.current = null;
      }
    },
    []
  );

  const handleProgress = useCallback(
    ({ currentTime: t }: { currentTime: number }) => {
      if (!isDragging) setCurrentTime(t);
    },
    [isDragging]
  );

  const handleEnd = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    videoRef.current?.seek(0);
    setCurrentlyPlayingId(null);
  }, [setCurrentlyPlayingId]);

  const togglePlay = useCallback(() => {
    if (effectivePlaying) {
      setIsPlaying(false);
      setCurrentlyPlayingId(null);
    } else {
      if (shouldPause && currentlyPlayingId) {
        setCurrentlyPlayingId(null);
      }
      setCurrentlyPlayingId(audioId);
      setIsPlaying(true);
    }
  }, [effectivePlaying, shouldPause, currentlyPlayingId, audioId, setCurrentlyPlayingId]);

  const seekTo = useCallback(
    (x: number) => {
      const w = waveformWidth.current;
      if (w <= 0 || duration <= 0) return;
      const t = Math.max(0, Math.min(x / w, 1)) * duration;
      setCurrentTime(t);
      if (duration > 0) {
        videoRef.current?.seek(t);
      } else {
        seekPendingRef.current = t;
      }
    },
    [duration]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
          setIsDragging(true);
          seekTo(evt.nativeEvent.locationX);
        },
        onPanResponderMove: (evt) => seekTo(evt.nativeEvent.locationX),
        onPanResponderRelease: () => setIsDragging(false),
        onPanResponderTerminate: () => setIsDragging(false),
      }),
    [seekTo]
  );

  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <View style={tw`rounded-lg w-60`}>
      <Video
        ref={videoRef}
        source={{ uri: audioUrl }}
        paused={!effectivePlaying}
        playInBackground={false}
        playWhenInactive={false}
        onLoad={handleLoad}
        onProgress={handleProgress}
        onEnd={handleEnd}
        style={{ width: 0, height: 0 }}
        progressUpdateInterval={80}
      />

      <View style={tw`flex-row items-center gap-2 px-2 pt-2 pb-1`}>
        <Pressable
          onPress={togglePlay}
          style={[
            tw`rounded-full p-2 shrink-0`,
            { backgroundColor: playButtonBg },
            theme?.messageStyle?.audioPlayButtonStyle,
          ]}
        >
          {effectivePlaying ? (
            CustomPauseIcon ? <CustomPauseIcon /> : (
              <PauseIcon style={tw.style('h-5 w-5')} color={pauseIconColor} />
            )
          ) : CustomPlayIcon ? <CustomPlayIcon /> : (
            <PlayIcon style={tw.style('h-5 w-5')} color={playIconColor} />
          )}
        </Pressable>

        <View style={{ flex: 1 }}>
          <View
            style={[
              { height: WAVEFORM_H, flexDirection: 'row', alignItems: 'flex-end' },
              theme?.messageStyle?.progressBarStyle,
            ]}
            onLayout={(e) => { waveformWidth.current = e.nativeEvent.layout.width; }}
            {...panResponder.panHandlers}
          >
            {waveform.map((amp, i) => {
              const active = (i + 0.5) / WAVEFORM_BARS <= progress;
              return (
                <View
                  key={i}
                  style={[
                    {
                      flex: 1,
                      marginHorizontal: 1,
                      height: Math.max(3, Math.round(amp * WAVEFORM_H)),
                      borderRadius: 2,
                      backgroundColor: active ? activeBarColor : inactiveBarColor,
                    },
                    active ? theme?.messageStyle?.activeProgressBarStyle : undefined,
                  ]}
                />
              );
            })}
          </View>

          <Text
            style={withFontFamily(
              [tw`text-[10px] mt-0.5`, { color: timestampColor }, theme?.messageStyle?.audioDurationStyle],
              theme?.fontFamily
            )}
          >
            {formatDuration(currentTime)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default React.memo(AudioPlayer);
