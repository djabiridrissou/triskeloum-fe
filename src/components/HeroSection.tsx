
import {  Users } from 'lucide-react';

const HeroSection = () => {
    return (
        <div className="relative bg-gradient-to-br from-yellow-600 via-yello-300 to-black overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-10 blur-3xl"></div>

            <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-20 lg:flex lg:items-center lg:justify-between">
                <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
                        Elevate Your Learning Journey
                    </h1>

                    <p className="text-xl text-indigo-100 mb-8 max-w-lg mx-auto lg:mx-0">
                        Discover personalized tutoring, collaborative events, and resources
                        that transform your educational experience.
                    </p>

                </div>

                <div className="hidden lg:block lg:w-1/3 mt-10 lg:mt-0">
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
                        <div className="flex items-center mb-4">
                            <Users className="w-8 h-8 text-white mr-3" />
                            <h3 className="text-xl font-bold text-white">Community Highlights</h3>
                        </div>
                        <ul className="space-y-2 text-indigo-100">
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                                <span>500+ Expert Tutors</span>
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                                <span>100+ Learning Events</span>
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                                <span>Personalized Matching</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;