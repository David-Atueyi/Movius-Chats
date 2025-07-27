import React from 'react';
import { FlatList, View } from 'react-native';
import tw from 'twrnc';
import ChatBubble from './components/ChatBubble/ChatBubble';
import ChatInput from './components/ChatInput/ChatInput';
import MediaViewer from './components/MediaViewer/MediaViewer';
import { TypingIndicator } from './components/TypingComponent/TypingIndicator';
import { AudioProvider } from './context/AudioContext';
import { ChatProvider, useChatContext } from './context/ChatContext';
import { ChatScreenProps } from './types';

const ChatScreenContent = () => {
  const {
    messages,
    currentUserId,
    onMessageLongPress,
    mediaUrl,
    setMediaUrl,
    setIsVideoPlaying,
    typingUsers,
    onSendMessage,
    onTypingStart,
    onTypingEnd,
    onAttachmentPress,
    onAudioRecordEnd,
    onAudioRecordStart,
    onCameraPress,
    renderCustomInput,
    CustomEmojiIcon,
    CustomAttachmentIcon,
    CustomCameraIcon,
    CustomMicrophoneIcon,
    CustomSendIcon,
    CustomFileIcon,
    CustomImagePreview,
    CustomVideoPreview,
  } = useChatContext();

  return (
    <View style={tw`flex-1 px-2 pb-4 gap-2 relative`}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ChatBubble
            message={item}
            isCurrentUser={item.senderId === currentUserId}
            onLongPress={() => onMessageLongPress?.(item)}
            isFirstInSequence={
              index === messages.length - 1 ||
              messages[index + 1]?.senderId !== item.senderId
            }
          />
        )}
        ListHeaderComponent={
          <TypingIndicator
            typingUsers={typingUsers || []}
            currentUserId={currentUserId}
          />
        }
        showsVerticalScrollIndicator={false}
        inverted
      />

      {renderCustomInput ? (
        renderCustomInput()
      ) : (
        <ChatInput
          onSendMessage={onSendMessage}
          onTypingStart={onTypingStart}
          onTypingEnd={onTypingEnd}
          onAttachmentPress={onAttachmentPress}
          onAudioRecordEnd={onAudioRecordEnd}
          onAudioRecordStart={onAudioRecordStart}
          onCameraPress={onCameraPress}
          CustomEmojiIcon={CustomEmojiIcon}
          CustomAttachmentIcon={CustomAttachmentIcon}
          CustomCameraIcon={CustomCameraIcon}
          CustomMicrophoneIcon={CustomMicrophoneIcon}
          CustomSendIcon={CustomSendIcon}
          CustomFileIcon={CustomFileIcon}
          CustomImagePreview={CustomImagePreview}
          CustomVideoPreview={CustomVideoPreview}
        />
      )}

      <MediaViewer
        imageUrl={mediaUrl.imageUrl}
        videoUrl={mediaUrl.videoUrl}
        onClose={() => {
          setMediaUrl({ imageUrl: '', videoUrl: '' });
          setIsVideoPlaying(false);
        }}
      />
    </View>
  );
};

const ChatScreen: React.FC<ChatScreenProps> = (props) => {
  return (
    <AudioProvider>
      <ChatProvider {...props}>
        <ChatScreenContent />
      </ChatProvider>
    </AudioProvider>
  );
};

export default ChatScreen;
