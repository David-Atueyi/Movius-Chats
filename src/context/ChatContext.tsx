import React, { createContext, useCallback, useContext, useState } from 'react';
import {
  ChatScreenProps,
  Message,
  MessageActionAnchor,
  MessageMediaItem,
} from '../types';

/** Full-screen swipe viewer state */
export interface MediaViewerGalleryState {
  items: MessageMediaItem[];
  initialIndex: number;
}

interface ChatContextType extends ChatScreenProps {
  mediaViewerGallery: MediaViewerGalleryState | null;
  setMediaViewerGallery: (
    items: MessageMediaItem[],
    initialIndex: number
  ) => void;
  clearMediaViewerGallery: () => void;
  isVideoPlaying: boolean;
  setIsVideoPlaying: (playing: boolean) => void;

  // ── Reply state ─────────────────────────────────────────────────────────
  /** The message currently being replied to (null when no draft reply). */
  replyTarget: Message | null;
  /** Begin a reply. Mirrors `onReplyMessage`. */
  startReply: (message: Message) => void;
  /** Cancel the current reply draft. */
  cancelReply: () => void;

  // ── Long-press action popover state ─────────────────────────────────────
  actionSheetMessage: Message | null;
  /** Anchor info captured at long-press time so the popover can position itself. */
  actionAnchor: MessageActionAnchor | null;
  openActionSheet: (message: Message, anchor?: MessageActionAnchor) => void;
  closeActionSheet: () => void;

  // ── Multi-select mode ───────────────────────────────────────────────────
  selectionMode: boolean;
  selectedIds: string[];
  enterSelectionMode: (initial?: Message) => void;
  exitSelectionMode: () => void;
  toggleSelection: (message: Message) => void;
  isSelected: (id: string) => boolean;

  // ── Edit-message draft state ────────────────────────────────────────────
  editingMessage: Message | null;
  startEdit: (message: Message) => void;
  cancelEdit: () => void;

  // ── Built-in camera modal state ─────────────────────────────────────────
  cameraVisible: boolean;
  openCamera: () => void;
  closeCamera: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<
  ChatScreenProps & { children: React.ReactNode }
> = ({ children, ...props }) => {
  const [mediaViewerGallery, setMediaViewerGalleryState] =
    useState<MediaViewerGalleryState | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const [replyTarget, setReplyTarget] = useState<Message | null>(null);
  const [actionSheetMessage, setActionSheetMessage] = useState<Message | null>(
    null
  );
  const [actionAnchor, setActionAnchor] =
    useState<MessageActionAnchor | null>(null);

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  const [cameraVisible, setCameraVisible] = useState(false);

  const setMediaViewerGallery = useCallback(
    (items: MessageMediaItem[], initialIndex: number) => {
      setMediaViewerGalleryState({ items, initialIndex });
      const cur = items[initialIndex];
      setIsVideoPlaying(cur?.kind === 'video');
    },
    []
  );

  const clearMediaViewerGallery = useCallback(() => {
    setMediaViewerGalleryState(null);
    setIsVideoPlaying(false);
  }, []);

  const onSelectionChangeRef = props.onSelectionChange;
  const emitSelection = useCallback(
    (ids: string[]) => {
      onSelectionChangeRef?.(ids);
    },
    [onSelectionChangeRef]
  );

  const startReply = useCallback(
    (message: Message) => {
      setReplyTarget(message);
      setEditingMessage(null);
      props.onReplyMessage?.(message);
    },
    [props]
  );

  const cancelReply = useCallback(() => {
    setReplyTarget(null);
  }, []);

  const openActionSheet = useCallback(
    (message: Message, anchor?: MessageActionAnchor) => {
      setActionAnchor(anchor ?? null);
      setActionSheetMessage(message);
    },
    []
  );
  const closeActionSheet = useCallback(() => {
    setActionSheetMessage(null);
    setActionAnchor(null);
  }, []);

  const enterSelectionMode = useCallback(
    (initial?: Message) => {
      setSelectionMode(true);
      const next = initial ? [initial.id] : [];
      setSelectedIds(next);
      emitSelection(next);
    },
    [emitSelection]
  );
  const exitSelectionMode = useCallback(() => {
    setSelectionMode(false);
    setSelectedIds([]);
    emitSelection([]);
  }, [emitSelection]);

  const toggleSelection = useCallback(
    (message: Message) => {
      setSelectedIds((prev) => {
        const next = prev.includes(message.id)
          ? prev.filter((id) => id !== message.id)
          : [...prev, message.id];
        emitSelection(next);
        return next;
      });
    },
    [emitSelection]
  );

  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds]
  );

  const startEdit = useCallback((message: Message) => {
    setEditingMessage(message);
    setReplyTarget(null);
  }, []);
  const cancelEdit = useCallback(() => {
    setEditingMessage(null);
  }, []);

  const openCamera = useCallback(() => setCameraVisible(true), []);
  const closeCamera = useCallback(() => setCameraVisible(false), []);

  return (
    <ChatContext.Provider
      value={{
        ...props,
        mediaViewerGallery,
        setMediaViewerGallery,
        clearMediaViewerGallery,
        isVideoPlaying,
        setIsVideoPlaying,
        replyTarget,
        startReply,
        cancelReply,
        actionSheetMessage,
        actionAnchor,
        openActionSheet,
        closeActionSheet,
        selectionMode,
        selectedIds,
        enterSelectionMode,
        exitSelectionMode,
        toggleSelection,
        isSelected,
        editingMessage,
        startEdit,
        cancelEdit,
        cameraVisible,
        openCamera,
        closeCamera,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
