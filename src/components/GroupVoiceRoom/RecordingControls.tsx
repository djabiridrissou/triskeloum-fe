import React, { useState } from 'react';
import { FaCircle, FaStop } from 'react-icons/fa';

interface RecordingControlsProps {
  isCreator: boolean;
  isRecording: boolean;
  onStartRecording: () => Promise<void>;
  onStopRecording: () => Promise<void>;
}

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  isCreator,
  isRecording,
  onStartRecording,
  onStopRecording,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCreator) {
    return null;
  }

  const handleStartRecording = async () => {
    if (isProcessing) return;
    try {
      setIsProcessing(true);
      await onStartRecording();
    } catch (error) {
      console.error('Error starting recording:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStopRecording = async () => {
    if (isProcessing) return;
    try {
      setIsProcessing(true);
      await onStopRecording();
    } catch (error) {
      console.error('Error stopping recording:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="recording-controls">
      {isRecording ? (
        <button
          className="recording-btn recording-active"
          onClick={handleStopRecording}
          disabled={isProcessing}
          title="Arrêter l'enregistrement"
        >
          <div className="icon-wrapper">
            <FaStop />
          </div>
          <span className="label">
            {isProcessing ? 'Arrêt...' : 'Arrêter l\'enregistrement'}
          </span>
          <span className="recording-indicator pulse"></span>
        </button>
      ) : (
        <button
          className="recording-btn"
          onClick={handleStartRecording}
          disabled={isProcessing}
          title="Démarrer l'enregistrement"
        >
          <div className="icon-wrapper">
            <FaCircle />
          </div>
          <span className="label">
            {isProcessing ? 'Démarrage...' : 'Enregistrer'}
          </span>
        </button>
      )}
    </div>
  );
};
