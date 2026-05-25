import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Pressable, Text, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import tw from 'twrnc';
import { PaperPlaneIcon } from '../../assets/Icons/PaperPlaneIcon';
import { PauseIcon } from '../../assets/Icons/PauseIcon';
import { PlayIcon } from '../../assets/Icons/PlayIcon';
import { TrashIcon } from '../../assets/Icons/TrashIcon';
import { formatDuration } from '../../utils/datefunc';

export interface VoiceRecorderProps {
  /** App primary color used for the circular send button. */
  primaryColor?: string;
  /** Bar background color. */
  backgroundColor?: string;
  /** Color of the animated waveform bars. */
  waveformColor?: string;
  /** Color of the running timer. */
  timerColor?: string;
  /** Override the send-button background. Falls back to `primaryColor`. */
  sendButtonColor?: string;
  /** Stroke color of the trash / delete icon. */
  deleteIconColor?: string;
  /** Color of the pause / play icon. */
  pauseIconColor?: string;

  /** Top corner radius. Bottom corners always stay square. Default `16`. */
  borderRadius?: number;

  /** Size of the circular send button. Default `50`. */
  sendButtonSize?: number;

  /** Number of bars rendered inside the waveform. Default `32`. */
  waveCount?: number;

  /** Override the entire delete icon (keeps press handling intact). */
  renderDeleteIcon?: () => ReactNode;
  /** Override the entire send icon (keeps press handling intact). */
  renderSendIcon?: () => ReactNode;
  /** Override the pause / play icon. */
  renderPauseIcon?: () => ReactNode;
  renderPlayIcon?: () => ReactNode;
  /** Replace the built-in waveform with any node. */
  renderWaveform?: () => ReactNode;

  /** Fired when the user taps the send button. */
  onSend?: () => void;
  /** Fired when the user taps the trash / cancel icon. */
  onDelete?: () => void;
  /** Fired when the user taps pause. */
  onPause?: () => void;
  /** Fired when the user taps play (resume). */
  onResume?: () => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  primaryColor = '#16A34A',
  backgroundColor = '#0B141A',
  waveformColor = '#E9EDEF',
  timerColor = '#FFFFFF',
  sendButtonColor,
  deleteIconColor = '#8696A0',
  pauseIconColor = '#F15C6D',
  borderRadius = 16,
  sendButtonSize = 50,
  waveCount = 32,
  renderDeleteIcon,
  renderSendIcon,
  renderPauseIcon,
  renderPlayIcon,
  renderWaveform,
  onSend,
  onDelete,
  onPause,
  onResume,
}) => {
  const [duration, setDuration] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const startedAt = useRef<number>(Date.now());
  const pausedAccum = useRef<number>(0);
  const pausedAt = useRef<number>(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setDuration(
        (Date.now() - startedAt.current - pausedAccum.current) / 1000
      );
    }, 250);
    return () => clearInterval(id);
  }, [isPaused]);

  const pauseOpacity = useSharedValue(1);
  const recBlink = useSharedValue(1);

  useEffect(() => {
    pauseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 600, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    recBlink.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1,
      false
    );
  }, []);

  const pauseAnimatedStyle = useAnimatedStyle(() => ({
    opacity: isPaused ? 1 : pauseOpacity.value,
  }));
  const recDotStyle = useAnimatedStyle(() => ({
    opacity: recBlink.value,
  }));

  const togglePause = () => {
    setIsPaused((prev) => {
      const next = !prev;
      if (next) {
        pausedAt.current = Date.now();
        onPause?.();
      } else {
        pausedAccum.current += Date.now() - pausedAt.current;
        pausedAt.current = 0;
        onResume?.();
      }
      return next;
    });
  };

  const containerStyle: ViewStyle = {
    backgroundColor,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
  };

  const sendBg = sendButtonColor ?? primaryColor;

  return (
    <View style={[tw`w-full px-4 py-2.5`, containerStyle]}>
      {/* Top row: rec dot + timer + waveform */}
      <View style={tw`flex-row items-center gap-3 px-1 pt-1.5 pb-2`}>
        <Animated.View
          style={[
            tw`w-1.5 h-1.5 rounded-full`,
            { backgroundColor: pauseIconColor },
            recDotStyle,
          ]}
        />
        <Text
          style={[
            tw`text-base font-semibold`,
            { color: timerColor, minWidth: 42 },
          ]}
          numberOfLines={1}
        >
          {formatDuration(duration)}
        </Text>
        <View style={tw`flex-1`}>
          {renderWaveform ? (
            renderWaveform()
          ) : (
            <Waveform color={waveformColor} count={waveCount} />
          )}
        </View>
      </View>

      {/* Bottom row: trash · pause/play · send */}
      <View style={tw`flex-row items-center justify-between mt-1`}>
        <Pressable
          onPress={onDelete}
          hitSlop={12}
          style={[
            tw`items-center justify-center rounded-full`,
            { width: sendButtonSize, height: sendButtonSize },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Delete recording"
        >
          {renderDeleteIcon ? (
            renderDeleteIcon()
          ) : (
            <TrashIcon style={tw.style('w-6 h-6')} color={deleteIconColor} />
          )}
        </Pressable>

        <Pressable
          onPress={togglePause}
          hitSlop={12}
          style={tw`items-center justify-center px-4`}
          accessibilityRole="button"
          accessibilityLabel={isPaused ? 'Resume recording' : 'Pause recording'}
        >
          {isPaused ? (
            renderPlayIcon ? (
              renderPlayIcon()
            ) : (
              <PlayIcon style={tw.style('w-7 h-7')} color={pauseIconColor} />
            )
          ) : (
            <Animated.View style={pauseAnimatedStyle}>
              {renderPauseIcon ? (
                renderPauseIcon()
              ) : (
                <PauseIcon
                  style={tw.style('w-7 h-7')}
                  color={pauseIconColor}
                />
              )}
            </Animated.View>
          )}
        </Pressable>

        <Pressable
          onPress={onSend}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel="Send recording"
          style={[
            tw`items-center justify-center rounded-full`,
            {
              width: sendButtonSize,
              height: sendButtonSize,
              backgroundColor: sendBg,
            },
          ]}
        >
          {renderSendIcon ? (
            renderSendIcon()
          ) : (
            <PaperPlaneIcon style={tw.style('w-6 h-6')} color="#FFFFFF" />
          )}
        </Pressable>
      </View>
    </View>
  );
};

interface WaveformProps {
  color: string;
  count: number;
}

const Waveform: React.FC<WaveformProps> = ({ color, count }) => {
  const tick = useSharedValue(0);

  useEffect(() => {
    tick.value = withRepeat(
      withTiming(1, { duration: 4500, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  return (
    <View style={tw`flex-row items-center justify-between h-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <WaveBar key={i} index={i} total={count} tick={tick} color={color} />
      ))}
    </View>
  );
};

interface WaveBarProps {
  index: number;
  total: number;
  tick: ReturnType<typeof useSharedValue<number>>;
  color: string;
}

const WaveBar: React.FC<WaveBarProps> = ({ index, total, tick, color }) => {
  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const t = tick.value * Math.PI * 2;
    const phase1 = Math.sin(t * 2 + index * 0.55);
    const phase2 = Math.sin(t * 4 + index * 1.3);
    const phase3 = Math.sin(t * 0.9 + index * 0.27);
    const combined = (phase1 * 0.55 + phase2 * 0.3 + phase3 * 0.4) * 0.5 + 0.5;
    const edge = Math.sin((index / Math.max(1, total - 1)) * Math.PI);
    const amp = Math.max(0.18, Math.min(1, combined) * (0.35 + 0.65 * edge));
    return { height: `${Math.round(amp * 100)}%` };
  });

  return (
    <Animated.View
      style={[
        tw`mx-px rounded-full`,
        { width: 2, backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
};

export default VoiceRecorder;
