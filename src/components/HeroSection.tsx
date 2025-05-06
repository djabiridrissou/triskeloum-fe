import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <div className="relative bg-white min-h-screen flex items-center">
            {/* Subtle gradient accent */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-gray-100 to-gray-200 opacity-20 blur-2xl"></div>

            <div className="container mx-auto px-8 py-20">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                    {/* Left content */}
                    <div className="w-full lg:w-1/2 mb-16 lg:mb-0">
                        <div className="max-w-lg">
                            <h1 className="font-light text-5xl lg:text-6xl text-black tracking-tight leading-none mb-6">
                                <span className="block">Excellence.</span>
                                <span className="block font-normal mt-2">Education.</span>
                                <span className="block mt-2">Exclusivity.</span>
                            </h1>

                            <div className="w-20 h-px bg-gray-600 my-8"></div>

                            <p className="text-gray-700 text-lg font-light leading-relaxed mb-10">
                                A refined learning experience, designed for those who aspire to excellence.
                            </p>

                            <button onClick={() => navigate('/discover')} className="border border-black text-black px-8 py-3 hover:bg-black hover:text-white transition duration-300 ease-in-out">
                                Discover
                            </button>
                        </div>
                    </div>

                    {/* Right content - subtle stats in elegant format */}
                    <div className="w-full lg:w-1/3">
                        <div className="border border-gray-200 p-8 backdrop-blur-sm bg-white/50">
                            <div className="flex items-center mb-8">
                                <Users className="w-5 h-5 text-gray-600 mr-3" />
                                <h3 className="text-sm uppercase tracking-widest text-gray-600 font-light">Our Community</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="border-b border-gray-200 pb-4">
                                    <p className="text-3xl font-light text-black">500+</p>
                                    <p className="text-sm text-gray-600 mt-1">Expert Tutors</p>
                                </div>

                                <div className="border-b border-gray-200 pb-4">
                                    <p className="text-3xl font-light text-black">100+</p>
                                    <p className="text-sm text-gray-600 mt-1">Learning Events</p>
                                </div>

                                <div>
                                    <p className="text-3xl font-light text-black">Personalized</p>
                                    <p className="text-sm text-gray-600 mt-1">Matching Service</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;