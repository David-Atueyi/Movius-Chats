import type { Message } from '../types';
/** Device locale when available, otherwise `en-GB`. */
export declare function getDefaultDateSeparatorLocale(): string;
export type ChatListItem = {
    type: 'message';
    message: Message;
    id: string;
} | {
    type: 'dateSeparator';
    id: string;
    label: string;
    dayKey: string;
    date: Date;
};
export interface DateSeparatorLabelOptions {
    locale?: string;
    weekdayLabelMaxDays?: number;
    formatDateSeparatorLabel?: (date: Date) => string;
    referenceDate?: Date;
}
export interface BuildChatListItemsOptions extends DateSeparatorLabelOptions {
    showDateSeparators?: boolean;
}
/** Truncate a Date to local calendar midnight. */
export declare function truncateToLocalMidnight(date: Date): Date;
/** Stable string key for a local calendar day. */
export declare function getDayKey(date: Date): string;
/** Whole calendar days between `reference` and `date` (both in local time). */
export declare function diffCalendarDays(reference: Date, date: Date): number;
export declare function parseMessageDate(createdAt?: string | Date): Date | null;
export declare function formatDateSeparatorLabel(date: Date, options?: DateSeparatorLabelOptions): string;
export declare function buildChatListItems(messages: Message[], options?: BuildChatListItemsOptions): ChatListItem[];
export declare function getAdjacentMessage(items: ChatListItem[], index: number, direction: 'next' | 'prev'): Message | null;
/** Whether this message is the topmost bubble in a consecutive same-sender group (inverted list). */
export declare function isFirstMessageInSequence(items: ChatListItem[], index: number): boolean;
export declare function getDateLabelForListItem(item: ChatListItem, options?: DateSeparatorLabelOptions): string | null;
export declare function resolveStickyDateLabel(viewableItems: Array<{
    index: number | null;
    item: ChatListItem;
    isViewable?: boolean;
}>, items: ChatListItem[], options?: DateSeparatorLabelOptions): string | null;
