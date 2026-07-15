import React from 'react';
import type { MessageReply, ReplyStyleOverrides } from '../../types';
interface InlineReplyProps {
    reply: MessageReply;
    fontFamily?: string;
    replyStyle?: ReplyStyleOverrides;
    backgroundColor: string;
    senderNameColor: string;
    previewTextColor: string;
    descriptionColor?: string;
    thumbnailSize?: number;
    defaultSenderName?: string;
    onPress?: () => void;
}
export declare const InlineReply: React.FC<InlineReplyProps>;
export {};
