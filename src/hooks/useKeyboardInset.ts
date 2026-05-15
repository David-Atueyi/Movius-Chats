import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

/**
 * Returns bottom padding to apply when the software keyboard is open.
 * More reliable than KeyboardAvoidingView alone on Android chat layouts.
 */
export function useKeyboardInset(
  keyboardVerticalOffset = 0,
  enabled = true
) {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setInset(0);
      return;
    }

    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (event: KeyboardEvent) => {
      const height = event.endCoordinates.height;
      setInset(Math.max(0, height - keyboardVerticalOffset));
    };

    const onHide = () => setInset(0);

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [keyboardVerticalOffset, enabled]);

  return enabled ? inset : 0;
}
