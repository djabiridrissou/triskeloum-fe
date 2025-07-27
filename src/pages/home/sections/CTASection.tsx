
const CTASection = () => (     
    <section 
        className="py-20 px-4 relative overflow-hidden"
        style={{
            backgroundImage: 'url("https://images.pexels.com/photos/7621366/pexels-photo-7621366.jpeg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}
    >
        {/* Overlay pour améliorer la lisibilité */}
        <div className="absolute inset-0  bg-opacity-50"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-green-600 mb-6">
                Prêt à Révolutionner Vos Échanges ?
            </h2>
            <p className="text-xl text-gray-700 mb-8">
                Rejoignez dès maintenant les milliers d'entreprises qui font confiance à Terminal d'Échanges
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => { window.location.href = '/register' }} className="cursor-pointer bg-green-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                    Commencer maintenant
                </button>
                <button className="border border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors">
                    Contactez-nous
                </button>
            </div>
        </div>
    </section>
);

export default CTASection;