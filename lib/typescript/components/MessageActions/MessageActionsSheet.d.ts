import React from 'react';
import { TextStyle, ViewStyle } from 'react-native';
import type { Message, MessageActionFlags, MessageActionId } from '../../types';
interface MessageActionsSheetProps {
    message: Message | null;
    visible: boolean;
    onClose: () => void;
    flags?: MessageActionFlags;
    fontFamily?: string;
    /** Background of the sheet card. */
    backgroundColor?: string;
    /** Color for action labels. */
    textColor?: string;
    /** Color for action icons. */
    iconColor?: string;
    /** Color for the Delete action (label + icon). */
    destructiveColor?: string;
    /** Optional row style override. */
    rowStyle?: ViewStyle;
    /** Optional row text style override. */
    rowTextStyle?: TextStyle;
    onAction: (id: MessageActionId, message: Message) => void;
}
export declare const MessageActionsSheet: React.FC<MessageActionsSheetProps>;
export {};
