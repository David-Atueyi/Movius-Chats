import { ImageStyle, TextStyle, ViewStyle } from "react-native";
export interface Message {
    id: string;
    text?: string;
    image?: string;
    video?: string;
    audio?: string;
    senderId: string;
    time: string;
    status: "read" | "delivered" | "sent";
    senderName?: string;
    senderAvatar?: string;
}
export interface ChatScreenProps {
    messages: Message[];
    currentUserId: string;
    onSendMessage: (message: Omit<Message, 'id' | 'time' | 'status'>) => void;
    onMessageLongPress?: (message: Message) => void;
    onAttachmentPress?: () => void;
    onAudioRecordEnd?: () => void;
    onAudioRecordStart?: () => void;
    onCameraPress?: () => void;
    typingUsers?: Array<{
        id: string;
        avatar: string;
        name: string;
    }>;
    onTypingStart?: () => void;
    onTypingEnd?: () => void;
    placeholder?: string;
    theme?: {
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
    };
    showAvatars?: boolean;
    showUserNames?: boolean;
    showEmojiButton?: boolean;
    showAttachmentsButton?: boolean;
    showCameraButton?: boolean;
    showVoiceRecordButton?: boolean;
    showBubbleTail?: boolean;
    showMessageStatus?: boolean;
    renderCustomInput?: () => React.ReactNode;
    renderCustomVideoBubbleError?: () => React.ReactNode;
    renderCustomTyping?: () => React.ReactNode;
    CustomEmojiIcon?: () => React.ReactNode;
    CustomAttachmentIcon?: () => React.ReactNode;
    CustomCameraIcon?: () => React.ReactNode;
    CustomSendIcon?: () => React.ReactNode;
    CustomMicrophoneIcon?: () => React.ReactNode;
    CustomPlayIcon?: () => React.ReactNode;
    CustomPauseIcon?: () => React.ReactNode;
}
