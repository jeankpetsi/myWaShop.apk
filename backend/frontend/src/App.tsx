import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductListAdmin from './pages/admin/ProductListAdmin';
import ProductFormAdmin from './pages/admin/ProductFormAdmin';
import CategorieListAdmin from './pages/admin/CategorieListAdmin';
import CategorieFormAdmin from './pages/admin/CategorieFormAdmin';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          {/* Skip to content link for accessibility */}
          <a href="#main-content" className="skip-link">
            Aller au contenu principal
          </a>
          <header className="App-header">
            <h1>Catalogue Commercial Togo</h1>
          </header>
          <main id="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<ProductList />} />
              <Route path="/login" element={<Login />} />
              <Route path="/produit/:slug" element={<ProductDetail />} />

              {/* Protected admin routes */}
              <Route
                element={<PrivateRoute />}
              >
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<ProductListAdmin />} />
                <Route path="/admin/products/create" element={<ProductFormAdmin />} />
                <Route path="/admin/products/edit/:id" element={<ProductFormAdmin />} />
                <Route path="/admin/categories" element={<CategorieListAdmin />} />
                <Route path="/admin/categories/create" element={<CategorieFormAdmin />} />
                <Route path="/admin/categories/edit/:id" element={<CategorieFormAdmin />} />
                {/* Redirect to admin dashboard if /admin is accessed without subpath */}
                <Route index element={<AdminDashboard />} />
              </Route>

              {/* Redirect to home for unknown routes */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;