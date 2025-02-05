import React from "react";
import { ChatScreenProps } from "../types";
interface ChatContextType extends ChatScreenProps {
    mediaUrl: {
        imageUrl: string;
        videoUrl: string;
    };
    setMediaUrl: (url: {
        imageUrl: string;
        videoUrl: string;
    }) => void;
    isVideoPlaying: boolean;
    setIsVideoPlaying: (playing: boolean) => void;
}
export declare const ChatProvider: React.FC<ChatScreenProps & {
    children: React.ReactNode;
}>;
export declare const useChatContext: () => ChatContextType;
export {};
//# sourceMappingURL=ChatContext.d.ts.map