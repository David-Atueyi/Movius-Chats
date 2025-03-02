import { Message } from "../../types";
export interface ChatInputProps {
    onSendMessage: (message: Omit<Message, "id" | "time" | "status">) => void;
    onTypingStart?: () => void;
    onTypingEnd?: () => void;
    onAttachmentPress?: () => void;
    onCameraPress?: () => void;
    onAudioRecordStart?: () => void;
    onAudioRecordEnd?: () => void;
    placeholder?: string;
    CustomEmojiIcon?: () => React.ReactNode;
    CustomAttachmentIcon?: () => React.ReactNode;
    CustomCameraIcon?: () => React.ReactNode;
    CustomSendIcon?: () => React.ReactNode;
    CustomMicrophoneIcon?: () => React.ReactNode;
}
export interface InputHeightState {
    height: number;
    isMultiline: boolean;
}
