import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import { Toaster } from "react-hot-toast";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CreatePayRequest from "./pages/payment/CreatePayRequest";
import ConfirmPay from "./pages/payment/ConfirmPay";
import AdminLayout from "./layouts/AdminLayout";
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
          <Route path="/register" element={<Register />} />
          <Route path="/fees" element={<CreatePayRequest />} />
          <Route path="/confirm-pay" element={<ConfirmPay />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/home" element={<AdminHome />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;