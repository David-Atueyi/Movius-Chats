import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { ClosePreviewIcon } from '../../assets/Icons/ClosePreviewIcon';
import tw from 'twrnc';
import type { Message, ReplyStyleOverrides } from '../../types';
import { withFontFamily } from '../../utils/theme';

interface ReplyPreviewProps {
  message: Message;
  onCancel: () => void;
  previewMaxLines?: number;
  replyStyle?: ReplyStyleOverrides;
  fontFamily?: string;
  accentColor?: string;
  closeIconColor?: string;
  backgroundColor?: string;
  senderNameColor?: string;
  previewTextColor?: string;
}

interface PreviewParts {
  text: string;
  thumbnail?: string;
}

const buildPreview = (message: Message): PreviewParts => {
  const firstMedia = message.mediaItems?.[0];
  if (message.text) {
    return {
      text: message.text,
      thumbnail:
        firstMedia?.kind === 'image' || firstMedia?.kind === 'video'
          ? firstMedia.uri
          : undefined,
    };
  }
  if (firstMedia?.kind === 'audio') {
    return { text: '🎤 Audio message' };
  }
  if (firstMedia?.kind === 'video') {
    return { text: '🎥 Video', thumbnail: firstMedia.uri };
  }
  if (firstMedia?.kind === 'image') {
    return {
      text: '📷 Photo',
      thumbnail: firstMedia?.uri,
    };
  }
  if ((message.fileAttachments ?? []).length) {
    return { text: `📎 ${message.fileAttachments?.[0]?.name ?? 'File'}` };
  }
  return { text: 'Message' };
};

export const ReplyPreview: React.FC<ReplyPreviewProps> = ({
  message,
  onCancel,
  previewMaxLines = 1,
  replyStyle,
  fontFamily,
  accentColor = '#22c55e',
  closeIconColor = 'rgba(0,0,0,0.5)',
  backgroundColor = '#FFFFFF',
  senderNameColor,
  previewTextColor,
}) => {
  const senderName = message.senderName || 'You';
  const { text: preview, thumbnail } = buildPreview(message);

  return (
    <View
      style={[
        tw`flex-row items-stretch mx-2 mb-1 rounded-xl overflow-hidden`,
        {
          backgroundColor,
          minHeight: 56,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 1 },
          elevation: 1,
        },
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

      <View style={tw`flex-1 flex-row items-center pl-3 pr-2 py-2`}>
        <View style={tw`flex-1 mr-2`}>
          <Text
            numberOfLines={1}
            style={withFontFamily(
              [
                tw`text-[14px] font-semibold`,
                { color: senderNameColor ?? accentColor },
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
                { color: previewTextColor ?? 'rgba(0,0,0,0.55)' },
                replyStyle?.previewText,
              ],
              fontFamily
            )}
          >
            {preview}
          </Text>
        </View>

        {thumbnail && (
          <Image
            source={{ uri: thumbnail }}
            style={[
              { width: 36, height: 36, borderRadius: 4, marginRight: 6 },
              replyStyle?.thumbnail,
            ]}
            resizeMode="cover"
          />
        )}

        <Pressable
          onPress={onCancel}
          hitSlop={10}
          style={tw`w-7 h-7 items-center justify-center`}
        >
          <ClosePreviewIcon color={closeIconColor} />
        </Pressable>
      </View>
    </View>
  );
};
