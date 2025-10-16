// components/chat/ChatMessage.tsx (MISE À JOUR)

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useEffect, useRef } from "react";
import ConversationBadge from "./ConversationBadge"; // ✅ IMPORT

const ChatMessage = ({ message, baseUrl, isLatest = false }: any) => {
  const audioRef: any = useRef<HTMLAudioElement>(null);
  
  const getAudioUrl = () => {
    if (!message.audioUrl) return '';
    const cleanBase = baseUrl;
    
    if (message.audioUrl.startsWith('http')) {
      return message.audioUrl;
    }
    if (message.audioUrl.startsWith('/voice/')) {
      return `${cleanBase}${message.audioUrl}`;
    }
    if (message.audioUrl.startsWith('voice/')) {
      return `${cleanBase}/${message.audioUrl}`;
    }
    return `${cleanBase}/voice/${message.audioUrl}`;
  };

  const audioUrl = getAudioUrl();
  
  useEffect(() => {
    if (message.audioUrl) {
      console.log('Audio URL generated:', {
        original: message.audioUrl,
        baseUrl: baseUrl,
        final: audioUrl
      });
    }
  }, [message.audioUrl, audioUrl, baseUrl]);

  useEffect(() => {
    if (audioUrl && audioRef.current && isLatest && !message.isTemp && message.mode === 'voice') {
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().catch((error: any) => {
            console.error('Autoplay error:', error);
          });
        }
      }, 100);
    }
  }, [audioUrl, isLatest, message.isTemp, message.mode]);

  return (
    <div className="space-y-2">
      {/* User Query */}
      <div className="flex justify-end">
        <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-[85%] md:max-w-2xl break-words">
          <p className="text-sm whitespace-pre-wrap">{message.query}</p>
          <p className="text-xs opacity-75 mt-1">
            {new Date(message.createdAt).toLocaleTimeString()}
          </p>
        </div>
      </div>
  
      {/* Assistant Answer */}
      {message.answer && (
        <div className="flex justify-start">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 max-w-[85%] md:max-w-2xl w-full shadow-sm">
            {/* Audio Player */}
            {audioUrl && (
              <div className="mb-3">
                <audio 
                  ref={audioRef}
                  controls 
                  className="w-full h-8"
                  preload="metadata"
                >
                  <source src={audioUrl} type="audio/mpeg" />
                  <source src={audioUrl} type="audio/wav" />
                  <source src={audioUrl} type="audio/ogg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            
            {/* Markdown Content */}
            <div className="markdown-content text-sm text-gray-900">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  pre: ({ node, ...props }: any) => {
                    const codeElement = props.children?.props;
                    const codeContent = codeElement?.children || '';
                    
                    return (
                      <div className="relative group">
                        <pre {...props}>{props.children}</pre>
                        <button
                          onClick={() => navigator.clipboard.writeText(codeContent)}
                          className="absolute top-2 right-2 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Copy
                        </button>
                      </div>
                    );
                  },
                  table: ({ node, ...props }: any) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full" {...props} />
                    </div>
                  )
                }}
              >
                {message.answer}
              </ReactMarkdown>
            </div>
            
            {/* ✅ NOUVEAU - Conversation Badges */}
            {message.conversational && (
              <ConversationBadge
                usedHistory={message.conversational.usedHistory}
                contradictionCheck={message.conversational.contradictionCheck}
                sourceConsistency={message.conversational.sourceConsistency}
                clarificationNeeded={message.conversational.clarificationNeeded}
              />
            )}
            
            {/* Sources Count */}
            {message.sourcesCount > 0 && (
              <p className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100">
                {message.sourcesCount} source{message.sourcesCount > 1 ? 's' : ''}
              </p>
            )}
            
            {/* Timestamp */}
            <p className="text-xs text-gray-400 mt-1">
              {new Date(message.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}
  
      {/* Loading Indicator */}
      {message.isTemp && !message.answer && (
        <div className="flex justify-start">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
            <div className="flex items-center gap-2 text-gray-400">
              <div className="animate-bounce text-xs">●</div>
              <div className="animate-bounce text-xs" style={{ animationDelay: '0.1s' }}>●</div>
              <div className="animate-bounce text-xs" style={{ animationDelay: '0.2s' }}>●</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;