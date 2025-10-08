import { useRef } from "react";


const ChatInput = ({ 
    query, 
    setQuery, 
    onSend, 
    onVoiceToggle, 
    onFileUpload,
    onToggleVoiceMode,
    isRecording, 
    isSending,
    isProcessingAudio,
    voiceEnabled 
  }: any) => {
    const fileInputRef: any = useRef(null);
    
    return (
      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSend()}
            placeholder={voiceEnabled ? 'Say "Hey Argus" to start...' : 'Type your question...'}
            disabled={isSending || isRecording || isProcessingAudio}
            className="flex-1 px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg 
                       focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                       disabled:bg-gray-50 disabled:text-gray-400
                       transition-colors"
          />
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp3,.wav,.m4a,.ogg,.webm"
            onChange={onFileUpload}
            className="hidden"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isSending || isRecording || isProcessingAudio || voiceEnabled}
            className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg
                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Upload audio file"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
  
          <button
            onClick={onVoiceToggle}
            disabled={isSending || isProcessingAudio || voiceEnabled}
            className={`p-2.5 rounded-lg transition-colors ${
              isRecording 
                ? 'bg-red-500 text-white recording-indicator' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            } disabled:opacity-40 disabled:cursor-not-allowed`}
            title={isRecording ? 'Stop recording' : 'Start recording'}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          </button>
  
          <button
            onClick={onToggleVoiceMode}
            className={`p-2.5 rounded-lg transition-colors ${
              voiceEnabled
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title={voiceEnabled ? 'Disable voice mode' : 'Enable voice mode'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>
  
          <button
            onClick={onSend}
            disabled={isSending || !query.trim() || isRecording || isProcessingAudio}
            className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Send message"
          >
            {isSending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </div>
        
        {isRecording && !voiceEnabled && (
          <p className="text-xs text-red-600 mt-2 text-center">Recording... Click mic to stop</p>
        )}
        {isProcessingAudio && (
          <p className="text-xs text-blue-600 mt-2 text-center">Processing audio...</p>
        )}
      </div>
    );
  };

export default ChatInput;