import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

interface Category {
  id: number;
  nom: string;
}

interface ProductFormData {
  nom: string;
  description: string;
  prix: number;
  reference: string;
  disponible: boolean;
  categorieId: number;
}

const ProductFormAdmin: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    nom: '',
    description: '',
    prix: 0,
    reference: '',
    disponible: false,
    categorieId: 1,
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // If editing, fetch the product data
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`/api/produits/${id}`);
          if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
          }
          const data: any = await response.json();
          // Map the backend product to our form data
          setFormData({
            nom: data.nom,
            description: data.description || '',
            prix: data.prix,
            reference: data.reference,
            disponible: data.disponible,
            categorieId: data.categorieId,
          });
          setIsEditing(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Erreur lors du chargement du produit');
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let response;
      if (isEditing && id) {
        // Update existing product
        response = await fetch(`/api/produits/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new product
        response = await fetch('/api/produits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'enregistrement');
      }

      navigate('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="admin-product-form">
      <h1>{isEditing ? 'Modifier le produit' : 'Ajouter un produit'}</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nom">Nom :</label>
          <input
            type="text"
            id="nom"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="reference">Référence :</label>
          <input
            type="text"
            id="reference"
            value={formData.reference}
            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description :</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="prix">Prix (en FCFA) :</label>
          <input
            type="number"
            id="prix"
            value={formData.prix}
            onChange={(e) => setFormData({ ...formData, prix: Number(e.target.value) || 0 })}
            min="0"
          />
        </div>
        <div>
          <label htmlFor="disponible">Disponible :</label>
          <select
            id="disponible"
            value={formData.disponible.toString()}
            onChange={(e) => setFormData({ ...formData, disponible: e.target.value === 'true' })}
          >
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
        </div>
        <div>
          <label htmlFor="categorieId">Catégorie :</label>
          <select
            id="categorieId"
            value={formData.categorieId}
            onChange={(e) => setFormData({ ...formData, categorieId: Number(e.target.value) })}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Enregistrement en cours...' : isEditing ? 'Mettre à jour' : 'Ajouter'}
          </button>
          <Link to="/admin/products" className="btn-cancel">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ProductFormAdmin;