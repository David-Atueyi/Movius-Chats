import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import tw from 'twrnc';
import type { Message, ReplyStyleOverrides } from '../../types';
import { withFontFamily } from '../../utils/theme';

interface ReplyPreviewProps {
  message: Message;
  onCancel: () => void;
  previewMaxLines?: number;
  replyStyle?: ReplyStyleOverrides;
  fontFamily?: string;
  /** Color used for the left vertical accent bar. */
  accentColor?: string;
  /** Color used for the close X icon. */
  closeIconColor?: string;
  /** Background of the preview row. */
  backgroundColor?: string;
  /** Color for the sender name text. */
  senderNameColor?: string;
  /** Color for the preview text. */
  previewTextColor?: string;
}

const buildPreviewText = (message: Message): string => {
  if (message.text) return message.text;
  if (message.audio) return '🎤 Audio message';
  if (message.video || (message.mediaItems ?? []).some((m) => m.kind === 'video')) {
    return '🎥 Video';
  }
  if (message.image || (message.mediaItems ?? []).some((m) => m.kind === 'image')) {
    return '📷 Photo';
  }
  if ((message.fileAttachments ?? []).length) {
    return `📎 ${message.fileAttachments?.[0]?.name ?? 'File'}`;
  }
  return 'Message';
};

export const ReplyPreview: React.FC<ReplyPreviewProps> = ({
  message,
  onCancel,
  previewMaxLines = 2,
  replyStyle,
  fontFamily,
  accentColor = '#22c55e',
  closeIconColor = 'rgba(255,255,255,0.7)',
  backgroundColor = 'rgba(255,255,255,0.06)',
  senderNameColor,
  previewTextColor,
}) => {
  const senderName = message.senderName || 'Replying to';
  const preview = buildPreviewText(message);

  return (
    <View
      style={[
        tw`flex-row items-center px-3 py-2 mx-2 mb-1 rounded-lg`,
        { backgroundColor },
        replyStyle?.container,
      ]}
    >
      <View
        style={[
          tw`w-1 self-stretch rounded-full mr-3`,
          { backgroundColor: accentColor },
          replyStyle?.replyBar,
        ]}
      />
      <View style={tw`flex-1`}>
        <Text
          numberOfLines={1}
          style={withFontFamily(
            [
              tw`text-[13px] font-semibold`,
              {
                color: senderNameColor ?? accentColor,
              },
              replyStyle?.senderName,
            ],
            fontFamily
          )}
        >
          {senderName}
        </Text>
        <Text
          numberOfLines={previewMaxLines}
          style={withFontFamily(
            [
              tw`text-[13px] mt-0.5`,
              {
                color: previewTextColor ?? 'rgba(255,255,255,0.7)',
              },
              replyStyle?.previewText,
            ],
            fontFamily
          )}
        >
          {preview}
        </Text>
      </View>

      <Pressable
        onPress={onCancel}
        hitSlop={10}
        style={tw`w-7 h-7 items-center justify-center`}
      >
        <Svg width={16} height={16} viewBox="0 0 24 24">
          <Line
            x1="18"
            y1="6"
            x2="6"
            y2="18"
            stroke={closeIconColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
          <Line
            x1="6"
            y1="6"
            x2="18"
            y2="18"
            stroke={closeIconColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
        </Svg>
      </Pressable>
    </View>
  );
};
