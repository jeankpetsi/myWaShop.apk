import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-dashboard">
      <h1>Tableau de bord d'administration</h1>
      <p>Bienvenue dans l'interface d'administration du catalogue.</p>
      <div className="admin-menu">
        <Link to="/admin/products" className="admin-menu-item">
          Gestion des produits
        </Link>
        <Link to="/admin/categories" className="admin-menu-item">
          Gestion des catégories
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;