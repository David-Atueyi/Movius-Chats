import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
interface WaveformAnimationProps {
    isActive: boolean;
    color?: string;
    height?: number;
    style?: StyleProp<ViewStyle>;
}
export declare const WaveformAnimation: React.FC<WaveformAnimationProps>;
export {};
