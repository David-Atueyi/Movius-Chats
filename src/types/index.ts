import { ImageStyle, TextStyle, ViewStyle } from 'react-native';

// ─── Voice recording ──────────────────────────────────────────────────────────

/** Returned by the recorder when a recording successfully completes. */
export interface RecordingResult {
  uri: string;
  duration: number;
  size?: number;
  mimeType?: string;
}

/** Passed to `renderVoiceRecorder` so a custom UI has full control. */
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
  autoSendOnRelease?: boolean;
  enablePauseResume?: boolean;
  recordingFormat?: string;
  recordingQuality?: string;
  animationDuration?: number;
}

/** Style overrides for each section of the recording UI. */
export interface VoiceRecorderStyleOverrides {
  container?: ViewStyle;
  timer?: TextStyle;
  waveform?: ViewStyle;
  micButton?: ViewStyle;
  slideText?: TextStyle;
  lockContainer?: ViewStyle;
  trashButton?: ViewStyle;
}

/** Color / size tweaks for the default recording UI. */
export interface RecordingUIProps {
  iconSize?: number;
  recordingIconSize?: number;
  sendIconSize?: number;
  timerTextStyle?: TextStyle;
  waveformColor?: string;
  recordingBackground?: string;
  cancelTextColor?: string;
  micPulseColor?: string;
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
  // Message handling
  messages: Message[];
  currentUserId: string;
  onSendMessage: (message: Omit<Message, 'id' | 'time' | 'status'>) => void;
  onMessageLongPress?: (message: Message) => void;
  onAttachmentPress?: () => void;
  onAudioRecordEnd?: (audio?: RecordingResult) => void;
  onAudioRecordStart?: () => void;
  onCameraPress?: () => void;
  onFileAttachmentPress?: (file: MessageFileAttachment) => void;

  // ── Voice recorder ──────────────────────────────────────────────────────────
  /** Replace the default recording UI with a fully custom component. */
  renderVoiceRecorder?: (state: VoiceRecorderExposedState) => React.ReactNode;
  /** Feature flags / limits for the built-in recorder. */
  voiceRecorderProps?: VoiceRecorderConfig;
  /** Style overrides for the built-in recording UI sections. */
  voiceRecorderStyles?: VoiceRecorderStyleOverrides;
  /** Color and size tweaks for the built-in recording UI. */
  recordingUIProps?: RecordingUIProps;

  keyboardVerticalOffset?: number;
  disableKeyboardAvoiding?: boolean;

  // Typing indicators and input
  typingUsers?: Array<{ id: string; avatar: string; name: string }>;
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
      timestamp?: string;
      inputsIconsColor?: string;
      sendIconsColor?: string;
      placeholderTextColor?: string;
      audioPlayIconColor?: string;
      audioPauseIconColor?: string;
      videoPlayIconColor?: string;
      /** Inactive (unplayed) waveform bar color */
      audioWaveformColor?: string;
      /** Active (played) waveform bar color */
      audioWaveformActiveColor?: string;
      /** Playback-time text color for sent audio messages */
      sentAudioTimestampColor?: string;
      /** Playback-time text color for received audio messages */
      receivedAudioTimestampColor?: string;
      inputTextColor?: string;
      sentIconColor?: string;
      deliveredIconColor?: string;
      readIconColor?: string;
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
