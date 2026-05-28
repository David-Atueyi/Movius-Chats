import type { Message } from '../../types';

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
