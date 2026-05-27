import React, { useMemo } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import tw from 'twrnc';
import { useChatContext } from '../../context/ChatContext';
import {
  getFileAttachmentBackground,
  getFileAttachmentSubtitleColor,
  getFileAttachmentTextColor,
  getMessageTextColor,
} from '../../utils/bubbleTheme';
import { collectMediaItems } from '../../utils/messageMedia';
import { getFontFamilyStyle, withFontFamily } from '../../utils/theme';
import AudioPlayer from '../AudioPlayer/AudioPlayer';
import { InlineReply } from '../Reply/InlineReply';
import { MediaGrid } from './MediaGrid';
import { MessageContentProps } from './types';

const MessageContent: React.FC<MessageContentProps> = ({
  message,
  onGalleryOpen,
  isVideoPlaying,
  isCurrentUser,
  isFirstInSequence,
  onLongPress,
}) => {
  const {
    theme,
    showMessageStatus,
    onFileAttachmentPress,
    replyStyle,
    renderInlineReply,
    selectionMode,
    toggleSelection,
  } = useChatContext();

  const mediaItems = useMemo(() => collectMediaItems(message), [message]);

  // ── Inline reply chip ────────────────────────────────────────────────────
  const replyChip = (() => {
    if (!message.replyTo) return null;
    if (renderInlineReply) {
      return renderInlineReply(message.replyTo, isCurrentUser);
    }
    const bg = getFileAttachmentBackground(theme, isCurrentUser);
    const senderColor = isCurrentUser
      ? theme?.colors?.sentMessageTextColor || 'rgba(255,255,255,0.95)'
      : theme?.colors?.sentBubbleBackgroundColor ||
        theme?.colors?.sentMessageTailColor ||
        '#22c55e';
    const textColor = isCurrentUser
      ? theme?.colors?.sentMessageTextColor || 'rgba(255,255,255,0.85)'
      : theme?.colors?.receivedMessageTextColor || 'rgba(0,0,0,0.75)';
    return (
      <InlineReply
        reply={message.replyTo}
        isCurrentUser={isCurrentUser}
        isFirstInSequence={isFirstInSequence}
        fontFamily={theme?.fontFamily}
        replyStyle={replyStyle}
        backgroundColor={bg}
        senderNameColor={senderColor}
        previewTextColor={textColor}
      />
    );
  })();

  return (
    <View>
      {replyChip}
      {mediaItems.length > 0 && (
        <MediaGrid
          items={mediaItems}
          onOpenGallery={onGalleryOpen}
          onLongPress={onLongPress}
        />
      )}

      {(message.fileAttachments ?? []).map((file, idx) => (
        <Pressable
          key={`${file.uri}-${idx}`}
          onPress={() => {
            if (selectionMode) {
              toggleSelection(message);
              return;
            }
            if (onFileAttachmentPress) {
              onFileAttachmentPress(file);
            } else {
              Linking.openURL(
                file.uri.startsWith('http') || file.uri.startsWith('file:')
                  ? file.uri
                  : `file://${file.uri}`
              );
            }
          }}
          onLongPress={onLongPress}
          delayLongPress={250}
          style={[
            tw`my-1.5 py-2 px-3 rounded-lg max-w-[220px]`,
            {
              backgroundColor: getFileAttachmentBackground(
                theme,
                isCurrentUser
              ),
            },
            isCurrentUser
              ? theme?.messageStyle?.sentFileAttachmentStyle
              : theme?.messageStyle?.receivedFileAttachmentStyle,
          ]}
        >
          <Text
            style={withFontFamily(
              [
                tw`text-xs font-semibold`,
                {
                  color: getFileAttachmentTextColor(theme, isCurrentUser),
                },
                isCurrentUser
                  ? theme?.messageStyle?.sentFileAttachmentTextStyle
                  : theme?.messageStyle?.receivedFileAttachmentTextStyle,
              ],
              theme?.fontFamily
            )}
            numberOfLines={2}
          >
            📎 {file.name}
          </Text>
          <Text
            style={withFontFamily(
              [
                tw`text-[10px] mt-0.5`,
                {
                  color: getFileAttachmentSubtitleColor(theme, isCurrentUser),
                },
                isCurrentUser
                  ? theme?.messageStyle?.sentFileAttachmentSubtitleStyle
                  : theme?.messageStyle?.receivedFileAttachmentSubtitleStyle,
              ],
              theme?.fontFamily
            )}
          >
            {file.type}
          </Text>
        </Pressable>
      ))}

      {message.audio && (
        <AudioPlayer
          audioUrl={message.audio}
          audioId={message.id}
          isVideoPlaying={isVideoPlaying as boolean}
          isCurrentUser={isCurrentUser}
          senderAvatar={message.senderAvatar}
          senderName={message.senderName}
          reserveStatusSpace={!message.text}
          onLongPress={onLongPress}
        />
      )}

      {message.text && (
        <ParsedText
          style={withFontFamily(
            [
              tw`pt-1`,
              showMessageStatus ? tw`pb-0` : tw`pb-2`,
              { wordBreak: 'break-word', overflowWrap: 'break-word' },
              isCurrentUser
                ? theme?.messageStyle?.sentTextStyle
                : theme?.messageStyle?.receivedTextStyle,
              getMessageTextColor(theme, isCurrentUser)
                ? { color: getMessageTextColor(theme, isCurrentUser) }
                : undefined,
            ],
            theme?.fontFamily
          )}
          parse={[
            {
              type: 'url',
              style: {
                color: 'blue',
                textDecorationLine: 'underline',
                ...getFontFamilyStyle(theme?.fontFamily),
              },
              onPress: (url) =>
                Linking.openURL(
                  url.startsWith('http') ? url : `https://${url}`
                ),
            },
          ]}
          childrenProps={{ allowFontScaling: false }}
        >
          {message.text}
        </ParsedText>
      )}
    </View>
  );
};

export default React.memo(MessageContent);
