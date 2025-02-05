import { LoadingIcon } from '../../assets/Icons/LoadingIcon';
import { XIcon } from '../../assets/Icons/XIcon';
import React, { useRef, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Video from 'react-native-video';
import tw from 'twrnc';
const MediaViewer = ({
  imageUrl,
  videoUrl,
  onClose
}) => {
  const videoRef = useRef(null);
  const [videoIsLoading, setVideoIsLoading] = useState(false);
  const [videoHasError, setVideoHasError] = useState(false);
  if (!imageUrl && !videoUrl) return null;
  return /*#__PURE__*/React.createElement(Modal, {
    visible: !!imageUrl || !!videoUrl,
    transparent: true
  }, /*#__PURE__*/React.createElement(View, {
    style: tw`top-0 bottom-0 left-0 right-0 bg-black/80 flex-1 absolute`
  }, /*#__PURE__*/React.createElement(Pressable, {
    onPress: onClose,
    style: tw`absolute right-4 top-4 p-2 rounded-full bg-slate-100/70 z-10`
  }, /*#__PURE__*/React.createElement(XIcon, {
    style: tw`h-8 w-8 stroke-black`
  })), imageUrl && /*#__PURE__*/React.createElement(ImageViewer, {
    imageUrls: [{
      url: imageUrl
    }],
    enableSwipeDown: true,
    onSwipeDown: onClose,
    backgroundColor: "rgba(0,0,0,0.8)",
    enableImageZoom: true,
    onSave: () => imageUrl,
    renderIndicator: () => /*#__PURE__*/React.createElement(React.Fragment, null)
  }), videoUrl && /*#__PURE__*/React.createElement(View, {
    style: tw`justify-center items-center`
  }, /*#__PURE__*/React.createElement(Video, {
    source: {
      uri: videoUrl
    },
    ref: videoRef,
    shutterColor: "transparent",
    controls: true,
    style: {
      width: '100%',
      height: '100%',
      borderRadius: 8,
      position: 'relative',
      marginHorizontal: 48
    },
    controlsStyles: {
      hideSettingButton: false,
      hideNext: true,
      hidePrevious: true
    },
    resizeMode: "contain",
    onLoadStart: () => {
      setVideoIsLoading(true);
      setVideoHasError(false);
    },
    onLoad: () => setVideoIsLoading(false),
    onBuffer: ({
      isBuffering
    }) => setVideoIsLoading(isBuffering),
    onError: () => {
      setVideoHasError(true);
      setVideoIsLoading(false);
    }
  }), videoIsLoading && /*#__PURE__*/React.createElement(View, {
    style: tw`absolute inset-0 flex items-center justify-center bg-black/40 rounded-full`
  }, /*#__PURE__*/React.createElement(LoadingIcon, {
    style: tw.style('h-12 w-12 fill-white animate-spin')
  })), videoHasError && /*#__PURE__*/React.createElement(View, {
    style: tw`absolute inset-0 flex items-center justify-center bg-red-500/60 p-2`
  }, /*#__PURE__*/React.createElement(Text, {
    style: tw`text-white font-bold`
  }, "Failed to load video")))));
};
export default /*#__PURE__*/React.memo(MediaViewer);
//# sourceMappingURL=MediaViewer.js.map