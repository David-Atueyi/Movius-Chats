import React, { useMemo } from 'react';
import {
  Dimensions,
  Modal,
  Pressable,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import tw from 'twrnc';
import { CopyIcon } from '../../assets/Icons/CopyIcon';
import { EditIcon } from '../../assets/Icons/EditIcon';
import { ForwardIcon } from '../../assets/Icons/ForwardIcon';
import { ReplyIcon } from '../../assets/Icons/ReplyIcon';
import { SelectIcon } from '../../assets/Icons/SelectIcon';
import { TrashIcon } from '../../assets/Icons/TrashIcon';
import type {
  Message,
  MessageActionAnchor,
  MessageActionFlags,
  MessageActionId,
  MessageActionUIProps,
} from '../../types';
import { withFontFamily } from '../../utils/theme';

interface MessageActionsPopoverProps {
  message: Message | null;
  anchor: MessageActionAnchor | null;
  visible: boolean;
  onClose: () => void;
  flags?: MessageActionFlags;
  ui?: MessageActionUIProps;
  fontFamily?: string;
  onAction: (id: MessageActionId, message: Message) => void;
}

interface Action {
  id: MessageActionId;
  label: string;
  Icon: React.FC<{ style?: ViewStyle; color?: string }>;
  destructive?: boolean;
}

const buildActions = (
  message: Message,
  flags: MessageActionFlags | undefined
): Action[] => {
  const hasEditableText = !!message.text?.trim();

  const all: Action[] = [
    { id: 'reply', label: 'Reply', Icon: ReplyIcon },
    { id: 'forward', label: 'Forward', Icon: ForwardIcon },
    { id: 'copy', label: 'Copy', Icon: CopyIcon },
    { id: 'edit', label: 'Edit', Icon: EditIcon },
    { id: 'select', label: 'Select', Icon: SelectIcon },
    { id: 'delete', label: 'Delete', Icon: TrashIcon, destructive: true },
  ];
  return all.filter((a) => {
    switch (a.id) {
      case 'reply':
        return flags?.enableReply !== false;
      case 'copy':
        return flags?.enableCopy !== false && hasEditableText;
      case 'edit':
        return flags?.enableEdit !== false && hasEditableText;
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
};

function resolvePosition(
  anchor: MessageActionAnchor | null,
  popoverWidth: number,
  rowHeight: number,
  rowCount: number
) {
  const screen = Dimensions.get('window');
  const margin = 8;

  if (!anchor) {
    return {
      top: screen.height / 2 - (rowHeight * rowCount) / 2,
      left: screen.width / 2 - popoverWidth / 2,
    };
  }

  const popoverHeight = rowHeight * rowCount + 12;

  let left: number;
  if (anchor.isCurrentUser) {
    left = anchor.x + anchor.width - popoverWidth;
  } else {
    left = anchor.x;
  }
  left = Math.max(margin, Math.min(left, screen.width - popoverWidth - margin));

  const spaceBelow = screen.height - (anchor.y + anchor.height);
  const showBelow = spaceBelow >= popoverHeight + margin;
  const top = showBelow
    ? anchor.y + anchor.height + 6
    : Math.max(margin, anchor.y - popoverHeight - 6);

  return { top, left };
}

export const MessageActionsPopover: React.FC<MessageActionsPopoverProps> = ({
  message,
  anchor,
  visible,
  onClose,
  flags,
  ui,
  fontFamily,
  onAction,
}) => {
  const actions = useMemo(
    () => (message ? buildActions(message, flags) : []),
    [message, flags]
  );

  const width = ui?.width ?? 200;
  const radius = ui?.borderRadius ?? 12;
  const bg = ui?.backgroundColor ?? '#FFFFFF';
  const text = ui?.textColor ?? '#111827';
  const icon = ui?.iconColor ?? text;
  const destructive = ui?.destructiveColor ?? '#EF4444';
  const backdrop = ui?.backdropColor ?? 'rgba(0,0,0,0.18)';

  const position = useMemo(
    () => resolvePosition(anchor, width, 48, actions.length),
    [anchor, width, actions.length]
  );

  if (!message) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable
        onPress={onClose}
        style={[tw`flex-1`, { backgroundColor: backdrop }]}
      >
        <Pressable
          onPress={() => {}}
          style={[
            tw`absolute overflow-hidden`,
            {
              width,
              borderRadius: radius,
              backgroundColor: bg,
              top: position.top,
              left: position.left,
              shadowColor: '#000',
              shadowOpacity: 0.16,
              shadowRadius: 16,
              shadowOffset: { width: 0, height: 6 },
              elevation: 6,
            },
          ]}
        >
          {actions.map((a) => {
            const color = a.destructive ? destructive : text;
            const ic = a.destructive ? destructive : icon;
            return (
              <Pressable
                key={a.id}
                onPress={() => onAction(a.id, message)}
                android_ripple={{ color: 'rgba(0,0,0,0.06)' }}
                style={[
                  tw`flex-row items-center px-4`,
                  { height: 48 },
                  ui?.rowStyle,
                ]}
              >
                <View style={{ width: 22, height: 22, marginRight: 14 }}>
                  <a.Icon style={{ width: 22, height: 22 }} color={ic} />
                </View>
                <Text
                  style={withFontFamily(
                    [tw`text-[15px] font-medium`, { color }, ui?.rowTextStyle],
                    fontFamily
                  )}
                >
                  {a.label}
                </Text>
              </Pressable>
            );
          })}
        </Pressable>
      </Pressable>
    </Modal>
  );
};
