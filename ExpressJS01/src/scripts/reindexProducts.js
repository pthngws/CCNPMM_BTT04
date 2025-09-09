require('dotenv').config();
const mongoose = require('mongoose');
const { reindexAllProducts } = require('../services/elasticsearchService');
const connection = require('../config/database');

const reindexProducts = async () => {
    try {
        console.log('🚀 Starting product reindexing process...');
        
        // Kết nối MongoDB
        await connection();
        console.log('✅ Connected to MongoDB');
        
        // Reindex tất cả products
        const success = await reindexAllProducts();
        
        if (success) {
            console.log('🎉 Product reindexing completed successfully!');
        } else {
            console.log('❌ Product reindexing failed!');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during reindexing:', error);
        process.exit(1);
    }
};

// Chạy script
reindexProducts();

