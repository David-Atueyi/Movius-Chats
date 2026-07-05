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
import {
  getInlineReplyBackground,
  getInlineReplyPreviewColor,
  getInlineReplySenderColor,
  mergeReplyUI,
} from '../../utils/replyTheme';
import { collectMediaItems } from '../../utils/messageMedia';
import { getFontFamilyStyle, withFontFamily } from '../../utils/theme';
import { InlineReply } from '../Reply/InlineReply';
import { MediaGrid } from './MediaGrid';
import { MessageContentProps } from './types';

const MessageContent: React.FC<MessageContentProps> = ({
  message,
  onGalleryOpen,
  isVideoPlaying,
  isCurrentUser,
  onLongPress,
}) => {
  const {
    theme,
    showMessageStatus,
    onFileAttachmentPress,
    replyUI,
    replyStyle,
    renderInlineReply,
    selectionMode,
    toggleSelection,
  } = useChatContext();

  const resolvedReplyUI = mergeReplyUI(theme, replyUI);
  const mergedReplyStyle = { ...theme?.reply?.styles, ...replyStyle };

  const mediaItems = useMemo(() => collectMediaItems(message), [message]);

  // Inline reply chip
  const replyChip = (() => {
    if (!message.replyTo) return null;
    if (renderInlineReply) {
      return renderInlineReply(message.replyTo, isCurrentUser);
    }
    return (
      <InlineReply
        reply={message.replyTo}
        fontFamily={theme?.fontFamily}
        replyStyle={mergedReplyStyle}
        backgroundColor={getInlineReplyBackground(
          theme,
          isCurrentUser,
          resolvedReplyUI
        )}
        senderNameColor={getInlineReplySenderColor(
          theme,
          isCurrentUser,
          resolvedReplyUI
        )}
        previewTextColor={getInlineReplyPreviewColor(
          theme,
          isCurrentUser,
          resolvedReplyUI
        )}
        thumbnailSize={resolvedReplyUI.thumbnailSize}
        defaultSenderName={resolvedReplyUI.defaultReplySenderName}
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
          messageId={message.id}
          isCurrentUser={isCurrentUser}
          senderAvatar={message.senderAvatar}
          senderName={message.senderName}
          isVideoPlaying={isVideoPlaying as boolean}
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
