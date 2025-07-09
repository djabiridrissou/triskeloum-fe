import Navbar from "../components/Navbar";


const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
            
        </div>
    );
}

export default AdminLayout;