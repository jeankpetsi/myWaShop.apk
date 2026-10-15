import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Category {
  id: number;
  nom: string;
  description: string | undefined;
  ordre: number;
  // Add other fields as needed
}

const CategorieListAdmin: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        const data: Category[] = await response.json();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      return;
    }
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      // Remove the deleted category from the list
      setCategories(categories.filter(category => category.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <div>Chargement des catégories...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="admin-categorie-list">
      <h1>Gestion des catégories</h1>
      <Link to="/admin/categories/create" className="btn-primary">
        Ajouter une catégorie
      </Link>
      {categories.length === 0 ? (
        <p>Aucune catégorie disponible.</p>
      ) : (
        <table className="categorie-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Description</th>
              <th>Ordre</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(categorie => (
              <tr key={categorie.id}>
                <td>{categorie.id}</td>
                <td>{categorie.nom}</td>
                <td>{categorie.description || ''}</td>
                <td>{categorie.ordre}</td>
                <td>
                  <Link to={`/admin/categories/edit/${categorie.id}`} className="btn-action">
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(categorie.id)}
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

export default CategorieListAdmin;