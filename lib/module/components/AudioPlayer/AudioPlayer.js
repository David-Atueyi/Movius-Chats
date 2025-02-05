function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useRef, useState } from 'react';
import { PanResponder, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Sound from 'react-native-sound';
import tw from 'twrnc';
import { PauseIcon } from '../../assets/Icons/PauseIcon';
import { PlayIcon } from '../../assets/Icons/PlayIcon';
import { useAudio } from '../../context/AudioContext';
import { useChatContext } from '../../context/ChatContext';
import { formatDuration } from '../../utils/datefunc';
const AudioPlayer = ({
  audioUrl,
  audioId,
  isVideoPlaying
}) => {
  const {
    theme,
    CustomPlayIcon,
    CustomPauseIcon
  } = useChatContext();
  const {
    currentlyPlayingId,
    setCurrentlyPlayingId
  } = useAudio();
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef(null);
  const progressWidth = useRef(0);
  const progressX = useRef(0);
  const startX = useRef(0);
  const knobPosition = useSharedValue(0);

  // Initialize sound
  useEffect(() => {
    let mounted = true;
    const newSound = new Sound(audioUrl, '', error => {
      if (!error && mounted) {
        setDuration(newSound.getDuration());
      }
    });
    setSound(newSound);
    return () => {
      mounted = false;
      if (newSound) {
        newSound.pause();
        newSound.release();
      }
    };
  }, [audioUrl]);

  // Handle stopping playback when another audio starts
  useEffect(() => {
    if (currentlyPlayingId && currentlyPlayingId !== audioId && isPlaying && sound) {
      sound.pause();
      setIsPlaying(false);
      setCurrentTime(0);
      knobPosition.value = 0;
    }
  }, [currentlyPlayingId, audioId, isPlaying, sound]);

  // Update progress
  useEffect(() => {
    let interval;
    if (isPlaying && sound && !isDragging) {
      interval = setInterval(() => {
        sound.getCurrentTime(seconds => {
          if (typeof seconds === 'number' && !isNaN(seconds)) {
            setCurrentTime(seconds);
            if (progressWidth.current > 0 && duration > 0) {
              const progress = seconds / duration * progressWidth.current;
              if (!isNaN(progress)) {
                knobPosition.value = withSpring(progress, {
                  damping: 15,
                  stiffness: 100
                });
              }
            }
          }
        });
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, sound, isDragging, duration]);
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: evt => {
      setIsDragging(true);
      startX.current = evt.nativeEvent.pageX - knobPosition.value;
    },
    onPanResponderMove: evt => {
      if (progressWidth.current > 0) {
        const newPosition = evt.nativeEvent.pageX - startX.current;
        const boundedPosition = Math.max(0, Math.min(newPosition, progressWidth.current));
        knobPosition.value = boundedPosition;
        const percentage = boundedPosition / progressWidth.current;
        const newTime = percentage * duration;
        if (!isNaN(newTime)) {
          setCurrentTime(newTime);
        }
      }
    },
    onPanResponderRelease: () => {
      setIsDragging(false);
      if (sound && progressWidth.current > 0) {
        const percentage = knobPosition.value / progressWidth.current;
        const newTime = percentage * duration;
        if (!isNaN(newTime)) {
          sound.setCurrentTime(newTime);
        }
      }
    },
    onPanResponderTerminate: () => {
      setIsDragging(false);
    }
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{
        translateX: knobPosition.value
      }]
    };
  });
  const togglePlay = () => {
    if (!sound) return;
    if (isPlaying) {
      sound.pause(() => {
        setIsPlaying(false);
        setCurrentlyPlayingId(null);
      });
    } else {
      setCurrentlyPlayingId(audioId);
      sound.play(success => {
        if (success) {
          setIsPlaying(false);
          setCurrentTime(0);
          knobPosition.value = withSpring(0);
          setCurrentlyPlayingId(null);
        }
      });
      setIsPlaying(true);
    }
  };

  // Stop audio when video starts playing
  useEffect(() => {
    if (isVideoPlaying && isPlaying && sound) {
      sound.pause(() => {
        setIsPlaying(false);
        setCurrentlyPlayingId(null);
      });
    }
  }, [isVideoPlaying]);
  return /*#__PURE__*/React.createElement(View, {
    style: tw`rounded-lg w-56`
  }, /*#__PURE__*/React.createElement(View, {
    style: tw`flex-row items-center gap-2 px-2 pt-2`
  }, /*#__PURE__*/React.createElement(Pressable, {
    onPress: togglePlay,
    style: [tw`bg-black/40 rounded-full p-2`, theme?.messageStyle?.audioPlayButtonStyle]
  }, isPlaying ? CustomPauseIcon ? /*#__PURE__*/React.createElement(CustomPauseIcon, null) : /*#__PURE__*/React.createElement(PauseIcon, {
    style: tw.style('h-6 w-6'),
    color: theme?.colors?.audioPauseIconColor || 'white'
  }) : CustomPlayIcon ? /*#__PURE__*/React.createElement(CustomPlayIcon, null) : /*#__PURE__*/React.createElement(PlayIcon, {
    style: tw.style('h-6 w-6'),
    color: theme?.colors?.audioPlayIconColor || 'white'
  })), /*#__PURE__*/React.createElement(View, {
    ref: progressRef,
    onLayout: e => {
      const {
        width
      } = e.nativeEvent.layout;
      progressWidth.current = width;
      progressRef.current?.measure((_, __, ___, ____, pageX) => {
        progressX.current = pageX;
      });
    },
    style: [tw`relative h-1 bg-zinc-400 rounded overflow-visible w-[75%]`, theme?.messageStyle?.progressBarStyle]
  }, /*#__PURE__*/React.createElement(View, {
    style: [tw`absolute h-full bg-slate-200`, {
      width: `${duration > 0 ? currentTime / duration * 100 : 0}%`
    }, theme?.messageStyle?.activeProgressBarStyle]
  }), /*#__PURE__*/React.createElement(Animated.View, _extends({}, panResponder.panHandlers, {
    style: [animatedStyle, {
      position: 'absolute',
      top: -6,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    }, {
      ...theme?.messageStyle?.audioKnobStyle
    }]
  })))), /*#__PURE__*/React.createElement(View, {
    style: tw`px-4 py-1`
  }, /*#__PURE__*/React.createElement(Text, {
    style: [tw`text-xs text-gray-500`, theme?.messageStyle?.audioDurationStyle]
  }, !isNaN(currentTime) ? formatDuration(currentTime) : '0:00')));
};
export default /*#__PURE__*/React.memo(AudioPlayer);
//# sourceMappingURL=AudioPlayer.js.map