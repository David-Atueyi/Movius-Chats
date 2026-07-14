import React from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import ParsedText from 'react-native-parsed-text';
import tw from 'twrnc';
import { useChatContext } from '../../context/ChatContext';
import {
  getFileAttachmentBackground,
  getFileAttachmentSubtitleColor,
  getFileAttachmentTextColor,
  getMediaTimestampColor,
  getMediaTimestampContainerStyle,
  getMessageTextColor,
} from '../../utils/bubbleTheme';
import { isGalleryMediaItem } from '../../utils/messageMedia';
import {
  getInlineReplyBackground,
  getInlineReplyPreviewColor,
  getInlineReplySenderColor,
  mergeReplyUI,
} from '../../utils/replyTheme';
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
  onLongPress,
  galleryMediaItems,
  primaryAudio,
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

  const gridItems =
    galleryMediaItems ?? (message.mediaItems ?? []).filter(isGalleryMediaItem);

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

      {gridItems.length > 0 && (
        <MediaGrid
          items={gridItems}
          onOpenGallery={onGalleryOpen}
          onLongPress={onLongPress}
          messageId={message.id}
          isCurrentUser={isCurrentUser}
          senderAvatar={message.senderAvatar}
          senderName={message.senderName}
          isVideoPlaying={isVideoPlaying as boolean}
        />
      )}

      {/* ✅ The one audio that attaches to this bubble — renders right under
          the media grid, same position the legacy `audio` field used to use */}
      {primaryAudio && (
        <View style={tw`my-1`}>
          <AudioPlayer
            audioUrl={primaryAudio.uri}
            audioId={message.id}
            isVideoPlaying={isVideoPlaying as boolean}
            isCurrentUser={isCurrentUser}
            senderAvatar={message.senderAvatar}
            senderName={message.senderName}
            reserveStatusSpace={false}
            onLongPress={onLongPress}
          />
        </View>
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
            tw`my-1.5 py-2 px-3 rounded-lg`,
            (galleryMediaItems?.length ?? 0) > 0
              ? { width: '100%' }
              : { maxWidth: 220 },
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
                  flexShrink: 1,
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
          {!message.text && (
            <View
              style={[
                tw`absolute right-2 bottom-2 px-2 py-1 rounded-md`,
                getMediaTimestampContainerStyle(theme, isCurrentUser),
              ]}
            >
              <Text
                style={withFontFamily(
                  [
                    tw`text-xs`,
                    {
                      color: getMediaTimestampColor(theme, isCurrentUser),
                    },
                  ],
                  theme?.fontFamily
                )}
              >
                {message.time}
              </Text>
            </View>
          )}
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
