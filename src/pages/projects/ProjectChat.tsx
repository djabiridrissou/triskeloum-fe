// pages/ProjectChat.tsx (VERSION CONVERSATIONNELLE)

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  useConversationHistoryQuery,
  useConversationalSearchMutation,
  useConversationalVoiceSearchMutation
} from '../../services/api';
import ChatInput from '../../components/chat/ChatInput';
import ChatMessage from '../../components/chat/ChatMessage';
import ThreadControls from '../../components/chat/ThreadControls'; // ✅ NOUVEAU
import { ChatStyles } from '../../components/chat/ChatStyles';
import VoiceStatusBar from '../../components/VoiceStatusBar';
import { useContinuousListening } from '../../hooks/voice';
import { useConversationThread } from '../../hooks/useConversationThread'; // ✅ NOUVEAU
import { BASE_URL } from '../../services/axios';

const ProjectChat: React.FC = () => {
  const { projectId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [before, setBefore] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [query, setQuery] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // ✅ NOUVEAU - Gestion du thread conversationnel
  const {
    threadId,
    isNewThread,
    isLoadingThread,
    resetThread,
    updateThreadId
  } = useConversationThread({
    projectId: projectId || '',
    enabled: !!projectId
  });

  console.log('🧵 Thread State:', { threadId, isNewThread, isLoadingThread });

  const { data, isLoading, isFetching } = useConversationHistoryQuery(
    {
      projectId,
      ...(before && { before }),
      limit: 30
    },
    { skip: !projectId }
  );

  // ✅ NOUVEAU - Mutations conversationnelles
  const [sendMessage, { isLoading: isSending }] = useConversationalSearchMutation();
  const [sendVoiceMessage, { isLoading: isSendingVoice }] = useConversationalVoiceSearchMutation();

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior });
  };

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
      setShowScrollButton(!isNearBottom);
    };

    const scrollElement = scrollRef.current;
    scrollElement?.addEventListener('scroll', handleScroll);
    return () => scrollElement?.removeEventListener('scroll', handleScroll);
  }, []);

  // Load initial messages
  useEffect(() => {
    if (data?.success && !before) {
      const sortedMessages = [...data.data.conversations].sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      setMessages(sortedMessages);
      setHasMore(data.data.hasMore);
      setTimeout(() => scrollToBottom('auto'), 100);
    }
  }, [data, before]);

  // Load more messages
  useEffect(() => {
    if (data?.success && before) {
      const sortedNewMessages = [...data.data.conversations].sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      setMessages(prev => [...sortedNewMessages, ...prev]);
      setHasMore(data.data.hasMore);
    }
  }, [data, before]);

  // Infinite scroll
  useEffect(() => {
    if (!topRef.current || !hasMore || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          const oldestMessage = messages[0];
          if (oldestMessage) {
            setBefore(oldestMessage.createdAt);
          }
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(topRef.current);
    return () => observer.disconnect();
  }, [hasMore, isFetching, messages]);

  const handleWakeWord = useCallback(() => {
    if (!isRecording && !isProcessingAudio && !isPlayingAudio) {
      console.log('🎯 Wake word detected! Starting recording...');

      const audio = new Audio('/sounds/acknowledgment.mp3');
      audio.volume = 1.0;
      audio.play().catch(() => console.log('No acknowledgment sound'));

      setTimeout(() => {
        startRecording();
      }, 300);
    }
  }, [isRecording, isProcessingAudio, isPlayingAudio]);

  const { isListening, status: listeningStatus } = useContinuousListening({
    onWakeWordDetected: handleWakeWord,
    enabled: voiceEnabled && !isRecording && !isProcessingAudio && !isPlayingAudio,
    projectId
  });

  const playAudioResponse = async (audioUrl: string) => {
    return new Promise<void>((resolve) => {
      const audio = new Audio(`${BASE_URL}/voice/${audioUrl}`);
      currentAudioRef.current = audio;

      audio.onended = () => {
        setIsPlayingAudio(false);
        currentAudioRef.current = null;
        resolve();
      };

      audio.onerror = () => {
        setIsPlayingAudio(false);
        currentAudioRef.current = null;
        resolve();
      };

      setIsPlayingAudio(true);
      audio.play().catch((error) => {
        console.error('Audio playback error:', error);
        setIsPlayingAudio(false);
        resolve();
      });
    });
  };

  // ✅ NOUVEAU - Text Search Conversationnel
  const handleSend = async () => {
    if (!query.trim() || isSending) return;

    const userMessage = {
      id: `temp-${Date.now()}`,
      query: query,
      answer: '',
      mode: 'text',
      createdAt: new Date().toISOString(),
      isTemp: true
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setTimeout(() => scrollToBottom(), 50);

    try {
      const response = await sendMessage({
        query,
        projectId,
        threadId, // ✅ Passer le threadId
        limit: 30
      }).unwrap();

      console.log('📨 Response:', response);

      // ✅ Update threadId si c'est un nouveau thread
      if (!threadId && response.data.conversational?.threadId) {
        updateThreadId(response.data.conversational.threadId);
      }

      setMessages(prev =>
        prev.map(m =>
          m.id === userMessage.id
            ? {
              id: response.data.conversationId,
              query: response.data.query || query,
              answer: response.data.answer,
              language: response.data.language,
              mode: 'text',
              sourcesCount: response.data.totalSources,
              conversational: response.data.conversational, // ✅ Metadata conversationnel
              createdAt: new Date().toISOString()
            }
            : m
        )
      );

      setTimeout(() => scrollToBottom(), 100);
    } catch (error) {
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
      console.error('Send message error:', error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        await handleAudioSend(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopRecording();
        }
      }, 10000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // ✅ NOUVEAU - Voice Search Conversationnel
  const handleAudioSend = async (blob: Blob) => {
    setIsProcessingAudio(true);

    const userMessage = {
      id: `temp-audio-${Date.now()}`,
      query: 'Processing audio...',
      answer: '',
      mode: 'voice',
      createdAt: new Date().toISOString(),
      isTemp: true
    };

    setMessages(prev => [...prev, userMessage]);
    setTimeout(() => scrollToBottom(), 50);

    try {
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');
      formData.append('projectId', projectId || '');
      formData.append('threadId', threadId || ''); // ✅ Passer threadId
      formData.append('limit', '30');

      // ✅ Utiliser la mutation RTK Query
      const response = await sendVoiceMessage(formData).unwrap();

      console.log('🎤 Voice Response:', response);

      if (response.success) {
        const responseData = response.data;

        // ✅ Update threadId si nouveau thread
        if (!threadId && responseData.conversational?.threadId) {
          updateThreadId(responseData.conversational.threadId);
        }

        setMessages(prev =>
          prev.map(m =>
            m.id === userMessage.id
              ? {
                id: responseData.conversationId,
                query: responseData.transcription,
                answer: responseData.answer,
                language: responseData.detectedLanguage || responseData.language,
                mode: 'voice',
                audioUrl: responseData.audioUrl,
                sourcesCount: responseData.totalSources,
                conversational: responseData.conversational, // ✅ Metadata conversationnel
                createdAt: new Date().toISOString(),
                isTemp: false
              }
              : m
          )
        );

        setTimeout(() => scrollToBottom(), 100);

        // Auto-play si voice mode activé
        if (voiceEnabled && responseData.audioUrl) {
          await playAudioResponse(responseData.audioUrl);
        }
      }
    } catch (error: any) {
      console.error('Voice search error:', error);
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
      alert('Voice search failed: ' + (error.data?.message || error.message));
    } finally {
      setIsProcessingAudio(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await handleAudioSend(file);
    }
    event.target.value = '';
  };

  const toggleVoiceMode = () => {
    setVoiceEnabled(!voiceEnabled);
    if (voiceEnabled && currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsPlayingAudio(false);
    }
  };

  // ✅ NOUVEAU - Handler pour nouvelle conversation
  const handleNewConversation = () => {
    resetThread();
    // Optionnel: Clear messages localement aussi
    // setMessages([]);
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-50 max-h-[800px] relative">
      <ChatStyles />

      {/* ✅ NOUVEAU - Thread Controls */}
      {threadId && (
        <ThreadControls
          threadId={threadId}
          projectId={projectId || ''}
          onReset={handleNewConversation}
        />
      )}

      {/* Voice Status Bar */}
      {voiceEnabled && (
        <VoiceStatusBar
          isListening={isListening}
          isRecording={isRecording}
          isProcessingAudio={isProcessingAudio}
          isPlayingAudio={isPlayingAudio}
          transcript={listeningStatus}
          onDisable={toggleVoiceMode}
        />
      )}

      {/* Messages Container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
      >
        <div ref={topRef} className="h-1">
          {isFetching && hasMore && (
            <div className="flex justify-center py-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
            </div>
          )}
        </div>

        {/* ✅ Thread Loading Indicator */}
        {isLoadingThread && messages.length === 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Loading conversation...</p>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, index) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            baseUrl={BASE_URL}
            isLatest={index === messages.length - 1}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={() => scrollToBottom()}
          className="absolute bottom-24 left-1/2 transform -translate-x-1/2 
                     bg-white border border-gray-200 rounded-full p-2 shadow-md 
                     hover:shadow-lg transition-shadow"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      )}

      {/* Chat Input */}
      <ChatInput
        query={query}
        setQuery={setQuery}
        onSend={handleSend}
        onVoiceToggle={handleVoiceToggle}
        onFileUpload={handleFileUpload}
        onToggleVoiceMode={toggleVoiceMode}
        isRecording={isRecording}
        isSending={isSending}
        isProcessingAudio={isProcessingAudio}
        voiceEnabled={voiceEnabled}
      />
    </div>
  );
};

export default ProjectChat;