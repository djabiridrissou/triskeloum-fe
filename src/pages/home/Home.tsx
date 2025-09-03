import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import ActorTypesSection from './sections/ActorTypeSection';
import FeaturesSection from './sections/FeatureSection';
import ServicesSection from './sections/ServiceSection';
import HeroSection from './sections/HeroSection';
import CTASection from './sections/CTASection';
import CatalogueSection from './sections/CatalogueSection';
import DomainsSection from './sections/DomainSection';
import AboutSection from './sections/AboutSection';

const Home: React.FC = () => {
    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="overflow-x-hidden">
                <HeroSection />
                <DomainsSection />
                <AboutSection />
                {/* <ServicesSection /> */}
                <CatalogueSection />
                <ActorTypesSection />
                <FeaturesSection />
                {/*  <PaymentMethodsSection /> */}
                <CTASection />
            </div>
            <Footer />
        </div>
    );
};

export default Home;