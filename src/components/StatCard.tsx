

const StatCard = ({ icon, title, value, description }: any) => (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 md:p-6 hover:bg-white/20 transition-all duration-300 min-w-[200px] md:min-w-[250px] flex-shrink-0">
      <div className="text-green-300 mb-2 md:mb-3">{icon}</div>
      <div className="text-2xl md:text-3xl font-bold text-white mb-1">{value}</div>
      <div className="text-white/80 text-sm font-medium mb-1">{title}</div>
      <div className="text-white/60 text-xs">{description}</div>
    </div>
  );
  

export default StatCard;