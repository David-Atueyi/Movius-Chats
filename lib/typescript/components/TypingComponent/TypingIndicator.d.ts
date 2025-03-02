export interface TypingUser {
    id: string;
    avatar: string;
    name: string;
}
interface TypingIndicatorProps {
    typingUsers: TypingUser[];
    currentUserId: string;
}
export declare const TypingIndicator: ({ typingUsers, currentUserId, }: TypingIndicatorProps) => import("react/jsx-runtime").JSX.Element | null;
export {};
