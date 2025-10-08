const VoiceStatusBar = ({ isListening, isRecording, isProcessingAudio, isPlayingAudio, transcript, onDisable }: any) => {
    const getStatusText = () => {
        if (isPlayingAudio) return 'Playing response...';
        if (isRecording) return 'Recording...';
        if (isProcessingAudio) return 'Processing...';
        if (transcript) return transcript; // Affiche le transcript qui contient déjà le status
        if (isListening) return 'Listening for "Hey Argus"...';
        return 'Initializing...';
      };
  
    return (
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 text-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full bg-white ${isListening ? 'listening-indicator' : ''}`} />
          <span className="font-medium">{getStatusText()}</span>
        </div>
        <button
          onClick={onDisable}
          className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors"
        >
          Disable Voice Mode
        </button>
      </div>
    );
  };

export default VoiceStatusBar;