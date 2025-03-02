import React from "react";
interface AudioContextType {
    currentlyPlayingId: string | null;
    setCurrentlyPlayingId: (id: string | null) => void;
}
export declare const AudioProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useAudio: () => AudioContextType;
export {};
