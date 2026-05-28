import React, { useMemo } from 'react';
import { Dimensions, Modal, Pressable, Text, View } from 'react-native';
import tw from 'twrnc';
import type {
  Message,
  MessageActionAnchor,
  MessageActionFlags,
  MessageActionIconComponents,
  MessageActionId,
  MessageActionLabels,
  MessageActionUIProps,
} from '../../types';
import {
  buildMessageActions,
  mergeMessageActionIcons,
  mergeMessageActionLabels,
  mergeMessageActionUI,
} from '../../utils/messageActions';
import { withFontFamily } from '../../utils/theme';
import ChatBubble from '../ChatBubble/ChatBubble';

interface LongPressOverlayProps {
  message: Message | null;
  anchor: MessageActionAnchor | null;
  visible: boolean;
  onClose: () => void;
  flags?: MessageActionFlags;
  ui?: MessageActionUIProps;
  labels?: MessageActionLabels;
  icons?: MessageActionIconComponents;
  fontFamily?: string;
  onAction: (id: MessageActionId, message: Message) => void;
}

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
  labels,
  icons,
  fontFamily,
  onAction,
}) => {
  const mergedUI = useMemo(() => mergeMessageActionUI(undefined, ui), [ui]);
  const mergedLabels = useMemo(
    () => mergeMessageActionLabels(undefined, labels),
    [labels]
  );
  const mergedIcons = useMemo(
    () => mergeMessageActionIcons(undefined, icons),
    [icons]
  );

  const actions = useMemo(
    () =>
      message
        ? buildMessageActions(
            message,
            flags,
            mergedLabels,
            mergedIcons,
            anchor?.isCurrentUser
          )
        : [],
    [message, flags, mergedLabels, mergedIcons, anchor]
  );

  const width = mergedUI.width ?? 200;
  const radius = mergedUI.borderRadius ?? 12;
  const bg = mergedUI.backgroundColor ?? '#FFFFFF';
  const text = mergedUI.textColor ?? '#111827';
  const icon = mergedUI.iconColor ?? text;
  const destructive = mergedUI.destructiveColor ?? '#EF4444';
  const scrim = mergedUI.scrimColor ?? 'rgba(0,0,0,0.60)';
  const ROW_HEIGHT = mergedUI.rowHeight ?? 36;
  const ICON_SIZE = mergedUI.iconSize ?? 16;
  const liftedPadding = mergedUI.liftedBubblePaddingHorizontal ?? 8;

  const menuPosition = useMemo(() => {
    if (!anchor) return null;
    return resolveMenuPosition(anchor, width, ROW_HEIGHT, actions.length);
  }, [anchor, width, ROW_HEIGHT, actions.length]);

  if (!message || !anchor) return null;

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
        style={[
          tw`flex-1 pt-10`,
          { backgroundColor: scrim },
          mergedUI.scrimPressableStyle,
        ]}
      >
        <View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              top: bubbleTop,
              left: 0,
              right: 0,
              paddingHorizontal: liftedPadding,
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
              mergedUI.menuStyle,
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
                    mergedUI.rowStyle,
                  ]}
                >
                  <View
                    style={{
                      width: ICON_SIZE,
                      height: ICON_SIZE,
                      marginRight: 10,
                    }}
                  >
                    <a.Icon
                      style={{ width: ICON_SIZE, height: ICON_SIZE }}
                      color={ic}
                    />
                  </View>
                  <Text
                    style={withFontFamily(
                      [
                        tw`text-[13px] font-medium`,
                        { color },
                        mergedUI.rowTextStyle,
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
