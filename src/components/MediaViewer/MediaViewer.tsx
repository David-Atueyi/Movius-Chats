import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import tw from 'twrnc';
import { LoadingIcon } from '../../assets/Icons/LoadingIcon';
import { XIcon } from '../../assets/Icons/XIcon';
import { useChatContext } from '../../context/ChatContext';
import type { MessageMediaItem } from '../../types';
import { isGalleryMediaItem } from '../../utils/messageMedia';
import { withFontFamily } from '../../utils/theme';

export interface MediaViewerProps {
  gallery: { items: MessageMediaItem[]; initialIndex: number } | null;
  onClose: () => void;
}

const MediaViewer: React.FC<MediaViewerProps> = ({ gallery, onClose }) => {
  const { theme, setIsVideoPlaying } = useChatContext();
  const listRef = useRef<FlatList<MessageMediaItem>>(null);
  const { width, height: windowHeight } = useWindowDimensions();
  const initialIndex = gallery?.initialIndex ?? 0;
  const [pageIndex, setPageIndex] = useState(initialIndex);
  const galleryItems = gallery?.items.filter(isGalleryMediaItem) ?? [];

  useEffect(() => {
    if (!galleryItems.length) return;
    const idx = Math.min(initialIndex, galleryItems.length - 1);
    setPageIndex(idx);
    const item = galleryItems[idx];
    setIsVideoPlaying(item?.kind === 'video');

    requestAnimationFrame(() => {
      try {
        listRef.current?.scrollToIndex({
          index: idx,
          animated: false,
        });
      } catch {
        /* layout not ready */
      }
    });
  }, [initialIndex, galleryItems, setIsVideoPlaying]);

  const handleClose = useCallback(() => {
    setIsVideoPlaying(false);
    onClose();
  }, [onClose, setIsVideoPlaying]);

  const onMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const idx = Math.round(e.nativeEvent.contentOffset.x / width);
      setPageIndex(idx);
      const item = galleryItems[idx];
      setIsVideoPlaying(item?.kind === 'video');
    },
    [galleryItems, width, setIsVideoPlaying]
  );

  if (!gallery || galleryItems.length === 0) return null;

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={[tw`flex-1 bg-black`, { width, height: windowHeight }]}>
        <Pressable
          onPress={handleClose}
          style={tw`absolute right-4 top-12 z-20 p-2 rounded-full bg-slate-100/70`}
        >
          <XIcon style={tw`h-8 w-8`} />
        </Pressable>

        {galleryItems.length > 1 && (
          <View style={tw`absolute top-14 left-0 right-0 z-10 items-center`}>
            <Text
              style={withFontFamily(
                tw`text-white/90 text-sm bg-black/40 px-3 py-1 rounded-full`,
                theme?.fontFamily
              )}
            >
              {pageIndex + 1} / {galleryItems.length}
            </Text>
          </View>
        )}

        <FlatList
          ref={listRef}
          data={galleryItems}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, i) => `${item.uri}-${i}`}
          initialScrollIndex={Math.min(initialIndex, galleryItems.length - 1)}
          extraData={pageIndex}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onMomentumScrollEnd={onMomentumScrollEnd}
          onScrollToIndexFailed={({ index }) => {
            setTimeout(() => {
              listRef.current?.scrollToIndex({ index, animated: false });
            }, 100);
          }}
          renderItem={({ item, index }) => (
            <ViewerPage
              item={item}
              width={width}
              height={windowHeight}
              isActive={index === pageIndex}
              autoPlayVideo={index === initialIndex && item.kind === 'video'}
            />
          )}
        />
      </View>
    </Modal>
  );
};

const ViewerPage: React.FC<{
  item: MessageMediaItem;
  width: number;
  height: number;
  isActive: boolean;
  /** Only true for the item the user tapped — not other pages in the album */
  autoPlayVideo: boolean;
}> = ({ item, width, height, isActive, autoPlayVideo }) => {
  const { theme } = useChatContext();
  const videoRef = useRef<VideoRef>(null);
  const [loading, setLoading] = useState(item.kind === 'video');
  const [error, setError] = useState(false);

  const shouldPlayVideo = item.kind === 'video' && isActive && autoPlayVideo;

  if (item.kind === 'image') {
    return (
      <View style={{ width, height, justifyContent: 'center' }}>
        <Image
          source={{ uri: item.uri }}
          style={{ width, height }}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View
      style={{
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
      }}
    >
      <Video
        source={{ uri: item.uri }}
        ref={videoRef}
        controls
        paused={!shouldPlayVideo}
        shutterColor="transparent"
        playInBackground={false}
        playWhenInactive={false}
        style={{
          width: width - 32,
          height: height * 0.55,
          backgroundColor: '#000',
        }}
        resizeMode="contain"
        onLoadStart={() => {
          setLoading(true);
          setError(false);
        }}
        onLoad={() => setLoading(false)}
        onBuffer={({ isBuffering }) => setLoading(isBuffering)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
      {loading && (
        <View
          style={tw`absolute inset-0 items-center justify-center`}
          pointerEvents="none"
        >
          <LoadingIcon style={tw.style('h-14 w-14')} spinning />
        </View>
      )}
      {error && (
        <View style={tw`absolute inset-0 items-center justify-center px-6`}>
          <Text
            style={withFontFamily(
              tw`text-white font-semibold`,
              theme?.fontFamily
            )}
          >
            Failed to load video
          </Text>
        </View>
      )}
    </View>
  );
};

export default React.memo(MediaViewer);
