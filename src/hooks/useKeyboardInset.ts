import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

/**
 * Full keyboard height for lifting the input bar above the software keyboard.
 * Do not subtract header offset here — that is only for KeyboardAvoidingView on iOS.
 */
export function useKeyboardInset(enabled = true) {
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
      setInset(event.endCoordinates.height);
    };

    const onHide = () => setInset(0);

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [enabled]);

  return enabled ? inset : 0;
}
