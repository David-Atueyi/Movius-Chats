import { Image, Text, View } from 'react-native';
import tw from 'twrnc';
import { ArrowBack2RoundedIcon } from '../../assets/Icons/ArrowBack2RoundedIcon';
import { useChatContext } from '../../context/ChatContext';
import { withFontFamily } from '../../utils/theme';

export interface TypingUser {
  id: string;
  avatar: string;
  name: string;
}

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
  currentUserId: string;
}

export const TypingIndicator = ({
  typingUsers,
  currentUserId,
}: TypingIndicatorProps) => {
  const { theme, showAvatars, renderCustomTyping, showBubbleTail, typingText } =
    useChatContext();

  const otherTypingUsers = typingUsers.filter(
    (user) => user.id !== currentUserId
  );

  if (!otherTypingUsers.length) return null;

  const displayedUsers = otherTypingUsers.slice(0, 2);
  const additionalUsers = otherTypingUsers.length - 2;

  // Number of visible circles (up to 2 user avatars + optional "+N")
  const numCircles = showAvatars
    ? displayedUsers.length + (additionalUsers > 0 ? 1 : 0)
    : 0;

  // Width of avatar group: first is 24px, each extra adds 14px (24 - 10px overlap)
  const avatarGroupW = numCircles > 0 ? 24 + Math.max(0, numCircles - 1) * 14 : 0;

  // marginLeft = avatarGroupW + 12 keeps the same 4px visual gap as regular
  // received chat bubbles (px-2 = 8px padding + 4px gap). For 1 avatar this
  // equals exactly 36px = ml-9, matching ChatBubble.tsx perfectly.
  const bubbleMarginLeft = numCircles > 0 ? avatarGroupW + 12 : 8;

  // Avatar group left from content area (inside px-2 padding = 8px)
  const avatarLeft = -(avatarGroupW + 12);

  return (
    <View
      style={[
        tw`px-2 my-1 bg-white rounded-tl-none rounded-lg relative max-w-[75%] self-start`,
        { marginLeft: bubbleMarginLeft },
        theme?.bubbleStyle?.typingContainerStyle,
      ]}
    >
      {showAvatars && numCircles > 0 && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: avatarLeft,
            flexDirection: 'row',
          }}
        >
          {displayedUsers.map((user, index) => (
            <View
              key={user.id}
              style={[
                tw`bg-gray-400 w-6 h-6 rounded-full items-center`,
                {
                  marginLeft: index > 0 ? -10 : 0,
                  zIndex: displayedUsers.length + index,
                },
              ]}
            >
              {user.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  style={[
                    tw`w-full h-full object-cover rounded-full`,
                    theme?.bubbleStyle?.avatarImageStyle,
                  ]}
                />
              ) : (
                <Text
                  style={withFontFamily(
                    [
                      tw`text-sm text-black font-semibold capitalize rounded-full bg-zinc-300 w-full h-full text-center pt-0.5`,
                      theme?.bubbleStyle?.avatarTextStyle,
                    ],
                    theme?.fontFamily
                  )}
                >
                  {user.name?.charAt(0)}
                </Text>
              )}
            </View>
          ))}
          {additionalUsers > 0 && (
            <View
              style={[
                tw`bg-gray-400 w-6 h-6 rounded-full items-center justify-center`,
                { marginLeft: -10, zIndex: 3 },
                { ...theme?.bubbleStyle?.additionalTypingUsersContainerStyle },
              ]}
            >
              <Text
                style={withFontFamily(
                  [
                    tw`text-white text-xs font-semibold`,
                    theme?.bubbleStyle?.additionalTypingUsersTextStyle,
                  ],
                  theme?.fontFamily
                )}
              >
                +{additionalUsers}
              </Text>
            </View>
          )}
        </View>
      )}

      {showBubbleTail && (
        <ArrowBack2RoundedIcon
          style={tw.style('absolute -top-[3px] w-6 h-6 rotate-180 -left-3.5 mt-[1.5px]')}
          color={theme?.colors?.receivedMessageTailColor || 'white'}
        />
      )}

      {renderCustomTyping ? (
        renderCustomTyping()
      ) : (
        <View style={tw`flex-row items-center py-3 px-2 justify-center`}>
          <Text
            style={withFontFamily(
              [tw`text-gray-600`, theme?.bubbleStyle?.typingTextStyle],
              theme?.fontFamily
            )}
          >
            {typingText ?? 'Typing...'}
          </Text>
        </View>
      )}
    </View>
  );
};
