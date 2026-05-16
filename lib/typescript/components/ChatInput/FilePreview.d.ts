import React from 'react';
import type { PreviewAttachment } from '../../types';
interface FilePreviewProps {
    previews: PreviewAttachment[];
    closePreview?: () => void;
    CustomFileIcon?: React.ComponentType<{
        style?: any;
    }>;
    CustomImagePreview?: React.ComponentType<{
        uri: string;
    }>;
    CustomVideoPreview?: React.ComponentType<{
        uri: string;
    }>;
    inputHeight?: number;
}
declare const _default: React.NamedExoticComponent<FilePreviewProps>;
export default _default;
