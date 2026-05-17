import { useCallback, useEffect, useRef, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { RecordingResult } from '../types';

export type RecordingStatus = 'idle' | 'recording' | 'paused';

interface UseVoiceRecorderOptions {
  maxDuration?: number;
  onRecordStart?: () => void;
  onRecordEnd?: (result: RecordingResult) => void;
}

async function requestMicPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'This app needs access to your microphone to record audio.',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  }
  // iOS: permissions are handled natively by AVFoundation when recording starts
  return true;
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
    (onMax: () => void) => {
      stopTimer();
      timerRef.current = setInterval(() => {
        durationRef.current += 1;
        setDuration(durationRef.current);
        if (durationRef.current >= maxDurationRef.current) onMax();
      }, 1000);
    },
    [stopTimer]
  );

  const startRecording = useCallback(async () => {
    let AudioRecord: any;
    try {
      AudioRecord = require('react-native-audio-record').default;
    } catch {
      console.error(
        '[movius-chats] Voice recording requires react-native-audio-record. ' +
          'Install it: yarn add react-native-audio-record'
      );
      return;
    }

    const granted = await requestMicPermission();
    if (!granted) {
      console.warn('[movius-chats] Microphone permission denied.');
      return;
    }

    try {
      AudioRecord.init({
        sampleRate: 16000,
        channels: 1,
        bitsPerSample: 16,
        audioSource: 6,
        wavFile: `movius_rec_${Date.now()}.wav`,
      });

      AudioRecord.start();
      recordingRef.current = AudioRecord;
      durationRef.current = 0;
      setDuration(0);
      setStatus('recording');

      startTimer(() => stopRecordingRef.current());

      onRecordStartRef.current?.();
    } catch (e) {
      console.warn('[movius-chats] Failed to start recording:', e);
    }
  }, [startTimer]);

  const pauseRecording = useCallback(async () => {
    if (!recordingRef.current) return;
    try {
      recordingRef.current.stop();
      setStatus('paused');
      stopTimer();
    } catch (e) {
      console.warn('[movius-chats] Failed to pause:', e);
    }
  }, [stopTimer]);

  const resumeRecording = useCallback(async () => {
    if (!recordingRef.current) return;
    try {
      recordingRef.current.start();
      setStatus('recording');
      startTimer(() => stopRecordingRef.current());
    } catch (e) {
      console.warn('[movius-chats] Failed to resume:', e);
    }
  }, [startTimer]);

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
      const uri: string = await rec.stop();
      if (!uri) return null;

      const result: RecordingResult = {
        uri: uri.startsWith('file://') ? uri : `file://${uri}`,
        duration: Math.max(1, capturedDuration),
        mimeType: 'audio/wav',
      };

      onRecordEndRef.current?.(result);
      return result;
    } catch (e) {
      console.warn('[movius-chats] Failed to stop recording:', e);
      return null;
    }
  }, [stopTimer]);

  const stopRecordingRef = useRef(stopRecordingImpl);
  stopRecordingRef.current = stopRecordingImpl;

  const stopRecording = useCallback(() => stopRecordingRef.current(), []);

  const cancelRecording = useCallback(async () => {
    const rec = recordingRef.current;
    stopTimer();
    recordingRef.current = null;
    durationRef.current = 0;
    setStatus('idle');
    setDuration(0);

    if (rec) {
      try {
        const uri: string = await rec.stop();
        if (uri) {
          try {
            const RNFS = require('react-native-fs');
            const path = uri.startsWith('file://') ? uri.slice(7) : uri;
            await RNFS.unlink(path);
          } catch {}
        }
      } catch {}
    }
  }, [stopTimer]);

  useEffect(() => {
    return () => {
      stopTimer();
      try { recordingRef.current?.stop(); } catch {}
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
