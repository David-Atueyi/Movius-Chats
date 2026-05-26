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
/** Lightweight reference to the message being replied to. */
export interface MessageReply {
    /** id of the original message being replied to. */
    messageId: string;
    /** Display name shown in the reply chip. */
    senderName?: string;
    /** Short text preview of the original message. */
    preview?: string;
    /**
     * Optional media kind so the reply chip can show an icon hint
     * (image / video / audio / file) when there is no preview text.
     */
    mediaKind?: 'image' | 'video' | 'audio' | 'file';
    /** Thumbnail uri (only meaningful when `mediaKind` is `image` or `video`). */
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
    /** Optional reference to a quoted message (rendered as a WhatsApp-style chip). */
    replyTo?: MessageReply;
    /** Marks the message as edited (renders a small italic "edited" before the timestamp). */
    edited?: boolean;
}
/** Feature flags for slide-to-reply. */
export interface ReplyConfig {
    /** Master switch — when `false` the gesture is disabled and the chip never shows. */
    enableReply?: boolean;
    /** Horizontal pixels the bubble must travel before the reply fires. Default `60`. */
    swipeThreshold?: number;
    /** Lines shown in the reply preview above the input. Default `2`. */
    previewMaxLines?: number;
}
/** Style overrides for the reply chip + reply preview row. */
export interface ReplyStyleOverrides {
    /** Outer container of the reply preview above the input. */
    container?: ViewStyle;
    /** Vertical accent bar on the left of the chip. */
    replyBar?: ViewStyle;
    /** Sender name text inside the chip. */
    senderName?: TextStyle;
    /** Preview text inside the chip. */
    previewText?: TextStyle;
    /** Style override for the optional thumbnail on the right end. */
    thumbnail?: ImageStyle;
}
export interface MessageActionFlags {
    enableReply?: boolean;
    enableCopy?: boolean;
    enableEdit?: boolean;
    enableDelete?: boolean;
    enableForward?: boolean;
    /** Toggle the "Select" action (enters multi-select mode). Default `true`. */
    enableSelect?: boolean;
}
/** Identifier for one of the default long-press actions. */
export type MessageActionId = 'reply' | 'copy' | 'edit' | 'delete' | 'forward' | 'select';
/** Anchor info passed to the popover so it can position itself near the bubble. */
export interface MessageActionAnchor {
    /** Bubble x position in screen coordinates. */
    x: number;
    /** Bubble y position in screen coordinates. */
    y: number;
    /** Bubble width. */
    width: number;
    /** Bubble height. */
    height: number;
    /** Whether the bubble belongs to the current user (right-aligned). */
    isCurrentUser: boolean;
}
/** Visual knobs for the long-press popover (the dropdown menu shown next to a bubble). */
export interface MessageActionUIProps {
    /** Card background color. Default `#FFFFFF`. */
    backgroundColor?: string;
    /** Default label color. Default `#111827`. */
    textColor?: string;
    /** Default icon color. Defaults to `textColor`. */
    iconColor?: string;
    /** Color used for the destructive Delete action. Default `#EF4444`. */
    destructiveColor?: string;
    /** Width of the popover card. Default `200`. */
    width?: number;
    /** Border radius of the popover card. Default `12`. */
    borderRadius?: number;
    /** Style override for individual action rows. */
    rowStyle?: ViewStyle;
    /** Style override for action labels. */
    rowTextStyle?: TextStyle;
    /** Optional override of the entire backdrop dim color. */
    backdropColor?: string;
}
export interface SelectionUIProps {
    /** Color used for the selected-bubble overlay (semi-transparent). */
    overlayColor?: string;
    /** Background color of the entire row when one of its bubbles is selected. */
    rowBackgroundColor?: string;
}
/** Result handed back to the host app when the user finishes capturing. */
export interface CameraCaptureResult {
    uri: string;
    type: 'image' | 'video';
    /** Video duration in seconds (only set for videos). */
    duration?: number;
    width?: number;
    height?: number;
}
/** Feature flags for the built-in camera screen. */
export interface CameraConfig {
    /** Allow photo capture. Default `true`. */
    enablePhoto?: boolean;
    /** Allow video recording. Default `true`. */
    enableVideo?: boolean;
    /** Allow pinch-to-zoom. Default `true`. */
    enableZoom?: boolean;
    /** Allow switching between front and back. Default `true`. */
    enableSwitchCamera?: boolean;
    /** Capture audio along with video. Default `true`. */
    enableAudio?: boolean;
    /** Maximum video recording length in seconds. Default `60`. */
    maxVideoDuration?: number;
    /** Maximum pinch zoom factor. Default `8`. */
    maxZoom?: number;
    /** Native photo quality preset. */
    photoQuality?: 'speed' | 'balanced' | 'quality';
    /** Native video quality preset (a vision-camera Format quality string). */
    videoQuality?: string;
}
/** Color / sizing knobs for the built-in camera screen UI. */
export interface CameraUIProps {
    /** Diameter of the round capture button. Default `72`. */
    captureButtonSize?: number;
    /** Diameter of the close / switch buttons. Default `40`. */
    controlButtonSize?: number;
    /** Style for the recording timer text. */
    timerTextStyle?: TextStyle;
    /** Camera scrim background color. Default `#000`. */
    backgroundColor?: string;
    /** Color of the capture ring while idle. Default `#FFFFFF`. */
    captureRingColor?: string;
    /** Color of the capture ring while recording. Default `#EF4444`. */
    recordingRingColor?: string;
    /** Color of the round dot inside the capture ring while idle. Default `#FFFFFF`. */
    captureDotColor?: string;
    /** Color of the recording dot indicator next to the timer. Default `#EF4444`. */
    recordingIndicatorColor?: string;
    /** Color of mode selector active text. Defaults to theme primary. */
    activeModeTextColor?: string;
    /** Color of mode selector inactive text. Default `rgba(255,255,255,0.7)`. */
    inactiveModeTextColor?: string;
    /** Color of the close / switch icons. Default `#FFFFFF`. */
    iconColor?: string;
}
/** Live state passed to a custom camera renderer. */
export interface CameraExposedState {
    isCameraReady: boolean;
    isRecording: boolean;
    facing: 'front' | 'back';
    zoom: number;
    /** Recording elapsed time in seconds (0 when not recording). */
    elapsed: number;
    capturePhoto: () => Promise<CameraCaptureResult | null>;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<CameraCaptureResult | null>;
    switchCamera: () => void;
    setZoom: (zoom: number) => void;
    /** Close the camera screen. */
    close: () => void;
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
    /** Fired when the user picks a message to reply to (via swipe or action sheet). */
    onReplyMessage?: (message: Message) => void;
    /** Feature flags for the reply gesture. */
    replyProps?: ReplyConfig;
    /** Style overrides for the reply chip + preview row. */
    replyStyle?: ReplyStyleOverrides;
    /** Replace the default reply preview (above the input) with a custom node. */
    renderReplyPreview?: (message: Message, cancel: () => void) => React.ReactNode;
    /** Replace the inline reply chip rendered inside a quoting bubble. */
    renderInlineReply?: (reply: MessageReply, isCurrentUser: boolean) => React.ReactNode;
    /** Toggle individual default actions on / off. */
    messageActionProps?: MessageActionFlags;
    /** Visual customization knobs for the default popover. */
    messageActionUI?: MessageActionUIProps;
    /** Replace the default long-press action popover entirely. */
    renderMessageActions?: (message: Message, close: () => void, anchor?: MessageActionAnchor) => React.ReactNode;
    onCopyMessage?: (message: Message) => void;
    /**
     * Fired when the user confirms an edit. The package will pre-fill the input
     * with the original text and clear the draft when this returns.
     */
    onEditMessage?: (message: Message, newText: string) => void;
    onDeleteMessage?: (message: Message) => void;
    onForwardMessage?: (message: Message) => void;
    /** Visual knobs for selected-bubble overlay. */
    selectionUI?: SelectionUIProps;
    /** Fired any time the selection set changes (entering / leaving select mode). */
    onSelectionChange?: (selectedIds: string[]) => void;
    /** Fired when the user taps Delete while in selection mode. */
    onDeleteSelected?: (messages: Message[]) => void;
    /** Fired when the user taps Forward while in selection mode. */
    onForwardSelected?: (messages: Message[]) => void;
    /** Fired when the user taps Copy while in selection mode. */
    onCopySelected?: (messages: Message[]) => void;
    /** Text rendered before the timestamp when `message.edited === true`. Default `edited`. */
    editedLabel?: string;
    /** Style override for the edited indicator. */
    editedTextStyle?: TextStyle;
    /** Enable the built-in camera screen (otherwise the package only fires `onCameraPress`). */
    enableBuiltInCamera?: boolean;
    /** Camera feature flags / limits. */
    cameraProps?: CameraConfig;
    /** Camera UI knobs (sizes / colors). */
    cameraUIProps?: CameraUIProps;
    /** Replace the entire built-in camera screen UI. */
    renderCameraScreen?: (state: CameraExposedState) => React.ReactNode;
    /** Fired when a photo or video is captured by the built-in camera. */
    onCameraCapture?: (media: CameraCaptureResult) => void;
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
            /** Style for the small italic "edited" indicator. */
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
