import React, { ReactNode } from 'react';
import { Pressable, Text, TextStyle, View, ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import tw from 'twrnc';
import { MicrophoneIcon } from '../../../assets/Icons/MicrophoneIcon';
import { PaperPlaneIcon } from '../../../assets/Icons/PaperPlaneIcon';
import { formatDuration } from '../../../utils/datefunc';
import { withFontFamily } from '../../../utils/theme';
import { LockPill } from './LockPill';

interface InlineRowProps {
  isHold: boolean;
  duration: number;

  composedGesture: ReturnType<typeof Gesture.Race>;
  micWrapperStyle: ReturnType<typeof useAnimatedStyle>;
  slideTextAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  lockPillAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
  chevronAnimatedStyle: ReturnType<typeof useAnimatedStyle>;

  // Colors / sizing
  primaryColor: string;
  microphoneColor: string;
  timerColor: string;
  cancelTextColor: string;
  holdPillBackground: string;
  lockPillBackground: string;
  lockColor: string;
  chevronColor: string;
  iconSize: number;
  lockIconSize: number;
  inputBarHeight: number;
  micSize: number;
  enableLockRecording: boolean;

  // Trailing-slot send-button mode
  showSendButton?: boolean;
  onSendPress?: () => void;
  sendButtonBackgroundColor?: string;
  sendButtonIconColor?: string;

  // Render slots
  renderInputPill?: () => ReactNode;
  renderMicIcon?: () => ReactNode;
  renderSendIcon?: () => ReactNode;
  renderArrowIcon?: () => ReactNode;
  renderLockIcon?: () => ReactNode;

  // Style overrides
  containerStyleOverride?: ViewStyle;
  timerTextStyle?: TextStyle;
  slideTextStyleOverride?: TextStyle;
  lockPillStyleOverride?: ViewStyle;
  sendButtonStyle?: ViewStyle;

  // Typography
  fontFamily?: string;
}

export const InlineRow: React.FC<InlineRowProps> = ({
  isHold,
  duration,
  composedGesture,
  micWrapperStyle,
  slideTextAnimatedStyle,
  lockPillAnimatedStyle,
  chevronAnimatedStyle,
  primaryColor,
  microphoneColor,
  timerColor,
  cancelTextColor,
  holdPillBackground,
  lockPillBackground,
  lockColor,
  chevronColor,
  iconSize,
  lockIconSize,
  inputBarHeight,
  micSize,
  enableLockRecording,
  showSendButton,
  onSendPress,
  sendButtonBackgroundColor,
  sendButtonIconColor,
  renderInputPill,
  renderMicIcon,
  renderSendIcon,
  renderArrowIcon,
  renderLockIcon,
  containerStyleOverride,
  timerTextStyle,
  slideTextStyleOverride,
  lockPillStyleOverride,
  sendButtonStyle,
  fontFamily,
}) => {
  const holdPillStyle: ViewStyle = {
    minHeight: inputBarHeight,
    backgroundColor: holdPillBackground,
  };

  const micButtonStyle: ViewStyle = {
    height: micSize,
    width: micSize,
    backgroundColor: primaryColor,
  };

  return (
    <View
      style={[tw`flex-row items-end gap-2 relative`, containerStyleOverride]}
      pointerEvents="box-none"
    >
      {isHold ? (
        <View
          style={[
            tw`flex-1 flex-row items-center px-4 rounded-3xl`,
            holdPillStyle,
          ]}
        >
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

          <Animated.View
            style={[
              tw`flex-1 flex-row items-center justify-center gap-1.5`,
              slideTextAnimatedStyle,
            ]}
          >
            {renderArrowIcon ? (
              renderArrowIcon()
            ) : (
              <Text
                style={withFontFamily(
                  [
                    tw`text-base leading-none`,
                    { color: cancelTextColor, marginTop: -2 },
                  ],
                  fontFamily
                )}
              >
                ‹
              </Text>
            )}
            <Text
              style={withFontFamily(
                [
                  tw`text-sm`,
                  { color: cancelTextColor },
                  slideTextStyleOverride,
                ],
                fontFamily
              )}
            >
              Slide to cancel
            </Text>
          </Animated.View>
        </View>
      ) : (
        renderInputPill?.()
      )}

      <View
        style={[
          tw`relative items-center justify-center`,
          { height: inputBarHeight, width: inputBarHeight },
        ]}
      >
        {enableLockRecording && isHold && (
          <LockPill
            width={micSize - 8}
            bottomOffset={micSize + 6}
            background={lockPillBackground}
            lockColor={lockColor}
            chevronColor={chevronColor}
            lockIconSize={lockIconSize}
            pillAnimatedStyle={lockPillAnimatedStyle}
            chevronAnimatedStyle={chevronAnimatedStyle}
            styleOverride={lockPillStyleOverride}
            renderLockIcon={renderLockIcon}
          />
        )}

        {showSendButton && !isHold ? (
          <Pressable
            onPress={onSendPress}
            style={[
              tw`items-center justify-center rounded-full`,
              {
                height: micSize,
                width: micSize,
                backgroundColor:
                  sendButtonBackgroundColor ?? primaryColor,
              },
              sendButtonStyle,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Send"
          >
            {renderSendIcon ? (
              renderSendIcon()
            ) : (
              <PaperPlaneIcon
                style={{ width: iconSize, height: iconSize }}
                color={sendButtonIconColor ?? microphoneColor}
              />
            )}
          </Pressable>
        ) : (
          <GestureDetector gesture={composedGesture}>
            <Animated.View
              style={[
                tw`items-center justify-center rounded-full`,
                micButtonStyle,
                sendButtonStyle,
                micWrapperStyle,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Tap to record. Long-press and slide left to cancel or up to lock."
            >
              {renderMicIcon ? (
                renderMicIcon()
              ) : (
                <MicrophoneIcon
                  style={{ width: iconSize + 6, height: iconSize + 6 }}
                  color={microphoneColor}
                />
              )}
            </Animated.View>
          </GestureDetector>
        )}
      </View>
    </View>
  );
};
