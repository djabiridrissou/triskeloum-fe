
const PrintableBadge = ({
    badgeNumber,
    visitorName,
    companyName,
    qrCode,
    date
}: {
    badgeNumber: string;
    visitorName: string;
    companyName: string;
    qrCode: string;
    date: string;
}) => {
    return (
        <div className="flex items-center justify-center min-h-screen p-8">
            <div className="w-96 bg-white border-8 border-black rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                    <div className="text-sm font-bold text-gray-600 mb-2">VISITOR BADGE</div>
                    <div className="h-1 bg-black w-20 mx-auto mb-4"></div>
                    <div className="text-9xl font-bold text-black mb-4">
                        {badgeNumber}
                    </div>
                </div>

                <div className="border-t-4 border-black pt-6 mb-6">
                    <div className="mb-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Visitor</p>
                        <p className="text-2xl font-bold text-black">{visitorName}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Company</p>
                        <p className="text-xl font-semibold text-gray-800">{companyName}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date</p>
                        <p className="text-lg font-medium text-gray-700">{date}</p>
                    </div>
                </div>

                <div className="flex justify-center pt-4 border-t-4 border-black">
                    <img
                        src={qrCode}
                        alt="Badge QR Code"
                        className="w-32 h-32"
                    />
                </div>

                <div className="text-center mt-6">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                        Please wear this badge at all times
                    </p>
                </div>
            </div>

            <style>{`
          @media print {
            @page {
              size: A4 portrait;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
            }
          }
        `}</style>
        </div>
    );
};

export default PrintableBadge;