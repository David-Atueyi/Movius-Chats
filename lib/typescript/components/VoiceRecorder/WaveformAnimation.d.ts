import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
interface WaveformAnimationProps {
    isActive: boolean;
    color?: string;
    height?: number;
    style?: StyleProp<ViewStyle>;
    barCount?: number;
    showOuterDots?: boolean;
}
export declare const WaveformAnimation: React.FC<WaveformAnimationProps>;
export {};
