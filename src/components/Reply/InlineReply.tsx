import React from 'react';
import { Text, View } from 'react-native';
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
      return '📷 Photo';
    case 'video':
      return '🎥 Video';
    case 'audio':
      return '🎤 Audio message';
    case 'file':
      return '📎 File';
    default:
      return 'Message';
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
  return (
    <View
      style={[
        tw`flex-row mt-1 mb-1 rounded-md overflow-hidden`,
        { backgroundColor },
        replyStyle?.container,
      ]}
    >
      <View
        style={[
          tw`w-1 self-stretch`,
          { backgroundColor: accentColor },
          replyStyle?.replyBar,
        ]}
      />
      <View style={tw`px-2 py-1.5 flex-1`}>
        <Text
          numberOfLines={1}
          style={withFontFamily(
            [
              tw`text-[12px] font-semibold`,
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
              tw`text-[12px] mt-0.5`,
              { color: previewTextColor },
              replyStyle?.previewText,
            ],
            fontFamily
          )}
        >
          {previewFor(reply)}
        </Text>
      </View>
    </View>
  );
};
