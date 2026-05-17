import { useCallback, useEffect, useRef, useState } from 'react';
import { RecordingResult } from '../types';

export type RecordingStatus = 'idle' | 'recording' | 'paused';

interface UseVoiceRecorderOptions {
  maxDuration?: number;
  onRecordStart?: () => void;
  onRecordEnd?: (result: RecordingResult) => void;
}

export function useVoiceRecorder({
  maxDuration = 300,
  onRecordStart,
  onRecordEnd,
}: UseVoiceRecorderOptions = {}) {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [duration, setDuration] = useState(0);

  const recordingRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const durationRef = useRef(0);

  // Keep callback refs stable so the PanResponder (created once) always calls the latest version
  const onRecordEndRef = useRef(onRecordEnd);
  onRecordEndRef.current = onRecordEnd;
  const onRecordStartRef = useRef(onRecordStart);
  onRecordStartRef.current = onRecordStart;
  const maxDurationRef = useRef(maxDuration);
  maxDurationRef.current = maxDuration;

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (onMaxDuration: () => void) => {
      stopTimer();
      timerRef.current = setInterval(() => {
        durationRef.current += 1;
        setDuration(durationRef.current);
        if (durationRef.current >= maxDurationRef.current) {
          onMaxDuration();
        }
      }, 1000);
    },
    [stopTimer]
  );

  const startRecording = useCallback(async () => {
    let Audio: any;
    try {
      Audio = require('expo-av').Audio;
    } catch {
      console.error(
        '[movius-chats] Voice recording requires expo-av. ' +
          'Install it with: bun add expo-av'
      );
      return;
    }

    try {
      const { status: permStatus } = await Audio.requestPermissionsAsync();
      if (permStatus !== 'granted') {
        console.warn('[movius-chats] Microphone permission denied.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      await recording.startAsync();

      recordingRef.current = recording;
      durationRef.current = 0;
      setDuration(0);
      setStatus('recording');

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      startTimer(() => stopRecording());

      onRecordStartRef.current?.();
    } catch (e) {
      console.warn('[movius-chats] Failed to start recording:', e);
    }
  }, [startTimer]); // stopRecording defined below — used via ref

  const pauseRecording = useCallback(async () => {
    if (!recordingRef.current) return;
    try {
      await recordingRef.current.pauseAsync();
      setStatus('paused');
      stopTimer();
    } catch (e) {
      console.warn('[movius-chats] Failed to pause:', e);
    }
  }, [stopTimer]);

  const resumeRecording = useCallback(async () => {
    if (!recordingRef.current) return;
    try {
      await recordingRef.current.startAsync();
      setStatus('recording');
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      startTimer(() => stopRecording());
    } catch (e) {
      console.warn('[movius-chats] Failed to resume:', e);
    }
  }, [startTimer]);

  // Exposed as a stable ref so the timer callback (closed at creation) can call it
  const stopRecordingImpl = useCallback(async (): Promise<RecordingResult | null> => {
    const rec = recordingRef.current;
    if (!rec) return null;

    stopTimer();
    recordingRef.current = null;
    const capturedDuration = durationRef.current;
    durationRef.current = 0;
    setStatus('idle');
    setDuration(0);

    try {
      await rec.stopAndUnloadAsync();
      const uri = rec.getURI() as string | null;
      if (!uri) return null;

      let durMs = capturedDuration * 1000;
      try {
        const st = await rec.getStatusAsync();
        if (st?.durationMillis) durMs = st.durationMillis;
      } catch {}

      const result: RecordingResult = {
        uri,
        duration: Math.max(1, Math.round(durMs / 1000)),
        mimeType: 'audio/m4a',
      };

      onRecordEndRef.current?.(result);
      return result;
    } catch (e) {
      console.warn('[movius-chats] Failed to stop recording:', e);
      return null;
    }
  }, [stopTimer]);

  // Stable ref so the timer closure can call the latest implementation
  const stopRecordingRef = useRef(stopRecordingImpl);
  stopRecordingRef.current = stopRecordingImpl;

  const stopRecording = useCallback(
    () => stopRecordingRef.current(),
    []
  );

  const cancelRecording = useCallback(async () => {
    const rec = recordingRef.current;
    stopTimer();
    recordingRef.current = null;
    durationRef.current = 0;
    setStatus('idle');
    setDuration(0);

    if (rec) {
      try {
        await rec.stopAndUnloadAsync();
        const uri = rec.getURI() as string | null;
        if (uri) {
          try {
            const { deleteAsync } = require('expo-file-system');
            await deleteAsync(uri, { idempotent: true });
          } catch {}
        }
      } catch {}
    }
  }, [stopTimer]);

  useEffect(() => {
    return () => {
      stopTimer();
      recordingRef.current?.stopAndUnloadAsync().catch(() => {});
    };
  }, [stopTimer]);

  return {
    status,
    duration,
    isRecording: status === 'recording',
    isPaused: status === 'paused',
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    cancelRecording,
  };
}
