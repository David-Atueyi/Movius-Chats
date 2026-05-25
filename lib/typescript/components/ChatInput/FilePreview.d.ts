import React from 'react';
import type { PreviewAttachment } from '../../types';
interface FilePreviewProps {
    previews: PreviewAttachment[];
    closePreview?: () => void;
    /** Remove a single item by URI. When provided each card gets its own × button. */
    onRemoveItem?: (uri: string) => void;
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
