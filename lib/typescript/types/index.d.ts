import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
/** Returned by the recorder when a recording successfully completes. */
export interface RecordingResult {
    uri: string;
    duration: number;
    size?: number;
    mimeType?: string;
}
/** Passed to `CustomVoiceRecorder` so a custom UI has full control. */
export interface VoiceRecorderExposedState {
    isRecording: boolean;
    isPaused: boolean;
    duration: number;
    isLocked: boolean;
    slideOffset: {
        x: number;
        y: number;
    };
    waveformData: number[];
    startRecording: () => void;
    stopRecording: () => Promise<RecordingResult | null>;
    pauseRecording: () => void;
    resumeRecording: () => void;
    cancelRecording: () => void;
}
/** Feature flags / limits for the built-in recorder. */
export interface VoiceRecorderConfig {
    maxDuration?: number;
    enableSlideToCancel?: boolean;
    enableLockRecording?: boolean;
    enableWaveform?: boolean;
}
/** Coarse-grained style overrides for the built-in recorder UI. */
export interface VoiceRecorderStyleOverrides {
    container?: ViewStyle;
    bar?: ViewStyle;
    timer?: TextStyle;
    waveform?: ViewStyle;
    slideText?: TextStyle;
    lockPill?: ViewStyle;
    trashButton?: ViewStyle;
    sendButton?: ViewStyle;
}
/** Color / sizing knobs for the built-in recorder UI. */
export interface RecordingUIProps {
    iconSize?: number;
    sendIconSize?: number;
    timerTextStyle?: TextStyle;
    timerColor?: string;
    waveformColor?: string;
    recordingBackground?: string;
    holdPillBackground?: string;
    cancelTextColor?: string;
    longPressMicColor?: string;
    containerBorderTopColor?: string;
    containerBorderTopWidth?: number;
    lockPillBackground?: string;
    lockIconColor?: string;
    chevronIconColor?: string;
    lockPillActiveBorderColor?: string;
    lockPillGap?: number;
    lockPillMarginBottom?: number;
    lockSlideDistance?: number;
    recordingSendButtonBackground?: string;
    deleteIconColor?: string;
    pauseIconColor?: string;
    waveformBarCount?: number;
}
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
    image?: string;
    video?: string;
    audio?: string;
    senderId: string;
    time: string;
    status: 'read' | 'delivered' | 'sent';
    senderName?: string;
    senderAvatar?: string;
    mediaItems?: MessageMediaItem[];
    fileAttachments?: MessageFileAttachment[];
}
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
    onAudioRecordEnd?: (audio?: RecordingResult) => void;
    onAudioRecordStart?: () => void;
    onCameraPress?: () => void;
    onFileAttachmentPress?: (file: MessageFileAttachment) => void;
    /** Replace the entire built-in voice recorder UI. */
    CustomVoiceRecorder?: (state: VoiceRecorderExposedState) => React.ReactNode;
    keyboardVerticalOffset?: number;
    disableKeyboardAvoiding?: boolean;
    typingUsers?: Array<{
        id: string;
        avatar: string;
        name: string;
    }>;
    typingText?: string;
    onTypingStart?: () => void;
    onTypingEnd?: () => void;
    placeholder?: string;
    previewData?: PreviewAttachment;
    previewItems?: PreviewAttachment[];
    closePreview?: () => void;
    onRemovePreviewItem?: (uri: string) => void;
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
            sentTimestampColor?: string;
            receivedTimestampColor?: string;
            sentMediaTimestampBackground?: string;
            receivedMediaTimestampBackground?: string;
            sentMessageTextColor?: string;
            receivedMessageTextColor?: string;
            sentBubbleBackgroundColor?: string;
            receivedBubbleBackgroundColor?: string;
            sentFileAttachmentBackground?: string;
            receivedFileAttachmentBackground?: string;
            sentFileAttachmentTextColor?: string;
            receivedFileAttachmentTextColor?: string;
            sentFileAttachmentSubtitleColor?: string;
            receivedFileAttachmentSubtitleColor?: string;
            sentAudioWaveformColor?: string;
            receivedAudioWaveformColor?: string;
            sentAudioWaveformActiveColor?: string;
            receivedAudioWaveformActiveColor?: string;
            sentAudioTimestampColor?: string;
            receivedAudioTimestampColor?: string;
            sentAudioPlayIconColor?: string;
            receivedAudioPlayIconColor?: string;
            sentAudioPauseIconColor?: string;
            receivedAudioPauseIconColor?: string;
            sentAudioPlayButtonBackground?: string;
            receivedAudioPlayButtonBackground?: string;
            sentAudioSpeedTextColor?: string;
            receivedAudioSpeedTextColor?: string;
            videoPlayIconColor?: string;
            inputTextColor?: string;
            sentIconColor?: string;
            deliveredIconColor?: string;
            readIconColor?: string;
            inputsIconsColor?: string;
            sendIconsColor?: string;
            placeholderTextColor?: string;
        };
        sizes?: {
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
            typingTextStyle?: TextStyle;
        };
        messageStyle?: {
            sentTextStyle?: TextStyle;
            receivedTextStyle?: TextStyle;
            sentFileAttachmentStyle?: ViewStyle;
            receivedFileAttachmentStyle?: ViewStyle;
            sentFileAttachmentTextStyle?: TextStyle;
            receivedFileAttachmentTextStyle?: TextStyle;
            sentFileAttachmentSubtitleStyle?: TextStyle;
            receivedFileAttachmentSubtitleStyle?: TextStyle;
            sentMediaTimestampContainerStyle?: ViewStyle;
            receivedMediaTimestampContainerStyle?: ViewStyle;
            audioPlayButtonStyle?: ViewStyle;
            audioKnobStyle?: ViewStyle;
            progressBarStyle?: ViewStyle;
            activeProgressBarStyle?: ViewStyle;
            audioDurationStyle?: TextStyle;
            audioSpeedButtonStyle?: ViewStyle;
            audioSpeedTextStyle?: TextStyle;
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
        voiceRecorder?: {
            ui?: RecordingUIProps;
            styles?: VoiceRecorderStyleOverrides;
            config?: VoiceRecorderConfig;
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
