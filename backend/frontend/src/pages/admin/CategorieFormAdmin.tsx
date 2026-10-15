import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

interface CategorieFormData {
  nom: string;
  description: string | undefined;
  ordre: number;
}

const CategorieFormAdmin: React.FC = () => {
  const [formData, setFormData] = useState<CategorieFormData>({
    nom: '',
    description: undefined,
    ordre: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // If editing, fetch the category data
  useEffect(() => {
    if (id) {
      const fetchCategorie = async () => {
        try {
          const response = await fetch(`/api/categories/${id}`);
          if (!response.ok) {
            throw new Error(`Erreur ${response.status}: ${response.statusText}`);
          }
          const data: any = await response.json();
          // Map the backend category to our form data
          setFormData({
            nom: data.nom,
            description: data.description,
            ordre: data.ordre,
          });
          setIsEditing(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la catégorie');
        }
      };
      fetchCategorie();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let response;
      if (isEditing && id) {
        // Update existing category
        response = await fetch(`/api/categories/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Create new category
        response = await fetch('/api/categories', {
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

      navigate('/admin/categories');
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
    <div className="admin-categorie-form">
      <h1>{isEditing ? 'Modifier la catégorie' : 'Ajouter une catégorie'}</h1>
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
          <label htmlFor="description">Description :</label>
          <textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value || undefined })}
          />
        </div>
        <div>
          <label htmlFor="ordre">Ordre :</label>
          <input
            type="number"
            id="ordre"
            value={formData.ordre}
            onChange={(e) => setFormData({ ...formData, ordre: Number(e.target.value) || 1 })}
            min="1"
          />
        </div>
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Enregistrement en cours...' : isEditing ? 'Mettre à jour' : 'Ajouter'}
          </button>
          <Link to="/admin/categories" className="btn-cancel">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CategorieFormAdmin;