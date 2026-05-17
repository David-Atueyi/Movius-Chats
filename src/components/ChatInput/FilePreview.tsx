import React from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import Video from 'react-native-video';
import { FileIcon } from '../../assets/Icons/FileIcon';
import { useChatContext } from '../../context/ChatContext';
import type { MessageMediaItem, PreviewAttachment } from '../../types';
import { withFontFamily } from '../../utils/theme';
import TruncateFileName from './TruncateFileName';

function previewsToMediaItems(
  previews: PreviewAttachment[]
): MessageMediaItem[] {
  return previews
    .filter((p) => p.type?.startsWith('image/') || p.type?.startsWith('video/'))
    .map((p) => ({
      uri: p.uri,
      kind: p.type.startsWith('video/') ? 'video' : 'image',
    }));
}

interface FilePreviewProps {
  previews: PreviewAttachment[];
  closePreview?: () => void;
  /** Remove a single item by URI. When provided each card gets its own × button. */
  onRemoveItem?: (uri: string) => void;
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
  onRemoveItem,
  CustomFileIcon,
  CustomImagePreview,
  CustomVideoPreview,
  inputHeight,
}) => {
  const { theme, setMediaViewerGallery } = useChatContext();

  const media = previews.filter(
    (p) => p.type?.startsWith('image/') || p.type?.startsWith('video/')
  );
  const docs = previews.filter(
    (p) => !p.type?.startsWith('image/') && !p.type?.startsWith('video/')
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
            pointerEvents="none"
            playInBackground={false}
            playWhenInactive={false}
          />
        </View>
      );
    }
    return null;
  };


  const renderCloseBtn = (uri: string, counterRotate?: string) => (
    <Pressable
      onPress={() => (onRemoveItem ? onRemoveItem(uri) : closePreview?.())}
      style={{
        position: 'absolute',
        zIndex: 50,
        height: 22,
        width: 22,
        backgroundColor: 'rgba(0,0,0,0.55)',
        right: -6,
        top: -6,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        transform: counterRotate ? [{ rotate: counterRotate }] : undefined,
      }}
    >
      <Text
        style={withFontFamily(
          { fontSize: 13, color: 'white', fontWeight: '700', lineHeight: 14 },
          theme?.fontFamily
        )}
      >
        ×
      </Text>
    </Pressable>
  );

  const renderMediaSection = () => {
    if (media.length === 0) return null;

    if (media.length === 1) {
      const p = media[0];
      if (!p) return null;
      return (
        <Pressable onPress={() => openGalleryAt(0)} style={{ position: 'relative' }}>
          {renderMediaThumb(p)}
          {renderCloseBtn(p.uri)}
        </Pressable>
      );
    }

    const slice = media.slice(0, 3);
    const extraOnThird = media.length > 3 ? media.length - 3 : 0;

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: CARD + 12,
        }}
      >
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

          // Negate the card rotation so the × button stays visually upright
          const counterRot =
            slice.length === 2
              ? idx === 0
                ? '4deg'
                : '-4deg'
              : idx === 0
                ? '10deg'
                : idx === 1
                  ? '0deg'
                  : '-10deg';

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
                transform: [{ rotate: rot }],
                position: 'relative',
              }}
            >
              <View style={{ position: 'relative' }}>
                {renderMediaThumb(p)}
                {idx === 2 && extraOnThird > 0 && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: 12,
                      backgroundColor: 'rgba(0,0,0,0.55)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}
                    >
                      +{extraOnThird}
                    </Text>
                  </View>
                )}
                {renderCloseBtn(p.uri, counterRot)}
              </View>
            </Pressable>
          );
        })}
      </View>
    );
  };

  // Each doc card: minHeight 64 + gap 8. Show at most 3 before scrolling.
  const DOC_CARD_H = 72; // 64 min + a bit of padding room
  const docsMaxHeight = DOC_CARD_H * 3 + 8 * 2; // 3 cards + 2 gaps

  const renderDocCard = (doc: PreviewAttachment, di: number) => (
    <View
      key={`${doc.uri}-${di}`}
      style={{ position: 'relative' }}
    >
      <View
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
      {renderCloseBtn(doc.uri)}
    </View>
  );

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
      <View style={{ gap: 8 }}>
        {renderMediaSection()}
        {docs.length > 0 && (
          <ScrollView
            scrollEnabled={docs.length > 3}
            style={{ maxHeight: docsMaxHeight }}
            showsVerticalScrollIndicator={docs.length > 3}
            contentContainerStyle={{ gap: 8 }}
            nestedScrollEnabled
          >
            {docs.map((doc, di) => renderDocCard(doc, di))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default React.memo(FilePreview);
