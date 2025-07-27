import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Video from 'react-native-video';
import { FileIcon } from '../../assets/Icons/FileIcon';
import { useChatContext } from '../../context/ChatContext';
import TruncateFileName from './TruncateFileName';
import { ChatInputProps } from './types';

const FilePreview: React.FC<Omit<ChatInputProps, 'onSendMessage'>> = ({
  previewData,
  closePreview,
  CustomFileIcon,
  CustomImagePreview,
  CustomVideoPreview,
}) => {
  const { theme, setMediaUrl, setIsVideoPlaying } = useChatContext();
  if (!previewData) return null;
  const isImage = previewData.type?.startsWith('image/');
  const isVideo = previewData.type?.startsWith('video/');

  return (
    <Pressable
      style={[
        // Default style
        {
          position: 'absolute',
          bottom: 80,
          left: 28,
          zIndex: 10,
          borderRadius: 12,
        },
        // Custom style overrides
        theme?.filePreviewStyle?.root,
      ]}
      onPress={() => {
        if (isImage || isVideo) {
          setMediaUrl({
            imageUrl: isImage ? previewData.uri : '',
            videoUrl: isVideo ? previewData.uri : '',
          });
          if (isVideo) setIsVideoPlaying(true);
        }
      }}
    >
      <Pressable
        onPress={closePreview}
        style={{
          position: 'absolute',
          zIndex: 10,
          height: 20,
          width: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          right: 0,
          borderTopRightRadius: 8,
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 12, color: 'black' }}>X</Text>
      </Pressable>

      {isImage ? (
        CustomImagePreview ? (
          <CustomImagePreview uri={previewData.uri} />
        ) : (
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <Image
              source={{ uri: previewData.uri }}
              style={{ width: '100%', height: '100%', borderRadius: 12 }}
              resizeMode="cover"
            />
          </View>
        )
      ) : isVideo ? (
        CustomVideoPreview ? (
          <CustomVideoPreview uri={previewData.uri} />
        ) : (
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <Video
              source={{ uri: previewData.uri }}
              style={{ width: '100%', height: '100%', borderRadius: 12 }}
              resizeMode="cover"
              muted
              repeat
              paused={false}
            />
          </View>
        )
      ) : (
        <View
          style={[
            {
              backgroundColor: 'white',
              width: 240,
              height: 64,
              borderRadius: 12,
              flexDirection: 'row',
              padding: 4,
              gap: 4,
              alignItems: 'center',
            },
            theme?.filePreviewStyle?.container,
          ]}
        >
          <View
            style={[
              {
                backgroundColor: '#d1d5db',
                borderRadius: 8,
                padding: 4,
                justifyContent: 'center',
                alignItems: 'center',
              },
              theme?.filePreviewStyle?.iconContainer,
            ]}
          >
            {CustomFileIcon ? (
              <CustomFileIcon />
            ) : (
              <FileIcon style={{ width: 40, height: 40 }} fill="white" />
            )}
          </View>
          <View
            style={[
              {
                backgroundColor: '#f3f4f6',
                flex: 1,
                borderRadius: 8,
                justifyContent: 'center',
                paddingHorizontal: 12,
              },
              theme?.filePreviewStyle?.nameContainer,
            ]}
          >
            <TruncateFileName
              fileName={previewData.name}
              style={theme?.filePreviewStyle?.text}
            />
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default React.memo(FilePreview);
