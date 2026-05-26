import React, { useRef } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import tw from 'twrnc';
import { ArrowBack2RoundedIcon } from '../../assets/Icons/ArrowBack2RoundedIcon';
import { useChatContext } from '../../context/ChatContext';
import { getBubbleBackgroundColor } from '../../utils/bubbleTheme';
import { collectMediaItems } from '../../utils/messageMedia';
import { withFontFamily } from '../../utils/theme';
import { SwipeableMessage } from '../Reply/SwipeableMessage';
import MessageContent from './MessageContent';
import MessageStatus from './MessageStatus';
import { ChatBubbleProps } from './types';

import type { MessageMediaItem } from '../../types';

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isCurrentUser,
  isFirstInSequence,
  onLongPress,
}) => {
  const {
    theme,
    showAvatars,
    showUserNames,
    showBubbleTail,
    setMediaViewerGallery,
    isVideoPlaying,
    replyProps,
    startReply,
    selectionMode,
    isSelected,
    toggleSelection,
    selectionUI,
  } = useChatContext();

  const bubbleRef = useRef<View>(null);

  const replyEnabled =
    (replyProps?.enableReply ?? true) && !selectionMode;
  const swipeThreshold = replyProps?.swipeThreshold ?? 60;

  const mediaItems = collectMediaItems(message);

  const handleGalleryOpen = (items: MessageMediaItem[], index: number) => {
    if (selectionMode) {
      toggleSelection(message);
      return;
    }
    setMediaViewerGallery(items, index);
  };

  const hasFilesOnly =
    (message.fileAttachments?.length ?? 0) > 0 &&
    mediaItems.length === 0 &&
    !message.text &&
    !message.audio;

  const selected = isSelected(message.id);

  const handleLongPress = () => {
    if (selectionMode) {
      toggleSelection(message);
      return;
    }
    bubbleRef.current?.measureInWindow((x, y, width, height) => {
      onLongPress?.({ x, y, width, height, isCurrentUser });
    });
  };

  const handlePress = () => {
    if (selectionMode) {
      toggleSelection(message);
    }
  };

  const overlayColor = selectionUI?.overlayColor;
  const rowBackgroundColor = selectionUI?.rowBackgroundColor;

  // ── Default the selection overlay to the same hue as the user's bubble ──
  const themePrimary =
    theme?.colors?.sentBubbleBackgroundColor ||
    theme?.colors?.sentMessageTailColor ||
    '#22c55e';
  const resolvedOverlay = overlayColor || addAlpha(themePrimary, 0.28);
  const resolvedRowBg = rowBackgroundColor || addAlpha(themePrimary, 0.12);

  const bubble = (
    <Pressable
      ref={bubbleRef as any}
      onLongPress={handleLongPress}
      onPress={handlePress}
      delayLongPress={250}
      style={[
        tw`px-2 my-1 max-w-[75%] relative`,
        isCurrentUser ? tw`self-end mr-3` : tw`self-start ml-9`,
        isFirstInSequence
          ? isCurrentUser
            ? tw`bg-green-500 rounded-tr-none`
            : tw`bg-white rounded-tl-none`
          : isCurrentUser
            ? tw`bg-green-500`
            : tw`bg-white`,
        {
          borderRadius: 8,
          ...(getBubbleBackgroundColor(theme, isCurrentUser)
            ? {
                backgroundColor: getBubbleBackgroundColor(theme, isCurrentUser),
              }
            : {}),
          ...(isCurrentUser
            ? theme?.bubbleStyle?.sent
            : theme?.bubbleStyle?.received),
        },
      ]}
    >
      {/* Avatar & Sender Name for Group Chat */}
      {!isCurrentUser && isFirstInSequence && showAvatars && (
        <>
          <View
            style={tw`absolute w-6 h-6 rounded-full top-0 -left-9 flex-row items-center`}
          >
            {message.senderAvatar ? (
              <Image
                source={{ uri: message.senderAvatar }}
                style={[
                  tw`w-full h-full rounded-full`,
                  theme?.bubbleStyle?.avatarImageStyle,
                ]}
                resizeMode="cover"
              />
            ) : (
              <Text
                style={withFontFamily(
                  [
                    tw`text-sm text-black font-semibold capitalize rounded-full bg-zinc-300 w-full h-full text-center pt-0.5`,
                    theme?.bubbleStyle?.avatarTextStyle,
                  ],
                  theme?.fontFamily
                )}
              >
                {message.senderName?.charAt(0)}
              </Text>
            )}
          </View>
          {showUserNames && message.senderName && (
            <Text
              style={withFontFamily(
                [
                  tw`text-sm text-black font-semibold mt-1 capitalize`,
                  theme?.bubbleStyle?.userNameStyle,
                ],
                theme?.fontFamily
              )}
            >
              {message.senderName}
            </Text>
          )}
        </>
      )}

      {/* Bubble Tail */}
      {isFirstInSequence && showBubbleTail && (
        <ArrowBack2RoundedIcon
          style={tw.style(
            'absolute  w-6 h-6',
            isCurrentUser
              ? 'rotate-90 -right-3.5 mt-[1.24px] -top-1'
              : 'rotate-180 -left-3.5 mt-[1.5px] -top-[3px]'
          )}
          color={
            isCurrentUser
              ? theme?.colors?.sentMessageTailColor || 'rgba(34, 197, 94, 1)'
              : theme?.colors?.receivedMessageTailColor || 'white'
          }
        />
      )}

      <MessageContent
        message={message}
        isCurrentUser={isCurrentUser}
        isFirstInSequence={isFirstInSequence}
        onGalleryOpen={handleGalleryOpen}
        isVideoPlaying={isVideoPlaying}
      />

      <MessageStatus
        time={message.time}
        edited={message.edited}
        status={isCurrentUser ? message.status : undefined}
        isCurrentUser={isCurrentUser}
        hasText={!!message.text}
        hasAudio={!!message.audio}
        hasGalleryMedia={mediaItems.length > 0 && !message.text}
        hasFileAttachments={hasFilesOnly}
      />

      {selectionMode && selected && (
        <View
          pointerEvents="none"
          style={[
            tw`absolute inset-0`,
            { backgroundColor: resolvedOverlay, borderRadius: 8 },
          ]}
        />
      )}
    </Pressable>
  );

  const wrappedBubble = (
    <SwipeableMessage
      isCurrentUser={isCurrentUser}
      enabled={replyEnabled}
      swipeThreshold={swipeThreshold}
      onReply={() => startReply(message)}
    >
      {bubble}
    </SwipeableMessage>
  );

  // Full-row tinted background while in selection mode (matches reference image 6).
  if (selectionMode && selected) {
    return (
      <View style={{ backgroundColor: resolvedRowBg }}>{wrappedBubble}</View>
    );
  }

  return wrappedBubble;
};

/** Best-effort hex/rgb → rgba(...,alpha) helper. */
function addAlpha(color: string, alpha: number): string {
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    }
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }
  if (color.startsWith('rgb(')) {
    return color.replace('rgb(', 'rgba(').replace(')', `, ${alpha})`);
  }
  return color;
}

export default React.memo(ChatBubble);
