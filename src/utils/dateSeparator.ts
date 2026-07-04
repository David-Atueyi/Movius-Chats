import { Platform, NativeModules } from 'react-native';
import type { Message } from '../types';

/** Device locale when available, otherwise `en-GB`. */
export function getDefaultDateSeparatorLocale(): string {
  try {
    if (Platform.OS === 'ios') {
      const settings = NativeModules.SettingsManager?.settings;
      return (
        settings?.AppleLocale ??
        settings?.AppleLanguages?.[0] ??
        'en-GB'
      );
    }
    return NativeModules.I18nManager?.localeIdentifier ?? 'en-GB';
  } catch {
    return 'en-GB';
  }
}

export type ChatListItem =
  | { type: 'message'; message: Message; id: string }
  | {
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
export function truncateToLocalMidnight(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Stable string key for a local calendar day. */
export function getDayKey(date: Date): string {
  const d = truncateToLocalMidnight(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Whole calendar days between `reference` and `date` (both in local time). */
export function diffCalendarDays(reference: Date, date: Date): number {
  const refMid = truncateToLocalMidnight(reference).getTime();
  const dateMid = truncateToLocalMidnight(date).getTime();
  return Math.round((refMid - dateMid) / 86_400_000);
}

export function parseMessageDate(createdAt?: string | Date): Date | null {
  if (createdAt == null) return null;
  if (createdAt instanceof Date) {
    return Number.isNaN(createdAt.getTime()) ? null : createdAt;
  }
  const parsed = new Date(createdAt);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDateSeparatorLabel(
  date: Date,
  options: DateSeparatorLabelOptions = {}
): string {
  const {
    locale,
    weekdayLabelMaxDays = 6,
    formatDateSeparatorLabel: customFormatter,
    referenceDate = new Date(),
  } = options;

  if (customFormatter) {
    return customFormatter(date);
  }

  const diffDays = diffCalendarDays(referenceDate, date);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays >= 2 && diffDays <= weekdayLabelMaxDays) {
    return date.toLocaleDateString(locale, { weekday: 'long' });
  }

  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function resolveMessageDay(
  message: Message,
  referenceDate: Date,
  warnedMissing: Set<string>
): { date: Date; dayKey: string } {
  const parsed = parseMessageDate(message.createdAt);
  if (parsed) {
    return { date: parsed, dayKey: getDayKey(parsed) };
  }

  if (__DEV__ && !warnedMissing.has(message.id)) {
    warnedMissing.add(message.id);
    console.warn(
      `[movius-chats] Message "${message.id}" is missing a valid createdAt; grouping under today.`
    );
  }

  return { date: referenceDate, dayKey: getDayKey(referenceDate) };
}

export function buildChatListItems(
  messages: Message[],
  options: BuildChatListItemsOptions = {}
): ChatListItem[] {
  const { showDateSeparators = true, ...labelOptions } = options;

  if (!showDateSeparators) {
    return messages.map((message) => ({
      type: 'message' as const,
      message,
      id: message.id,
    }));
  }

  const referenceDate = labelOptions.referenceDate ?? new Date();
  const warnedMissing = new Set<string>();
  const items: ChatListItem[] = [];
  let lastDayKey: string | null = null;

  for (const message of messages) {
    const { date, dayKey } = resolveMessageDay(
      message,
      referenceDate,
      warnedMissing
    );

    if (lastDayKey !== null && dayKey !== lastDayKey) {
      items.push({
        type: 'dateSeparator',
        id: `date-sep-${dayKey}`,
        label: formatDateSeparatorLabel(date, {
          ...labelOptions,
          referenceDate,
        }),
        dayKey,
        date,
      });
    }

    items.push({
      type: 'message',
      message,
      id: message.id,
    });

    lastDayKey = dayKey;
  }

  return items;
}

export function getAdjacentMessage(
  items: ChatListItem[],
  index: number,
  direction: 'next' | 'prev'
): Message | null {
  const step = direction === 'next' ? 1 : -1;
  for (let i = index + step; i >= 0 && i < items.length; i += step) {
    const item = items[i];
    if (!item) continue;
    if (item.type === 'message') return item.message;
  }
  return null;
}

/** Whether this message is the topmost bubble in a consecutive same-sender group (inverted list). */
export function isFirstMessageInSequence(
  items: ChatListItem[],
  index: number
): boolean {
  const item = items[index];
  if (!item || item.type !== 'message') return false;

  const nextMessage = getAdjacentMessage(items, index, 'next');
  if (nextMessage === null) return true;
  return nextMessage.senderId !== item.message.senderId;
}

export function getDateLabelForListItem(
  item: ChatListItem,
  options: DateSeparatorLabelOptions = {}
): string | null {
  if (item.type === 'dateSeparator') {
    return item.label;
  }

  const referenceDate = options.referenceDate ?? new Date();
  const parsed = parseMessageDate(item.message.createdAt);
  const date = parsed ?? referenceDate;

  return formatDateSeparatorLabel(date, {
    ...options,
    referenceDate,
  });
}

export function resolveStickyDateLabel(
  viewableItems: Array<{
    index: number | null;
    item: ChatListItem;
    isViewable?: boolean;
  }>,
  items: ChatListItem[],
  options: DateSeparatorLabelOptions = {}
): string | null {
  const viewable = viewableItems.filter(
    (entry) =>
      entry.isViewable !== false &&
      entry.index != null &&
      entry.index >= 0 &&
      entry.index < items.length
  );

  if (viewable.length === 0) return null;

  const topIndex = Math.max(...viewable.map((entry) => entry.index as number));
  const topItem = items[topIndex];
  if (!topItem) return null;

  return getDateLabelForListItem(topItem, options);
}
