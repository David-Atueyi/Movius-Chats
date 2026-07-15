import React from 'react';
import type { Message, ReplyStyleOverrides } from '../../types';
interface ReplyPreviewProps {
    message: Message;
    onCancel: () => void;
    onPress?: () => void;
    previewMaxLines?: number;
    replyStyle?: ReplyStyleOverrides;
    fontFamily?: string;
    accentColor?: string;
    closeIconColor?: string;
    backgroundColor?: string;
    senderNameColor?: string;
    previewTextColor?: string;
    descriptionColor?: string;
    description?: string;
    showCloseButton?: boolean;
}
export declare const ReplyPreview: React.FC<ReplyPreviewProps>;
export {};
