const { client, PRODUCTS_INDEX } = require('../config/elasticsearch');
const Product = require('../models/product');
const Category = require('../models/category');

// Index một product vào Elasticsearch với đầy đủ dữ liệu cho suggestions
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
            purchaseCount: product.purchaseCount || 0,
            commentCount: product.commentCount || 0,
            favoriteCount: product.favoriteCount || 0,
            tags: product.tags || [],
            isActive: product.isActive,
            isFeatured: product.isFeatured || false,
            isOnSale: product.isOnSale || false,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            // Thêm dữ liệu cho completion suggester
            name_suggest: {
                input: [
                    product.name,
                    ...(product.tags || []),
                    ...(category ? [category.name] : [])
                ],
                weight: product.isFeatured ? 10 : 1
            },
            categoryName_suggest: {
                input: category ? [category.name] : [],
                weight: 5
            },
            tags_suggest: {
                input: product.tags || [],
                weight: 3
            }
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

// Bulk index nhiều products với đầy đủ dữ liệu cho suggestions
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
                updatedAt: product.updatedAt,
                // Thêm dữ liệu cho completion suggester
                name_suggest: {
                    input: [
                        product.name,
                        ...(product.tags || []),
                        ...(product.category.name ? [product.category.name] : [])
                    ],
                    weight: product.isFeatured ? 10 : 1
                },
                categoryName_suggest: {
                    input: product.category.name ? [product.category.name] : [],
                    weight: 5
                },
                tags_suggest: {
                    input: product.tags || [],
                    weight: 3
                }
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

        // Thêm tìm kiếm văn bản nếu có query
        if (query.trim()) {
            const q = query.trim().toLowerCase();

            // Nếu query quá ngắn (1-2 ký tự), dùng wildcard search đơn giản
            if (q.length <= 2) {
                queryBody.body.query.bool.must.push({
                    bool: {
                        should: [
                            { wildcard: { name: `*${q}*` } },
                            { wildcard: { description: `*${q}*` } },
                            { wildcard: { categoryName: `*${q}*` } },
                            { wildcard: { tags: `*${q}*` } }
                        ],
                        minimum_should_match: 1
                    }
                });
            } else {
                // Với query >= 3 ký tự: ưu tiên prefix match trên name.autocomplete,
                // đồng thời bổ sung fuzzy và wildcard làm fallback (chỉ cần 1 trong các điều kiện khớp)
                queryBody.body.query.bool.must.push({
                    bool: {
                        should: [
                            { match_phrase_prefix: { 'name.autocomplete': q } },
                            {
                                multi_match: {
                                    query: q,
                                    fields: ['name^3', 'categoryName^2', 'tags'],
                                    type: 'best_fields',
                                    fuzziness: 'AUTO',
                                    prefix_length: 0,
                                    max_expansions: 100
                                }
                            },
                            { wildcard: { name: `*${q}*` } },
                            { wildcard: { categoryName: `*${q}*` } },
                            { wildcard: { tags: `*${q}*` } }
                        ],
                        minimum_should_match: 1
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

// Lấy suggestions cho autocomplete - sử dụng Elasticsearch
const getSearchSuggestions = async (query, limit = 10) => {
    try {
        const trimmed = (query || '').trim();

        // Trường hợp không có query: lấy sản phẩm phổ biến từ ES
        if (!trimmed) {
            const response = await client.search({
                index: PRODUCTS_INDEX,
                body: {
                    size: limit,
                    query: {
                        bool: {
                            must: [{ term: { isActive: true } }]
                        }
                    },
                    sort: [
                        { isFeatured: { order: 'desc' } },
                        { viewCount: { order: 'desc' } },
                        { rating: { order: 'desc' } }
                    ]
                }
            });

            const suggestions = response.hits.hits.map(hit => ({
                text: hit._source.name,
                score: (hit._source.isFeatured ? 10 : 0) + (hit._source.viewCount || 0) + (hit._source.rating || 0),
                type: 'product',
                source: 'es-popular',
                productId: hit._id
            }));

            return {
                EC: 0,
                EM: 'Popular products retrieved successfully (ES)',
                DT: suggestions
            };
        }

        // Có query: ưu tiên prefix/autocomplete trên ES
        const q = trimmed.toLowerCase();

        // Thử dùng suggest API (nếu trường suggest đã được index). Nếu không có, vẫn có kết quả fallback từ truy vấn search phía dưới.
        const [suggestRes, searchRes] = await Promise.all([
            client.search({
                index: PRODUCTS_INDEX,
                body: {
                    size: 0,
                    suggest: {
                        name_suggest: {
                            prefix: q,
                            completion: { field: 'name.suggest', size: limit, skip_duplicates: true }
                        },
                        category_suggest: {
                            prefix: q,
                            completion: { field: 'categoryName.suggest', size: limit, skip_duplicates: true }
                        },
                        tag_suggest: {
                            prefix: q,
                            completion: { field: 'tags.suggest', size: limit, skip_duplicates: true }
                        }
                    }
                }
            }).catch(() => null),
            client.search({
                index: PRODUCTS_INDEX,
                body: {
                    size: limit,
                    query: {
                        bool: {
                            must: [{ term: { isActive: true } }],
                            should: [
                                { match_phrase_prefix: { 'name.autocomplete': q } },
                                { wildcard: { 'name': `*${q}*` } },
                                { wildcard: { 'categoryName': `*${q}*` } },
                                { wildcard: { 'tags': `*${q}*` } }
                            ],
                            minimum_should_match: 1
                        }
                    },
                    sort: [
                        { isFeatured: { order: 'desc' } },
                        { viewCount: { order: 'desc' } },
                        { rating: { order: 'desc' } }
                    ]
                }
            })
        ]);

        const out = [];

        // Map từ suggest API nếu có
        if (suggestRes && suggestRes.suggest) {
            const pushOption = (opt, type) => {
                if (!opt || !opt.text) return;
                out.push({
                    text: opt.text,
                    score: opt._score || 1,
                    type,
                    source: 'es-suggest'
                });
            };

            (suggestRes.suggest.name_suggest?.[0]?.options || []).forEach(o => pushOption(o, 'product'));
            (suggestRes.suggest.category_suggest?.[0]?.options || []).forEach(o => pushOption(o, 'category'));
            // Bỏ qua tag suggestions theo yêu cầu trước đây, nhưng vẫn có thể tận dụng nếu muốn
        }

        // Fallback + bổ sung: lấy từ search hits
        const hits = searchRes.hits.hits || [];

        // Sản phẩm
        hits.forEach(hit => {
            out.push({
                text: hit._source.name,
                score: (hit._source.isFeatured ? 10 : 0) + (hit._source.viewCount || 0) + (hit._source.rating || 0),
                type: 'product',
                source: 'es-search',
                productId: hit._id
            });
        });

        // Danh mục: suy ra từ các hit (lấy id từ field category, tên từ categoryName)
        const seenCategories = new Set();
        hits.forEach(hit => {
            const catId = hit._source.category;
            const catName = hit._source.categoryName;
            if (catId && catName && !seenCategories.has(catId) && catName.toLowerCase().includes(q)) {
                seenCategories.add(catId);
                out.push({
                    text: catName,
                    score: 5,
                    type: 'category',
                    source: 'es-derived',
                    categoryId: catId
                });
            }
        });

        // Lọc trùng theo text + ưu tiên product trước
        const dedup = [];
        const seenText = new Set();
        out
            .filter(s => !!s.text)
            .sort((a, b) => {
                if (a.type === 'product' && b.type !== 'product') return -1;
                if (b.type === 'product' && a.type !== 'product') return 1;
                return (b.score || 0) - (a.score || 0);
            })
            .forEach(item => {
                if (!seenText.has(item.text)) {
                    seenText.add(item.text);
                    dedup.push(item);
                }
            });

        const sliced = dedup.slice(0, limit);

        return {
            EC: 0,
            EM: 'Suggestions retrieved successfully (ES)',
            DT: sliced
        };
    } catch (error) {
        console.error('❌ Error getting suggestions (ES):', error);
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

// Tìm kiếm sản phẩm tương tự (More Like This)
const getSimilarProducts = async (productId, limit = 6) => {
    try {
        const response = await client.search({
            index: PRODUCTS_INDEX,
            body: {
                size: limit,
                query: {
                    bool: {
                        must: [
                            {
                                more_like_this: {
                                    fields: ['name', 'description', 'categoryName', 'tags'],
                                    like: [
                                        {
                                            _index: PRODUCTS_INDEX,
                                            _id: productId
                                        }
                                    ],
                                    min_term_freq: 1,
                                    max_query_terms: 12,
                                    min_doc_freq: 1,
                                    max_doc_freq: 1000,
                                    min_word_length: 2,
                                    boost_terms: 2.0,
                                    include: true,
                                    minimum_should_match: '30%'
                                }
                            }
                        ],
                        filter: {
                            bool: {
                                must: [
                                    { term: { isActive: true } },
                                    { bool: { must_not: { term: { _id: productId } } } }
                                ]
                            }
                        }
                    }
                },
                sort: [
                    { _score: { order: 'desc' } },
                    { purchaseCount: { order: 'desc' } },
                    { rating: { order: 'desc' } }
                ]
            }
        });

        const products = response.hits.hits.map(hit => ({
            ...hit._source,
            _id: hit._id,
            _score: hit._score
        }));

        return {
            EC: 0,
            EM: 'Similar products retrieved successfully',
            DT: products
        };
    } catch (error) {
        console.error('❌ Error getting similar products:', error);
        return {
            EC: -1,
            EM: 'Failed to get similar products',
            DT: []
        };
    }
};

// Tìm kiếm theo trending (sản phẩm được xem nhiều nhất)
const getTrendingProducts = async (limit = 10, timeRange = '7d') => {
    try {
        const response = await client.search({
            index: PRODUCTS_INDEX,
            body: {
                size: limit,
                query: {
                    bool: {
                        must: [
                            { term: { isActive: true } },
                            { range: { createdAt: { gte: `now-${timeRange}` } } }
                        ]
                    }
                },
                sort: [
                    { viewCount: { order: 'desc' } },
                    { rating: { order: 'desc' } },
                    { createdAt: { order: 'desc' } }
                ]
            }
        });

        const products = response.hits.hits.map(hit => ({
            ...hit._source,
            _id: hit._id,
            _score: hit._score
        }));

        return {
            EC: 0,
            EM: 'Trending products retrieved successfully',
            DT: products
        };
    } catch (error) {
        console.error('❌ Error getting trending products:', error);
        return {
            EC: -1,
            EM: 'Failed to get trending products',
            DT: []
        };
    }
};

// Tìm kiếm theo facets/aggregations
const getSearchFacets = async (searchParams) => {
    try {
        const {
            query = '',
            category = '',
            minPrice = 0,
            maxPrice = Number.MAX_SAFE_INTEGER,
            minRating = 0,
            maxRating = 5
        } = searchParams;

        const queryBody = {
            index: PRODUCTS_INDEX,
            body: {
                size: 0,
                query: {
                    bool: {
                        must: [
                            { term: { isActive: true } }
                        ],
                        filter: [
                            { range: { price: { gte: minPrice, lte: maxPrice } } },
                            { range: { rating: { gte: minRating, lte: maxRating } } }
                        ]
                    }
                },
                aggs: {
                    categories: {
                        terms: {
                            field: 'categoryName.keyword',
                            size: 20
                        }
                    },
                    price_ranges: {
                        range: {
                            field: 'price',
                            ranges: [
                                { to: 100000 },
                                { from: 100000, to: 500000 },
                                { from: 500000, to: 1000000 },
                                { from: 1000000, to: 5000000 },
                                { from: 5000000 }
                            ]
                        }
                    },
                    rating_ranges: {
                        range: {
                            field: 'rating',
                            ranges: [
                                { to: 2 },
                                { from: 2, to: 3 },
                                { from: 3, to: 4 },
                                { from: 4, to: 5 }
                            ]
                        }
                    },
                    tags: {
                        terms: {
                            field: 'tags',
                            size: 20
                        }
                    },
                    stock_status: {
                        terms: {
                            field: 'isOnSale'
                        }
                    },
                    featured_status: {
                        terms: {
                            field: 'isFeatured'
                        }
                    }
                }
            }
        };

        // Thêm text search nếu có query
        if (query.trim()) {
            queryBody.body.query.bool.must.push({
                multi_match: {
                    query: query,
                    fields: ['name^3', 'categoryName^2', 'tags'],
                    type: 'best_fields',
                    fuzziness: 'AUTO'
                }
            });
        }

        // Thêm category filter nếu có
        if (category) {
            queryBody.body.query.bool.filter.push({
                term: { category: category }
            });
        }

        const response = await client.search(queryBody);

        return {
            EC: 0,
            EM: 'Search facets retrieved successfully',
            DT: {
                categories: response.aggregations.categories.buckets,
                priceRanges: response.aggregations.price_ranges.buckets,
                ratingRanges: response.aggregations.rating_ranges.buckets,
                tags: response.aggregations.tags.buckets,
                stockStatus: response.aggregations.stock_status.buckets,
                featuredStatus: response.aggregations.featured_status.buckets
            }
        };
    } catch (error) {
        console.error('❌ Error getting search facets:', error);
        return {
            EC: -1,
            EM: 'Failed to get search facets',
            DT: null
        };
    }
};

// Tìm kiếm với typo tolerance và phonetic matching
const searchWithTypoTolerance = async (query, limit = 12) => {
    try {
        const response = await client.search({
            index: PRODUCTS_INDEX,
            body: {
                size: limit,
                query: {
                    bool: {
                        must: [
                            { term: { isActive: true } }
                        ],
                        should: [
                            // Exact match (highest priority)
                            {
                                multi_match: {
                                    query: query,
                                    fields: ['name^5', 'categoryName^3', 'tags^2'],
                                    type: 'phrase',
                                    boost: 3
                                }
                            },
                            // Fuzzy match
                            {
                                multi_match: {
                                    query: query,
                                    fields: ['name^3', 'categoryName^2', 'tags'],
                                    type: 'best_fields',
                                    fuzziness: 'AUTO',
                                    prefix_length: 1,
                                    max_expansions: 50,
                                    boost: 2
                                }
                            },
                            // Wildcard match
                            {
                                bool: {
                                    should: [
                                        { wildcard: { 'name.autocomplete': `*${query.toLowerCase()}*` } },
                                        { wildcard: { 'description': `*${query.toLowerCase()}*` } },
                                        { wildcard: { 'categoryName': `*${query.toLowerCase()}*` } },
                                        { wildcard: { 'tags': `*${query.toLowerCase()}*` } }
                                    ],
                                    boost: 1
                                }
                            }
                        ],
                        minimum_should_match: 1
                    }
                },
                highlight: {
                    fields: {
                        name: { number_of_fragments: 0 },
                        description: { number_of_fragments: 1, fragment_size: 150 },
                        categoryName: { number_of_fragments: 0 }
                    },
                    pre_tags: ['<mark>'],
                    post_tags: ['</mark>']
                }
            }
        });

        const products = response.hits.hits.map(hit => ({
            ...hit._source,
            _id: hit._id,
            _score: hit._score,
            highlight: hit.highlight
        }));

        return {
            EC: 0,
            EM: 'Search with typo tolerance successful',
            DT: {
                products,
                total: response.hits.total.value,
                maxScore: response.hits.max_score
            }
        };
    } catch (error) {
        console.error('❌ Error searching with typo tolerance:', error);
        return {
            EC: -1,
            EM: 'Search with typo tolerance failed',
            DT: null
        };
    }
};

module.exports = {
    indexProduct,
    bulkIndexProducts,
    deleteProductFromIndex,
    searchProducts,
    getSearchSuggestions,
    getSimilarProducts,
    getTrendingProducts,
    getSearchFacets,
    searchWithTypoTolerance,
    reindexAllProducts
};
