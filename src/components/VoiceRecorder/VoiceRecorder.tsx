import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { PaperPlaneIcon } from '../../assets/Icons/PaperPlaneIcon';
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

  /** Container height. Default `110`. */
  height?: number;
  /** Top corner radius. Bottom corners always stay square. Default `18`. */
  borderRadius?: number;

  /** Number of bars rendered inside the waveform. Default `28`. */
  waveCount?: number;
  /** Horizontal gap between waveform bars. Default `3`. */
  waveSpacing?: number;
  /** Width of each waveform bar. Default `3`. */
  waveWidth?: number;

  /** Override the entire delete icon (keeps press handling intact). */
  renderDeleteIcon?: () => ReactNode;
  /** Override the entire send icon (keeps press handling intact). */
  renderSendIcon?: () => ReactNode;
  /** Replace the built-in waveform with any node. */
  renderWaveform?: () => ReactNode;

  /** Fired when the user taps the send button. */
  onSend?: () => void;
  /** Fired when the user taps the trash / cancel icon. */
  onDelete?: () => void;
}

const DEFAULT_BG = '#0B141A';
const DEFAULT_PRIMARY = '#22C55E';
const DEFAULT_WAVEFORM = '#E9EDEF';
const DEFAULT_TIMER = '#FFFFFF';
const DEFAULT_DELETE = '#8696A0';
const PAUSE_BAR_COLOR = '#F15C6D';

const WAVEFORM_HEIGHT = 36;
const WAVEFORM_WIDTH = 200;
const SEND_SIZE = 72;
const DELETE_SIZE = 26;

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  primaryColor = DEFAULT_PRIMARY,
  backgroundColor = DEFAULT_BG,
  waveformColor = DEFAULT_WAVEFORM,
  timerColor = DEFAULT_TIMER,
  sendButtonColor,
  deleteIconColor = DEFAULT_DELETE,
  height = 110,
  borderRadius = 18,
  waveCount = 28,
  waveSpacing = 3,
  waveWidth = 3,
  renderDeleteIcon,
  renderSendIcon,
  renderWaveform,
  onSend,
  onDelete,
}) => {
  const [duration, setDuration] = useState(0);
  const startedAt = useRef<number>(Date.now());

  useEffect(() => {
    startedAt.current = Date.now();
    const id = setInterval(() => {
      setDuration((Date.now() - startedAt.current) / 1000);
    }, 250);
    return () => clearInterval(id);
  }, []);

  const sendScale = useSharedValue(1);
  const pauseOpacity = useSharedValue(1);

  useEffect(() => {
    sendScale.value = withRepeat(
      withSequence(
        withTiming(1.05, {
          duration: 900,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    pauseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.45, {
          duration: 600,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const sendAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sendScale.value }],
  }));
  const pauseAnimatedStyle = useAnimatedStyle(() => ({
    opacity: pauseOpacity.value,
  }));

  const containerStyle: ViewStyle = {
    height,
    backgroundColor,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
  };

  const resolvedSendBackground = sendButtonColor ?? primaryColor;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.row}>
        <Pressable
          onPress={onDelete}
          hitSlop={10}
          style={styles.deleteWrapper}
          accessibilityRole="button"
          accessibilityLabel="Delete recording"
        >
          {renderDeleteIcon ? (
            renderDeleteIcon()
          ) : (
            <TrashIcon
              style={{ width: DELETE_SIZE, height: DELETE_SIZE }}
              color={deleteIconColor}
            />
          )}
        </Pressable>

        <View style={styles.center}>
          <View style={styles.timerRow}>
            <Text
              style={[styles.timer, { color: timerColor }]}
              numberOfLines={1}
            >
              {formatDuration(duration)}
            </Text>

            <View style={styles.waveformWrapper}>
              {renderWaveform ? (
                renderWaveform()
              ) : (
                <Waveform
                  color={waveformColor}
                  count={waveCount}
                  spacing={waveSpacing}
                  barWidth={waveWidth}
                />
              )}
            </View>
          </View>

          <Animated.View style={[styles.pauseRow, pauseAnimatedStyle]}>
            <View style={styles.pauseBar} />
            <View style={styles.pauseBar} />
          </Animated.View>
        </View>

        <Animated.View style={sendAnimatedStyle}>
          <Pressable
            onPress={onSend}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel="Send recording"
            style={[
              styles.sendButton,
              { backgroundColor: resolvedSendBackground },
            ]}
          >
            {renderSendIcon ? (
              renderSendIcon()
            ) : (
              <PaperPlaneIcon
                style={{ width: 30, height: 30 }}
                color="#FFFFFF"
              />
            )}
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
};

interface WaveformProps {
  color: string;
  count: number;
  spacing: number;
  barWidth: number;
}

const Waveform: React.FC<WaveformProps> = ({
  color,
  count,
  spacing,
  barWidth,
}) => {
  const tick = useSharedValue(0);

  useEffect(() => {
    tick.value = withRepeat(
      withTiming(1, { duration: 4500, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const totalWidth = Math.min(
    WAVEFORM_WIDTH,
    count * barWidth + (count - 1) * spacing
  );

  return (
    <View
      style={[
        styles.waveform,
        { width: totalWidth, height: WAVEFORM_HEIGHT },
      ]}
    >
      {Array.from({ length: count }).map((_, i) => (
        <WaveBar
          key={i}
          index={i}
          total={count}
          tick={tick}
          color={color}
          width={barWidth}
          spacing={spacing}
        />
      ))}
    </View>
  );
};

interface WaveBarProps {
  index: number;
  total: number;
  tick: ReturnType<typeof useSharedValue<number>>;
  color: string;
  width: number;
  spacing: number;
}

const WaveBar: React.FC<WaveBarProps> = ({
  index,
  total,
  tick,
  color,
  width,
  spacing,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const t = tick.value * Math.PI * 2;
    const phase1 = Math.sin(t * 2 + index * 0.55);
    const phase2 = Math.sin(t * 4 + index * 1.3);
    const phase3 = Math.sin(t * 0.9 + index * 0.27);
    const combined = (phase1 * 0.55 + phase2 * 0.3 + phase3 * 0.4) * 0.5 + 0.5;

    const edgeFalloff = Math.sin((index / Math.max(1, total - 1)) * Math.PI);
    const amplitude = Math.max(
      0.15,
      Math.min(1, combined) * (0.35 + 0.65 * edgeFalloff)
    );
    return {
      height: `${Math.round(amplitude * 100)}%`,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width,
          marginHorizontal: spacing / 2,
          backgroundColor: color,
          borderRadius: width,
        },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 18,
    paddingVertical: 14,
    justifyContent: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteWrapper: {
    width: DELETE_SIZE,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingBottom: 2,
  },
  center: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timer: {
    fontSize: 24,
    fontWeight: '600',
    minWidth: 50,
    letterSpacing: 0.3,
  },
  waveformWrapper: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pauseRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  pauseBar: {
    width: 3,
    height: 12,
    borderRadius: 2,
    backgroundColor: PAUSE_BAR_COLOR,
  },
  sendButton: {
    width: SEND_SIZE,
    height: SEND_SIZE,
    borderRadius: SEND_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
});

export default VoiceRecorder;
