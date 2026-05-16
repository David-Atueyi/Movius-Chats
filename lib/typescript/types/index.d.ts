import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
/** Single image or video inside a message bubble (use `mediaItems` for albums). */
export interface MessageMediaItem {
    uri: string;
    kind: 'image' | 'video';
}
/** PDFs, docs, etc. — shown as file rows in the bubble (not the image grid). */
export interface MessageFileAttachment {
    uri: string;
    type: string;
    name: string;
}
export interface Message {
    id: string;
    text?: string;
    /** @deprecated Prefer `mediaItems` for multiple; kept for backward compatibility. */
    image?: string;
    /** @deprecated Prefer `mediaItems` for multiple; kept for backward compatibility. */
    video?: string;
    audio?: string;
    senderId: string;
    time: string;
    status: 'read' | 'delivered' | 'sent';
    senderName?: string;
    senderAvatar?: string;
    /**
     * Multiple images/videos in one bubble (WhatsApp-style grid).
     * When non-empty, overrides single `image` / `video` for display.
     */
    mediaItems?: MessageMediaItem[];
    /** Non-media attachments shown as downloadable/list rows in the bubble */
    fileAttachments?: MessageFileAttachment[];
}
/** Input composer preview rows */
export interface PreviewAttachment {
    uri: string;
    type: string;
    name?: string;
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
    /** iOS only: header/status-bar offset for KeyboardAvoidingView. Android uses full keyboard height on the input bar. */
    keyboardVerticalOffset?: number;
    /** Set true if your screen already handles keyboard insets. */
    disableKeyboardAvoiding?: boolean;
    typingUsers?: Array<{
        id: string;
        avatar: string;
        name: string;
    }>;
    onTypingStart?: () => void;
    onTypingEnd?: () => void;
    placeholder?: string;
    /** @deprecated Use `previewItems` for multiple selections */
    previewData?: PreviewAttachment;
    /** Multiple files in the composer — images/videos use spread preview; others use file chip(s) */
    previewItems?: PreviewAttachment[];
    closePreview?: () => void;
    CustomFileIcon?: React.ComponentType<{
        style?: any;
    }>;
    CustomImagePreview?: React.ComponentType<{
        uri: string;
    }>;
    CustomVideoPreview?: React.ComponentType<{
        uri: string;
    }>;
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
