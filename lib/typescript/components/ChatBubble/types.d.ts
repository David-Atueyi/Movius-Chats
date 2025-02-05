import { Message } from "../../types";
export interface ChatBubbleProps {
    message: Message;
    isCurrentUser: boolean;
    isFirstInSequence: boolean;
    onLongPress?: () => void;
}
export interface MessageContentProps extends ChatBubbleProps {
    onMediaPress: (type: "image" | "video", url: string) => void;
    isVideoPlaying?: boolean;
}
export interface MessageStatusProps {
    time: string;
    status?: "read" | "delivered" | "sent";
    isCurrentUser: boolean;
    hasText: boolean;
    hasAudio: boolean;
}
//# sourceMappingURL=types.d.ts.map