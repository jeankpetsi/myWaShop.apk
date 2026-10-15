import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Product {
  id: number;
  nom: string;
  prix: number;
  reference: string;
  disponible: boolean;
  slug: string;
  // Add other fields as needed
}

const ProductList: React.FC = () => {
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

  if (loading) {
    return <div>Chargement des produits...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="product-list">
      <h1>Nos Produits</h1>
      {products.length === 0 ? (
        <p>Aucun produit disponible.</p>
      ) : (
        <ul className="products-grid">
          {products.map(product => (
            <li key={product.id} className="product-item">
              <Link to={`/produit/${product.slug}`}>
                <div className="product-card">
                  <h2>{product.nom}</h2>
                  <p><strong>Référence :</strong> {product.reference}</p>
                  <p><strong>Prix :</strong> {product.prix === 0 ? 'Gratuit' : `${product.prix} FCFA`}</p>
                  <p><strong>Disponibilité :</strong> {product.disponible ? 'En stock' : 'Épuisé'}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;