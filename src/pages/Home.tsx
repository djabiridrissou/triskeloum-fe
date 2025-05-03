import React, { useState } from 'react';
import { Tabs } from 'antd';
import Navbar from '../components/Navbar';
import MarketplaceTab from '../components/MarketPlace';
import TutorsTab from '../components/Tutors';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';

const Home: React.FC = () => {
    const [activeKey, setActiveKey] = useState('market');

    const tabItems = [
        {
            key: 'market',
            label: 'Advertisements',
            children: <MarketplaceTab />,
        },
        {
            key: 'tutors',
            label: 'Tutors',
            children: <TutorsTab />,
        }
    ];

    const handleTabChange = (key: string) => {
        setActiveKey(key);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <HeroSection />
            <div className="container mx-auto px-4 py-6 overflow-y-auto">
                <Tabs 
                    activeKey={activeKey} 
                    onChange={handleTabChange}
                    className="home-tabs"
                    items={tabItems}
                />
            </div>
            <Footer />
        </div>
    );
};

export default Home;