import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import Logout from "./pages/auth/Logout";
import UnderConstruction from "./pages/UnderConstruction";
import MainLayout from "./layouts/MainLayout";
import Projects from "./pages/Projects";
import NewProject from "./pages/sections/NewProject";

const App = () => {
  return (
    <div>
      <Toaster toastOptions={{
        duration: 4000,
        success: {
          duration: 2000,
        },
        error: {
          duration: 500,
        }
      }}
        position="top-right" />
      <Router>
        <Routes>
        <Route element={
              <MainLayout />
          }>
             <Route path="/" element={<Home />} />
             <Route path="/projects" element={<Projects />} />
             <Route path="/projects/new" element={<NewProject />} />
          </Route>
         
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes protégées pour les admins */}
          <Route element={
            <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
          </Route>
          {/* Routes protégées pour les admins */}
          <Route path="/logout" element={<Logout />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<UnderConstruction />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;