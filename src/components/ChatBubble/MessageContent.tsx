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
import { MediaGrid } from './MediaGrid';
import { MessageContentProps } from './types';

const MessageContent: React.FC<MessageContentProps> = ({
  message,
  onGalleryOpen,
  isVideoPlaying,
  isCurrentUser,
}) => {
  const { theme, showMessageStatus, onFileAttachmentPress } = useChatContext();

  const mediaItems = useMemo(() => collectMediaItems(message), [message]);

  return (
    <View>
      {mediaItems.length > 0 && (
        <MediaGrid items={mediaItems} onOpenGallery={onGalleryOpen} />
      )}

      {(message.fileAttachments ?? []).map((file, idx) => (
        <Pressable
          key={`${file.uri}-${idx}`}
          onPress={() => {
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
        <View style={tw`my-2`}>
          <AudioPlayer
            audioUrl={message.audio}
            audioId={message.id}
            isVideoPlaying={isVideoPlaying as boolean}
            isCurrentUser={isCurrentUser}
          />
        </View>
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
