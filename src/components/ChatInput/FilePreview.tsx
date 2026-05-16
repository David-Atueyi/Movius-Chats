import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Video from 'react-native-video';
import { FileIcon } from '../../assets/Icons/FileIcon';
import { useChatContext } from '../../context/ChatContext';
import type { MessageMediaItem, PreviewAttachment } from '../../types';
import { withFontFamily } from '../../utils/theme';
import TruncateFileName from './TruncateFileName';

function previewsToMediaItems(previews: PreviewAttachment[]): MessageMediaItem[] {
  return previews
    .filter(
      (p) =>
        p.type?.startsWith('image/') ||
        p.type?.startsWith('video/')
    )
    .map((p) => ({
      uri: p.uri,
      kind: p.type.startsWith('video/') ? 'video' : 'image',
    }));
}

interface FilePreviewProps {
  previews: PreviewAttachment[];
  closePreview?: () => void;
  CustomFileIcon?: React.ComponentType<{ style?: any }>;
  CustomImagePreview?: React.ComponentType<{ uri: string }>;
  CustomVideoPreview?: React.ComponentType<{ uri: string }>;
  inputHeight?: number;
}

const CARD = 56;
const FAN_OVERLAP = 18;

const FilePreview: React.FC<FilePreviewProps> = ({
  previews,
  closePreview,
  CustomFileIcon,
  CustomImagePreview,
  CustomVideoPreview,
  inputHeight,
}) => {
  const { theme, setMediaViewerGallery } = useChatContext();

  const media = previews.filter(
    (p) =>
      p.type?.startsWith('image/') ||
      p.type?.startsWith('video/')
  );
  const docs = previews.filter(
    (p) =>
      !p.type?.startsWith('image/') &&
      !p.type?.startsWith('video/')
  );

  const mediaAsItems = previewsToMediaItems(previews);

  if (previews.length === 0) return null;

  const openGalleryAt = (index: number) => {
    if (mediaAsItems.length === 0) return;
    setMediaViewerGallery(mediaAsItems, index);
  };

  const renderMediaThumb = (p: PreviewAttachment, size = CARD) => {
    const isImage = p.type?.startsWith('image/');
    const isVideo = p.type?.startsWith('video/');
    if (isImage && CustomImagePreview) {
      return <CustomImagePreview uri={p.uri} />;
    }
    if (isVideo && CustomVideoPreview) {
      return <CustomVideoPreview uri={p.uri} />;
    }
    if (isImage) {
      return (
        <Image
          source={{ uri: p.uri }}
          style={{
            width: size,
            height: size,
            borderRadius: 12,
          }}
          resizeMode="cover"
        />
      );
    }
    if (isVideo) {
      return (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <Video
            source={{ uri: p.uri }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
            muted
            repeat
            paused={false}
          />
        </View>
      );
    }
    return null;
  };

  const renderMediaSection = () => {
    if (media.length === 0) return null;

    if (media.length === 1) {
      const p = media[0];
      if (!p) return null;
      return (
        <Pressable onPress={() => openGalleryAt(0)}>
          {renderMediaThumb(p)}
        </Pressable>
      );
    }

    const showFan = media.length >= 2;
    const slice = media.slice(0, 3);
    const extraOnThird = media.length > 3 ? media.length - 3 : 0;

    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: CARD + 12 }}>
        {slice.map((p, idx) => {
          const rot =
            slice.length === 2
              ? idx === 0
                ? '-4deg'
                : '4deg'
              : idx === 0
                ? '-10deg'
                : idx === 1
                  ? '0deg'
                  : '10deg';

          return (
            <Pressable
              key={`${p.uri}-${idx}`}
              onPress={() => {
                const items = previewsToMediaItems(media);
                const i = items.findIndex((x) => x.uri === p.uri);
                openGalleryAt(i >= 0 ? i : 0);
              }}
              style={{
                marginLeft: idx === 0 ? 0 : -FAN_OVERLAP,
                zIndex: idx + 1,
                transform: showFan ? [{ rotate: rot }] : undefined,
              }}
            >
              <View style={{ position: 'relative' }}>
                {renderMediaThumb(p)}
                {idx === 2 && extraOnThird > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 12,
                      backgroundColor: 'rgba(0,0,0,0.55)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>
                      +{extraOnThird}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    );
  };

  return (
    <View
      style={[
        {
          position: 'absolute',
          bottom: (inputHeight ?? 0) + 8,
          zIndex: 20,
          borderRadius: 12,
          maxWidth: '92%',
          alignSelf: 'flex-start',
        },
        theme?.filePreviewStyle?.root,
      ]}
    >
      <Pressable
        onPress={closePreview}
        style={{
          position: 'absolute',
          zIndex: 50,
          height: 22,
          width: 22,
          backgroundColor: 'rgba(255, 255, 255, 0.65)',
          right: -4,
          top: -4,
          borderRadius: 11,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text
          style={withFontFamily(
            { fontSize: 11, color: 'black', fontWeight: '700' },
            theme?.fontFamily
          )}
        >
          ×
        </Text>
      </Pressable>

      <View style={{ gap: 8 }}>
        {renderMediaSection()}
        {docs.map((doc, di) => (
          <View
            key={`${doc.uri}-${di}`}
            style={[
              {
                backgroundColor: 'white',
                width: 240,
                minHeight: 64,
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
                fileName={doc.name || 'File'}
                style={theme?.filePreviewStyle?.text}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default React.memo(FilePreview);
