import React from 'react';
import type { DateSeparatorTheme } from '../../types';
export interface DateSeparatorProps {
    label: string;
    variant?: 'inline' | 'sticky';
    theme?: DateSeparatorTheme;
    fontFamily?: string;
    renderCustom?: (label: string) => React.ReactNode;
}
declare const _default: React.NamedExoticComponent<DateSeparatorProps>;
export default _default;
