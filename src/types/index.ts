import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

// ─── Voice recording ──────────────────────────────────────────────────────────

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
  slideOffset: { x: number; y: number };
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

export interface MessageMediaItem {
  uri: string;
  kind: 'image' | 'video';
}

export interface MessageFileAttachment {
  uri: string;
  type: string;
  name: string;
}

/** Lightweight reference to the message being replied to. */
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

// ─── Reply ────────────────────────────────────────────────────────────────────

/** Feature flags for slide-to-reply. */
export interface ReplyConfig {
  enableReply?: boolean;
  swipeThreshold?: number;
  previewMaxLines?: number;
}

/** Style overrides for the reply chip + reply preview row. */
export interface ReplyStyleOverrides {
  container?: ViewStyle;
  replyBar?: ViewStyle;
  senderName?: TextStyle;
  previewText?: TextStyle;
  thumbnail?: ImageStyle;
}

// ─── Long-press message actions ───────────────────────────────────────────────

export interface MessageActionFlags {
  enableReply?: boolean;
  enableCopy?: boolean;
  enableEdit?: boolean;
  enableDelete?: boolean;
  enableForward?: boolean;
  enableSelect?: boolean;
}

export type MessageActionId =
  | 'reply'
  | 'copy'
  | 'edit'
  | 'delete'
  | 'forward'
  | 'select';

export interface MessageActionAnchor {
  x: number;
  y: number;
  width: number;
  height: number;
  isCurrentUser: boolean;
  isFirstInSequence: boolean;
}

export interface MessageActionUIProps {
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  destructiveColor?: string;
  width?: number;
  borderRadius?: number;
  rowStyle?: ViewStyle;
  rowTextStyle?: TextStyle;
  backdropColor?: string;
  scrimColor?: string;
}

// ─── Selection mode (multi-select after pressing "Select") ──────────────────

export interface SelectionUIProps {
  overlayColor?: string;
  rowBackgroundColor?: string;
}

// ─── Camera ───────────────────────────────────────────────────────────────────

export interface CameraCaptureResult {
  uri: string;
  type: 'image' | 'video';
  duration?: number;
  width?: number;
  height?: number;
}

/** Feature flags for the built-in camera screen. */
export interface CameraConfig {
  enablePhoto?: boolean;
  enableVideo?: boolean;
  enableZoom?: boolean;
  enableSwitchCamera?: boolean;
  enableAudio?: boolean;
  maxVideoDuration?: number;
  maxZoom?: number;
  photoQuality?: 'speed' | 'balanced' | 'quality';
  videoQuality?: string;
}

/** Color / sizing knobs for the built-in camera screen UI. */
export interface CameraUIProps {
  captureButtonSize?: number;
  controlButtonSize?: number;
  timerTextStyle?: TextStyle;
  backgroundColor?: string;
  captureRingColor?: string;
  recordingRingColor?: string;
  captureDotColor?: string;
  recordingIndicatorColor?: string;
  activeModeTextColor?: string;
  inactiveModeTextColor?: string;
  iconColor?: string;
}

/** Live state passed to a custom camera renderer. */
export interface CameraExposedState {
  isCameraReady: boolean;
  isRecording: boolean;
  facing: 'front' | 'back';
  zoom: number;
  elapsed: number;
  capturePhoto: () => Promise<CameraCaptureResult | null>;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<CameraCaptureResult | null>;
  switchCamera: () => void;
  setZoom: (zoom: number) => void;
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
  CustomVoiceRecorder?: (state: VoiceRecorderExposedState) => React.ReactNode;

  // ── Reply (slide-to-reply + reply preview) ────────────────────────────────
  onReplyMessage?: (message: Message) => void;
  replyProps?: ReplyConfig;
  replyStyle?: ReplyStyleOverrides;
  renderReplyPreview?: (
    message: Message,
    cancel: () => void
  ) => React.ReactNode;
  renderInlineReply?: (
    reply: MessageReply,
    isCurrentUser: boolean
  ) => React.ReactNode;

  // ── Long-press message actions ────────────────────────────────────────────
  messageActionProps?: MessageActionFlags;
  messageActionUI?: MessageActionUIProps;
  renderMessageActions?: (
    message: Message,
    close: () => void,
    anchor?: MessageActionAnchor
  ) => React.ReactNode;
  onCopyMessage?: (message: Message) => void;
  onEditMessage?: (message: Message, newText: string) => void;
  onDeleteMessage?: (message: Message) => void;
  onForwardMessage?: (message: Message) => void;

  // ── Multi-select mode ─────────────────────────────────────────────────────
  selectionUI?: SelectionUIProps;
  onSelectionChange?: (selectedIds: string[]) => void;
  onDeleteSelected?: (messages: Message[]) => void;
  onForwardSelected?: (messages: Message[]) => void;
  onCopySelected?: (messages: Message[]) => void;

  // ── "edited" indicator ────────────────────────────────────────────────────
  editedLabel?: string;
  editedTextStyle?: TextStyle;

  // ── Camera ────────────────────────────────────────────────────────────────
  enableBuiltInCamera?: boolean;
  cameraProps?: CameraConfig;
  cameraUIProps?: CameraUIProps;
  renderCameraScreen?: (state: CameraExposedState) => React.ReactNode;
  onCameraCapture?: (media: CameraCaptureResult) => void;

  keyboardVerticalOffset?: number;
  disableKeyboardAvoiding?: boolean;

  // Typing indicators and input
  typingUsers?: Array<{ id: string; avatar: string; name: string }>;
  typingText?: string;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  placeholder?: string;
  previewData?: PreviewAttachment;
  previewItems?: PreviewAttachment[];
  closePreview?: () => void;
  onRemovePreviewItem?: (uri: string) => void;
  CustomFileIcon?: React.ComponentType<{ style?: any }>;
  CustomImagePreview?: React.ComponentType<{ uri: string }>;
  CustomVideoPreview?: React.ComponentType<{ uri: string }>;

  // UI Customization
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
