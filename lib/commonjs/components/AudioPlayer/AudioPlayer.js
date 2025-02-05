"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _reactNativeSound = _interopRequireDefault(require("react-native-sound"));
var _twrnc = _interopRequireDefault(require("twrnc"));
var _PauseIcon = require("../../assets/Icons/PauseIcon");
var _PlayIcon = require("../../assets/Icons/PlayIcon");
var _AudioContext = require("../../context/AudioContext");
var _ChatContext = require("../../context/ChatContext");
var _datefunc = require("../../utils/datefunc");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const AudioPlayer = ({
  audioUrl,
  audioId,
  isVideoPlaying
}) => {
  const {
    theme,
    CustomPlayIcon,
    CustomPauseIcon
  } = (0, _ChatContext.useChatContext)();
  const {
    currentlyPlayingId,
    setCurrentlyPlayingId
  } = (0, _AudioContext.useAudio)();
  const [sound, setSound] = (0, _react.useState)(null);
  const [isPlaying, setIsPlaying] = (0, _react.useState)(false);
  const [currentTime, setCurrentTime] = (0, _react.useState)(0);
  const [duration, setDuration] = (0, _react.useState)(0);
  const [isDragging, setIsDragging] = (0, _react.useState)(false);
  const progressRef = (0, _react.useRef)(null);
  const progressWidth = (0, _react.useRef)(0);
  const progressX = (0, _react.useRef)(0);
  const startX = (0, _react.useRef)(0);
  const knobPosition = (0, _reactNativeReanimated.useSharedValue)(0);

  // Initialize sound
  (0, _react.useEffect)(() => {
    let mounted = true;
    const newSound = new _reactNativeSound.default(audioUrl, '', error => {
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
  (0, _react.useEffect)(() => {
    if (currentlyPlayingId && currentlyPlayingId !== audioId && isPlaying && sound) {
      sound.pause();
      setIsPlaying(false);
      setCurrentTime(0);
      knobPosition.value = 0;
    }
  }, [currentlyPlayingId, audioId, isPlaying, sound]);

  // Update progress
  (0, _react.useEffect)(() => {
    let interval;
    if (isPlaying && sound && !isDragging) {
      interval = setInterval(() => {
        sound.getCurrentTime(seconds => {
          if (typeof seconds === 'number' && !isNaN(seconds)) {
            setCurrentTime(seconds);
            if (progressWidth.current > 0 && duration > 0) {
              const progress = seconds / duration * progressWidth.current;
              if (!isNaN(progress)) {
                knobPosition.value = (0, _reactNativeReanimated.withSpring)(progress, {
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
  const panResponder = _reactNative.PanResponder.create({
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
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
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
          knobPosition.value = (0, _reactNativeReanimated.withSpring)(0);
          setCurrentlyPlayingId(null);
        }
      });
      setIsPlaying(true);
    }
  };

  // Stop audio when video starts playing
  (0, _react.useEffect)(() => {
    if (isVideoPlaying && isPlaying && sound) {
      sound.pause(() => {
        setIsPlaying(false);
        setCurrentlyPlayingId(null);
      });
    }
  }, [isVideoPlaying]);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: (0, _twrnc.default)`rounded-lg w-56`
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: (0, _twrnc.default)`flex-row items-center gap-2 px-2 pt-2`
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Pressable, {
    onPress: togglePlay,
    style: [(0, _twrnc.default)`bg-black/40 rounded-full p-2`, theme?.messageStyle?.audioPlayButtonStyle]
  }, isPlaying ? CustomPauseIcon ? /*#__PURE__*/_react.default.createElement(CustomPauseIcon, null) : /*#__PURE__*/_react.default.createElement(_PauseIcon.PauseIcon, {
    style: _twrnc.default.style('h-6 w-6'),
    color: theme?.colors?.audioPauseIconColor || 'white'
  }) : CustomPlayIcon ? /*#__PURE__*/_react.default.createElement(CustomPlayIcon, null) : /*#__PURE__*/_react.default.createElement(_PlayIcon.PlayIcon, {
    style: _twrnc.default.style('h-6 w-6'),
    color: theme?.colors?.audioPlayIconColor || 'white'
  })), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
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
    style: [(0, _twrnc.default)`relative h-1 bg-zinc-400 rounded overflow-visible w-[75%]`, theme?.messageStyle?.progressBarStyle]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [(0, _twrnc.default)`absolute h-full bg-slate-200`, {
      width: `${duration > 0 ? currentTime / duration * 100 : 0}%`
    }, theme?.messageStyle?.activeProgressBarStyle]
  }), /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, _extends({}, panResponder.panHandlers, {
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
  })))), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: (0, _twrnc.default)`px-4 py-1`
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
    style: [(0, _twrnc.default)`text-xs text-gray-500`, theme?.messageStyle?.audioDurationStyle]
  }, !isNaN(currentTime) ? (0, _datefunc.formatDuration)(currentTime) : '0:00')));
};
var _default = exports.default = /*#__PURE__*/_react.default.memo(AudioPlayer);
//# sourceMappingURL=AudioPlayer.js.map