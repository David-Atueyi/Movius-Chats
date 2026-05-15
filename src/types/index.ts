import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

export interface Message {
  id: string;
  text?: string;
  image?: string;
  video?: string;
  audio?: string;
  senderId: string;
  time: string;
  status: 'read' | 'delivered' | 'sent';
  senderName?: string;
  senderAvatar?: string;
}

export interface ChatScreenProps {
  // Message handling
  messages: Message[];
  currentUserId: string;
  onSendMessage: (message: Omit<Message, 'id' | 'time' | 'status'>) => void;
  onMessageLongPress?: (message: Message) => void;
  onAttachmentPress?: () => void;
  onAudioRecordEnd?: () => void;
  onAudioRecordStart?: () => void;
  onCameraPress?: () => void;

  /** iOS only: header/status-bar offset for KeyboardAvoidingView. Android uses full keyboard height on the input bar. */
  keyboardVerticalOffset?: number;
  /** Set true if your screen already handles keyboard insets. */
  disableKeyboardAvoiding?: boolean;

  // Typing indicators and input
  typingUsers?: Array<{ id: string; avatar: string; name: string }>;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  placeholder?: string;
  previewData?: { uri: string; type: string; name: string };
  closePreview?: () => void;
  CustomFileIcon?: React.ComponentType<{ style?: any }>;
  CustomImagePreview?: React.ComponentType<{ uri: string }>;
  CustomVideoPreview?: React.ComponentType<{ uri: string }>;

  // UI Customization
  theme?: {
    fontFamily?: string;
    colors?: {
      sentMessageTailColor?: string;
      receivedMessageTailColor?: string;
      timestamp?: string;
      inputsIconsColor?: string;
      sendIconsColor?: string;
      placeholderTextColor?: string;
      audioPlayIconColor?: string;
      audioPauseIconColor?: string;
      videoPlayIconColor?: string;
      inputTextColor?: string;
      sentIconColor?: string;
      deliveredIconColor?: string;
      readIconColor?: string;
    };
    sizes?: {
      /** Emoji, attachment, and camera icons only (not send/mic). Twrnc class or pixels. */
      inputIconSize?: string | number;
    };
    bubbleStyle?: {
      sent?: ViewStyle;
      received?: ViewStyle;
      avatarTextStyle?: TextStyle;
      userNameStyle?: TextStyle;
      avatarImageStyle?: ImageStyle;
      typingContainerStyle?: ViewStyle;
      additionalTypingUsersContainerStyle?: ViewStyle;
      additionalTypingUsersTextStyle?: TextStyle;
    };
    messageStyle?: {
      sentTextStyle?: TextStyle;
      receivedTextStyle?: TextStyle;
      audioPlayButtonStyle?: ViewStyle;
      audioKnobStyle?: ViewStyle;
      progressBarStyle?: ViewStyle;
      activeProgressBarStyle?: ViewStyle;
      audioDurationStyle?: TextStyle;
    };
    inputStyles?: {
      inputSectionContainerStyle?: ViewStyle;
      inputContainerStyle?: ViewStyle;
      sendButtonStyle?: ViewStyle;
    };
    filePreviewStyle?: {
      root?: ViewStyle;
      container?: ViewStyle;
      iconContainer?: ViewStyle;
      nameContainer?: ViewStyle;
      text?: TextStyle;
    };
  };

  // Feature flags
  showAvatars?: boolean;
  showUserNames?: boolean;
  showEmojiButton?: boolean;
  showAttachmentsButton?: boolean;
  showCameraButton?: boolean;
  showVoiceRecordButton?: boolean;
  showBubbleTail?: boolean;
  showMessageStatus?: boolean;

  // Custom components
  renderCustomInput?: () => React.ReactNode;
  renderCustomVideoBubbleError?: () => React.ReactNode;
  renderCustomTyping?: () => React.ReactNode;

  // Custom icon props
  CustomEmojiIcon?: () => React.ReactNode;
  CustomAttachmentIcon?: () => React.ReactNode;
  CustomCameraIcon?: () => React.ReactNode;
  CustomSendIcon?: () => React.ReactNode;
  CustomMicrophoneIcon?: () => React.ReactNode;
  CustomPlayIcon?: () => React.ReactNode;
  CustomPauseIcon?: () => React.ReactNode;
}
