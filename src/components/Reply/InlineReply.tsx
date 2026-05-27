import React from 'react';
import { Image, Text, View } from 'react-native';
import tw from 'twrnc';
import type { MessageReply, ReplyStyleOverrides } from '../../types';
import { withFontFamily } from '../../utils/theme';

interface InlineReplyProps {
  reply: MessageReply;
  isCurrentUser: boolean;
  /** Whether this is the first bubble in a sequence — controls top-corner radii. */
  isFirstInSequence?: boolean;
  fontFamily?: string;
  replyStyle?: ReplyStyleOverrides;
  /** Background tint for the chip itself. */
  backgroundColor: string;
  /** Sender name color. */
  senderNameColor: string;
  /** Preview text color. */
  previewTextColor: string;
}

const previewFor = (reply: MessageReply): string => {
  if (reply.preview) return reply.preview;
  switch (reply.mediaKind) {
    case 'image':
      return 'Photo';
    case 'video':
      return 'Video';
    case 'audio':
      return 'Audio message';
    case 'file':
      return 'File';
    default:
      return 'Message';
  }
};

const iconFor = (kind: MessageReply['mediaKind']): string | null => {
  switch (kind) {
    case 'image':
      return '📷';
    case 'video':
      return '🎥';
    case 'audio':
      return '🎤';
    case 'file':
      return '📎';
    default:
      return null;
  }
};

const BUBBLE_RADIUS = 8;

export const InlineReply: React.FC<InlineReplyProps> = ({
  reply,
  isCurrentUser,
  isFirstInSequence,
  fontFamily,
  replyStyle,
  backgroundColor,
  senderNameColor,
  previewTextColor,
}) => {
  const icon = iconFor(reply.mediaKind);
  const preview = previewFor(reply);
  const showThumb = !!reply.thumbnailUri;

  const topLeftRadius =
    isFirstInSequence && !isCurrentUser ? 0 : BUBBLE_RADIUS;
  const topRightRadius =
    isFirstInSequence && isCurrentUser ? 0 : BUBBLE_RADIUS;

  return (
    <View
      style={[
        tw`flex-row overflow-hidden`,
        {
          backgroundColor,
          minHeight: 48,
          marginLeft: -8,
          marginRight: -8,
          marginTop: -2,
          marginBottom: 4,
          borderTopLeftRadius: topLeftRadius,
          borderTopRightRadius: topRightRadius,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
        },
        replyStyle?.container,
      ]}
    >
      <View style={tw`flex-1 flex-row items-center px-3 py-2`}>
        <View style={tw`flex-1`}>
          <Text
            numberOfLines={1}
            style={withFontFamily(
              [
                tw`text-[13px] font-semibold`,
                { color: senderNameColor },
                replyStyle?.senderName,
              ],
              fontFamily
            )}
          >
            {reply.senderName || 'Reply'}
          </Text>
          <Text
            numberOfLines={2}
            style={withFontFamily(
              [
                tw`text-[12.5px] mt-0.5`,
                { color: previewTextColor },
                replyStyle?.previewText,
              ],
              fontFamily
            )}
          >
            {icon && !reply.preview ? `${icon} ${preview}` : preview}
          </Text>
        </View>

        {showThumb && (
          <Image
            source={{ uri: reply.thumbnailUri }}
            style={[
              tw`ml-2`,
              { width: 40, height: 40, borderRadius: 4 },
              replyStyle?.thumbnail,
            ]}
            resizeMode="cover"
          />
        )}
      </View>
    </View>
  );
};
