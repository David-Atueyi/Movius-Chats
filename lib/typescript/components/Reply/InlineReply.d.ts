import React from 'react';
import type { MessageReply, ReplyStyleOverrides } from '../../types';
interface InlineReplyProps {
    reply: MessageReply;
    isCurrentUser: boolean;
    isFirstInSequence?: boolean;
    fontFamily?: string;
    replyStyle?: ReplyStyleOverrides;
    /** Vertical accent bar color (defaults to a lighter shade of the bubble). */
    accentColor: string;
    /** Background tint for the chip itself. */
    backgroundColor: string;
    /** Sender name color. */
    senderNameColor: string;
    /** Preview text color. */
    previewTextColor: string;
}
export declare const InlineReply: React.FC<InlineReplyProps>;
export {};
