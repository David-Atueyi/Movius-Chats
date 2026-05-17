import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Image, PanResponder, Pressable, Text, View } from 'react-native';

// ─── New-Architecture compatibility shim ─────────────────────────────────────
// react-native-sound imports resolveAssetSource the old way; on New Architecture
// that path returns an Object not a function → "resolveAssetSource is not a function".
// We patch the cached module here as a runtime safety net.
// The movius-chats postinstall script applies the permanent file-level fix.
try {
  const ras = require('react-native/Libraries/Image/resolveAssetSource');
  if (typeof ras !== 'function') {
    const fn = Image.resolveAssetSource.bind(Image);
    Object.keys(ras).forEach((k) => {
      try { (ras as any)[k] = (fn as any)[k]; } catch {}
    });
    Object.defineProperty(ras, '__esModule', { value: false, configurable: true });
    (global as any).__moviusRAS = fn;
  }
} catch { /* safe to skip */ }

import Sound from 'react-native-sound';
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

// ─── Waveform generator ───────────────────────────────────────────────────────
// Generates a deterministic pseudo-random bar-height array from the audio URL
// so the same message always shows the same waveform shape.
const WAVEFORM_BARS = 34;
const WAVEFORM_H = 34; // total container height in px

function generateWaveform(url: string, count: number): number[] {
  // djb2 hash seeded from URL
  let h = 5381;
  for (let i = 0; i < url.length; i++) {
    h = ((h << 5) + h + url.charCodeAt(i)) | 0;
  }
  return Array.from({ length: count }, (_, i) => {
    // Mix the index in so adjacent bars differ
    h = (Math.imul(h ^ (h >>> 16), 0x45d9f3b + i * 31337)) | 0;
    h = h ^ (h >>> 13);
    const raw = Math.abs(h) % 100;
    // Shape: bias toward mid heights (more natural look)
    // minimum 18 % so very short bars still show
    return 0.18 + (raw / 100) * 0.82;
  });
}

// ─── Component ───────────────────────────────────────────────────────────────
const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  audioId,
  isVideoPlaying,
  isCurrentUser,
}) => {
  const { theme, CustomPlayIcon, CustomPauseIcon } = useChatContext();
  const { currentlyPlayingId, setCurrentlyPlayingId } = useAudio();

  const [sound, setSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const waveformWidth = useRef(0);
  const soundRef = useRef<Sound | null>(null);

  // Pre-compute waveform shape once per URL
  const waveform = useMemo(() => generateWaveform(audioUrl, WAVEFORM_BARS), [audioUrl]);

  const { inactive: inactiveBarColor, active: activeBarColor } =
    getAudioWaveformColors(theme, isCurrentUser);
  const timestampColor = getAudioDurationColor(theme, isCurrentUser);
  const playIconColor = getAudioPlayIconColor(theme, isCurrentUser);
  const pauseIconColor = getAudioPauseIconColor(theme, isCurrentUser);
  const playButtonBg = getAudioPlayButtonBackground(theme, isCurrentUser);

  // ── Initialize sound ────────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;
    let newSound: Sound | null = null;

    try {
      newSound = new Sound(audioUrl, '', (error) => {
        if (!error && mounted && newSound) {
          setDuration(newSound.getDuration());
        }
      });
      setSound(newSound);
      soundRef.current = newSound;
    } catch {
      console.warn(
        '[movius-chats] AudioPlayer: Could not initialize react-native-sound. ' +
          'Reinstall the package to apply the resolveAssetSource patch automatically.'
      );
    }

    return () => {
      mounted = false;
      newSound?.pause();
      newSound?.release();
      soundRef.current = null;
    };
  }, [audioUrl]);

  // ── Stop when another audio/video starts ────────────────────────────────
  useEffect(() => {
    if (currentlyPlayingId && currentlyPlayingId !== audioId && isPlaying && sound) {
      sound.pause();
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [currentlyPlayingId, audioId, isPlaying, sound]);

  useEffect(() => {
    if (isVideoPlaying && isPlaying && sound) {
      sound.pause(() => {
        setIsPlaying(false);
        setCurrentlyPlayingId(null);
      });
    }
  }, [isVideoPlaying]);

  // ── Progress polling ─────────────────────────────────────────────────────
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && sound && !isDragging) {
      interval = setInterval(() => {
        sound.getCurrentTime((sec) => {
          if (typeof sec === 'number' && !isNaN(sec)) {
            setCurrentTime(sec);
          }
        });
      }, 80);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isPlaying, sound, isDragging, duration]);

  // ── Seek helper ──────────────────────────────────────────────────────────
  const seekTo = (x: number) => {
    const w = waveformWidth.current;
    if (w <= 0 || duration <= 0) return;
    const ratio = Math.max(0, Math.min(x / w, 1));
    const t = ratio * duration;
    setCurrentTime(t);
    soundRef.current?.setCurrentTime(t);
  };

  // ── PanResponder on waveform ─────────────────────────────────────────────
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      setIsDragging(true);
      seekTo(evt.nativeEvent.locationX);
    },
    onPanResponderMove: (evt) => {
      seekTo(evt.nativeEvent.locationX);
    },
    onPanResponderRelease: () => { setIsDragging(false); },
    onPanResponderTerminate: () => { setIsDragging(false); },
  });

  // ── Play / pause ─────────────────────────────────────────────────────────
  const togglePlay = () => {
    if (!sound) return;
    if (isPlaying) {
      sound.pause(() => {
        setIsPlaying(false);
        setCurrentlyPlayingId(null);
      });
    } else {
      setCurrentlyPlayingId(audioId);
      sound.play((success) => {
        if (success) {
          setIsPlaying(false);
          setCurrentTime(0);
          setCurrentlyPlayingId(null);
        }
      });
      setIsPlaying(true);
    }
  };

  // ── Progress ratio ───────────────────────────────────────────────────────
  const progress = duration > 0 ? currentTime / duration : 0;

  return (
    <View style={tw`rounded-lg w-60`}>
      <View style={tw`flex-row items-center gap-2 px-2 pt-2 pb-1`}>
        {/* Play / Pause button */}
        <Pressable
          onPress={togglePlay}
          style={[
            tw`rounded-full p-2 shrink-0`,
            { backgroundColor: playButtonBg },
            theme?.messageStyle?.audioPlayButtonStyle,
          ]}
        >
          {isPlaying ? (
            CustomPauseIcon ? <CustomPauseIcon /> : (
              <PauseIcon
                style={tw.style('h-5 w-5')}
                color={pauseIconColor}
              />
            )
          ) : CustomPlayIcon ? <CustomPlayIcon /> : (
            <PlayIcon
              style={tw.style('h-5 w-5')}
              color={playIconColor}
            />
          )}
        </Pressable>

        {/* Waveform + timestamp column */}
        <View style={{ flex: 1 }}>
          {/* Waveform bars */}
          <View
            style={[
              {
                height: WAVEFORM_H,
                flexDirection: 'row',
                alignItems: 'flex-end',
              },
              theme?.messageStyle?.progressBarStyle,
            ]}
            onLayout={(e) => { waveformWidth.current = e.nativeEvent.layout.width; }}
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

          {/* Duration */}
          <Text
            style={withFontFamily(
              [
                tw`text-[10px] mt-0.5`,
                { color: timestampColor },
                theme?.messageStyle?.audioDurationStyle,
              ],
              theme?.fontFamily
            )}
          >
            {!isNaN(currentTime) ? formatDuration(currentTime) : '0:00'}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default React.memo(AudioPlayer);
