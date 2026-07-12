import type { ViewStyle } from 'react-native';
import type { ChatScreenProps, Message, MessageActionFlags, MessageActionIconComponents, MessageActionId, MessageActionLabels, MessageActionUIProps } from '../types';
type Theme = ChatScreenProps['theme'];
export interface MessageActionItem {
    id: MessageActionId;
    label: string;
    Icon: React.ComponentType<{
        style?: ViewStyle;
        color?: string;
    }>;
    destructive?: boolean;
}
export declare function mergeMessageActionUI(theme?: Theme, ui?: MessageActionUIProps): MessageActionUIProps;
export declare function mergeMessageActionLabels(theme?: Theme, labels?: MessageActionLabels): MessageActionLabels;
export declare function mergeMessageActionIcons(theme?: Theme, icons?: MessageActionIconComponents): MessageActionIconComponents;
export declare function buildMessageActions(message: Message, flags: MessageActionFlags | undefined, labels?: MessageActionLabels, icons?: MessageActionIconComponents, isCurrentUser?: boolean): MessageActionItem[];
export {};
