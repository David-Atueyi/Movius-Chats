/**
 * Returns bottom padding to apply when the software keyboard is open.
 * More reliable than KeyboardAvoidingView alone on Android chat layouts.
 */
export declare function useKeyboardInset(keyboardVerticalOffset?: number, enabled?: boolean): number;
