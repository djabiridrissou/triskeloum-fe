import axios from "axios";
import { useRef, useState, useEffect, useCallback } from "react";
import { BASE_URL } from "../services/axios";

const WAKE_WORDS = ['hey argus', 'argus', 'hey arguments', 'arguments'];

export const useVoiceRecognition = ({ onWakeWord, enabled }: any) => {
    const recognitionRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Speech recognition not supported');
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            console.log('🎤 Recognition started');
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }

            const currentTranscript = (finalTranscript || interimTranscript).toLowerCase().trim();
            setTranscript(currentTranscript);

            console.log('📝 Transcript:', currentTranscript);

            if (finalTranscript) {
                const hasWakeWord = WAKE_WORDS.some(word =>
                    finalTranscript.toLowerCase().includes(word)
                );

                if (hasWakeWord) {
                    console.log('✅ Wake word detected!');
                    onWakeWord?.();
                }
            }
        };

        recognition.onerror = (event: any) => {
            console.error('❌ Recognition error:', event.error);
            if (event.error === 'not-allowed') {
                setIsListening(false);
            }
        };

        recognition.onend = () => {
            console.log('🔚 Recognition ended');
            setIsListening(false);

            // Auto-restart if enabled
            if (enabled) {
                setTimeout(() => {
                    try {
                        recognition.start();
                    } catch (e) {
                        console.log('Failed to restart recognition');
                    }
                }, 100);
            }
        };

        recognitionRef.current = recognition;

        // Start if enabled
        if (enabled) {
            try {
                recognition.start();
            } catch (e) {
                console.log('Recognition already started');
            }
        }

        return () => {
            if (recognitionRef.current) {
                try {
                    (recognitionRef.current as any).stop();
                } catch (e) {
                    // Ignore
                }
            }
        };
    }, [enabled]); // Only recreate when enabled changes

    return { isListening, transcript };
};

export const useAudioRecording = () => {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef: any = useRef(null);
    const audioChunksRef: any = useRef([]);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder: any = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event: any) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                stream.getTracks().forEach(track => track.stop());
                return audioBlob;
            };

            mediaRecorder.start();
            setIsRecording(true);
            return true;
        } catch (error) {
            console.error('Error accessing microphone:', error);
            return false;
        }
    }, []);

    const stopRecording = useCallback(() => {
        return new Promise((resolve) => {
            if (mediaRecorderRef.current && isRecording) {
                mediaRecorderRef.current.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    setIsRecording(false);
                    resolve(audioBlob);
                };
                mediaRecorderRef.current.stop();
            } else {
                resolve(null);
            }
        });
    }, [isRecording]);

    return { isRecording, startRecording, stopRecording };
};

export const useWakeWordDetection = ({ onWakeWord, enabled }: any) => {
    const recognitionRef: any = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            console.warn('Speech recognition not supported');
            return;
        }

        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            console.log('🎤 Wake word detection started');
            setIsListening(true);
        };

        recognition.onresult = (event: any) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript.toLowerCase();

                if (event.results[i].isFinal) {
                    console.log('📝 Final:', transcript);

                    const hasWakeWord = WAKE_WORDS.some(word => transcript.includes(word));
                    if (hasWakeWord) {
                        console.log('✅ Wake word detected!');
                        onWakeWord?.();
                    }
                } else {
                    setTranscript(transcript);
                }
            }
        };

        recognition.onerror = (event: any) => {
            if (event.error !== 'no-speech') {
                console.error('❌ Recognition error:', event.error);
            }
            setIsListening(false);
        };

        recognition.onend = () => {
            console.log('🔚 Recognition ended');
            setIsListening(false);

            if (enabled) {
                setTimeout(() => {
                    try {
                        recognition.start();
                    } catch (e) { }
                }, 100);
            }
        };

        recognitionRef.current = recognition;
        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) { }
            }
        };
    }, []);

    useEffect(() => {
        if (enabled && recognitionRef.current) {
            try {
                recognitionRef.current.start();
            } catch (e) { }
        } else if (!enabled && recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch (e) { }
        }
    }, [enabled]);

    return { isListening, transcript };
};

export const useContinuousListening = ({ onWakeWordDetected, enabled, projectId }: any) => {
    const [isListening, setIsListening] = useState(false);
    const [status, setStatus] = useState('');
    const [lastTranscript, setLastTranscript] = useState('');
    const mediaRecorderRef: any = useRef(null);
    const streamRef: any = useRef(null);
    const processingRef: any = useRef(false);

    const processAudioChunk = useCallback(async (audioBlob: any) => {
        if (processingRef.current) return;
        processingRef.current = true;

        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'chunk.webm');

            const response = await axios.post(`${BASE_URL}/voice/transcribe-chunk`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success && response.data.data) {
                const { transcription, hasWakeWord } = response.data.data;

                if (transcription) {
                    console.log('📝 Heard:', transcription);
                    setLastTranscript(transcription);

                    if (hasWakeWord) {
                        console.log('✅ Wake word detected in:', transcription);
                        onWakeWordDetected?.();
                        return true;
                    }
                }
            }
        } catch (error) {
            console.error('Chunk transcription error:', error);
        } finally {
            processingRef.current = false;
        }

        return false;
    }, [onWakeWordDetected]);

    const startListening = useCallback(async () => {
        try {
            console.log('🎤 Starting wake word detection...');

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            streamRef.current = stream;

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            let chunks: any = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                if (chunks.length > 0) {
                    const audioBlob = new Blob(chunks, { type: 'audio/webm' });
                    const shouldStop = await processAudioChunk(audioBlob);

                    if (shouldStop) {
                        stopListening();
                    } else if (streamRef.current?.active && enabled) {
                        chunks = [];
                        mediaRecorder.start();
                        setTimeout(() => {
                            if (mediaRecorder.state === 'recording') {
                                mediaRecorder.stop();
                            }
                        }, 2000);
                    }
                }
            };

            mediaRecorderRef.current = mediaRecorder;
            setIsListening(true);
            setStatus('Listening for "Hey Argus"...');

            mediaRecorder.start();
            setTimeout(() => {
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
            }, 2000);

        } catch (error) {
            console.error('Error starting wake word detection:', error);
            setIsListening(false);
        }
    }, [enabled, processAudioChunk]);

    const stopListening = useCallback(() => {
        console.log('🛑 Stopping wake word detection...');

        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track: any) => track.stop());
        }

        setIsListening(false);
        setStatus('');
        processingRef.current = false;
    }, []);

    useEffect(() => {
        if (enabled) {
            startListening();
        } else {
            stopListening();
        }

        return () => {
            stopListening();
        };
    }, [enabled, startListening, stopListening]);

    return { isListening, status: lastTranscript ? `Listening... (heard: "${lastTranscript}")` : status };
};