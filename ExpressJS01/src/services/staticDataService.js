const { categories, products } = require('../data/products');
const { 
    searchProducts, 
    indexProduct, 
    deleteProductFromIndex,
    bulkIndexProducts 
} = require('./elasticsearchService');

// Get all categories
const getAllCategoriesService = async () => {
    try {
        return {
            EC: 0,
            EM: 'Get categories successfully',
            DT: categories
        };
    } catch (error) {
        console.log('Error in getAllCategoriesService:', error);
        return { EC: -1, EM: 'Failed to get categories' };
    }
};

// Get category by ID
const getCategoryByIdService = async (categoryId) => {
    try {
        const category = categories.find(cat => cat._id === categoryId);
        if (!category) {
            return { EC: 1, EM: 'Category not found' };
        }
        return { EC: 0, EM: 'Get category successfully', DT: category };
    } catch (error) {
        console.log('Error in getCategoryByIdService:', error);
        return { EC: -1, EM: 'Failed to get category' };
    }
};

// Get products by category
const getProductsByCategoryService = async (categoryId, page = 1, limit = 12) => {
    try {
        const skip = (page - 1) * limit;
        
        // Kiểm tra category có tồn tại không
        const category = categories.find(cat => cat._id === categoryId);
        if (!category) {
            return { EC: 1, EM: 'Category not found' };
        }

        // Lấy products với pagination
        const filteredProducts = products.filter(product => 
            product.category === categoryId && product.isActive
        );

        const paginatedProducts = filteredProducts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(skip, skip + limit);

        // Populate category name
        const productsWithCategory = paginatedProducts.map(product => ({
            ...product,
            category: {
                _id: category._id,
                name: category.name
            }
        }));

        const totalProducts = filteredProducts.length;
        const totalPages = Math.ceil(totalProducts / limit);

        return {
            EC: 0,
            EM: 'Get products successfully',
            DT: {
                products: productsWithCategory,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalProducts,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        };
    } catch (error) {
        console.log('Error in getProductsByCategoryService:', error);
        return { EC: -1, EM: 'Failed to get products' };
    }
};

// Get all products with search
const getAllProductsService = async (page = 1, limit = 12, search = '') => {
    try {
        const skip = (page - 1) * limit;
        let filteredProducts = products.filter(product => product.isActive);

        // Thêm tìm kiếm theo tên sản phẩm
        if (search) {
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.description.toLowerCase().includes(search.toLowerCase()) ||
                product.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
            );
        }

        const paginatedProducts = filteredProducts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(skip, skip + limit);

        // Populate category name
        const productsWithCategory = paginatedProducts.map(product => {
            const category = categories.find(cat => cat._id === product.category);
            return {
                ...product,
                category: {
                    _id: category._id,
                    name: category.name
                }
            };
        });

        const totalProducts = filteredProducts.length;
        const totalPages = Math.ceil(totalProducts / limit);

        return {
            EC: 0,
            EM: 'Get products successfully',
            DT: {
                products: productsWithCategory,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalProducts,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                }
            }
        };
    } catch (error) {
        console.log('Error in getAllProductsService:', error);
        return { EC: -1, EM: 'Failed to get products' };
    }
};

// Get product by ID
const getProductByIdService = async (productId) => {
    try {
        const product = products.find(prod => prod._id === productId);
        if (!product) {
            return { EC: 1, EM: 'Product not found' };
        }

        // Populate category
        const category = categories.find(cat => cat._id === product.category);
        const productWithCategory = {
            ...product,
            category: {
                _id: category._id,
                name: category.name
            }
        };

        return { EC: 0, EM: 'Get product successfully', DT: productWithCategory };
    } catch (error) {
        console.log('Error in getProductByIdService:', error);
        return { EC: -1, EM: 'Failed to get product' };
    }
};

// Advanced search với Elasticsearch
const advancedSearchProductsService = async (searchParams) => {
    try {
        return await searchProducts(searchParams);
    } catch (error) {
        console.log('Error in advancedSearchProductsService:', error);
        return { EC: -1, EM: 'Failed to search products' };
    }
};

// Get search suggestions
const getSearchSuggestionsService = async (query, limit = 10) => {
    try {
        const { getSearchSuggestions } = require('./elasticsearchService');
        return await getSearchSuggestions(query, limit);
    } catch (error) {
        console.log('Error in getSearchSuggestionsService:', error);
        return { EC: -1, EM: 'Failed to get suggestions', DT: [] };
    }
};

// Create product (for demo purposes)
const createProductService = async (productData) => {
    try {
        const { name, description, price, originalPrice, images, category, stock, tags, isFeatured } = productData;

        // Kiểm tra category có tồn tại không
        const categoryExists = categories.find(cat => cat._id === category);
        if (!categoryExists) {
            return { EC: 1, EM: 'Category not found' };
        }

        // Tạo product mới
        const newProduct = {
            _id: `prod_${Date.now()}`,
            name,
            description,
            price,
            originalPrice,
            images,
            category,
            stock,
            tags,
            isFeatured: isFeatured || false,
            rating: 0,
            reviewCount: 0,
            viewCount: 0,
            isActive: true,
            isOnSale: originalPrice && originalPrice > price,
            discount: originalPrice && originalPrice > price ? 
                Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        // Thêm vào danh sách products
        products.push(newProduct);

        // Index product vào Elasticsearch
        await indexProduct(newProduct);

        // Populate category
        const productWithCategory = {
            ...newProduct,
            category: {
                _id: categoryExists._id,
                name: categoryExists.name
            }
        };

        return { EC: 0, EM: 'Create product successfully', DT: productWithCategory };
    } catch (error) {
        console.log('Error in createProductService:', error);
        return { EC: -1, EM: 'Failed to create product' };
    }
};

// Reindex all products from static data
const reindexAllProductsFromStaticData = async () => {
    try {
        console.log('🔄 Starting reindex of all products from static data...');
        
        // Xóa index cũ
        const { client, PRODUCTS_INDEX } = require('../config/elasticsearch');
        await client.indices.delete({ index: PRODUCTS_INDEX, ignore: [404] });
        
        // Tạo lại index
        const { initializeIndex } = require('../config/elasticsearch');
        await initializeIndex();
        
        // Bulk index tất cả products
        await bulkIndexProducts(products);
        
        console.log(`✅ Reindex completed. Indexed ${products.length} products from static data.`);
        return true;
    } catch (error) {
        console.error('❌ Error reindexing products from static data:', error);
        return false;
    }
};

module.exports = {
    getAllCategoriesService,
    getCategoryByIdService,
    getProductsByCategoryService,
    getAllProductsService,
    advancedSearchProductsService,
    getSearchSuggestionsService,
    getProductByIdService,
    createProductService,
    reindexAllProductsFromStaticData
};

