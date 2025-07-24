import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import './App.css'
import { Toaster } from "react-hot-toast";
import Home from "./pages/home/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import CreatePayRequest from "./pages/payment/CreatePayRequest";
import ConfirmPay from "./pages/payment/ConfirmPay";
import AdminLayout from "./layouts/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminBuyers from "./pages/admin/AdminBuyers";
import AdminSellers from "./pages/admin/AdminSellers";
import SupplierLayout from "./layouts/SellerLayout";
import SupplierHome from "./pages/supplier/SupplierCatalogue";
import Unauthorized from "./pages/Unauthorized";
import Logout from "./pages/auth/Logout";
import AdminHomologation from "./pages/admin/AdminHomologation";
import BuyerLayout from "./layouts/BuyerLayout";
import BuyerHome from "./pages/buyer/BuyerHome";
import { CartProvider } from "./contexts/CartContext";
import UnderConstruction from "./pages/UnderConstruction";
import CheckoutPage from "./pages/buyer/Checkout";
import BuyerSales from "./pages/buyer/BuyerSales";
import AdminOrders from "./pages/admin/AdminOrders";
import Services from "./pages/home/Services";

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
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/fees" element={<CreatePayRequest />} />
            <Route path="/confirm-pay" element={<ConfirmPay />} />

            {/* Routes protégées pour les admins */}
            <Route element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="/admin/home" element={<AdminHome />} />
              <Route path="/admin/buyers" element={<AdminBuyers />} />
              <Route path="/admin/sellers" element={<AdminSellers />} />
              <Route path="/admin/homologation" element={<AdminHomologation />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
            </Route>
            {/* Routes protégées pour les admins */}

            { }
            <Route element={
              <ProtectedRoute allowedRoles={['supplier']}>
                <SupplierLayout />
              </ProtectedRoute>
            }>
              <Route path="/supplier/catalogue" element={<SupplierHome />} />

            </Route>
            { }

            { }
            <Route element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerLayout />
              </ProtectedRoute>
            }>
              <Route path="/buyer/home" element={<BuyerHome />} />
              <Route path="/buyer/checkout" element={<CheckoutPage />} />
              <Route path="/buyer/sales" element={<BuyerSales />} />
            </Route>
            { }
            <Route path="/logout" element={<Logout />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<UnderConstruction />} />
          </Routes>
        </CartProvider>
      </Router>
    </div>
  );
};

export default App;