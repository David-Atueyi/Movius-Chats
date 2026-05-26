import React from 'react';
import {
  COLOR_BAR_BG_FALLBACK,
  COLOR_CANCEL_TEXT,
  COLOR_HOLD_PILL_BG_FALLBACK,
  COLOR_LIGHT,
  COLOR_LOCK_PILL_BG_FALLBACK,
  COLOR_MUTED,
  COLOR_PRIMARY_FALLBACK,
  COLOR_RED,
  COLOR_WHITE,
  DEFAULT_CANCEL_DISTANCE,
  DEFAULT_HOLD_SCALE,
  DEFAULT_ICON_SIZE,
  DEFAULT_INPUT_BAR_HEIGHT,
  DEFAULT_LOCK_DISTANCE,
  DEFAULT_LOCK_ICON_SIZE,
  DEFAULT_WAVE_COUNT,
} from './constants';
import { InlineRow } from './InlineRow';
import { RecordingBar } from './RecordingBar';
import { useFlowController } from './useFlowController';
import type { VoiceRecorderFlowProps } from './types';

export type {
  RecordingState,
  VoiceRecorderFlowAudio,
  VoiceRecorderFlowProps,
} from './types';

export const VoiceRecorderFlow: React.FC<VoiceRecorderFlowProps> = (props) => {
  const {
    primaryColor = COLOR_PRIMARY_FALLBACK,
    backgroundColor = COLOR_BAR_BG_FALLBACK,
    holdPillBackground = COLOR_HOLD_PILL_BG_FALLBACK,
    timerColor = COLOR_WHITE,
    microphoneColor = COLOR_WHITE,
    lockColor = COLOR_LIGHT,
    waveformColor = COLOR_LIGHT,
    deleteIconColor = COLOR_MUTED,
    cancelTextColor = COLOR_CANCEL_TEXT,
    chevronColor,
    pauseIconColor = COLOR_RED,
    lockPillBackground = COLOR_LOCK_PILL_BG_FALLBACK,
    inputBarHeight = DEFAULT_INPUT_BAR_HEIGHT,
    micSize: micSizeProp,
    holdMicScale = DEFAULT_HOLD_SCALE,
    iconSize = DEFAULT_ICON_SIZE,
    lockIconSize = DEFAULT_LOCK_ICON_SIZE,
    enableLockRecording = true,
    enableSlideToCancel = true,
    enableWaveform = true,
    lockSlideDistance = DEFAULT_LOCK_DISTANCE,
    cancelSlideDistance = DEFAULT_CANCEL_DISTANCE,
    waveCount = DEFAULT_WAVE_COUNT,
    renderInputPill,
    renderMicIcon,
    renderSendIcon,
    renderLockIcon,
    renderArrowIcon,
    renderDeleteIcon,
    renderPauseIcon,
    renderPlayIcon,
    renderWaveform,
    containerStyle,
    barStyle,
    timerTextStyle,
    slideTextStyle,
    waveformStyle,
    lockPillStyle,
    trashButtonStyle,
    sendButtonStyle,
    onRecordingStart,
    onRecordingStop,
    onSend,
    onDelete,
    onLock,
    onCancel,
    onPauseRecording,
    onResumeRecording,
    onStateChange,
  } = props;

  const micSize = micSizeProp ?? inputBarHeight;
  const resolvedChevronColor = chevronColor ?? lockColor;

  const flow = useFlowController({
    cancelSlideDistance,
    lockSlideDistance,
    enableLockRecording,
    enableSlideToCancel,
    holdMicScale,
    onRecordingStart,
    onRecordingStop,
    onSend,
    onDelete,
    onLock,
    onCancel,
    onPauseRecording,
    onResumeRecording,
    onStateChange,
  });

  const isFullBar =
    flow.state === 'RECORDING_TAP' ||
    flow.state === 'LOCKED_RECORDING' ||
    flow.state === 'SENDING';

  if (isFullBar) {
    return (
      <RecordingBar
        duration={flow.duration}
        isPaused={flow.isPaused}
        composedGesture={flow.composedGesture}
        micWrapperStyle={flow.micWrapperStyle}
        pausePulseStyle={flow.pausePulseStyle}
        recDotStyle={flow.recDotStyle}
        waveTick={flow.waveTick}
        onCancelPress={flow.triggerCancel}
        onTogglePause={flow.togglePause}
        backgroundColor={backgroundColor}
        timerColor={timerColor}
        waveformColor={waveformColor}
        deleteIconColor={deleteIconColor}
        pauseIconColor={pauseIconColor}
        primaryColor={primaryColor}
        micSize={micSize}
        iconSize={iconSize}
        inputBarHeight={inputBarHeight}
        waveCount={waveCount}
        enableWaveform={enableWaveform}
        renderDeleteIcon={renderDeleteIcon}
        renderPauseIcon={renderPauseIcon}
        renderPlayIcon={renderPlayIcon}
        renderSendIcon={renderSendIcon}
        renderWaveform={renderWaveform}
        containerStyleOverride={containerStyle}
        barStyleOverride={barStyle}
        timerTextStyle={timerTextStyle}
        waveformStyle={waveformStyle}
        trashButtonStyle={trashButtonStyle}
        sendButtonStyle={sendButtonStyle}
      />
    );
  }

  return (
    <InlineRow
      isHold={flow.state === 'RECORDING_HOLD'}
      duration={flow.duration}
      composedGesture={flow.composedGesture}
      micWrapperStyle={flow.micWrapperStyle}
      slideTextAnimatedStyle={flow.slideTextAnimatedStyle}
      lockPillAnimatedStyle={flow.lockPillAnimatedStyle}
      chevronAnimatedStyle={flow.chevronAnimatedStyle}
      primaryColor={primaryColor}
      microphoneColor={microphoneColor}
      timerColor={timerColor}
      cancelTextColor={cancelTextColor}
      holdPillBackground={holdPillBackground}
      lockPillBackground={lockPillBackground}
      lockColor={lockColor}
      chevronColor={resolvedChevronColor}
      iconSize={iconSize}
      lockIconSize={lockIconSize}
      inputBarHeight={inputBarHeight}
      micSize={micSize}
      enableLockRecording={enableLockRecording}
      renderInputPill={renderInputPill}
      renderMicIcon={renderMicIcon}
      renderArrowIcon={renderArrowIcon}
      renderLockIcon={renderLockIcon}
      containerStyleOverride={containerStyle}
      timerTextStyle={timerTextStyle}
      slideTextStyleOverride={slideTextStyle}
      lockPillStyleOverride={lockPillStyle}
      sendButtonStyle={sendButtonStyle}
    />
  );
};

export default VoiceRecorderFlow;
