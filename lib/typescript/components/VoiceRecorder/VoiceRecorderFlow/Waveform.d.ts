import React from 'react';
import { type SharedValue } from 'react-native-reanimated';
interface WaveformProps {
    color: string;
    tick: SharedValue<number>;
    count: number;
}
export declare const Waveform: React.FC<WaveformProps>;
export {};
