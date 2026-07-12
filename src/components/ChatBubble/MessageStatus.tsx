import React from 'react';
import { Text, View } from 'react-native';
import tw from 'twrnc';
import { CheckAllIcon } from '../../assets/Icons/CheckAllIcon';
import { CheckIcon } from '../../assets/Icons/CheckIcon';
import { useChatContext } from '../../context/ChatContext';
import {
  getMediaTimestampColor,
  getMediaTimestampContainerStyle,
  getMessageTimestampColor,
} from '../../utils/bubbleTheme';
import { withFontFamily } from '../../utils/theme';
import { MessageStatusProps } from './types';
import { ClockIcon } from '../../assets/Icons/ClockIcon';
import { FailedIcon } from '../../assets/Icons/FailedIcon';

const MessageStatus: React.FC<MessageStatusProps> = ({
  time,
  status,
  isCurrentUser,
  hasText,
  hasAudio,
  hasGalleryMedia,
  hasFileAttachments,
  edited,
}) => {
  const { theme, showMessageStatus, editedLabel, editedTextStyle } =
    useChatContext();
  const galleryOnlyOverlay = hasGalleryMedia && !hasText && !hasAudio;
  const mediaOverlay =
    (hasGalleryMedia || hasFileAttachments) && !hasText && !hasAudio;

  const timestampColor = galleryOnlyOverlay
    ? '#ffffff'
    : mediaOverlay
      ? getMediaTimestampColor(theme, isCurrentUser)
      : getMessageTimestampColor(theme, isCurrentUser);

  const editedColor =
    galleryOnlyOverlay || mediaOverlay
      ? 'rgba(255,255,255,0.85)'
      : timestampColor;

  return (
    <>
      {showMessageStatus && (
        <View
          style={[
            tw`flex-row items-center`,
            hasText
              ? tw`justify-end pb-1 ml-4`
              : hasAudio
                ? tw`absolute right-3 bottom-2`
                : mediaOverlay
                  ? [
                      tw`absolute right-3 bottom-4`,
                      getMediaTimestampContainerStyle(theme, isCurrentUser),
                    ]
                  : [
                      tw`absolute right-3 bottom-4`,
                      getMediaTimestampContainerStyle(theme, isCurrentUser),
                    ],
          ]}
        >
          {edited && (
            <Text
              style={withFontFamily(
                [
                  tw`text-[11px] mr-1.5`,
                  {
                    fontStyle: 'italic',
                    color: editedColor,
                    opacity: 0.85,
                  },
                  theme?.messageStyle?.editedTextStyle,
                  editedTextStyle,
                ],
                theme?.fontFamily
              )}
            >
              {editedLabel ?? 'edited'}
            </Text>
          )}
          <Text
            style={withFontFamily(
              [tw`text-xs`, { color: timestampColor }],
              theme?.fontFamily
            )}
          >
            {time}
          </Text>
          {isCurrentUser && (
            <View style={tw`ml-1 flex-row items-center`}>
              {status === 'sending' && (
                <ClockIcon
                  style={tw.style('h-4 w-4', { opacity: 0.8 })}
                  fill={theme?.colors?.sendingIconColor || '#6B7280'}
                />
              )}
              {status === 'failed' && (
                <FailedIcon
                  style={tw.style('h-4 w-4')}
                  fill={theme?.colors?.failedIconColor || '#EF4444'}
                />
              )}
              {status === 'sent' && (
                <CheckIcon
                  style={tw.style('h-4 w-4', { opacity: 0.7 })}
                  fill={theme?.colors?.sentIconColor || '#6B7280'}
                />
              )}
              {status === 'delivered' && (
                <CheckAllIcon
                  style={tw.style('h-4 w-4', { opacity: 0.7 })}
                  fill={theme?.colors?.deliveredIconColor || '#6B7280'}
                />
              )}
              {status === 'read' && (
                <CheckAllIcon
                  style={tw.style('h-4 w-4', { opacity: 0.9 })}
                  fill={theme?.colors?.readIconColor || '#3B82F6'}
                />
              )}
            </View>
          )}
        </View>
      )}
    </>
  );
};

export default React.memo(MessageStatus);
