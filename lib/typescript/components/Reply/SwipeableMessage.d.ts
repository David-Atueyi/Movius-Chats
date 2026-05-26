import React from 'react';
interface SwipeableMessageProps {
    isCurrentUser: boolean;
    enabled: boolean;
    swipeThreshold: number;
    onReply: () => void;
    iconColor?: string;
    iconBackground?: string;
    children: React.ReactNode;
}
export declare const SwipeableMessage: React.FC<SwipeableMessageProps>;
export {};
