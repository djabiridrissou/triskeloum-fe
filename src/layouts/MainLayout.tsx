import { Mail } from 'lucide-react';
import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';


const MainLayout: React.FC = () => {
    return (
        <div className="flex flex-col">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
           {/*  <Footer /> */}
        </div>
    );
};

export default MainLayout;