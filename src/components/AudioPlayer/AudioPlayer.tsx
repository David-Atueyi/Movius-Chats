import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Image, PanResponder, Pressable, Text, View } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import tw from 'twrnc';
import { PauseIcon } from '../../assets/Icons/PauseIcon';
import { PlayIcon } from '../../assets/Icons/PlayIcon';
import { useAudio } from '../../context/AudioContext';
import { useChatContext } from '../../context/ChatContext';
import type { ChatScreenProps } from '../../types';
import {
  getAudioDurationColor,
  getAudioPauseIconColor,
  getAudioPlayIconColor,
  getAudioSpeedTextColor,
  getAudioWaveformColors,
} from '../../utils/bubbleTheme';
import { formatDuration } from '../../utils/datefunc';
import { withFontFamily } from '../../utils/theme';
import { AudioPlayerProps, PLAYBACK_RATES, PlaybackRate } from './types';

type ChatTheme = ChatScreenProps['theme'];

const WAVEFORM_BARS = 50;
const WAVEFORM_H = 36;
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
  onLongPress,
}) => {
  const { theme, CustomPlayIcon, CustomPauseIcon, showMessageStatus } =
    useChatContext();
  const { currentlyPlayingId, setCurrentlyPlayingId } = useAudio();

  const videoRef = useRef<VideoRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState<PlaybackRate>(1);
  const seekPendingRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const waveformWRef = useRef(0);
  const waveformViewRef = useRef<View>(null);
  const waveformPageXRef = useRef(0);
  const seekBlockedUntilRef = useRef(0);

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
      if (isDraggingRef.current) return;
      if (Date.now() < seekBlockedUntilRef.current) return;
      setCurrentTime(t);
    },
    []
  );

  const handleEnd = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    videoRef.current?.seek(0);
    setCurrentlyPlayingId(null);
  }, [setCurrentlyPlayingId]);

  const handleSeek = useCallback(() => {
    seekBlockedUntilRef.current = 0;
  }, []);

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
      const w = waveformWRef.current;
      if (w <= 0 || duration <= 0) return;
      const t = Math.max(0, Math.min(x / w, 1)) * duration;
      setCurrentTime(t);
      seekBlockedUntilRef.current = Date.now() + 3000;
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
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (_evt, gestureState) => {
        isDraggingRef.current = true;
        seekTo(gestureState.x0 - waveformPageXRef.current);
      },
      onPanResponderMove: (_evt, gestureState) => {
        seekTo(gestureState.moveX - waveformPageXRef.current);
      },
      onPanResponderRelease: () => {
        isDraggingRef.current = false;
      },
      onPanResponderTerminate: () => {
        isDraggingRef.current = false;
      },
    }),
  [seekTo]
);

  const playPause = (
    <Pressable
      onPress={togglePlay}
      onLongPress={onLongPress}
      delayLongPress={250}
      hitSlop={8}
      style={tw`shrink-0 px-0.5`}
    >
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

  const waveformBars = (
    <View
      ref={waveformViewRef}
      style={[tw`flex-1 min-w-0`, { height: WAVEFORM_H }]}
      onLayout={() => {
        waveformViewRef.current?.measure((_x, _y, width, _h, pageX) => {
          waveformPageXRef.current = pageX;
          waveformWRef.current = width;
        });
      }}
    >
      <View
        style={[
          {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
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
                  marginHorizontal: 0.5,
                  height: Math.max(3, Math.round(amp * WAVEFORM_H)),
                  borderRadius: 2,
                  backgroundColor: active ? activeBarColor : inactiveBarColor,
                },
                active
                  ? theme?.messageStyle?.activeProgressBarStyle
                  : undefined,
              ]}
            />
          );
        })}
      </View>
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
        onSeek={handleSeek}
        style={{ width: 0, height: 0 }}
        progressUpdateInterval={80}
      />

      <View style={tw`flex-row items-center gap-1.5`}>
        {isCurrentUser ? (
          <>
            {avatarOrSpeed}
            {playPause}
            {waveformBars}
          </>
        ) : (
          <>
            {playPause}
            {waveformBars}
            {avatarOrSpeed}
          </>
        )}
      </View>
      <Text
        style={withFontFamily(
          [
            tw`text-[11px] mt-1`,
            {
              color: durationColor,
              paddingLeft: isCurrentUser ? AVATAR_SIZE + 6 + 28 + 6 : 28 + 6,
            },
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
};

export default React.memo(AudioPlayer);
