import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/auth/Login";
import StudentRegister from "./pages/auth/StudentRegister";
import Verify from "./pages/auth/ Verify";
import StudentDashboard from "./pages/StudentDashboard";
import { Toaster } from "react-hot-toast";
import AdminHome from "./pages/admin/AdminHome";
import DiscoverPage from "./pages/pages/Discover";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TutorPublicProfile from "./pages/pages/TutorPublicProfile";
import MessagePage from "./pages/MessagePage";
import TutorDashboard from "./pages/pages/TutorDashboard";

const App = () => {

  return (
    <div>
      <Toaster toastOptions={{
        duration: 4000, // spd4
        success: {
          duration: 2000, // sds 5
        },
        error: {
          duration: 500, // 8sde
        }
      }}
        position="top-right" />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<div className="bg-black flex flex-col">
            <Navbar />
            <DiscoverPage />
            <Footer />
          </div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/portal" element={<StudentRegister />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/tutors-profile/:id" element={<div className="bg-black flex flex-col">
            <Navbar />
            <TutorPublicProfile />
            <Footer />
          </div>} />
          <Route element={<PrivateRoute />}>
            <Route path="/students/dashboard" element={<StudentDashboard />} />
            <Route path="/messages" element={<MessagePage />} />
            <Route path="/tutors/dashboard" element={<TutorDashboard />} />
            <Route path="/admin/dashboard" element={<AdminHome />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;