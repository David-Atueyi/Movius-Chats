import { Message } from '../../types';

export interface ChatInputProps {
  onSendMessage: (message: Omit<Message, 'id' | 'time' | 'status'>) => void;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  onAttachmentPress?: () => void;
  onCameraPress?: () => void;
  onAudioRecordStart?: () => void;
  onAudioRecordEnd?: () => void;
  placeholder?: string;
  previewData?: { uri: string; type: string; name: string };
  closePreview?: () => void;
  CustomEmojiIcon?: () => React.ReactNode;
  CustomAttachmentIcon?: () => React.ReactNode;
  CustomCameraIcon?: () => React.ReactNode;
  CustomSendIcon?: () => React.ReactNode;
  CustomMicrophoneIcon?: () => React.ReactNode;
  CustomFileIcon?: React.ComponentType<{ style?: any }>;
  CustomImagePreview?: React.ComponentType<{ uri: string }>;
  CustomVideoPreview?: React.ComponentType<{ uri: string }>;
}

export interface InputHeightState {
  height: number;
  isMultiline: boolean;
}
