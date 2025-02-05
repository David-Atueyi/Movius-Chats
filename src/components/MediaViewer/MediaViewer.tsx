import { LoadingIcon } from '../../assets/Icons/LoadingIcon';
import { XIcon } from '../../assets/Icons/XIcon';
import React, { useRef, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import Video, { VideoRef } from 'react-native-video';
import tw from 'twrnc';
import { MediaViewerProps } from './types';

const MediaViewer: React.FC<MediaViewerProps> = ({
  imageUrl,
  videoUrl,
  onClose,
}) => {
  const videoRef = useRef<VideoRef>(null);
  const [videoIsLoading, setVideoIsLoading] = useState(false);
  const [videoHasError, setVideoHasError] = useState(false);

  if (!imageUrl && !videoUrl) return null;

  return (
    <Modal visible={!!imageUrl || !!videoUrl} transparent={true}>
      <View
        style={tw`top-0 bottom-0 left-0 right-0 bg-black/80 flex-1 absolute`}
      >
        <Pressable
          onPress={onClose}
          style={tw`absolute right-4 top-4 p-2 rounded-full bg-slate-100/70 z-10`}
        >
          <XIcon style={tw`h-8 w-8 stroke-black`} />
        </Pressable>

        {imageUrl && (
          <ImageViewer
            imageUrls={[{ url: imageUrl }]}
            enableSwipeDown
            onSwipeDown={onClose}
            backgroundColor="rgba(0,0,0,0.8)"
            enableImageZoom
            onSave={() => imageUrl}
            renderIndicator={() => <></>}
          />
        )}

        {videoUrl && (
          <View style={tw`justify-center items-center`}>
            <Video
              source={{ uri: videoUrl }}
              ref={videoRef}
              shutterColor="transparent"
              controls={true}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 8,
                position: 'relative',
                marginHorizontal: 48,
              }}
              controlsStyles={{
                hideSettingButton: false,
                hideNext: true,
                hidePrevious: true,
              }}
              resizeMode="contain"
              onLoadStart={() => {
                setVideoIsLoading(true);
                setVideoHasError(false);
              }}
              onLoad={() => setVideoIsLoading(false)}
              onBuffer={({ isBuffering }) => setVideoIsLoading(isBuffering)}
              onError={() => {
                setVideoHasError(true);
                setVideoIsLoading(false);
              }}
            />
            {videoIsLoading && (
              <View
                style={tw`absolute inset-0 flex items-center justify-center bg-black/40 rounded-full`}
              >
                <LoadingIcon
                  style={tw.style('h-12 w-12 fill-white animate-spin')}
                />
              </View>
            )}
            {videoHasError && (
              <View
                style={tw`absolute inset-0 flex items-center justify-center bg-red-500/60 p-2`}
              >
                <Text style={tw`text-white font-bold`}>
                  Failed to load video
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
};

export default React.memo(MediaViewer);
