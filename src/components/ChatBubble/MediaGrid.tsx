import React from 'react';
import {
  Image,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import tw from 'twrnc';
import { LoadingIcon } from '../../assets/Icons/LoadingIcon';
import { PlayIcon } from '../../assets/Icons/PlayIcon';
import { useChatContext } from '../../context/ChatContext';
import type { MessageMediaItem } from '../../types';
import { withFontFamily } from '../../utils/theme';

const GRID_WIDTH = 240;
const SINGLE_HEIGHT = 320;
const ROW_GAP = 2;

// All multi-item layouts share this total height to match the single-item bubble
const MULTI_HEIGHT = SINGLE_HEIGHT;
const TWO_ROW_H = MULTI_HEIGHT;
const THREE_TOP_H = Math.round(MULTI_HEIGHT * 0.55);
const THREE_BOT_H = MULTI_HEIGHT - THREE_TOP_H - ROW_GAP;
const FOUR_CELL_H = Math.round((MULTI_HEIGHT - ROW_GAP) / 2);

interface MediaGridProps {
  items: MessageMediaItem[];
  onOpenGallery: (items: MessageMediaItem[], index: number) => void;
}

const VideoThumbCell: React.FC<{
  uri: string;
  cellStyle: object;
  roundedStyle: object;
}> = ({ uri, cellStyle, roundedStyle }) => {
  const { theme, CustomPlayIcon } = useChatContext();
  const videoRef = React.useRef<VideoRef>(null);
  const [duration, setDuration] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  return (
    <View style={[cellStyle, roundedStyle]} pointerEvents="none">
      <Video
        source={{ uri }}
        ref={videoRef}
        paused
        muted
        playInBackground={false}
        playWhenInactive={false}
        pointerEvents="none"
        style={[roundedStyle, { width: '100%', height: '100%' }]}
        resizeMode="cover"
        onLoadStart={() => {
          setLoading(true);
          setError(false);
        }}
        onLoad={(d) => {
          setDuration(d.duration);
          setLoading(false);
        }}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
      {loading && (
        <View
          style={[
            tw`absolute inset-0 items-center justify-center bg-black/40`,
            roundedStyle,
          ]}
        >
          <LoadingIcon style={tw.style('h-8 w-8')} spinning />
        </View>
      )}
      {!loading && !error && (
        <>
          <View style={tw`pointer-events-none absolute inset-0 items-center justify-center`}>
            {CustomPlayIcon ? (
              <CustomPlayIcon />
            ) : (
              <PlayIcon
                style={tw.style('h-10 w-10')}
                color={theme?.colors?.videoPlayIconColor || 'white'}
              />
            )}
          </View>
          <View
            style={tw`pointer-events-none absolute bottom-1 left-1 bg-black/50 px-1.5 py-0.5 rounded`}
          >
            <Text style={tw`text-white text-[10px] font-semibold`}>
              {formatShortDuration(duration)}
            </Text>
          </View>
        </>
      )}
      {error && (
        <View
          style={[
            tw`absolute inset-0 items-center justify-center bg-red-500/50`,
            roundedStyle,
          ]}
        >
          <Text style={withFontFamily(tw`text-white text-xs`, theme?.fontFamily)}>
            Video
          </Text>
        </View>
      )}
    </View>
  );
};

function formatShortDuration(sec: number): string {
  if (!sec || Number.isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export const MediaGrid: React.FC<MediaGridProps> = ({
  items,
  onOpenGallery,
}) => {
  const { width: windowW } = useWindowDimensions();
  const maxW = Math.min(GRID_WIDTH, windowW * 0.72);

  if (items.length === 0) return null;

  const roundedSmall = { borderRadius: 6, overflow: 'hidden' as const };

  if (items.length === 1) {
    const item = items[0]!;
    return (
      <Pressable
        onPress={() => onOpenGallery(items, 0)}
        style={{ width: maxW, height: SINGLE_HEIGHT, marginVertical: 8 }}
      >
        {item.kind === 'image' ? (
          <Image
            source={{ uri: item.uri }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 8,
            }}
            resizeMode="cover"
          />
        ) : (
          <VideoThumbCell
            uri={item.uri}
            cellStyle={{ width: maxW, height: SINGLE_HEIGHT }}
            roundedStyle={{ borderRadius: 8 }}
          />
        )}
      </Pressable>
    );
  }

  if (items.length === 2) {
    const half = (maxW - ROW_GAP) / 2;
    return (
      <View
        style={{
          width: maxW,
          height: TWO_ROW_H,
          flexDirection: 'row',
          gap: ROW_GAP,
          marginVertical: 8,
        }}
      >
        {items.slice(0, 2).map((item, idx) => (
          <Pressable
            key={`${item.uri}-${idx}`}
            onPress={() => onOpenGallery(items, idx)}
            style={{ width: half, height: TWO_ROW_H }}
          >
            {item.kind === 'image' ? (
              <Image
                source={{ uri: item.uri }}
                style={[roundedSmall, { width: '100%', height: '100%' }]}
                resizeMode="cover"
              />
            ) : (
              <VideoThumbCell
                uri={item.uri}
                cellStyle={{ width: half, height: TWO_ROW_H }}
                roundedStyle={roundedSmall}
              />
            )}
          </Pressable>
        ))}
      </View>
    );
  }

  if (items.length === 3) {
    const top = items[0]!;
    const left = items[1]!;
    const right = items[2]!;
    const bottomHalf = (maxW - ROW_GAP) / 2;
    return (
      <View style={{ width: maxW, height: MULTI_HEIGHT, marginVertical: 8, gap: ROW_GAP }}>
        <Pressable
          onPress={() => onOpenGallery(items, 0)}
          style={{ width: maxW, height: THREE_TOP_H }}
        >
          {top.kind === 'image' ? (
            <Image
              source={{ uri: top.uri }}
              style={[roundedSmall, { width: '100%', height: '100%' }]}
              resizeMode="cover"
            />
          ) : (
            <VideoThumbCell
              uri={top.uri}
              cellStyle={{ width: maxW, height: THREE_TOP_H }}
              roundedStyle={roundedSmall}
            />
          )}
        </Pressable>
        <View style={{ flexDirection: 'row', gap: ROW_GAP, height: THREE_BOT_H }}>
          <Pressable
            key={`${left.uri}-1`}
            onPress={() => onOpenGallery(items, 1)}
            style={{ width: bottomHalf, height: THREE_BOT_H }}
          >
            {left.kind === 'image' ? (
              <Image
                source={{ uri: left.uri }}
                style={[roundedSmall, { width: '100%', height: '100%' }]}
                resizeMode="cover"
              />
            ) : (
              <VideoThumbCell
                uri={left.uri}
                cellStyle={{ width: bottomHalf, height: THREE_BOT_H }}
                roundedStyle={roundedSmall}
              />
            )}
          </Pressable>
          <Pressable
            key={`${right.uri}-2`}
            onPress={() => onOpenGallery(items, 2)}
            style={{ width: bottomHalf, height: THREE_BOT_H }}
          >
            {right.kind === 'image' ? (
              <Image
                source={{ uri: right.uri }}
                style={[roundedSmall, { width: '100%', height: '100%' }]}
                resizeMode="cover"
              />
            ) : (
              <VideoThumbCell
                uri={right.uri}
                cellStyle={{ width: bottomHalf, height: THREE_BOT_H }}
                roundedStyle={roundedSmall}
              />
            )}
          </Pressable>
        </View>
      </View>
    );
  }

  const cellW = (maxW - ROW_GAP) / 2;
  const extra = items.length - 4;
  const display = items.slice(0, 4);

  return (
    <View
      style={{
        width: maxW,
        height: MULTI_HEIGHT,
        flexWrap: 'wrap',
        flexDirection: 'row',
        gap: ROW_GAP,
        marginVertical: 8,
      }}
    >
      {display.map((cell, idx) => (
        <Pressable
          key={`${cell.uri}-${idx}`}
          onPress={() => onOpenGallery(items, idx)}
          style={{
            width: cellW,
            height: FOUR_CELL_H,
            position: 'relative',
          }}
        >
          {cell.kind === 'image' ? (
            <Image
              source={{ uri: cell.uri }}
              style={[roundedSmall, { width: '100%', height: '100%' }]}
              resizeMode="cover"
            />
          ) : (
            <VideoThumbCell
              uri={cell.uri}
              cellStyle={{ width: cellW, height: FOUR_CELL_H }}
              roundedStyle={roundedSmall}
            />
          )}
          {idx === 3 && extra > 0 && (
            <View
              style={tw`absolute inset-0 bg-black/55 items-center justify-center`}
            >
              <Text style={tw`text-white text-lg font-bold`}>+{extra}</Text>
            </View>
          )}
        </Pressable>
      ))}
    </View>
  );
};
