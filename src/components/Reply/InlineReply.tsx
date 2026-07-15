import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import tw from 'twrnc';
import type { MessageReply, ReplyStyleOverrides } from '../../types';
import { withFontFamily } from '../../utils/theme';

interface InlineReplyProps {
  reply: MessageReply;
  fontFamily?: string;
  replyStyle?: ReplyStyleOverrides;
  backgroundColor: string;
  senderNameColor: string;
  previewTextColor: string;
  descriptionColor?: string;
  thumbnailSize?: number;
  defaultSenderName?: string;
  onPress?: () => void;
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
  backgroundColor,
  senderNameColor,
  previewTextColor,
  descriptionColor,
  thumbnailSize = 40,
  defaultSenderName = 'Reply',
  onPress,
}) => {
  const icon = iconFor(reply.mediaKind);
  const preview = previewFor(reply);
  const showThumb = !!reply.thumbnailUri;

  const content = (
    <View
      style={[
        tw`my-2 rounded-md overflow-hidden`,
        { backgroundColor, minHeight: 48 },
        replyStyle?.inlineContainer,
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
            {reply.senderName || defaultSenderName}
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
          {reply.description ? (
            <Text
              numberOfLines={2}
              style={withFontFamily(
                [
                  tw`text-[11.5px] mt-0.5`,
                  { color: descriptionColor ?? previewTextColor },
                  replyStyle?.description,
                ],
                fontFamily
              )}
            >
              {reply.description}
            </Text>
          ) : null}
        </View>

        {showThumb && (
          <Image
            source={{ uri: reply.thumbnailUri }}
            style={[
              tw`ml-2`,
              {
                width: thumbnailSize,
                height: thumbnailSize,
                borderRadius: 4,
              },
              replyStyle?.thumbnail,
            ]}
            resizeMode="cover"
          />
        )}
      </View>
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress} hitSlop={4}>
      {content}
    </Pressable>
  );
};
