import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './context/ProtectedRoute';
import Admin from './pages/Admin'; 
import AdminDashboard from './components/AdminComponents/AdminDashboard';
import AdminContext from './context/AdminContext';
import OrderSuccess from './components/OrderComponents/OrderSuccess';
import OrderDetail from './components/OrderComponents/OrderDetail';

function App() {
  return (
    <Routes>
      {/* === PUBLIC & USER PAGES (with NavBar + Footer) === */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/detail/:productid" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="order-detail/:orderId" element={<OrderDetail />} />

        {/* Protected User Page */}
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="/mylenceriaadmin" element={<Admin />} />
      {/* === ADMIN SECTION (NO NavBar, NO Footer) === */}
      <Route element={<AdminContext />}>  {/* Protects all admin routes */}
        <Route element={<AdminLayout />}>
          {/* <Route path="/admin" element={<Admin />} /> */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
   
        </Route>
      </Route>
    </Routes>
  );
}

export default App;