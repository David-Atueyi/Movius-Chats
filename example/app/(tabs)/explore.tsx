import ChatScreen from 'movius-chats';
import { Message } from 'movius-chats/lib/typescript/types';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

const messagesData: Message[] = [
  {
    id: '7',
    senderId: '6',
    time: '10:31 AM',
    status: 'delivered',
    senderName: 'adam',
  },
];

const ExploreScreen = () => {
  const [messages, setMessages] = useState<Message[]>(
    [...messagesData].reverse()
  );

  const handleSendMessage = (
    message: Omit<Message, 'id' | 'time' | 'status'>
  ) => {
    setMessages([
      {
        ...message,
        id: Date.now().toString(),
        time: 'Now',
        status: 'sent',
      },
      ...messages,
    ]);
  };
  return (
    <ChatScreen
      messages={messages}
      currentUserId={'1'}
      onSendMessage={handleSendMessage}
      showAvatars
    />
  );
};

export default ExploreScreen;
const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
