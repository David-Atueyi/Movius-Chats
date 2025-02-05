import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import tw from 'twrnc';
import { LoadingIcon } from '../../assets/Icons/LoadingIcon';
import { PlayIcon } from '../../assets/Icons/PlayIcon';
import { useChatContext } from '../../context/ChatContext';
import { formatDuration } from '../../utils/datefunc';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import { MessageContentProps } from './types';

const MessageContent: React.FC<MessageContentProps> = ({
  message,
  onMediaPress,
  isVideoPlaying,
}) => {
  const {
    theme,
    showMessageStatus,
    CustomPlayIcon,
    renderCustomVideoBubbleError,
  } = useChatContext();
  const videoRef = React.useRef<VideoRef>(null);
  const [duration, setDuration] = React.useState(0);
  const [videoIsLoading, setVideoIsLoading] = React.useState(false);
  const [videoHasError, setVideoHasError] = React.useState(false);

  return (
    <View>
      {message.image && (
        <Pressable
          onPress={() => onMediaPress('image', message.image as string)}
          style={tw`w-60 h-80 my-2`}
        >
          <Image
            source={{ uri: message.image }}
            style={tw`w-full h-full object-contain rounded-lg`}
          />
        </Pressable>
      )}

      {message.video && (
        <Pressable
          onPress={() => onMediaPress('video', message.video as string)}
          style={tw`w-60 h-80 my-2 justify-center items-center`}
          disabled={videoIsLoading}
        >
          <Video
            source={{ uri: message.video }}
            ref={videoRef}
            paused={true}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 8,
              position: 'relative',
            }}
            resizeMode="cover"
            onLoadStart={() => {
              setVideoIsLoading(true);
              setVideoHasError(false);
            }}
            onLoad={(data) => {
              setDuration(data.duration);
              setVideoIsLoading(false);
            }}
            onBuffer={({ isBuffering }) => setVideoIsLoading(isBuffering)}
            onError={() => {
              setVideoHasError(true);
              setVideoIsLoading(false);
            }}
          />
          {videoIsLoading ? (
            <View
              style={tw`absolute inset-0 flex items-center justify-center bg-black/40 rounded-full`}
            >
              <LoadingIcon
                style={tw.style('h-12 w-12 fill-white animate-spin')}
              />
            </View>
          ) : videoHasError ? (
            renderCustomVideoBubbleError ? (
              renderCustomVideoBubbleError()
            ) : (
              <View
                style={tw`absolute inset-0 flex items-center justify-center bg-red-500/60 p-2`}
              >
                <Text style={tw`text-white font-bold`}>
                  Failed to load video
                </Text>
              </View>
            )
          ) : (
            <>
              <View style={tw`absolute bg-black/40 rounded-full`}>
                {CustomPlayIcon ? (
                  <CustomPlayIcon />
                ) : (
                  <PlayIcon
                    style={tw.style('h-16 w-16')}
                    color={theme?.colors?.audioPlayIconColor || 'white'}
                  />
                )}
              </View>
              <View
                style={tw`absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded-md`}
              >
                <Text style={tw`text-white text-xs font-semibold`}>
                  {formatDuration(duration)}
                </Text>
              </View>
            </>
          )}
        </Pressable>
      )}

      {message.audio && (
        <View style={tw`my-2`}>
          <AudioPlayer
            audioUrl={message.audio}
            audioId={message.id}
            isVideoPlaying={isVideoPlaying as boolean}
          />
        </View>
      )}

      {message.text && (
        <Text
          style={[
            tw`text-gray-800 pt-1 break-words`,
            showMessageStatus ? tw`pb-0` : tw`pb-2`,
            theme?.messageStyle?.textStyle,
          ]}
        >
          {message.text}
        </Text>
      )}
    </View>
  );
};

export default React.memo(MessageContent);
