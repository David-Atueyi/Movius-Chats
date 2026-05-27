import React from 'react';
import type { Message, ReplyStyleOverrides } from '../../types';
interface ReplyPreviewProps {
    message: Message;
    onCancel: () => void;
    previewMaxLines?: number;
    replyStyle?: ReplyStyleOverrides;
    fontFamily?: string;
    accentColor?: string;
    closeIconColor?: string;
    backgroundColor?: string;
    senderNameColor?: string;
    previewTextColor?: string;
}
export declare const ReplyPreview: React.FC<ReplyPreviewProps>;
export {};
