import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Product {
  id: number;
  nom: string;
  description: string;
  prix: number;
  reference: string;
  disponible: boolean;
  categorieId: number;
  slug: string;
  // Add other fields as needed from your API
}

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) {
        setError('Slug non fourni');
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/produits/${slug}`);
        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }
        const data: Product = await response.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  if (!product) {
    return <div>Produit non trouvé.</div>;
  }

  // Construct WhatsApp message
  const whatsappNumber = '+22890000000'; // This should come from commerce settings, but for now hardcoded
  const message = encodeURIComponent(
    `Bonjour, je suis intéressé par le produit :\n\n` +
    `Nom : ${product.nom}\n` +
    `Référence : ${product.reference}\n` +
    `Prix : ${product.prix} ${product.prix === 0 ? 'gratuit' : 'FCFA'}\n` +
    `Disponibilité : ${product.disponible ? 'En stock' : 'Épuisé'}\n` +
    `Description : ${product.description}\n\n` +
    `Vous pouvez trouver ce produit ici : ${window.location.href}`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <div className="product-detail">
      <h1>{product.nom}</h1>
      <div className="product-info">
        <p><strong>Référence :</strong> {product.reference}</p>
        <p><strong>Prix :</strong> {product.prix === 0 ? 'Gratuit' : `${product.prix} FCFA`}</p>
        <p><strong>Disponibilité :</strong> {product.disponible ? 'En stock' : 'Épuisé'}</p>
        <p><strong>Description :</strong></p>
        <p>{product.description}</p>
      </div>
      <div className="whatsapp-button">
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          Envoyer par WhatsApp
        </a>
      </div>
    </div>
  );
};

export default ProductDetail;