import React, { ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import { useAnimatedStyle } from 'react-native-reanimated';
interface LockPillProps {
    width: number;
    bottomOffset: number;
    background: string;
    lockColor: string;
    chevronColor: string;
    lockIconSize: number;
    pillAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
    chevronAnimatedStyle: ReturnType<typeof useAnimatedStyle>;
    styleOverride?: ViewStyle;
    renderLockIcon?: () => ReactNode;
}
export declare const LockPill: React.FC<LockPillProps>;
export {};
