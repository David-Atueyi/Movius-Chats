import React, { ReactNode } from 'react';
import { Pressable, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import tw from 'twrnc';
import { PaperPlaneIcon } from '../../../assets/Icons/PaperPlaneIcon';
import { PauseIcon } from '../../../assets/Icons/PauseIcon';
import { PlayIcon } from '../../../assets/Icons/PlayIcon';
import { TrashIcon } from '../../../assets/Icons/TrashIcon';
import { formatDuration } from '../../../utils/datefunc';
import { withFontFamily } from '../../../utils/theme';
import { Waveform } from './Waveform';

interface RecordingBarProps {
  duration: number;
  isPaused: boolean;

  composedGesture: ReturnType<typeof Gesture.Race>;
  micWrapperStyle: ReturnType<typeof useAnimatedStyle>;
  pausePulseStyle: ReturnType<typeof useAnimatedStyle>;
  recDotStyle: ReturnType<typeof useAnimatedStyle>;
  waveTick: SharedValue<number>;

  onCancelPress: () => void;
  onTogglePause: () => void;

  // Colors / sizing
  backgroundColor: string;
  timerColor: string;
  waveformColor: string;
  deleteIconColor: string;
  pauseIconColor: string;
  primaryColor: string;
  micSize: number;
  iconSize: number;
  inputBarHeight: number;
  waveCount: number;
  enableWaveform: boolean;

  // Optional header slot rendered inside the bar above the timer / waveform.
  headerSlot?: ReactNode;

  // Render slots
  renderDeleteIcon?: () => ReactNode;
  renderPauseIcon?: () => ReactNode;
  renderPlayIcon?: () => ReactNode;
  renderSendIcon?: () => ReactNode;
  renderWaveform?: () => ReactNode;

  // Style overrides
  containerStyleOverride?: ViewStyle;
  barStyleOverride?: ViewStyle;
  timerTextStyle?: TextStyle;
  waveformStyle?: ViewStyle;
  trashButtonStyle?: ViewStyle;
  sendButtonStyle?: ViewStyle;

  // Typography
  fontFamily?: string;
}

export const RecordingBar: React.FC<RecordingBarProps> = ({
  duration,
  isPaused,
  composedGesture,
  micWrapperStyle,
  pausePulseStyle,
  recDotStyle,
  waveTick,
  onCancelPress,
  onTogglePause,
  backgroundColor,
  timerColor,
  waveformColor,
  deleteIconColor,
  pauseIconColor,
  primaryColor,
  micSize,
  iconSize,
  inputBarHeight,
  waveCount,
  enableWaveform,
  headerSlot,
  renderDeleteIcon,
  renderPauseIcon,
  renderPlayIcon,
  renderSendIcon,
  renderWaveform,
  containerStyleOverride,
  barStyleOverride,
  timerTextStyle,
  waveformStyle,
  trashButtonStyle,
  sendButtonStyle,
  fontFamily,
}) => {
  const fullBarStyle: ViewStyle = {
    minHeight: inputBarHeight + 50,
    backgroundColor,
  };

  const micButtonStyle: ViewStyle = {
    height: micSize,
    width: micSize,
    backgroundColor: primaryColor,
  };

  return (
    <View
      style={[
        tw`w-full rounded-2xl px-4 py-2.5`,
        fullBarStyle,
        containerStyleOverride,
        barStyleOverride,
      ]}
    >
      
      {headerSlot}

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
          style={withFontFamily(
            [
              tw`text-base font-semibold`,
              { color: timerColor, minWidth: 42 },
              timerTextStyle,
            ],
            fontFamily
          )}
          numberOfLines={1}
        >
          {formatDuration(duration)}
        </Text>

        {enableWaveform && (
          <View style={[tw`flex-1`, waveformStyle]}>
            {renderWaveform ? (
              renderWaveform()
            ) : (
              <Waveform color={waveformColor} tick={waveTick} count={waveCount} />
            )}
          </View>
        )}
      </View>

      {/* Bottom row: trash · pause/play · send */}
      <View style={tw`flex-row items-center justify-between mt-1`}>
        <Pressable
          onPress={onCancelPress}
          hitSlop={12}
          style={[
            tw`items-center justify-center rounded-full`,
            { width: micSize, height: micSize },
            trashButtonStyle,
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
          onPress={onTogglePause}
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
            <Animated.View style={pausePulseStyle}>
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

        <GestureDetector gesture={composedGesture}>
          <Animated.View
            style={[
              tw`items-center justify-center rounded-full`,
              micButtonStyle,
              sendButtonStyle,
              micWrapperStyle,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Send recording"
          >
            {renderSendIcon ? (
              renderSendIcon()
            ) : (
              <PaperPlaneIcon
                style={{ width: iconSize, height: iconSize }}
                color="#FFFFFF"
              />
            )}
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
};
