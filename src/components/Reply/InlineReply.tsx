import React from 'react';
import { Image, Text, View } from 'react-native';
import tw from 'twrnc';
import type { MessageReply, ReplyStyleOverrides } from '../../types';
import { withFontFamily } from '../../utils/theme';

interface InlineReplyProps {
  reply: MessageReply;
  isCurrentUser: boolean;
  fontFamily?: string;
  replyStyle?: ReplyStyleOverrides;
  /** Vertical accent bar color (defaults to a lighter shade of the bubble). */
  accentColor: string;
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

export const InlineReply: React.FC<InlineReplyProps> = ({
  reply,
  fontFamily,
  replyStyle,
  accentColor,
  backgroundColor,
  senderNameColor,
  previewTextColor,
}) => {
  const icon = iconFor(reply.mediaKind);
  const preview = previewFor(reply);
  const showThumb = !!reply.thumbnailUri;

  return (
    <View
      style={[
        tw`flex-row mt-1.5 mb-0.5 rounded-md overflow-hidden`,
        { backgroundColor, minHeight: 44 },
        replyStyle?.container,
      ]}
    >
      <View
        style={[
          tw`w-[3px] self-stretch`,
          { backgroundColor: accentColor },
          replyStyle?.replyBar,
        ]}
      />

      <View style={tw`flex-1 flex-row items-center pl-2 pr-2 py-1.5`}>
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
              { width: 36, height: 36, borderRadius: 4 },
              replyStyle?.thumbnail,
            ]}
            resizeMode="cover"
          />
        )}
      </View>
    </View>
  );
};
