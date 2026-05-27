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
import { TrashIcon } from '../../assets/Icons/TrashIcon';
import type {
  Message,
  MessageActionAnchor,
  MessageActionFlags,
  MessageActionId,
  MessageActionUIProps,
} from '../../types';
import { withFontFamily } from '../../utils/theme';
import ChatBubble from '../ChatBubble/ChatBubble';

interface LongPressOverlayProps {
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

const SelectIcon: React.FC<{ style?: ViewStyle; color?: string }> = ({
  style,
  color = '#111827',
}) => (
  <View
    style={[
      {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1.5,
        borderColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      },
      style,
    ]}
  >
    <View
      style={{
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: color,
      }}
    />
  </View>
);

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
        return flags?.enableCopy !== false;
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

/**
 * Position the menu directly below the bubble; flip above when the bubble
 * is too close to the bottom. Horizontally aligns to the bubble side.
 */
function resolveMenuPosition(
  anchor: MessageActionAnchor,
  popoverWidth: number,
  rowHeight: number,
  rowCount: number
) {
  const screen = Dimensions.get('window');
  const margin = 8;
  const popoverHeight = rowHeight * rowCount + 12;

  let left: number;
  if (anchor.isCurrentUser) {
    left = anchor.x + anchor.width - popoverWidth;
  } else {
    left = anchor.x;
  }
  left = Math.max(margin, Math.min(left, screen.width - popoverWidth - margin));

  const spaceBelow = screen.height - (anchor.y + anchor.height);
  const placeBelow = spaceBelow >= popoverHeight + margin;

  return {
    left,
    top: placeBelow
      ? anchor.y + anchor.height + 8
      : Math.max(margin, anchor.y - popoverHeight - 8),
  };
}

export const LongPressOverlay: React.FC<LongPressOverlayProps> = ({
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
  const scrim = ui?.scrimColor ?? 'rgba(0,0,0,0.55)';

  const ROW_HEIGHT = 36;
  const menuPosition = useMemo(() => {
    if (!anchor) return null;
    return resolveMenuPosition(anchor, width, ROW_HEIGHT, actions.length);
  }, [anchor, width, actions.length]);

  if (!message || !anchor) return null;

  // The bubble's `my-1` margin means measureInWindow reported a y that is
  // 4px below the visual top of the bubble. Compensate so the lifted clone
  // sits in the exact same place as the original.
  const bubbleTop = Math.max(0, anchor.y - 4);

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
        style={[tw`flex-1`, { backgroundColor: scrim }]}
      >
        {/* Lifted bubble — actual content rendered above the scrim.
            `px-2` matches the host chat's left/right padding so the lifted
            clone sits at exactly the same horizontal offset as the original. */}
        <View
          pointerEvents="none"
          style={[
            tw`px-2`,
            {
              position: 'absolute',
              top: bubbleTop,
              left: 0,
              right: 0,
            },
          ]}
        >
          <ChatBubble
            message={message}
            isCurrentUser={anchor.isCurrentUser}
            isFirstInSequence={anchor.isFirstInSequence}
            staticMode
          />
        </View>

        {/* Anchored action menu */}
        {menuPosition && (
          <Pressable
            onPress={() => {}}
            style={[
              tw`absolute overflow-hidden`,
              {
                width,
                borderRadius: radius,
                backgroundColor: bg,
                top: menuPosition.top,
                left: menuPosition.left,
                shadowColor: '#000',
                shadowOpacity: 0.18,
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
                    tw`flex-row items-center px-3`,
                    { height: ROW_HEIGHT },
                    ui?.rowStyle,
                  ]}
                >
                  <View style={{ width: 16, height: 16, marginRight: 10 }}>
                    <a.Icon
                      style={{ width: 16, height: 16 }}
                      color={ic}
                    />
                  </View>
                  <Text
                    style={withFontFamily(
                      [
                        tw`text-[13px] font-medium`,
                        { color },
                        ui?.rowTextStyle,
                      ],
                      fontFamily
                    )}
                  >
                    {a.label}
                  </Text>
                </Pressable>
              );
            })}
          </Pressable>
        )}
      </Pressable>
    </Modal>
  );
};
