require('dotenv').config();
const mongoose = require('mongoose');
const { searchProducts, getSearchSuggestions } = require('../services/elasticsearchService');
const connection = require('../config/database');

const testSearch = async () => {
    try {
        console.log('🧪 Testing Elasticsearch search functionality...');
        
        // Kết nối MongoDB
        await connection();
        console.log('✅ Connected to MongoDB');
        
        // Test 1: Basic search
        console.log('\n🔍 Test 1: Basic search for "phone"');
        const basicSearch = await searchProducts({
            query: 'phone',
            page: 1,
            limit: 5
        });
        console.log('Results:', basicSearch.EC === 0 ? `${basicSearch.DT.products.length} products found` : 'Failed');
        
        // Test 2: Advanced search with filters
        console.log('\n🔍 Test 2: Advanced search with price filter');
        const advancedSearch = await searchProducts({
            query: '',
            minPrice: 100000,
            maxPrice: 5000000,
            minRating: 4.0,
            sortBy: 'price',
            sortOrder: 'asc',
            page: 1,
            limit: 5
        });
        console.log('Results:', advancedSearch.EC === 0 ? `${advancedSearch.DT.products.length} products found` : 'Failed');
        
        // Test 3: Search suggestions
        console.log('\n🔍 Test 3: Search suggestions for "lap"');
        const suggestions = await getSearchSuggestions('lap', 5);
        console.log('Suggestions:', suggestions.EC === 0 ? suggestions.DT.map(s => s.text).join(', ') : 'Failed');
        
        // Test 4: Fuzzy search
        console.log('\n🔍 Test 4: Fuzzy search for "telefon" (misspelled)');
        const fuzzySearch = await searchProducts({
            query: 'telefon',
            page: 1,
            limit: 5
        });
        console.log('Results:', fuzzySearch.EC === 0 ? `${fuzzySearch.DT.products.length} products found` : 'Failed');
        
        // Test 5: Category filter
        console.log('\n🔍 Test 5: Search by category');
        const categorySearch = await searchProducts({
            query: '',
            category: 'electronics', // Replace with actual category ID
            page: 1,
            limit: 5
        });
        console.log('Results:', categorySearch.EC === 0 ? `${categorySearch.DT.products.length} products found` : 'Failed');
        
        console.log('\n✅ All tests completed!');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error during testing:', error);
        process.exit(1);
    }
};

// Chạy tests
testSearch();

