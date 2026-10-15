import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  nom: string;
  prix: number;
  reference: string;
  disponible: boolean;
  slug: string;
  categorieId: number;
  // Add other fields as needed
}

const ProductListAdmin: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/produits');
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        const data: Product[] = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }
    try {
      const response = await fetch(`/api/produits/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      // Remove the deleted product from the list
      setProducts(products.filter(product => product.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <div>Chargement des produits...</div>
  }

  if (error) {
    return <div>Erreur: {error}</div>
  }

  return (
    <div className="admin-product-list">
      <h1>Gestion des produits</h1>
      <Link to="/admin/products/create" className="btn-primary">
        Ajouter un produit
      </Link>
      {products.length === 0 ? (
        <p>Aucun produit disponible.</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Référence</th>
              <th>Prix</th>
              <th>Disponible</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.nom}</td>
                <td>{product.reference}</td>
                <td>{product.prix === 0 ? 'Gratuit' : `${product.prix} FCFA`}</td>
                <td>{product.disponible ? 'Oui' : 'Non'}</td>
                <td>
                  <Link to={`/admin/products/edit/${product.id}`} className="btn-action">
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="btn-action btn-danger"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductListAdmin;