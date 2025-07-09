

const StatCard = ({ icon, title, value, description }: any) => (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300">
        <div className="text-green-300 mb-3">{icon}</div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className="text-white/80 text-sm font-medium mb-1">{title}</div>
        <div className="text-white/60 text-xs">{description}</div>
    </div>
);

export default StatCard;