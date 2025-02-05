import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Video from 'react-native-video';
import tw from 'twrnc';
import { LoadingIcon } from '../../assets/Icons/LoadingIcon';
import { PlayIcon } from '../../assets/Icons/PlayIcon';
import { useChatContext } from '../../context/ChatContext';
import { formatDuration } from '../../utils/datefunc';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
const MessageContent = ({
  message,
  onMediaPress,
  isVideoPlaying
}) => {
  const {
    theme,
    showMessageStatus,
    CustomPlayIcon,
    renderCustomVideoBubbleError
  } = useChatContext();
  const videoRef = React.useRef(null);
  const [duration, setDuration] = React.useState(0);
  const [videoIsLoading, setVideoIsLoading] = React.useState(false);
  const [videoHasError, setVideoHasError] = React.useState(false);
  return /*#__PURE__*/React.createElement(View, null, message.image && /*#__PURE__*/React.createElement(Pressable, {
    onPress: () => onMediaPress('image', message.image),
    style: tw`w-60 h-80 my-2`
  }, /*#__PURE__*/React.createElement(Image, {
    source: {
      uri: message.image
    },
    style: tw`w-full h-full object-contain rounded-lg`
  })), message.video && /*#__PURE__*/React.createElement(Pressable, {
    onPress: () => onMediaPress('video', message.video),
    style: tw`w-60 h-80 my-2 justify-center items-center`,
    disabled: videoIsLoading
  }, /*#__PURE__*/React.createElement(Video, {
    source: {
      uri: message.video
    },
    ref: videoRef,
    paused: true,
    style: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
      position: 'relative'
    },
    resizeMode: "cover",
    onLoadStart: () => {
      setVideoIsLoading(true);
      setVideoHasError(false);
    },
    onLoad: data => {
      setDuration(data.duration);
      setVideoIsLoading(false);
    },
    onBuffer: ({
      isBuffering
    }) => setVideoIsLoading(isBuffering),
    onError: () => {
      setVideoHasError(true);
      setVideoIsLoading(false);
    }
  }), videoIsLoading ? /*#__PURE__*/React.createElement(View, {
    style: tw`absolute inset-0 flex items-center justify-center bg-black/40 rounded-full`
  }, /*#__PURE__*/React.createElement(LoadingIcon, {
    style: tw.style('h-12 w-12 fill-white animate-spin')
  })) : videoHasError ? renderCustomVideoBubbleError ? renderCustomVideoBubbleError() : /*#__PURE__*/React.createElement(View, {
    style: tw`absolute inset-0 flex items-center justify-center bg-red-500/60 p-2`
  }, /*#__PURE__*/React.createElement(Text, {
    style: tw`text-white font-bold`
  }, "Failed to load video")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(View, {
    style: tw`absolute bg-black/40 rounded-full`
  }, CustomPlayIcon ? /*#__PURE__*/React.createElement(CustomPlayIcon, null) : /*#__PURE__*/React.createElement(PlayIcon, {
    style: tw.style('h-16 w-16'),
    color: theme?.colors?.audioPlayIconColor || 'white'
  })), /*#__PURE__*/React.createElement(View, {
    style: tw`absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded-md`
  }, /*#__PURE__*/React.createElement(Text, {
    style: tw`text-white text-xs font-semibold`
  }, formatDuration(duration))))), message.audio && /*#__PURE__*/React.createElement(View, {
    style: tw`my-2`
  }, /*#__PURE__*/React.createElement(AudioPlayer, {
    audioUrl: message.audio,
    audioId: message.id,
    isVideoPlaying: isVideoPlaying
  })), message.text && /*#__PURE__*/React.createElement(Text, {
    style: [tw`text-gray-800 pt-1 break-words`, showMessageStatus ? tw`pb-0` : tw`pb-2`, theme?.messageStyle?.textStyle]
  }, message.text));
};
export default /*#__PURE__*/React.memo(MessageContent);
//# sourceMappingURL=MessageContent.js.map