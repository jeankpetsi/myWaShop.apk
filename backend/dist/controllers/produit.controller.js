"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduit = exports.updateProduit = exports.createProduit = exports.getProduitBySlug = exports.getProduits = void 0;
// Stockage en mémoire pour la démonstration (à remplacer par la vraie base de données)
let produits = [
    {
        id: 1,
        nom: "Smartphone XYZ",
        description: "Smartphone dernier cri avec écran OLED et batterie longue durée",
        prix: 125000, // 125 000 XOF = 125 000 FCFA
        reference: "SM-XYZ-2024",
        disponibilite: "disponible",
        statutPublication: "publié",
        misEnAvant: true,
        nouveau: true,
        datePublication: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // Il y a 10 jours
        createdAt: new Date(),
        updatedAt: new Date(),
        categorieId: 1, // Électronique
        slug: "smartphone-xyz"
    },
    {
        id: 2,
        nom: "Chemise en coton",
        description: "Chemise confortable en coton bio, disponible en plusieurs couleurs",
        prix: 15000, // 15 000 XOF
        reference: "CH-COTON-001",
        disponibilite: "disponible",
        statutPublication: "publié",
        misEnAvant: false,
        nouveau: false,
        datePublication: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Il y a 30 jours
        createdAt: new Date(),
        updatedAt: new Date(),
        categorieId: 2, // Vêtements
        slug: "chemise-coton"
    },
    {
        id: 3,
        nom: "Lampe de bureau LED",
        description: "Lampe de bureau avec variateur d'intensité et port USB intégré",
        prix: 25000, // 25 000 XOF
        reference: "LAMPE-LED-005",
        disponibilite: "sur commande",
        statutPublication: "publié",
        misEnAvant: false,
        nouveau: true,
        datePublication: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Il y a 5 jours
        createdAt: new Date(),
        updatedAt: new Date(),
        categorieId: 3, // Maison & Jardin
        slug: "lampe-bureau-led"
    },
    {
        id: 4,
        nom: "Tablette Tactile",
        description: "Tablette tactile 10 pouces pour toute la famille",
        prix: 80000, // 80 000 XOF
        reference: "TAB-FAMILLE-2024",
        disponibilite: "indisponible",
        statutPublication: "publié",
        misEnAvant: false,
        nouveau: false,
        datePublication: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // Il y a 60 jours
        createdAt: new Date(),
        updatedAt: new Date(),
        categorieId: 1, // Électronique
        slug: "tablette-tactile"
    }
];
/**
 * Normalise une chaîne pour la recherche (supprime les accents, met en minuscules)
 * @param str - Chaîne à normaliser
 * @returns Chaîne normalisée
 */
const normalizeString = (str) => {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, ''); // Supprime les accents
};
/**
 * Valide et convertit une valeur en l'un des états de disponibilité autorisés
 */
const validateDisponibilite = (value) => {
    if (value === undefined)
        return 'disponible';
    const strValue = Array.isArray(value) ? value[0] : value;
    if (typeof strValue !== 'string')
        return 'disponible';
    switch (strValue) {
        case 'disponible':
        case 'sur commande':
        case 'indisponible':
            return strValue;
        default:
            return 'disponible';
    }
};
/**
 * Valide et convertit une valeur en l'un des états de publication autorisés
 */
const validateStatutPublication = (value) => {
    if (value === undefined)
        return 'masqué';
    const strValue = Array.isArray(value) ? value[0] : value;
    if (typeof strValue !== 'string')
        return 'masqué';
    switch (strValue) {
        case 'publié':
        case 'masqué':
            return strValue;
        default:
            return 'masqué';
    }
};
/**
 * Récupère les produits avec recherche, filtres, tri et pagination
 * @route GET /api/produits
 */
const getProduits = (req, res) => {
    try {
        // Le middleware d'authentification a déjà vérifié le token et attaché l'utilisateur à req.user
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                message: 'Utilisateur non authentifié.'
            });
            return;
        }
        // Récupérer les paramètres de requête (gestion des cas où ils pourraient être des tableaux)
        const searchArray = req.query.search;
        const search = Array.isArray(searchArray) ? searchArray[0] : searchArray;
        const categorieArray = req.query.categorie;
        const categorie = Array.isArray(categorieArray) ? categorieArray[0] : categorieArray;
        const sortArray = req.query.sort;
        const sort = Array.isArray(sortArray) ? sortArray[0] : sortArray;
        const pageArray = req.query.page;
        const page = Array.isArray(pageArray) ? pageArray[0] : pageArray;
        const limitArray = req.query.limit;
        const limit = Array.isArray(limitArray) ? limitArray[0] : limitArray;
        // Dans une vraie application, nous filtrerions par commerce_id via l'utilisateur
        // Pour la démonstration, nous utilisons tous les produits
        // Filtrer par statut de publication (seuls les produits publiés sont visibles)
        let filteredProduits = produits.filter(p => p.statutPublication === 'publié');
        // Recherche (insensible aux accents et à la casse, à partir de 2 caractères - RG-10)
        if (search && typeof search === 'string' && search.trim().length >= 2) {
            const searchTerm = search.trim();
            const normalizedSearch = normalizeString(searchTerm);
            filteredProduits = filteredProduits.filter(product => {
                // Rechercher dans nom, description, référence
                const nomNormalize = normalizeString(product.nom);
                const descNormalize = product.description ? normalizeString(product.description) : '';
                const refNormalize = product.reference ? normalizeString(product.reference) : '';
                return nomNormalize.includes(normalizedSearch) ||
                    descNormalize.includes(normalizedSearch) ||
                    refNormalize.includes(normalizedSearch);
            });
        }
        // Filtrer par catégorie
        if (categorie && typeof categorie === 'string' && categorie !== '') {
            // Dans une vraie application, nous aurions besoin de joindre avec la table catégories
            // Pour la démonstration, nous filtrons par categorieId (supposant que categorie contient l'ID)
            const categorieId = parseInt(categorie, 10);
            if (!isNaN(categorieId)) {
                filteredProduits = filteredProduits.filter(p => p.categorieId === categorieId);
            }
            // Note: Dans une implémentation réelle, nous faudrait chercher l'ID de la catégorie par son nom
        }
        // Tri
        if (sort && typeof sort === 'string') {
            switch (sort) {
                case 'prix-asc':
                    filteredProduits.sort((a, b) => a.prix - b.prix);
                    break;
                case 'prix-desc':
                    filteredProduits.sort((a, b) => b.prix - a.prix);
                    break;
                case 'recents':
                    filteredProduits.sort((a, b) => b.datePublication?.getTime() ?? 0 - (a.datePublication?.getTime() ?? 0));
                    break;
                case 'defaut':
                default:
                    // Tri par défaut : ordre défini par le commerçant, puis plus récents
                    // Pour la démonstration, nous allons trier par categorie.ordre (supposé) puis par date
                    // Pour la démonstration, nous allons supposer un ordre basé sur categorieId
                    filteredProduits.sort((a, b) => {
                        const ordreA = a.categorieId || 999;
                        const ordreB = b.categorieId || 999;
                        if (ordreA !== ordreB) {
                            return ordreA - ordreB;
                        }
                        const dateA = a.datePublication?.getTime() ?? 0;
                        const dateB = b.datePublication?.getTime() ?? 0;
                        return dateB - dateA; // Plus récents en premier
                    });
                    break;
            }
        }
        // Pagination
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 12)); // Max 100 par page
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = startIndex + limitNum;
        const paginatedProduits = filteredProduits.slice(startIndex, endIndex);
        // Préparer la réponse avec les métadonnées de pagination
        res.status(200).json({
            produits: paginatedProduits,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total: filteredProduits.length,
                totalPages: Math.ceil(filteredProduits.length / limitNum),
                hasNextPage: endIndex < filteredProduits.length,
                hasPrevPage: pageNum > 1
            }
        });
    }
    catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des produits.'
        });
    }
};
exports.getProduits = getProduits;
/**
 * Récupère un produit spécifique par son slug
 * @route GET /api/produits/:slug
 */
const getProduitBySlug = (req, res) => {
    try {
        // Le middleware d'authentification a déjà vérifié le token et attaché l'utilisateur à req.user
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                message: 'Utilisateur non authentifié.'
            });
            return;
        }
        const { slug } = req.params;
        if (!slug || typeof slug !== 'string') {
            res.status(400).json({
                message: 'Slug de produit invalide.'
            });
            return;
        }
        // Dans une vraie application, nous filtrerions par commerce_id via l'utilisateur
        // Pour la démonstration, nous recherchons dans tous les produits publiés
        const produit = produits.find(p => p.slug === slug && p.statutPublication === 'publié');
        if (!produit) {
            res.status(404).json({
                message: 'Produit non trouvé ou non publié.'
            });
            return;
        }
        res.status(200).json(produit);
    }
    catch (error) {
        console.error('Erreur lors de la récupération du produit par slug:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération du produit.'
        });
    }
};
exports.getProduitBySlug = getProduitBySlug;
/**
 * Crée un nouveau produit
 * @route POST /api/produits
 */
const createProduit = async (req, res) => {
    try {
        // Le middleware d'authentification a déjà vérifié le token et attaché l'utilisateur à req.user
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                message: 'Utilisateur non authentifié.'
            });
            return;
        }
        // Gérer le cas où les valeurs pourraient être des tableaux
        const getValue = (value) => {
            if (value === undefined)
                return undefined;
            return Array.isArray(value) ? value[0] : value;
        };
        const nom = getValue(req.body.nom);
        const description = getValue(req.body.description);
        const prix = getValue(req.body.prix);
        const reference = getValue(req.body.reference);
        const categorieId = getValue(req.body.categorieId);
        const slug = getValue(req.body.slug);
        const disponibilite = getValue(req.body.disponibilite);
        const misEnAvant = getValue(req.body.misEnAvant);
        const nouveau = getValue(req.body.nouveau);
        // Validation obligatoire
        if (!nom || typeof nom !== 'string' || nom.trim() === '') {
            res.status(400).json({
                message: 'Le nom du produit est requis.'
            });
            return;
        }
        if (nom.length < 2 || nom.length > 120) {
            res.status(400).json({
                message: 'Le nom du produit doit contenir entre 2 et 120 caractères.'
            });
            return;
        }
        if (prix === undefined || prix === null || isNaN(Number(prix)) || Number(prix) < 0) {
            res.status(400).json({
                message: 'Le prix doit être un nombre positif ou nul.'
            });
            return;
        }
        if (!slug || typeof slug !== 'string' || slug.trim() === '') {
            res.status(400).json({
                message: 'Le slug du produit est requis.'
            });
            return;
        }
        const cleanSlug = slug.trim();
        if (cleanSlug.length < 3 || cleanSlug.length > 80) {
            res.status(400).json({
                message: 'Le slug doit contenir entre 3 et 80 caractères.'
            });
            return;
        }
        // Validation du format du slug (minuscules, chiffres, tirets)
        if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
            res.status(400).json({
                message: 'Le slug doit contenir uniquement des lettres minuscules, des chiffres et des tirets.'
            });
            return;
        }
        // Vérifier l'unicité du slug
        const existingProduit = produits.find(p => p.slug === cleanSlug);
        if (existingProduit) {
            res.status(409).json({
                message: 'Un produit avec ce slug existe déjà.'
            });
            return;
        }
        // Dans une vraie application, nous vérifierions que la catégorie appartient au commerce
        // Pour la démonstration, nous continuons
        // Créer le nouveau produit
        const newProduit = {
            id: produits.length > 0 ? Math.max(...produits.map(p => p.id)) + 1 : 1,
            nom: nom.trim(),
            description: description ? (typeof description === 'string' ? description.trim() : undefined) : undefined,
            prix: Number(prix),
            reference: reference ? (typeof reference === 'string' ? reference.trim() : undefined) : undefined,
            disponibilite: validateDisponibilite(disponibilite),
            statutPublication: 'masqué', // Par défaut, les nouveaux produits sont masqués
            misEnAvant: misEnAvant !== undefined && misEnAvant !== null ? !!misEnAvant : false,
            nouveau: nouveau !== undefined && nouveau !== null ? !!nouveau : false,
            datePublication: (nouveau !== undefined && nouveau !== null && !!nouveau) ? new Date() : undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
            categorieId: categorieId ? Number(categorieId) : undefined,
            slug: cleanSlug
        };
        produits.push(newProduit);
        res.status(201).json(newProduit);
    }
    catch (error) {
        console.error('Erreur lors de la création du produit:', error);
        res.status(500).json({
            message: 'Erreur lors de la création du produit.'
        });
    }
};
exports.createProduit = createProduit;
/**
 * Met à jour un produit existant
 * @route PUT /api/produits/:id
 */
const updateProduit = async (req, res) => {
    try {
        // Le middleware d'authentification a déjà vérifié le token et attaché l'utilisateur à req.user
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                message: 'Utilisateur non authentifié.'
            });
            return;
        }
        // Gérer le cas où les valeurs pourraient être des tableaux
        const getParamValue = (value) => {
            if (value === undefined)
                return undefined;
            return Array.isArray(value) ? value[0] : value;
        };
        const getBodyValue = (value) => {
            if (value === undefined)
                return undefined;
            return Array.isArray(value) ? value[0] : value;
        };
        const produitIdParam = getParamValue(req.params.id);
        const produitId = produitIdParam ? parseInt(produitIdParam, 10) : NaN;
        if (isNaN(produitId)) {
            res.status(400).json({
                message: 'ID de produit invalide.'
            });
            return;
        }
        // Trouver le produit
        const produitIndex = produits.findIndex(p => p.id === produitId);
        if (produitIndex === -1) {
            res.status(404).json({
                message: 'Produit non trouvé.'
            });
            return;
        }
        const produit = produits[produitIndex];
        // Dans une vraie application, nous vérifierions que le produit appartient au commerce de l'utilisateur
        // Pour la démonstration, nous continuons
        // Gérer le cas où les valeurs pourraient être des tableaux
        const nom = getBodyValue(req.body.nom);
        const description = getBodyValue(req.body.description);
        const prix = getBodyValue(req.body.prix);
        const reference = getBodyValue(req.body.reference);
        const categorieId = getBodyValue(req.body.categorieId);
        const slug = getBodyValue(req.body.slug);
        const disponibilite = getBodyValue(req.body.disponibilite);
        const statutPublication = getBodyValue(req.body.statutPublication);
        const misEnAvant = getBodyValue(req.body.misEnAvant);
        const nouveau = getBodyValue(req.body.nouveau);
        // Validation des champs fournis
        if (nom !== undefined && nom !== null) {
            if (typeof nom !== 'string' || nom.trim() === '') {
                res.status(400).json({
                    message: 'Le nom du produit ne peut pas être vide.'
                });
                return;
            }
            if (nom.length < 2 || nom.length > 120) {
                res.status(400).json({
                    message: 'Le nom du produit doit contenir entre 2 et 120 caractères.'
                });
                return;
            }
        }
        if (prix !== undefined && prix !== null) {
            if (isNaN(Number(prix)) || Number(prix) < 0) {
                res.status(400).json({
                    message: 'Le prix doit être un nombre positif ou nul.'
                });
                return;
            }
        }
        if (slug !== undefined && slug !== null) {
            if (typeof slug !== 'string' || slug.trim() === '') {
                res.status(400).json({
                    message: 'Le slug du produit est requis s\'il est fourni.'
                });
                return;
            }
            const cleanSlug = slug.trim();
            if (cleanSlug.length < 3 || cleanSlug.length > 80) {
                res.status(400).json({
                    message: 'Le slug doit contenir entre 3 et 80 caractères.'
                });
                return;
            }
            // Validation du format du slug
            if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
                res.status(400).json({
                    message: 'Le slug doit contenir uniquement des lettres minuscules, des chiffres et des tirets.'
                });
                return;
            }
            // Vérifier l'unicité du slug (en excluant le produit actuel)
            const existingProduit = produits.find(p => p.id !== produitId && p.slug === cleanSlug);
            if (existingProduit) {
                res.status(409).json({
                    message: 'Un produit avec ce slug existe déjà.'
                });
                return;
            }
        }
        // Mettre à jour les champs - avec vérification préalable de l'existence
        if (nom !== undefined && nom !== null) {
            produit.nom = nom.trim();
        }
        if (description !== undefined && description !== null) {
            produit.description = description ? (typeof description === 'string' ? description.trim() : undefined) : undefined;
        }
        if (prix !== undefined && prix !== null) {
            produit.prix = Number(prix);
        }
        if (reference !== undefined && reference !== null) {
            produit.reference = reference ? (typeof reference === 'string' ? reference.trim() : undefined) : undefined;
        }
        if (categorieId !== undefined && categorieId !== null) {
            produit.categorieId = Number(categorieId);
        }
        if (slug !== undefined && slug !== null) {
            produit.slug = slug.trim();
        }
        if (disponibilite !== undefined && disponibilite !== null) {
            produit.disponibilite = validateDisponibilite(disponibilite);
        }
        if (statutPublication !== undefined && statutPublication !== null) {
            produit.statutPublication = validateStatutPublication(statutPublication);
            // Si le produit est publié pour la première fois, définir la date de publication
            if (statutPublication === 'publié' && !produit.datePublication) {
                produit.datePublication = new Date();
            }
            // Si le produit est masqué, réinitialiser la date de publication et le drapeau nouveau
            if (statutPublication === 'masqué') {
                produit.datePublication = undefined;
                produit.nouveau = false;
            }
        }
        if (misEnAvant !== undefined && misEnAvant !== null) {
            produit.misEnAvant = !!misEnAvant;
        }
        if (nouveau !== undefined && nouveau !== null) {
            produit.nouveau = !!nouveau;
            // Si on marque comme nouveau, définir la date de publication à aujourd'hui
            // et s'assurer que le statut est publié
            if (produit.nouveau) {
                produit.datePublication = new Date();
                if (produit.statutPublication !== 'publié') {
                    produit.statutPublication = 'publié';
                }
            }
        }
        produit.updatedAt = new Date();
        res.status(200).json(produit);
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour du produit:', error);
        res.status(500).json({
            message: 'Erreur lors de la mise à jour du produit.'
        });
    }
};
exports.updateProduit = updateProduit;
/**
 * Supprime un produit (le masque en réalité)
 * @route DELETE /api/produits/:id
 */
const deleteProduit = async (req, res) => {
    try {
        // Le middleware d'authentification a déjà vérifié le token et attaché l'utilisateur à req.user
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                message: 'Utilisateur non authentifié.'
            });
            return;
        }
        // Gérer le cas où les valeurs pourraient être des tableaux
        const getParamValue = (value) => {
            if (value === undefined)
                return undefined;
            return Array.isArray(value) ? value[0] : value;
        };
        const produitIdParam = getParamValue(req.params.id);
        const produitId = produitIdParam ? parseInt(produitIdParam, 10) : NaN;
        if (isNaN(produitId)) {
            res.status(400).json({
                message: 'ID de produit invalide.'
            });
            return;
        }
        // Trouver le produit
        const produitIndex = produits.findIndex(p => p.id === produitId);
        if (produitIndex === -1) {
            res.status(404).json({
                message: 'Produit non trouvé.'
            });
            return;
        }
        // Dans cette application, nous ne supprimons pas réellement le produit
        // Nous le masquons simplement (RG-01 : Seuls les produits publiés sont visibles)
        const produit = produits[produitIndex];
        produit.statutPublication = 'masqué';
        produit.updatedAt = new Date();
        res.status(200).json({
            message: 'Produit masqué avec succès.',
            produit
        });
    }
    catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        res.status(500).json({
            message: 'Erreur lors de la suppression du produit.'
        });
    }
};
exports.deleteProduit = deleteProduit;
exports.default = {
    getProduits: exports.getProduits,
    getProduitBySlug: exports.getProduitBySlug,
    createProduit: exports.createProduit,
    updateProduit: exports.updateProduit,
    deleteProduit: exports.deleteProduit
};
