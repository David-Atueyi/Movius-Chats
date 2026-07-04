import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import type { Message, MessageActionFlags, MessageActionId } from '../../types';
interface MessageActionsSheetProps {
    message: Message | null;
    visible: boolean;
    onClose: () => void;
    flags?: MessageActionFlags;
    fontFamily?: string;
    backgroundColor?: string;
    textColor?: string;
    iconColor?: string;
    destructiveColor?: string;
    rowStyle?: ViewStyle;
    rowTextStyle?: TextStyle;
    onAction: (id: MessageActionId, message: Message) => void;
}
export declare const MessageActionsSheet: React.FC<MessageActionsSheetProps>;
export {};
