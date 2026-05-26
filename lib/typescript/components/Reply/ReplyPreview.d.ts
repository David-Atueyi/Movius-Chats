import React from 'react';
import type { Message, ReplyStyleOverrides } from '../../types';
interface ReplyPreviewProps {
    message: Message;
    onCancel: () => void;
    previewMaxLines?: number;
    replyStyle?: ReplyStyleOverrides;
    fontFamily?: string;
    /** Color used for the left vertical accent bar. */
    accentColor?: string;
    /** Color used for the close X icon. */
    closeIconColor?: string;
    /** Background of the preview row. */
    backgroundColor?: string;
    /** Color for the sender name text. */
    senderNameColor?: string;
    /** Color for the preview text. */
    previewTextColor?: string;
}
export declare const ReplyPreview: React.FC<ReplyPreviewProps>;
export {};
