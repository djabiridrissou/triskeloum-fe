import { useState } from "react";
import PrintableBadge from "./PrintableBadge";

interface CheckinConfirmationProps {
  visitorData: any;
  companyName: string;
  responseData?: {
    visitId: string;
    visitorId: string;
    qrCode: string;
    badgeNumber: string;
    company: string;
    status: string;
    nextStep: string;
  };
  onComplete?: () => void; // 👈 Nouvelle prop pour réinitialiser
}

const CheckinConfirmation = ({ 
  visitorData, 
  companyName, 
  responseData,
  onComplete 
}: CheckinConfirmationProps) => {
  const [showPrintBadge, setShowPrintBadge] = useState(false);

  const handlePrint = () => {
    setShowPrintBadge(true);
    setTimeout(() => {
      window.print();
      setShowPrintBadge(false);
      
      // Retourner au step 1 après 1 seconde
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
      }, 1000);
    }, 100);
  };

  if (showPrintBadge && responseData) {
    return (
      <div className="fixed inset-0 bg-white z-50">
        <PrintableBadge
          badgeNumber={responseData.badgeNumber}
          visitorName={`${visitorData.firstName} ${visitorData.lastName}`}
          companyName={companyName}
          qrCode={responseData.qrCode}
          date={new Date().toLocaleDateString()}
        />
      </div>
    );
  }

  return (
    <div className="text-center py-4">
      <div className="mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Welcome!</h2>
      </div>

      <div className="relative bg-black text-white rounded-2xl p-8 mb-6">
        <div className="text-center mb-6">
          <p className="text-sm mb-2 text-gray-300">Your Visitor Number</p>
          <div className="text-8xl font-bold">
            {responseData?.badgeNumber || "—"}
          </div>
        </div>
        
        {responseData?.qrCode && (
          <div className="absolute bottom-4 right-4">
            <img 
              src={responseData.qrCode}
              alt="QR"
              className="w-20 h-20 bg-white p-1 rounded"
            />
          </div>
        )}
      </div>

      <button 
        onClick={handlePrint}
        className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl hover:bg-blue-700 transition-colors text-lg font-semibold"
      >
        Print Badge
      </button>

      <p className="text-sm text-gray-500 mt-4">
        Show this number to reception
      </p>
    </div>
  );
};

export default CheckinConfirmation;