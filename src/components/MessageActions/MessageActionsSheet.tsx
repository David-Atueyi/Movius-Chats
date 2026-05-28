import React from 'react';
import {
  Modal,
  Pressable,
  Text,
  TextStyle,
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
  MessageActionFlags,
  MessageActionId,
} from '../../types';
import { withFontFamily } from '../../utils/theme';

interface MessageActionsSheetProps {
  message: Message | null;
  visible: boolean;
  onClose: () => void;
  flags?: MessageActionFlags;
  fontFamily?: string;
  backgroundColor?: string;
  textColor?: string;
  iconColor?: string;
  destructiveColor?: string;
  rowStyle?: ViewStyle;
  rowTextStyle?: TextStyle;
  onAction: (id: MessageActionId, message: Message) => void;
}

interface Action {
  id: MessageActionId;
  label: string;
  Icon: React.FC<{ style?: ViewStyle; color?: string }>;
  destructive?: boolean;
}

const buildActions = (flags: MessageActionFlags | undefined): Action[] => {
  const all: Action[] = [
    { id: 'reply', label: 'Reply', Icon: ReplyIcon },
    { id: 'copy', label: 'Copy', Icon: CopyIcon },
    { id: 'edit', label: 'Edit', Icon: EditIcon },
    { id: 'forward', label: 'Forward', Icon: ForwardIcon },
    { id: 'delete', label: 'Delete', Icon: TrashIcon, destructive: true },
  ];
  return all.filter((a) => {
    switch (a.id) {
      case 'reply':
        return flags?.enableReply !== false;
      case 'copy':
        return flags?.enableCopy !== false;
      case 'edit':
        return flags?.enableEdit !== false;
      case 'delete':
        return flags?.enableDelete !== false;
      case 'forward':
        return flags?.enableForward !== false;
      default:
        return true;
    }
  });
};

export const MessageActionsSheet: React.FC<MessageActionsSheetProps> = ({
  message,
  visible,
  onClose,
  flags,
  fontFamily,
  backgroundColor = '#1f2937',
  textColor = '#FFFFFF',
  iconColor = '#FFFFFF',
  destructiveColor = '#ef4444',
  rowStyle,
  rowTextStyle,
  onAction,
}) => {
  if (!message) return null;
  const actions = buildActions(flags);

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
        style={tw`flex-1 bg-black/50 justify-end`}
      >
        <Pressable
          onPress={() => {}}
          style={[
            tw`mx-3 mb-6 rounded-2xl overflow-hidden`,
            { backgroundColor },
          ]}
        >
          {actions.map((a, i) => {
            const color = a.destructive ? destructiveColor : textColor;
            const ic = a.destructive ? destructiveColor : iconColor;
            return (
              <Pressable
                key={a.id}
                onPress={() => {
                  onAction(a.id, message);
                }}
                style={[
                  tw`flex-row items-center justify-between px-5 py-4`,
                  i !== 0
                    ? {
                        borderTopWidth: 0.5,
                        borderTopColor: 'rgba(255,255,255,0.08)',
                      }
                    : null,
                  rowStyle,
                ]}
              >
                <Text
                  style={withFontFamily(
                    [
                      tw`text-[16px] font-medium`,
                      { color },
                      rowTextStyle,
                    ],
                    fontFamily
                  )}
                >
                  {a.label}
                </Text>
                <View style={{ width: 22, height: 22 }}>
                  <a.Icon
                    style={{ width: 22, height: 22 }}
                    color={ic}
                  />
                </View>
              </Pressable>
            );
          })}
        </Pressable>

        <Pressable
          onPress={onClose}
          style={[
            tw`mx-3 mb-3 rounded-2xl py-4 items-center`,
            { backgroundColor },
          ]}
        >
          <Text
            style={withFontFamily(
              [
                tw`text-[16px] font-semibold`,
                { color: textColor },
              ],
              fontFamily
            )}
          >
            Cancel
          </Text>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
