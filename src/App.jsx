import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import OrderList from './components/OrderList';
import ProtectedRoute from './components/ProtectedRoute';
import AdminNavbar from './components/AdminNavbar';
import BannerManagement from './components/BannerManagement';
import BannerForm from './components/BannerForm';
import ApkUpload from './components/ApkUpload';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50">
                <AdminNavbar />
                <main>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="products" element={<ProductList />} />
                    <Route path="products/create" element={<ProductForm />} />
                    <Route path="products/edit/:id" element={<ProductForm />} />
                    <Route path="orders" element={<OrderList />} />
                    <Route path="orders/:id" element={<OrderList />} />
                    <Route path="banners" element={<BannerManagement />} />
                    <Route path="banners/create" element={<BannerForm />} />
                    <Route path="banners/edit/:id" element={<BannerForm />} />
                    <Route path="apk" element={<ApkUpload />} />

                    {/* Catch any unmatched /admin/* routes */}
                    <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                  </Routes>
                </main>
              </div>
            </ProtectedRoute>
          } />

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />

          {/* Global catch-all route */}
          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
