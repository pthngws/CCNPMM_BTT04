const { client, PRODUCTS_INDEX } = require('../config/elasticsearch');
const Product = require('../models/product');
const Category = require('../models/category');

// Index một product vào Elasticsearch
const indexProduct = async (product) => {
    try {
        const category = await Category.findById(product.category);
        
        const document = {
            _id: product._id.toString(),
            name: product.name,
            description: product.description || '',
            price: product.price,
            originalPrice: product.originalPrice || product.price,
            discount: product.discount || 0,
            category: product.category.toString(),
            categoryName: category ? category.name : '',
            stock: product.stock || 0,
            rating: product.rating || 0,
            reviewCount: product.reviewCount || 0,
            viewCount: product.viewCount || 0,
            tags: product.tags || [],
            isActive: product.isActive,
            isFeatured: product.isFeatured || false,
            isOnSale: product.isOnSale || false,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt
        };

        await client.index({
            index: PRODUCTS_INDEX,
            id: product._id.toString(),
            body: document
        });

        console.log(`✅ Indexed product: ${product.name}`);
        return true;
    } catch (error) {
        console.error('❌ Error indexing product:', error);
        return false;
    }
};

// Bulk index nhiều products
const bulkIndexProducts = async (products) => {
    try {
        const body = [];
        
        for (const product of products) {
            const document = {
                name: product.name,
                description: product.description || '',
                price: product.price,
                originalPrice: product.originalPrice || product.price,
                discount: product.discount || 0,
                category: product.category._id ? product.category._id.toString() : product.category.toString(),
                categoryName: product.category.name || '',
                stock: product.stock || 0,
                rating: product.rating || 0,
                reviewCount: product.reviewCount || 0,
                viewCount: product.viewCount || 0,
                tags: product.tags || [],
                isActive: product.isActive,
                isFeatured: product.isFeatured || false,
                isOnSale: product.isOnSale || false,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            };

            body.push({ index: { _index: PRODUCTS_INDEX, _id: product._id.toString() } });
            body.push(document);
        }

        if (body.length > 0) {
            const response = await client.bulk({ body });
            if (response.errors) {
                console.error('❌ Bulk indexing errors:', response.items.filter(item => item.index.error).map(item => ({
                    id: item.index._id,
                    error: item.index.error
                })));
            } else {
                console.log(`✅ Bulk indexed ${products.length} products successfully`);
            }
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error bulk indexing products:', error);
        return false;
    }
};

// Xóa product khỏi index
const deleteProductFromIndex = async (productId) => {
    try {
        await client.delete({
            index: PRODUCTS_INDEX,
            id: productId.toString()
        });
        console.log(`✅ Deleted product from index: ${productId}`);
        return true;
    } catch (error) {
        console.error('❌ Error deleting product from index:', error);
        return false;
    }
};

// Tìm kiếm products với fuzzy search và filters
const searchProducts = async (searchParams) => {
    try {
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
        } = searchParams;

        const from = (page - 1) * limit;
        
        // Xây dựng query body
        const queryBody = {
            index: PRODUCTS_INDEX,
            body: {
                from,
                size: limit,
                query: {
                    bool: {
                        must: [
                            {
                                term: {
                                    isActive: true
                                }
                            }
                        ],
                        filter: []
                    }
                }
            }
        };

        // Thêm fuzzy search nếu có query
        if (query.trim()) {
            // Nếu query quá ngắn (1-2 ký tự), dùng wildcard search
            if (query.trim().length <= 2) {
                queryBody.body.query.bool.must.push({
                    bool: {
                        should: [
                            {
                                wildcard: {
                                    name: `*${query.toLowerCase()}*`
                                }
                            },
                            {
                                wildcard: {
                                    description: `*${query.toLowerCase()}*`
                                }
                            },
                            {
                                wildcard: {
                                    categoryName: `*${query.toLowerCase()}*`
                                }
                            },
                            {
                                wildcard: {
                                    tags: `*${query.toLowerCase()}*`
                                }
                            }
                        ],
                        minimum_should_match: 1
                    }
                });
            } else {
                // Query dài hơn, dùng fuzzy search
                queryBody.body.query.bool.must.push({
                    multi_match: {
                        query: query,
                        fields: ['name^3', 'description^2', 'categoryName^2', 'tags'],
                        type: 'best_fields',
                        fuzziness: 'AUTO',
                        prefix_length: 0,
                        max_expansions: 100
                    }
                });
            }
        }

        // Thêm filters
        if (category) {
            queryBody.body.query.bool.filter.push({
                term: {
                    category: category
                }
            });
        }

        // Filter theo giá
        queryBody.body.query.bool.filter.push({
            range: {
                price: {
                    gte: minPrice,
                    lte: maxPrice
                }
            }
        });

        // Filter theo rating
        queryBody.body.query.bool.filter.push({
            range: {
                rating: {
                    gte: minRating,
                    lte: maxRating
                }
            }
        });

        // Filter theo sale status
        if (isOnSale !== null) {
            queryBody.body.query.bool.filter.push({
                term: {
                    isOnSale: isOnSale
                }
            });
        }

        // Filter theo featured status
        if (isFeatured !== null) {
            queryBody.body.query.bool.filter.push({
                term: {
                    isFeatured: isFeatured
                }
            });
        }

        // Thêm sorting
        const sortField = getSortField(sortBy);
        queryBody.body.sort = [
            {
                [sortField]: {
                    order: sortOrder
                }
            }
        ];

        // Thêm highlight cho search results
        if (query.trim()) {
            queryBody.body.highlight = {
                fields: {
                    name: {},
                    description: {},
                    categoryName: {}
                },
                pre_tags: ['<mark>'],
                post_tags: ['</mark>']
            };
        }

        const response = await client.search(queryBody);
        
        // Xử lý kết quả
        const products = response.hits.hits.map(hit => ({
            ...hit._source,
            _id: hit._id,
            _score: hit._score,
            highlight: hit.highlight
        }));

        const total = response.hits.total.value;
        const totalPages = Math.ceil(total / limit);

        return {
            EC: 0,
            EM: 'Search successful',
            DT: {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalProducts: total,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1
                },
                searchInfo: {
                    query,
                    filters: {
                        category,
                        minPrice,
                        maxPrice,
                        minRating,
                        maxRating,
                        isOnSale,
                        isFeatured
                    },
                    sortBy,
                    sortOrder
                }
            }
        };

    } catch (error) {
        console.error('❌ Error searching products:', error);
        return {
            EC: -1,
            EM: 'Search failed',
            DT: null
        };
    }
};

// Lấy suggestions cho autocomplete
const getSearchSuggestions = async (query, limit = 10) => {
    try {
        const response = await client.search({
            index: PRODUCTS_INDEX,
            body: {
                size: 0,
                suggest: {
                    product_suggest: {
                        prefix: query,
                        completion: {
                            field: 'name.suggest',
                            size: limit,
                            skip_duplicates: true
                        }
                    }
                }
            }
        });

        const suggestions = response.suggest.product_suggest[0].options.map(option => ({
            text: option.text,
            score: option._score
        }));

        return {
            EC: 0,
            EM: 'Suggestions retrieved successfully',
            DT: suggestions
        };
    } catch (error) {
        console.error('❌ Error getting suggestions:', error);
        return {
            EC: -1,
            EM: 'Failed to get suggestions',
            DT: []
        };
    }
};

// Helper function để map sort field
const getSortField = (sortBy) => {
    const sortMap = {
        'newest': 'createdAt',
        'oldest': 'createdAt',
        'price-low': 'price',
        'price-high': 'price',
        'rating': 'rating',
        'popular': 'viewCount',
        'name': 'name.keyword'
    };
    return sortMap[sortBy] || 'createdAt';
};

// Reindex tất cả products
const reindexAllProducts = async () => {
    try {
        console.log('🔄 Starting reindex of all products...');
        
        // Xóa index cũ
        try {
            await client.indices.delete({ index: PRODUCTS_INDEX });
        } catch (error) {
            if (error.meta?.statusCode !== 404) {
                throw error;
            }
        }
        
        // Tạo lại index
        const { initializeIndex } = require('../config/elasticsearch');
        await initializeIndex();
        
        // Lấy tất cả products từ MongoDB
        const products = await Product.find({ isActive: true }).populate('category', 'name');
        
        // Bulk index
        await bulkIndexProducts(products);
        
        console.log(`✅ Reindex completed. Indexed ${products.length} products.`);
        return true;
    } catch (error) {
        console.error('❌ Error reindexing products:', error);
        return false;
    }
};

module.exports = {
    indexProduct,
    bulkIndexProducts,
    deleteProductFromIndex,
    searchProducts,
    getSearchSuggestions,
    reindexAllProducts
};
