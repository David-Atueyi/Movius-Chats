import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Image, PanResponder, Pressable, Text, View } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import tw from 'twrnc';
import { PauseIcon } from '../../assets/Icons/PauseIcon';
import { PlayIcon } from '../../assets/Icons/PlayIcon';
import { useAudio } from '../../context/AudioContext';
import { useChatContext } from '../../context/ChatContext';
import {
  getAudioDurationColor,
  getAudioPauseIconColor,
  getAudioPlayIconColor,
  getAudioSpeedTextColor,
  getAudioWaveformColors,
} from '../../utils/bubbleTheme';
import { formatDuration } from '../../utils/datefunc';
import { withFontFamily } from '../../utils/theme';
import type { ChatScreenProps } from '../../types';
import { AudioPlayerProps, PLAYBACK_RATES, PlaybackRate } from './types';

type ChatTheme = ChatScreenProps['theme'];

const WAVEFORM_BARS = 34;
const WAVEFORM_H = 34;
const AVATAR_SIZE = 42;

function generateWaveform(url: string, count: number): number[] {
  let h = 5381;
  for (let i = 0; i < url.length; i++) {
    h = ((h << 5) + h + url.charCodeAt(i)) | 0;
  }
  return Array.from({ length: count }, (_, i) => {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b + i * 31337) | 0;
    h = h ^ (h >>> 13);
    return 0.18 + ((Math.abs(h) % 100) / 100) * 0.82;
  });
}

function avatarInitial(name?: string): string {
  const t = name?.trim();
  return t ? t.charAt(0).toUpperCase() : '?';
}

function AudioAvatarOrSpeed({
  isPlaying,
  playbackRate,
  onCycleSpeed,
  senderAvatar,
  senderName,
  isCurrentUser,
  theme,
}: {
  isPlaying: boolean;
  playbackRate: PlaybackRate;
  onCycleSpeed: () => void;
  senderAvatar?: string;
  senderName?: string;
  isCurrentUser: boolean;
  theme?: ChatTheme;
}) {
  if (isPlaying) {
    return (
      <Pressable
        onPress={onCycleSpeed}
        style={[
          tw`rounded-full items-center justify-center`,
          {
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            backgroundColor: isCurrentUser
              ? 'rgba(0,0,0,0.22)'
              : 'rgba(255,255,255,0.12)',
          },
          theme?.messageStyle?.audioSpeedButtonStyle,
        ]}
      >
        <Text
          style={withFontFamily(
            [
              tw`text-xs font-semibold`,
              { color: getAudioSpeedTextColor(theme, isCurrentUser) },
              theme?.messageStyle?.audioSpeedTextStyle,
            ],
            theme?.fontFamily
          )}
        >
          {playbackRate === 1 ? '1x' : `${playbackRate}x`}
        </Text>
      </Pressable>
    );
  }

  if (senderAvatar) {
    return (
      <Image
        source={{ uri: senderAvatar }}
        style={[
          tw`rounded-full`,
          { width: AVATAR_SIZE, height: AVATAR_SIZE },
          theme?.bubbleStyle?.avatarImageStyle,
        ]}
        resizeMode="cover"
      />
    );
  }

  return (
    <View
      style={[
        tw`rounded-full items-center justify-center`,
        {
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          backgroundColor: isCurrentUser ? 'rgba(0,0,0,0.2)' : '#9ca3af',
        },
      ]}
    >
      <Text
        style={withFontFamily(
          [tw`text-base font-semibold capitalize`, { color: '#ffffff' }],
          theme?.fontFamily
        )}
      >
        {avatarInitial(senderName)}
      </Text>
    </View>
  );
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  audioId,
  isVideoPlaying,
  isCurrentUser,
  senderAvatar,
  senderName,
  reserveStatusSpace = true,
}) => {
  const { theme, CustomPlayIcon, CustomPauseIcon, showMessageStatus } =
    useChatContext();
  const { currentlyPlayingId, setCurrentlyPlayingId } = useAudio();

  const videoRef = useRef<VideoRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1);
  const [waveformW, setWaveformW] = useState(0);
  const seekPendingRef = useRef<number | null>(null);

  const waveform = useMemo(
    () => generateWaveform(audioUrl, WAVEFORM_BARS),
    [audioUrl]
  );

  const { inactive: inactiveBarColor, active: activeBarColor } =
    getAudioWaveformColors(theme, isCurrentUser);
  const durationColor = getAudioDurationColor(theme, isCurrentUser);
  const playIconColor = getAudioPlayIconColor(theme, isCurrentUser);
  const pauseIconColor = getAudioPauseIconColor(theme, isCurrentUser);
  const shouldPause =
    isVideoPlaying || (!!currentlyPlayingId && currentlyPlayingId !== audioId);
  const effectivePlaying = isPlaying && !shouldPause;
  const progress = duration > 0 ? currentTime / duration : 0;

  const handleLoad = useCallback((data: { duration: number }) => {
    setDuration(data.duration);
    if (seekPendingRef.current !== null) {
      videoRef.current?.seek(seekPendingRef.current);
      seekPendingRef.current = null;
    }
  }, []);

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
      setCurrentlyPlayingId(audioId);
      setIsPlaying(true);
    }
  }, [effectivePlaying, audioId, setCurrentlyPlayingId]);

  const cycleSpeed = useCallback(() => {
    setPlaybackRate((r) => {
      const i = PLAYBACK_RATES.indexOf(r);
      const next = PLAYBACK_RATES[(i + 1) % PLAYBACK_RATES.length];
      return next ?? 1;
    });
  }, []);

  const seekTo = useCallback(
    (x: number) => {
      const w = waveformW;
      if (w <= 0 || duration <= 0) return;
      const t = Math.max(0, Math.min(x / w, 1)) * duration;
      setCurrentTime(t);
      if (duration > 0) {
        videoRef.current?.seek(t);
      } else {
        seekPendingRef.current = t;
      }
    },
    [duration, waveformW]
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

  const playPause = (
    <Pressable onPress={togglePlay} hitSlop={8} style={tw`shrink-0 px-0.5`}>
      {effectivePlaying ? (
        CustomPauseIcon ? (
          <CustomPauseIcon />
        ) : (
          <PauseIcon style={tw.style('h-6 w-6')} color={pauseIconColor} />
        )
      ) : CustomPlayIcon ? (
        <CustomPlayIcon />
      ) : (
        <PlayIcon style={tw.style('h-6 w-6')} color={playIconColor} />
      )}
    </Pressable>
  );

  const avatarOrSpeed = (
    <AudioAvatarOrSpeed
      isPlaying={effectivePlaying}
      playbackRate={playbackRate}
      onCycleSpeed={cycleSpeed}
      senderAvatar={senderAvatar}
      senderName={senderName}
      isCurrentUser={isCurrentUser}
      theme={theme}
    />
  );

  const waveformBlock = (
    <View style={[tw`flex-1 min-w-0`, reserveStatusSpace && showMessageStatus && tw`pr-14`]}>
      <View
        style={{ height: WAVEFORM_H }}
        onLayout={(e) => setWaveformW(e.nativeEvent.layout.width)}
      >
        <View
          style={[
            {
              height: WAVEFORM_H,
              flexDirection: 'row',
              alignItems: 'flex-end',
            },
            theme?.messageStyle?.progressBarStyle,
          ]}
          {...panResponder.panHandlers}
        >
          {waveform.map((amp, i) => {
            const barProgress = (i + 0.5) / WAVEFORM_BARS;
            const active = barProgress <= progress;
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
      </View>
      <Text
        style={withFontFamily(
          [
            tw`text-[11px] mt-0.5`,
            { color: durationColor },
            theme?.messageStyle?.audioDurationStyle,
          ],
          theme?.fontFamily
        )}
      >
        {formatDuration(
          effectivePlaying ? currentTime : duration > 0 ? duration : currentTime
        )}
      </Text>
    </View>
  );

  return (
    <View
      style={[
        tw`min-w-[240px] max-w-[280px] py-1.5 px-1`,
        reserveStatusSpace && showMessageStatus && tw`pb-4`,
      ]}
    >
      <Video
        ref={videoRef}
        source={{ uri: audioUrl }}
        paused={!effectivePlaying}
        rate={playbackRate}
        playInBackground={false}
        playWhenInactive={false}
        onLoad={handleLoad}
        onProgress={handleProgress}
        onEnd={handleEnd}
        style={{ width: 0, height: 0 }}
        progressUpdateInterval={80}
      />

      <View style={tw`flex-row items-center gap-1.5`}>
        {isCurrentUser ? (
          <>
            {avatarOrSpeed}
            {playPause}
            {waveformBlock}
          </>
        ) : (
          <>
            {playPause}
            {waveformBlock}
            {avatarOrSpeed}
          </>
        )}
      </View>
    </View>
  );
};

export default React.memo(AudioPlayer);
