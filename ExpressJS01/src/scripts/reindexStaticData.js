require('dotenv').config();
const { reindexAllProductsFromStaticData } = require('../services/staticDataService');
const { checkConnection, initializeIndex } = require('../config/elasticsearch');

const reindexStaticData = async () => {
    try {
        console.log('🚀 Starting reindex of static data...');
        
        // Kiểm tra Elasticsearch connection
        const elasticsearchConnected = await checkConnection();
        if (!elasticsearchConnected) {
            console.log('❌ Elasticsearch connection failed!');
            console.log('💡 Please make sure Elasticsearch is running on http://localhost:9200');
            process.exit(1);
        }
        
        // Khởi tạo index
        await initializeIndex();
        console.log('✅ Elasticsearch index initialized');
        
        // Reindex products từ static data
        const success = await reindexAllProductsFromStaticData();
        
        if (success) {
            console.log('🎉 Static data reindexing completed successfully!');
        } else {
            console.log('❌ Static data reindexing failed!');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during reindexing:', error);
        process.exit(1);
    }
};

// Chạy script
reindexStaticData();

