import React from 'react';
import type { MessageReply, ReplyStyleOverrides } from '../../types';
interface InlineReplyProps {
    reply: MessageReply;
    isCurrentUser: boolean;
    /** Whether this is the first bubble in a sequence — controls top-corner radii. */
    isFirstInSequence?: boolean;
    fontFamily?: string;
    replyStyle?: ReplyStyleOverrides;
    /** Background tint for the chip itself. */
    backgroundColor: string;
    /** Sender name color. */
    senderNameColor: string;
    /** Preview text color. */
    previewTextColor: string;
}
export declare const InlineReply: React.FC<InlineReplyProps>;
export {};
