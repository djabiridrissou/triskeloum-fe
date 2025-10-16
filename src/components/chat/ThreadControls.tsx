// components/chat/ThreadControls.tsx

import React from 'react';
import { useClearThreadMutation, useGetThreadDetailsQuery } from '../../services/api';

interface ThreadControlsProps {
  threadId: string | null;
  projectId: string;
  onReset: () => void;
}

const ThreadControls: React.FC<ThreadControlsProps> = ({ 
  threadId, 
  projectId,
  onReset 
}) => {
  const [clearThread, { isLoading: isClearing }] = useClearThreadMutation();
  const { data: threadDetails } = useGetThreadDetailsQuery(
    { threadId },
    { skip: !threadId }
  );

  const handleNewConversation = async () => {
    if (!threadId) {
      onReset();
      return;
    }

    try {
      await clearThread({ threadId }).unwrap();
      onReset();
    } catch (error) {
      console.error('Failed to clear thread:', error);
      // Fallback: reset localement
      onReset();
    }
  };

  if (!threadId) return null;

  const messageCount = threadDetails?.data?.messages?.length || 0;
  const primaryLanguage = threadDetails?.data?.primaryLanguage || 'fr';

  return (
    <div className="flex items-center justify-between px-6 py-2 bg-gray-50 border-b border-gray-200">
      <div className="flex items-center gap-3 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          {messageCount} message{messageCount !== 1 ? 's' : ''}
        </span>
        
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
          </svg>
          {primaryLanguage.toUpperCase()}
        </span>
      </div>

      <button
        onClick={handleNewConversation}
        disabled={isClearing}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 
                   bg-white border border-gray-300 rounded-md hover:bg-gray-50 
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isClearing ? (
          <>
            <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-400 border-t-transparent" />
            Clearing...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Conversation
          </>
        )}
      </button>
    </div>
  );
};

export default ThreadControls;