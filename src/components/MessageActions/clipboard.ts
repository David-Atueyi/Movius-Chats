import type { Message } from '../../types';

/**
 * Best-effort clipboard copy that doesn't pull in a hard dependency.
 *
 * Order:
 * 1. `@react-native-clipboard/clipboard` (the supported package).
 * 2. The legacy `Clipboard` export still shipped by some older RN versions.
 * 3. No-op (the consumer can supply `onCopyMessage` for full control).
 */
export const tryCopyMessage = (message: Message): boolean => {
  const text =
    message.text ??
    message.fileAttachments?.[0]?.name ??
    '';
  if (!text) return false;

  try {
    const mod = require('@react-native-clipboard/clipboard');
    const Clipboard = mod?.default ?? mod;
    if (Clipboard?.setString) {
      Clipboard.setString(text);
      return true;
    }
  } catch {
    // ignore — try fallback
  }

  try {
    const RN = require('react-native');
    if (RN?.Clipboard?.setString) {
      RN.Clipboard.setString(text);
      return true;
    }
  } catch {
    // ignore
  }

  return false;
};
