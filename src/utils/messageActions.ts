import type { ViewStyle } from 'react-native';
import { CopyIcon } from '../assets/Icons/CopyIcon';
import { EditIcon } from '../assets/Icons/EditIcon';
import { ForwardIcon } from '../assets/Icons/ForwardIcon';
import { ReplyIcon } from '../assets/Icons/ReplyIcon';
import { SelectIcon } from '../assets/Icons/SelectIcon';
import { TrashIcon } from '../assets/Icons/TrashIcon';
import type {
  ChatScreenProps,
  Message,
  MessageActionFlags,
  MessageActionIconComponents,
  MessageActionId,
  MessageActionLabels,
  MessageActionUIProps,
} from '../types';

type Theme = ChatScreenProps['theme'];

export interface MessageActionItem {
  id: MessageActionId;
  label: string;
  Icon: React.ComponentType<{ style?: ViewStyle; color?: string }>;
  destructive?: boolean;
}

const DEFAULT_LABELS: Record<MessageActionId, string> = {
  reply: 'Reply',
  copy: 'Copy',
  edit: 'Edit',
  delete: 'Delete',
  forward: 'Forward',
  select: 'Select',
};

const DEFAULT_ICONS: MessageActionIconComponents = {
  reply: ReplyIcon,
  copy: CopyIcon,
  edit: EditIcon,
  delete: TrashIcon,
  forward: ForwardIcon,
  select: SelectIcon,
};

export function mergeMessageActionUI(
  theme?: Theme,
  ui?: MessageActionUIProps
): MessageActionUIProps {
  return { ...theme?.messageActions?.ui, ...ui };
}

export function mergeMessageActionLabels(
  theme?: Theme,
  labels?: MessageActionLabels
): MessageActionLabels {
  return { ...theme?.messageActions?.labels, ...labels };
}

export function mergeMessageActionIcons(
  theme?: Theme,
  icons?: MessageActionIconComponents
): MessageActionIconComponents {
  return { ...DEFAULT_ICONS, ...theme?.messageActions?.icons, ...icons };
}

export function buildMessageActions(
  message: Message,
  flags: MessageActionFlags | undefined,
  labels?: MessageActionLabels,
  icons?: MessageActionIconComponents,
  isCurrentUser?: boolean
): MessageActionItem[] {
  const mergedLabels = { ...DEFAULT_LABELS, ...labels };
  const mergedIcons = mergeMessageActionIcons(undefined, icons);
  const hasEditableText = !!message.text?.trim();

  const all: MessageActionItem[] = [
    {
      id: 'reply',
      label: mergedLabels.reply!,
      Icon: mergedIcons.reply ?? ReplyIcon,
    },
    {
      id: 'forward',
      label: mergedLabels.forward!,
      Icon: mergedIcons.forward ?? ForwardIcon,
    },
    {
      id: 'copy',
      label: mergedLabels.copy!,
      Icon: mergedIcons.copy ?? CopyIcon,
    },
    {
      id: 'edit',
      label: mergedLabels.edit!,
      Icon: mergedIcons.edit ?? EditIcon,
    },
    {
      id: 'select',
      label: mergedLabels.select!,
      Icon: mergedIcons.select ?? SelectIcon,
    },
    {
      id: 'delete',
      label: mergedLabels.delete!,
      Icon: mergedIcons.delete ?? TrashIcon,
      destructive: true,
    },
  ];

  return all.filter((a) => {
    switch (a.id) {
      case 'reply':
        return flags?.enableReply !== false;
      case 'copy':
        return flags?.enableCopy !== false && hasEditableText;
      case 'edit':
        return (
          flags?.enableEdit !== false && hasEditableText && !!isCurrentUser
        );
      case 'delete':
        return flags?.enableDelete !== false;
      case 'forward':
        return flags?.enableForward !== false;
      case 'select':
        return flags?.enableSelect !== false;
      default:
        return true;
    }
  });
}
