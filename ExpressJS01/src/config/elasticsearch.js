const { Client } = require('@elastic/elasticsearch');

// Cấu hình Elasticsearch client
const client = new Client({
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    auth: {
        username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
        password: process.env.ELASTICSEARCH_PASSWORD || 'changeme'
    },
    // Tùy chọn cho development
    requestTimeout: 30000,
    maxRetries: 3,
    resurrectStrategy: 'ping'
});

// Tên index cho products
const PRODUCTS_INDEX = 'products';

// Mapping cho products index
const productsMapping = {
    mappings: {
        properties: {
            name: {
                type: 'text',
                analyzer: 'standard',
                fields: {
                    keyword: {
                        type: 'keyword'
                    },
                    suggest: {
                        type: 'completion'
                    }
                }
            },
            description: {
                type: 'text',
                analyzer: 'standard'
            },
            price: {
                type: 'float'
            },
            originalPrice: {
                type: 'float'
            },
            discount: {
                type: 'float'
            },
            category: {
                type: 'keyword'
            },
            categoryName: {
                type: 'text',
                analyzer: 'standard'
            },
            stock: {
                type: 'integer'
            },
            rating: {
                type: 'float'
            },
            reviewCount: {
                type: 'integer'
            },
            viewCount: {
                type: 'integer'
            },
            tags: {
                type: 'keyword'
            },
            isActive: {
                type: 'boolean'
            },
            createdAt: {
                type: 'date'
            },
            updatedAt: {
                type: 'date'
            }
        }
    },
    settings: {
        analysis: {
            analyzer: {
                vietnamese_analyzer: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: ['lowercase', 'asciifolding']
                }
            }
        }
    }
};

// Khởi tạo index nếu chưa tồn tại
const initializeIndex = async () => {
    try {
        const exists = await client.indices.exists({ index: PRODUCTS_INDEX });
        
        if (!exists) {
            await client.indices.create({
                index: PRODUCTS_INDEX,
                body: productsMapping
            });
            console.log(`✅ Created Elasticsearch index: ${PRODUCTS_INDEX}`);
        } else {
            console.log(`✅ Elasticsearch index already exists: ${PRODUCTS_INDEX}`);
        }
    } catch (error) {
        console.error('❌ Error initializing Elasticsearch index:', error);
        throw error;
    }
};

// Kiểm tra kết nối Elasticsearch
const checkConnection = async () => {
    try {
        const response = await client.ping();
        console.log('✅ Elasticsearch connection successful');
        return true;
    } catch (error) {
        console.error('❌ Elasticsearch connection failed:', error);
        return false;
    }
};

module.exports = {
    client,
    PRODUCTS_INDEX,
    initializeIndex,
    checkConnection
};

