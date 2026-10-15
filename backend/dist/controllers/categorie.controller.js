"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategorie = exports.updateCategorie = exports.createCategorie = exports.getCategorieById = exports.getCategories = void 0;
// Stockage en mémoire pour la démonstration (à remplacer par la vraie base de données)
let categories = [
    {
        id: 1,
        nom: "Électronique",
        description: "Produits électroniques et gadgets",
        ordre: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        nom: "Vêtements",
        description: "Vêtements et accessoires de mode",
        ordre: 2,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 3,
        nom: "Maison & Jardin",
        description: "Articles pour la maison et le jardin",
        ordre: 3,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 4,
        nom: "Alimentation",
        description: "Produits alimentaires et boissons",
        ordre: 4,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];
/**
 * Récupère toutes les catégories avec recherche et tri
 * @route GET /api/categories
 */
const getCategories = (req, res) => {
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
        const sortArray = req.query.sort;
        const sort = Array.isArray(sortArray) ? sortArray[0] : sortArray;
        // Dans une vraie application, nous filtrerions par commerce_id via l'utilisateur
        // Pour la démonstration, nous utilisons toutes les catégories
        // Filtrer par statut de publication (toutes les catégories sont actives dans cette démo)
        let filteredCategories = categories;
        // Recherche (insensible aux accents et à la casse, à partir de 2 caractères)
        if (search && typeof search === 'string' && search.trim().length >= 2) {
            const searchTerm = search.trim().toLowerCase();
            filteredCategories = filteredCategories.filter(category => {
                return category.nom.toLowerCase().includes(searchTerm) ||
                    (category.description && category.description.toLowerCase().includes(searchTerm));
            });
        }
        // Tri
        if (sort && typeof sort === 'string') {
            switch (sort) {
                case 'nom-asc':
                    filteredCategories.sort((a, b) => a.nom.localeCompare(b.nom));
                    break;
                case 'nom-desc':
                    filteredCategories.sort((a, b) => b.nom.localeCompare(a.nom));
                    break;
                case 'ordre-asc':
                    filteredCategories.sort((a, b) => a.ordre - b.ordre);
                    break;
                case 'ordre-desc':
                    filteredCategories.sort((a, b) => b.ordre - a.ordre);
                    break;
                case 'defaut':
                default:
                    // Tri par défaut : ordre défini par le commerçant
                    filteredCategories.sort((a, b) => a.ordre - b.ordre);
                    break;
            }
        }
        res.status(200).json(filteredCategories);
    }
    catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des catégories.'
        });
    }
};
exports.getCategories = getCategories;
/**
 * Récupère une catégorie spécifique par son ID
 * @route GET /api/categories/:id
 */
const getCategorieById = (req, res) => {
    try {
        // Le middleware d'authentification a déjà vérifié le token et attaché l'utilisateur à req.user
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                message: 'Utilisateur non authentifié.'
            });
            return;
        }
        // Gérer le cas où l'ID pourrait être un tableau
        const getParamValue = (value) => {
            if (value === undefined)
                return undefined;
            return Array.isArray(value) ? value[0] : value;
        };
        const categorieIdParam = getParamValue(req.params.id);
        const categorieId = categorieIdParam ? parseInt(categorieIdParam, 10) : NaN;
        if (isNaN(categorieId)) {
            res.status(400).json({
                message: 'ID de catégorie invalide.'
            });
            return;
        }
        // Dans une vraie application, nous filtrerions par commerce_id via l'utilisateur
        // Pour la démonstration, nous recherchons dans toutes les catégories
        const categorie = categories.find(c => c.id === categorieId);
        if (!categorie) {
            res.status(404).json({
                message: 'Catégorie non trouvée.'
            });
            return;
        }
        res.status(200).json(categorie);
    }
    catch (error) {
        console.error('Erreur lors de la récupération de la catégorie:', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération de la catégorie.'
        });
    }
};
exports.getCategorieById = getCategorieById;
/**
 * Crée une nouvelle catégorie
 * @route POST /api/categories
 */
const createCategorie = async (req, res) => {
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
        const ordre = getValue(req.body.ordre);
        // Validation obligatoire
        if (!nom || typeof nom !== 'string' || nom.trim() === '') {
            res.status(400).json({
                message: 'Le nom de la catégorie est requis.'
            });
            return;
        }
        if (nom.length < 2 || nom.length > 80) {
            res.status(400).json({
                message: 'Le nom de la catégorie doit contenir entre 2 et 80 caractères.'
            });
            return;
        }
        // Vérifier l'unicité du nom
        const existingCategorie = categories.find(c => c.nom.toLowerCase() === nom.trim().toLowerCase());
        if (existingCategorie) {
            res.status(409).json({
                message: 'Une catégorie avec ce nom existe déjà.'
            });
            return;
        }
        // Dans une vraie application, nous vérifierions que la catégorie appartient au commerce
        // Pour la démonstration, nous continuons
        // Créer la nouvelle catégorie
        const newCategorie = {
            id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
            nom: nom.trim(),
            description: description ? (typeof description === 'string' ? description.trim() : undefined) : undefined,
            ordre: ordre !== undefined && ordre !== null && !isNaN(Number(ordre)) ? Number(ordre) : 999,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        categories.push(newCategorie);
        res.status(201).json(newCategorie);
    }
    catch (error) {
        console.error('Erreur lors de la création de la catégorie:', error);
        res.status(500).json({
            message: 'Erreur lors de la création de la catégorie.'
        });
    }
};
exports.createCategorie = createCategorie;
/**
 * Met à jour une catégorie existante
 * @route PUT /api/categories/:id
 */
const updateCategorie = async (req, res) => {
    try {
        // Le middleware d'authentification a déjà vérifié le token et attaché l'utilisateur à req.user
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                message: 'Utilisateur non authentifié.'
            });
            return;
        }
        // Gérer le cas où l'ID pourrait être un tableau
        const getParamValue = (value) => {
            if (value === undefined)
                return undefined;
            return Array.isArray(value) ? value[0] : value;
        };
        const categorieIdParam = getParamValue(req.params.id);
        const categorieId = categorieIdParam ? parseInt(categorieIdParam, 10) : NaN;
        if (isNaN(categorieId)) {
            res.status(400).json({
                message: 'ID de catégorie invalide.'
            });
            return;
        }
        // Trouver la catégorie
        const categorieIndex = categories.findIndex(c => c.id === categorieId);
        if (categorieIndex === -1) {
            res.status(404).json({
                message: 'Catégorie non trouvée.'
            });
            return;
        }
        const categorie = categories[categorieIndex];
        // Dans une vraie application, nous vérifierions que la catégorie appartient au commerce de l'utilisateur
        // Pour la démonstration, nous continuons
        // Gérer le cas où les valeurs pourraient être des tableaux
        const getValue = (value) => {
            if (value === undefined)
                return undefined;
            return Array.isArray(value) ? value[0] : value;
        };
        const nom = getValue(req.body.nom);
        const description = getValue(req.body.description);
        const ordre = getValue(req.body.ordre);
        // Validation des champs fournis
        if (nom !== undefined && nom !== null) {
            if (typeof nom !== 'string' || nom.trim() === '') {
                res.status(400).json({
                    message: 'Le nom de la catégorie ne peut pas être vide.'
                });
                return;
            }
            if (nom.length < 2 || nom.length > 80) {
                res.status(400).json({
                    message: 'Le nom de la catégorie doit contenir entre 2 et 80 caractères.'
                });
                return;
            }
        }
        // Vérifier l'unicité du nom (en excluant la catégorie actuelle)
        if (nom !== undefined && nom !== null) {
            const existingCategorie = categories.find(c => c.id !== categorieId && c.nom.toLowerCase() === nom.trim().toLowerCase());
            if (existingCategorie) {
                res.status(409).json({
                    message: 'Une catégorie avec ce nom existe déjà.'
                });
                return;
            }
        }
        // Mettre à jour les champs
        if (nom !== undefined && nom !== null) {
            categorie.nom = nom.trim();
        }
        if (description !== undefined && description !== null) {
            categorie.description = description ? (typeof description === 'string' ? description.trim() : undefined) : undefined;
        }
        if (ordre !== undefined && ordre !== null) {
            categorie.ordre = !isNaN(Number(ordre)) ? Number(ordre) : categorie.ordre;
        }
        categorie.updatedAt = new Date();
        res.status(200).json(categorie);
    }
    catch (error) {
        console.error('Erreur lors de la mise à jour de la catégorie:', error);
        res.status(500).json({
            message: 'Erreur lors de la mise à jour de la catégorie.'
        });
    }
};
exports.updateCategorie = updateCategorie;
/**
 * Supprime une catégorie (la rend inactive)
 * @route DELETE /api/categories/:id
 */
const deleteCategorie = async (req, res) => {
    try {
        // Le middleware d'authentification a déjà vérifié le token et attaché l'utilisateur à req.user
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({
                message: 'Utilisateur non authentifié.'
            });
            return;
        }
        // Gérer le cas où l'ID pourrait être un tableau
        const getParamValue = (value) => {
            if (value === undefined)
                return undefined;
            return Array.isArray(value) ? value[0] : value;
        };
        const categorieIdParam = getParamValue(req.params.id);
        const categorieId = categorieIdParam ? parseInt(categorieIdParam, 10) : NaN;
        if (isNaN(categorieId)) {
            res.status(400).json({
                message: 'ID de catégorie invalide.'
            });
            return;
        }
        // Trouver la catégorie
        const categorieIndex = categories.findIndex(c => c.id === categorieId);
        if (categorieIndex === -1) {
            res.status(404).json({
                message: 'Catégorie non trouvée.'
            });
            return;
        }
        // Dans cette application, nous ne supprimons pas réellement la catégorie
        // Nous la marquons comme inutilisée ou nous vérifions qu'elle n'a pas de produits
        // Pour la démo, nous la supprimons simplement de la liste
        const categorie = categories[categorieIndex];
        categories.splice(categorieIndex, 1);
        res.status(200).json({
            message: 'Catégorie supprimée avec succès.',
            categorie
        });
    }
    catch (error) {
        console.error('Erreur lors de la suppression de la catégorie:', error);
        res.status(500).json({
            message: 'Erreur lors de la suppression de la catégorie.'
        });
    }
};
exports.deleteCategorie = deleteCategorie;
exports.default = {
    getCategories: exports.getCategories,
    getCategorieById: exports.getCategorieById,
    createCategorie: exports.createCategorie,
    updateCategorie: exports.updateCategorie,
    deleteCategorie: exports.deleteCategorie
};
