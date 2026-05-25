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

  return (
    <View style={tw`my-1 max-w-[75%] self-start ml-9 px-2`}>
      {showAvatars && (
        <View style={tw`absolute top-0 -left-9 flex-row`}>
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

      <View
        style={[
          tw`px-2 bg-white rounded-tl-none rounded-lg relative`,
          theme?.bubbleStyle?.typingContainerStyle,
        ]}
      >
        {showBubbleTail && (
          <ArrowBack2RoundedIcon
            style={tw.style('absolute -top-1 w-6 h-6 rotate-180 -left-3.5 mt-[1.26px]')}
            color={theme?.colors?.receivedMessageTailColor || 'white'}
          />
        )}
        {renderCustomTyping ? (
          renderCustomTyping()
        ) : (
          <View style={tw`flex-row items-center py-3 px-2 justify-center`}>
            <Text
              style={withFontFamily(
                [
                  tw`text-gray-600`,
                  theme?.bubbleStyle?.typingTextStyle,
                ],
                theme?.fontFamily
              )}
            >
              {typingText ?? 'Typing...'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
