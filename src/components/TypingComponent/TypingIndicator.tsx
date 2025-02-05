import { Image, Text, View } from 'react-native';
import tw from 'twrnc';
import { ArrowBack2RoundedIcon } from '../../assets/Icons/ArrowBack2RoundedIcon';
import { useChatContext } from '../../context/ChatContext';

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
  const { theme, showAvatars, renderCustomTyping, showBubbleTail } =
    useChatContext();

  const otherTypingUsers = typingUsers.filter(
    (user) => user.id !== currentUserId
  );

  if (!otherTypingUsers.length) return null;

  const displayedUsers = otherTypingUsers.slice(0, 2);
  const additionalUsers = otherTypingUsers.length - 2;

  return (
    <View style={tw`my-1 max-w-[75%] self-start flex-row`}>
      {showAvatars && (
        <View style={tw`flex-row`}>
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
                  style={[
                    tw`text-sm text-black font-semibold capitalize rounded-full bg-zinc-300 w-full h-full text-center pt-0.5`,
                    theme?.bubbleStyle?.avatarTextStyle,
                  ]}
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
                {
                  marginLeft: -10,
                  zIndex: 3,
                },
                { ...theme?.bubbleStyle?.additionalTypingUsersContainerStyle },
              ]}
            >
              <Text
                style={[
                  tw`text-white text-xs font-semibold`,
                  theme?.bubbleStyle?.additionalTypingUsersTextStyle,
                ]}
              >
                +{additionalUsers}
              </Text>
            </View>
          )}
        </View>
      )}
      {showBubbleTail && (
        <ArrowBack2RoundedIcon
          style={tw.style(
            'w-6 h-6 rotate-180 fill-white mt-[1.25px] translate-x-1.5'
          )}
          color={`${theme?.colors?.receivedMessageTailColor || 'white'}`}
        />
      )}

      <View
        style={[
          tw`px-2 my-1 bg-white rounded-tl-none rounded-lg`,
          theme?.bubbleStyle?.typingContainerStyle,
        ]}
      >
        {renderCustomTyping ? (
          renderCustomTyping()
        ) : (
          <View style={tw`flex-row items-center py-3 px-2 justify-center`}>
            <Text style={tw`text-gray-600`}>Typing...</Text>
          </View>
        )}
      </View>
    </View>
  );
};
