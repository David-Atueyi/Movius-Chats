import React from 'react';
import { Text, View } from 'react-native';
import tw from 'twrnc';
import { CheckAllIcon } from '../../assets/Icons/CheckAllIcon';
import { CheckIcon } from '../../assets/Icons/CheckIcon';
import { useChatContext } from '../../context/ChatContext';
import { MessageStatusProps } from './types';

const MessageStatus: React.FC<MessageStatusProps> = ({
  time,
  status,
  isCurrentUser,
  hasText,
  hasAudio,
}) => {
  const { theme, showMessageStatus } = useChatContext();
  return (
    <>
      {showMessageStatus && (
        <View
          style={[
            tw`flex-row items-center`,
            hasText
              ? tw`justify-end pb-1 ml-4`
              : hasAudio
                ? tw`absolute right-3 bottom-3`
                : tw`absolute right-3 bottom-4 bg-black/50 px-2 py-1 rounded-md`,
          ]}
        >
          <Text
            style={[
              tw`text-xs`,
              {
                color:
                  hasText || hasAudio
                    ? theme?.colors?.timestamp || 'rgba(107, 114, 128, 0.7)'
                    : 'white',
              },
            ]}
          >
            {time}
          </Text>
          {isCurrentUser && (
            <View style={tw`ml-1 flex-row items-center`}>
              {status === 'sent' && (
                <CheckIcon
                  style={tw.style('fill-gray-500 h-4 w-4', { opacity: 0.7 })}
                />
              )}
              {status === 'delivered' && (
                <CheckAllIcon
                  style={tw.style('fill-gray-500 h-4 w-4', { opacity: 0.7 })}
                />
              )}
              {status === 'read' && (
                <CheckAllIcon
                  style={tw.style('fill-blue-500 h-4 w-4', { opacity: 0.9 })}
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
