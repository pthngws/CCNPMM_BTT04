const { 
    getProductsByCategoryService, 
    getAllProductsService, 
    advancedSearchProductsService,
    getSearchSuggestionsService,
    getProductByIdService, 
    createProductService 
} = require('../services/productService');

const getProductsByCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { page = 1, limit = 12 } = req.query;
    
    const data = await getProductsByCategoryService(categoryId, parseInt(page), parseInt(limit));
    return res.status(200).json(data);
};

const getAllProducts = async (req, res) => {
    const { page = 1, limit = 12, search = '' } = req.query;
    
    const data = await getAllProductsService(parseInt(page), parseInt(limit), search);
    return res.status(200).json(data);
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    const data = await getProductByIdService(id);
    return res.status(200).json(data);
};

const createProduct = async (req, res) => {
    const productData = req.body;
    const data = await createProductService(productData);
    return res.status(200).json(data);
};

// Advanced search với Elasticsearch
const advancedSearchProducts = async (req, res) => {
    const {
        query = '',
        category = '',
        minPrice = 0,
        maxPrice = Number.MAX_SAFE_INTEGER,
        minRating = 0,
        maxRating = 5,
        isOnSale = null,
        isFeatured = null,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        page = 1,
        limit = 12
    } = req.query;

    const searchParams = {
        query,
        category,
        minPrice: parseFloat(minPrice),
        maxPrice: parseFloat(maxPrice),
        minRating: parseFloat(minRating),
        maxRating: parseFloat(maxRating),
        isOnSale: isOnSale === 'true' ? true : isOnSale === 'false' ? false : null,
        isFeatured: isFeatured === 'true' ? true : isFeatured === 'false' ? false : null,
        sortBy,
        sortOrder,
        page: parseInt(page),
        limit: parseInt(limit)
    };

    const data = await advancedSearchProductsService(searchParams);
    return res.status(200).json(data);
};

// Get search suggestions
const getSearchSuggestions = async (req, res) => {
    const { q: query, limit = 10 } = req.query;
    
    if (!query || query.trim().length < 2) {
        return res.status(200).json({
            EC: 0,
            EM: 'Query too short',
            DT: []
        });
    }

    const data = await getSearchSuggestionsService(query.trim(), parseInt(limit));
    return res.status(200).json(data);
};

module.exports = {
    getProductsByCategory,
    getAllProducts,
    advancedSearchProducts,
    getSearchSuggestions,
    getProductById,
    createProduct
};


