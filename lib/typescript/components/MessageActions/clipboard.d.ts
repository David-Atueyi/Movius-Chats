import type { Message } from '../../types';
/**
 * Best-effort clipboard copy that doesn't pull in a hard dependency.
 *
 * Order:
 * 1. `@react-native-clipboard/clipboard` (the supported package).
 * 2. The legacy `Clipboard` export still shipped by some older RN versions.
 * 3. No-op (the consumer can supply `onCopyMessage` for full control).
 */
export declare const tryCopyMessage: (message: Message) => boolean;
