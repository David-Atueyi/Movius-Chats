import React from 'react';
interface SwipeableMessageProps {
    isCurrentUser: boolean;
    enabled: boolean;
    swipeThreshold: number;
    onReply: () => void;
    iconColor?: string;
    iconBackground?: string;
    iconSize?: number;
    children: React.ReactNode;
}
export declare const SwipeableMessage: React.FC<SwipeableMessageProps>;
export {};
