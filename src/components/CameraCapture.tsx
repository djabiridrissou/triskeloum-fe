import { useRef, useState, useEffect } from "react";
import * as blazeface from "@tensorflow-models/blazeface";
import "@tensorflow/tfjs";


interface CameraCaptureProps {
  onCapture: (photoData: string) => void;
  onSkip: () => void;
  capturedPhoto: string;
  onConfirm: () => void;
  isSubmitting: boolean;
}

const CameraCapture = ({ onCapture, onSkip, capturedPhoto, onConfirm, isSubmitting }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState<string>("");
  const [validating, setValidating] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const modelRef = useRef<any>(null);

  useEffect(() => {
    // Charger le modèle de détection de visage
    const loadModel = async () => {
      try {
        modelRef.current = await blazeface.load();
        console.log("Face detection model loaded");
      } catch (err) {
        console.error("Error loading face detection model:", err);
      }
    };
    loadModel();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      setError("");
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      streamRef.current = stream;
   
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        try {
          await videoRef.current.play();
          setCameraActive(true);
        } catch (playError) {
          console.error("Play error:", playError);
        }
        
        videoRef.current.onloadedmetadata = () => {
          if (!cameraActive) {
            videoRef.current?.play().catch(console.error);
            setCameraActive(true);
          }
        };
      }
    } catch (err: any) {
      setError(`Camera Error: ${err.message}`);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const detectFace = async (videoElement: HTMLVideoElement): Promise<boolean> => {
    if (!modelRef.current) {
      console.error("Face detection model not loaded");
      return false;
    }

    try {
      const predictions = await modelRef.current.estimateFaces(videoElement, false);
      
      if (predictions.length === 0) {
        setError("No face detected. Please position your face in the frame.");
        return false;
      }

      if (predictions.length > 1) {
        setError("Multiple faces detected. Please ensure only one person is in frame.");
        return false;
      }

      // Vérifier que le visage est bien centré
      const face = predictions[0];
      const videoWidth = videoElement.videoWidth;
      const videoHeight = videoElement.videoHeight;
      
      const faceX = face.topLeft[0];
      const faceY = face.topLeft[1];
      const faceWidth = face.bottomRight[0] - face.topLeft[0];
      const faceHeight = face.bottomRight[1] - face.topLeft[1];

      // Vérifier que le visage occupe au moins 20% de l'image
      const faceArea = faceWidth * faceHeight;
      const videoArea = videoWidth * videoHeight;
      const facePercentage = (faceArea / videoArea) * 100;

      if (facePercentage < 15) {
        setError("Face too small. Please move closer to the camera.");
        return false;
      }

      if (facePercentage > 70) {
        setError("Face too close. Please move back a bit.");
        return false;
      }

      // Vérifier le centrage (tolérance de 30%)
      const faceCenterX = faceX + faceWidth / 2;
      const faceCenterY = faceY + faceHeight / 2;
      const videoCenterX = videoWidth / 2;
      const videoCenterY = videoHeight / 2;

      const horizontalOffset = Math.abs(faceCenterX - videoCenterX) / videoWidth;
      const verticalOffset = Math.abs(faceCenterY - videoCenterY) / videoHeight;

      if (horizontalOffset > 0.3 || verticalOffset > 0.3) {
        setError("Please center your face in the frame.");
        return false;
      }

      return true;
    } catch (err) {
      console.error("Face detection error:", err);
      return false;
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current) {
      setError("Video reference invalid");
      return;
    }

    if (videoRef.current.readyState < 2) {
      setError("Video not ready yet, please wait...");
      return;
    }

    setValidating(true);
    setError("");

    // Valider la présence d'un visage centré
    const isFaceValid = await detectFace(videoRef.current);

    if (!isFaceValid) {
      setValidating(false);
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    if (canvas.width === 0 || canvas.height === 0) {
      setError("Invalid video dimensions");
      setValidating(false);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0);
      
      const photoData = canvas.toDataURL('image/jpeg', 0.8);
      onCapture(photoData);
      stopCamera();
      setValidating(false);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Take a Photo</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      
      {!capturedPhoto ? (
        <>
          <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ height: '400px' }}>
            <video 
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ 
                transform: 'scaleX(-1)',
                display: cameraActive ? 'block' : 'none'
              }}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            {!cameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="text-6xl mb-4">📸</div>
                <p className="text-lg">Click "Start Camera" to begin</p>
              </div>
            )}

            {/* Guide visuel pour centrer le visage */}
            {cameraActive && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-80 border-4 border-white/50 rounded-full"></div>
                </div>
                <p className="absolute bottom-4 left-0 right-0 text-center text-white text-sm bg-black/50 py-2">
                  Position your face in the oval
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {!cameraActive ? (
              <button
                type="button"
                onClick={startCamera}
                className="flex-1 bg-black text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                📷 Start Camera
              </button>
            ) : (
              <button
                type="button"
                onClick={capturePhoto}
                disabled={validating}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50"
              >
                {validating ? "🔍 Validating..." : "📸 Capture Photo"}
              </button>
            )}
           {/*  <button
              type="button"
              onClick={() => {
                stopCamera();
                onSkip();
              }}
              className="flex-1 bg-gray-300 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-400 font-medium transition-colors"
            >
              Skip
            </button> */}
          </div>
        </>
      ) : (
        <>
          <div className="mb-4 bg-gray-100 rounded-lg p-4">
            <img 
              src={capturedPhoto}
              alt="Captured"
              className="mx-auto rounded-lg max-h-96 object-contain border-2 border-gray-300"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                onCapture("");
                setTimeout(startCamera, 100);
              }}
              className="flex-1 bg-gray-300 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-400 font-medium transition-colors"
            >
              🔄 Retake Photo
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {isSubmitting ? "⏳ Processing..." : "✅ Confirm & Continue"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraCapture;