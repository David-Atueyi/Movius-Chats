import type { ChatScreenProps, ReplyUIProps } from '../types';
type Theme = ChatScreenProps['theme'];
export declare function mergeReplyUI(theme?: Theme, replyUI?: ReplyUIProps): ReplyUIProps;
export declare function getInlineReplyBackground(theme: Theme | undefined, isCurrentUser: boolean, replyUI?: ReplyUIProps): string;
export declare function getInlineReplySenderColor(theme: Theme | undefined, isCurrentUser: boolean, replyUI?: ReplyUIProps): string;
export declare function getInlineReplyPreviewColor(theme: Theme | undefined, isCurrentUser: boolean, replyUI?: ReplyUIProps): string;
export declare function getInputPreviewBackground(theme?: Theme, replyUI?: ReplyUIProps): string;
export declare function getRecordingPreviewBackground(theme?: Theme, replyUI?: ReplyUIProps): string;
export {};
