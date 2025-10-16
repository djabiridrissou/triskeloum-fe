// hooks/useConversationThread.ts

import { useState, useEffect } from 'react';
import { useGetActiveThreadQuery } from '../services/api';

interface UseConversationThreadOptions {
  projectId: string;
  enabled?: boolean;
}

export const useConversationThread = ({ 
  projectId, 
  enabled = true 
}: UseConversationThreadOptions) => {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isNewThread, setIsNewThread] = useState(false);

  // Récupérer thread actif du backend
  const { data: activeThreadData, isLoading } = useGetActiveThreadQuery(
    { projectId },
    { skip: !enabled || !projectId }
  );

  // Au mount ou changement de projet, récupérer thread depuis backend
  useEffect(() => {
    if (activeThreadData?.success && activeThreadData.data?.length > 0) {
      const latestThread = activeThreadData.data[0];
      setThreadId(latestThread.threadId);
      setIsNewThread(false);
      
      // Sauvegarder dans localStorage pour persistance
      localStorage.setItem(`thread_${projectId}`, latestThread.threadId);
    } else {
      // Pas de thread actif, vérifier localStorage
      const savedThreadId = localStorage.getItem(`thread_${projectId}`);
      if (savedThreadId) {
        setThreadId(savedThreadId);
      }
    }
  }, [activeThreadData, projectId]);

  // Reset thread (nouvelle conversation)
  const resetThread = () => {
    setThreadId(null);
    setIsNewThread(true);
    localStorage.removeItem(`thread_${projectId}`);
  };

  // Update threadId après première requête
  const updateThreadId = (newThreadId: string) => {
    setThreadId(newThreadId);
    setIsNewThread(false);
    localStorage.setItem(`thread_${projectId}`, newThreadId);
  };

  return {
    threadId,
    isNewThread,
    isLoadingThread: isLoading,
    resetThread,
    updateThreadId,
  };
};