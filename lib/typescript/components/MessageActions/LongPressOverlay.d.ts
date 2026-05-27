import React from 'react';
import type { Message, MessageActionAnchor, MessageActionFlags, MessageActionId, MessageActionUIProps } from '../../types';
interface LongPressOverlayProps {
    message: Message | null;
    anchor: MessageActionAnchor | null;
    visible: boolean;
    onClose: () => void;
    flags?: MessageActionFlags;
    ui?: MessageActionUIProps;
    fontFamily?: string;
    onAction: (id: MessageActionId, message: Message) => void;
}
export declare const LongPressOverlay: React.FC<LongPressOverlayProps>;
export {};
