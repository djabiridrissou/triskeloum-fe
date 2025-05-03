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
          <Route path="/login" element={<Login />} />
          <Route path="/portal" element={<StudentRegister />} />
          <Route path="/verify" element={<Verify />} />
          <Route element={<PrivateRoute />}>
            <Route path="/students/dashboard" element={<StudentDashboard />} />
            <Route path="/tutors/dashboard" element={<Home />} />
            <Route path="/admin/dashboard" element={<AdminHome />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;