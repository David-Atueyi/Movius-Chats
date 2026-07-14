import React from 'react';
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
import MessageStatus from './MessageStatus';
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

  const hasAudioMedia = !!primaryAudio;
  const fileAttachments = message.fileAttachments ?? [];

  // ✅ Only true when file attachments are the ONLY content — this is the
  // case where the timestamp needs to embed inside the last file's own box
  // instead of floating relative to the entire bubble's content stack.
  const isFilesOnly =
    !message.text &&
    !hasAudioMedia &&
    gridItems.length === 0 &&
    fileAttachments.length > 0;

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

      {fileAttachments.map((file, idx) => {
        const isLastFile = idx === fileAttachments.length - 1;
        // ✅ Only reserve space + embed the status pill on the last file
        // box, and only when files are the sole content of this bubble
        const embedStatusHere = isFilesOnly && isLastFile;

        return (
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
              embedStatusHere ? tw`pb-6` : null, // ✅ room for the embedded pill
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

            {/* ✅ Positioned relative to THIS Pressable, not the whole
                bubble — RN views are position:'relative' by default, so
                this absolute child correctly hugs this box's own corner */}
            {embedStatusHere && showMessageStatus && (
              <MessageStatus
                time={message.time}
                edited={message.edited}
                status={isCurrentUser ? message.status : undefined}
                isCurrentUser={isCurrentUser}
                hasText={false}
                hasAudio={false}
                hasGalleryMedia={false}
                hasFileAttachments={true}
              />
            )}
          </Pressable>
        );
      })}

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
