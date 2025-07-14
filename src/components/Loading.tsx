const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="relative w-32 h-32">
        <img
          src="/images/logob.png"
          alt="Terminal d'échanges"
          className="w-full h-full object-contain animate-spin-slow"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold text-gray-600">Chargement...</span>
        </div>
      </div>
    </div>
  );
};

export default Loading;