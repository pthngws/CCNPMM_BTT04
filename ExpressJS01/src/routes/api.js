const express = require('express');
const { createUser, handleLogin, getUser, getAccount } = require('../controllers/userController');
const { getAllCategories, getCategoryById, createCategory } = require('../controllers/categoryController');
const { 
    getProductsByCategory, 
    getAllProducts, 
    advancedSearchProducts, 
    getSearchSuggestions, 
    getProductById, 
    createProduct,
    getSimilarProducts,
    getTrendingProducts,
    getSearchFacets,
    searchWithTypoTolerance
} = require('../controllers/productController');
const auth = require('../middleware/auth');
const publicAuth = require('../middleware/publicAuth');
const delay = require('../middleware/delay');

const routerAPI = express.Router();

// Public routes (không cần authentication)
routerAPI.get('/categories', getAllCategories);
routerAPI.get('/categories/:id', getCategoryById);
routerAPI.get('/products', getAllProducts);
routerAPI.get('/products/search', advancedSearchProducts);
routerAPI.get('/products/suggestions', getSearchSuggestions);
routerAPI.get('/products/similar/:id', getSimilarProducts);
routerAPI.get('/products/trending', getTrendingProducts);
routerAPI.get('/products/facets', getSearchFacets);
routerAPI.get('/products/search-typo', searchWithTypoTolerance);
routerAPI.get('/products/:id', getProductById);
routerAPI.get('/categories/:categoryId/products', getProductsByCategory);

// Protected routes (cần authentication)
routerAPI.all('*', auth);

routerAPI.get('/', (req, res) => {
    return res.status(200).json('Hello world api');
});

routerAPI.post('/register', createUser);
routerAPI.post('/login', handleLogin);
routerAPI.get('/user', getUser);
routerAPI.get('/account', delay, getAccount);

// Admin routes (cần authentication)
routerAPI.post('/categories', createCategory);
routerAPI.post('/products', createProduct);

module.exports = routerAPI;