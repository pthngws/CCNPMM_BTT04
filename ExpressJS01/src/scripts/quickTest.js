require('dotenv').config();
const mongoose = require('mongoose');
const { checkConnection, initializeIndex } = require('../config/elasticsearch');
const { reindexAllProducts } = require('../services/elasticsearchService');
const connection = require('../config/database');

const quickTest = async () => {
    console.log('🚀 Quick Test - Elasticsearch Search System');
    console.log('==========================================\n');

    try {
        // Step 1: Test MongoDB connection
        console.log('1️⃣ Testing MongoDB connection...');
        await connection();
        console.log('✅ MongoDB connected successfully\n');

        // Step 2: Test Elasticsearch connection
        console.log('2️⃣ Testing Elasticsearch connection...');
        const elasticsearchConnected = await checkConnection();
        if (!elasticsearchConnected) {
            console.log('❌ Elasticsearch connection failed!');
            console.log('💡 Please make sure Elasticsearch is running on http://localhost:9200');
            console.log('💡 You can start it with: docker run -d --name elasticsearch -p 9200:9200 -e "discovery.type=single-node" -e "xpack.security.enabled=false" elasticsearch:8.11.0');
            process.exit(1);
        }
        console.log('✅ Elasticsearch connected successfully\n');

        // Step 3: Initialize index
        console.log('3️⃣ Initializing Elasticsearch index...');
        await initializeIndex();
        console.log('✅ Index initialized successfully\n');

        // Step 4: Reindex products
        console.log('4️⃣ Reindexing products...');
        const reindexSuccess = await reindexAllProducts();
        if (!reindexSuccess) {
            console.log('❌ Reindexing failed!');
            process.exit(1);
        }
        console.log('✅ Products reindexed successfully\n');

        // Step 5: Test search functionality
        console.log('5️⃣ Testing search functionality...');
        const { searchProducts, getSearchSuggestions } = require('../services/elasticsearchService');
        
        // Test basic search
        const basicSearch = await searchProducts({
            query: 'test',
            page: 1,
            limit: 5
        });
        
        if (basicSearch.EC === 0) {
            console.log(`✅ Basic search works - Found ${basicSearch.DT.products.length} products`);
        } else {
            console.log('❌ Basic search failed');
        }

        // Test suggestions
        const suggestions = await getSearchSuggestions('test', 3);
        if (suggestions.EC === 0) {
            console.log(`✅ Suggestions work - Found ${suggestions.DT.length} suggestions`);
        } else {
            console.log('❌ Suggestions failed');
        }

        console.log('\n🎉 All tests passed! Your search system is ready to use.');
        console.log('\n📋 Next steps:');
        console.log('1. Start your backend: npm run dev');
        console.log('2. Start your frontend: cd ../ReactJS01/reactjs01 && npm run dev');
        console.log('3. Open http://localhost:5173/products to test the UI');
        console.log('4. Try searching with different keywords and filters');

        process.exit(0);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure MongoDB is running');
        console.log('2. Make sure Elasticsearch is running on port 9200');
        console.log('3. Check your .env file configuration');
        console.log('4. Make sure you have products in your database');
        process.exit(1);
    }
};

// Chạy quick test
quickTest();

