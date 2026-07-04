import type { ComponentType, ReactNode } from 'react';
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
export interface RecordingResult {
    uri: string;
    duration: number;
    size?: number;
    mimeType?: string;
}
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
export interface VoiceRecorderConfig {
    maxDuration?: number;
    enableSlideToCancel?: boolean;
    enableLockRecording?: boolean;
    enableWaveform?: boolean;
}
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
export interface MessageMediaItem {
    uri: string;
    kind: 'image' | 'video';
}
export interface MessageFileAttachment {
    uri: string;
    type: string;
    name: string;
}
export interface MessageReply {
    messageId: string;
    senderName?: string;
    preview?: string;
    mediaKind?: 'image' | 'video' | 'audio' | 'file';
    thumbnailUri?: string;
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
    replyTo?: MessageReply;
    edited?: boolean;
}
export interface SwipeReplyUIProps {
    iconColor?: string;
    iconBackground?: string;
    iconSize?: number;
}
export interface ReplyConfig {
    enableReply?: boolean;
    swipeThreshold?: number;
    previewMaxLines?: number;
    swipe?: SwipeReplyUIProps;
}
export interface ReplyUIProps {
    accentColor?: string;
    closeIconColor?: string;
    inputPreviewBackground?: string;
    recordingPreviewBackground?: string;
    previewCardBackground?: string;
    previewSenderNameColor?: string;
    previewTextColor?: string;
    sentInlineBackground?: string;
    receivedInlineBackground?: string;
    sentSenderNameColor?: string;
    receivedSenderNameColor?: string;
    sentPreviewTextColor?: string;
    receivedPreviewTextColor?: string;
    editChipTitle?: string;
    defaultReplySenderName?: string;
    thumbnailSize?: number;
}
export interface ReplyStyleOverrides {
    container?: ViewStyle;
    replyBar?: ViewStyle;
    senderName?: TextStyle;
    previewText?: TextStyle;
    thumbnail?: ImageStyle;
    inlineContainer?: ViewStyle;
    inputPreviewContainer?: ViewStyle;
    recordingPreviewContainer?: ViewStyle;
    editPreviewContainer?: ViewStyle;
    closeButton?: ViewStyle;
}
export interface MessageActionFlags {
    enableReply?: boolean;
    enableCopy?: boolean;
    enableEdit?: boolean;
    enableDelete?: boolean;
    enableForward?: boolean;
    enableSelect?: boolean;
}
export type MessageActionId = 'reply' | 'copy' | 'edit' | 'delete' | 'forward' | 'select';
export interface MessageActionAnchor {
    x: number;
    y: number;
    width: number;
    height: number;
    isCurrentUser: boolean;
    isFirstInSequence: boolean;
}
export interface MessageActionLabels {
    reply?: string;
    copy?: string;
    edit?: string;
    delete?: string;
    forward?: string;
    select?: string;
}
export type MessageActionIconComponents = Partial<Record<MessageActionId, ComponentType<{
    style?: ViewStyle;
    color?: string;
}>>>;
export interface MessageActionUIProps {
    backgroundColor?: string;
    textColor?: string;
    iconColor?: string;
    destructiveColor?: string;
    width?: number;
    borderRadius?: number;
    rowHeight?: number;
    iconSize?: number;
    rowStyle?: ViewStyle;
    rowTextStyle?: TextStyle;
    menuStyle?: ViewStyle;
    scrimPressableStyle?: ViewStyle;
    liftedBubblePaddingHorizontal?: number;
    backdropColor?: string;
    scrimColor?: string;
}
export interface SelectionUIProps {
    overlayColor?: string;
    rowBackgroundColor?: string;
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
    CustomVoiceRecorder?: (state: VoiceRecorderExposedState) => React.ReactNode;
    onReplyMessage?: (message: Message) => void;
    replyProps?: ReplyConfig;
    replyUI?: ReplyUIProps;
    replyStyle?: ReplyStyleOverrides;
    renderReplyPreview?: (message: Message, cancel: () => void) => React.ReactNode;
    renderInlineReply?: (reply: MessageReply, isCurrentUser: boolean) => React.ReactNode;
    messageActionProps?: MessageActionFlags;
    messageActionUI?: MessageActionUIProps;
    messageActionLabels?: MessageActionLabels;
    messageActionIcons?: MessageActionIconComponents;
    renderMessageActions?: (message: Message, close: () => void, anchor?: MessageActionAnchor) => React.ReactNode;
    onCopyMessage?: (message: Message) => void;
    onEditMessage?: (message: Message, newText: string) => void;
    onDeleteMessage?: (message: Message) => void;
    onForwardMessage?: (message: Message) => void;
    onEndReached?: (info: {
        distanceFromEnd: number;
    }) => void;
    onEndReachedThreshold?: number;
    isLoadingMoreMessages?: boolean;
    renderLoadingMoreIndicator?: () => React.ReactNode;
    loadingMoreIndicatorContainerStyle?: ViewStyle;
    loadingMoreIndicatorText?: string;
    loadingMoreIndicatorTextStyle?: TextStyle;
    loadingMoreIndicatorColor?: string;
    loadingMoreIndicatorSize?: number | 'small' | 'large';
    selectionUI?: SelectionUIProps;
    onSelectionChange?: (selectedIds: string[]) => void;
    onDeleteSelected?: (messages: Message[]) => void;
    onForwardSelected?: (messages: Message[]) => void;
    onCopySelected?: (messages: Message[]) => void;
    editedLabel?: string;
    editedTextStyle?: TextStyle;
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
            editedTextStyle?: TextStyle;
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
        reply?: {
            ui?: ReplyUIProps;
            styles?: ReplyStyleOverrides;
        };
        messageActions?: {
            ui?: MessageActionUIProps;
            labels?: MessageActionLabels;
            icons?: MessageActionIconComponents;
        };
        selection?: SelectionUIProps;
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
    CustomClosePreviewIcon?: () => ReactNode;
    CustomEditPreviewIcon?: () => ReactNode;
    renderEditPreview?: (message: Message, cancel: () => void) => ReactNode;
}
