import React from 'react';
import { ChatScreenProps } from './types';
declare const ChatScreen: React.FC<ChatScreenProps>;
export { VoiceRecorder, type VoiceRecorderProps, } from './components/VoiceRecorder/VoiceRecorder';
export { VoiceRecordingGesture, type VoiceRecordingGestureProps, } from './components/VoiceRecorder/VoiceRecordingGesture';
export { VoiceRecorderFlow, type VoiceRecorderFlowProps, type VoiceRecorderFlowAudio, type RecordingState, } from './components/VoiceRecorder/VoiceRecorderFlow';
export default ChatScreen;
