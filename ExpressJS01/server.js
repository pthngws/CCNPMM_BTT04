require('dotenv').config();
const express = require('express');
const configViewEngine = require('./src/config/viewEngine');
const apiRoutes = require('./src/routes/api');
const webRoutes = require('./src/routes/web');
// const connection = require('./src/config/database'); // Comment out for static data
const { initializeIndex, checkConnection } = require('./src/config/elasticsearch');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configViewEngine(app);

app.use('/', webRoutes);
app.use('/v1/api/', apiRoutes);

(async () => {
    try {
        // Không cần kết nối MongoDB khi sử dụng static data
        // await connection();
        
        // Kiểm tra và khởi tạo Elasticsearch
        const elasticsearchConnected = await checkConnection();
        if (elasticsearchConnected) {
            await initializeIndex();
            
            // Reindex products từ static data
            const { reindexAllProductsFromStaticData } = require('./src/services/staticDataService');
            await reindexAllProductsFromStaticData();
        } else {
            console.log('⚠️  Elasticsearch not available, using static data fallback');
        }
        
        app.listen(port, () => {
            console.log(`Backend Nodejs App listening on port ${port}`);
            console.log('📊 Using static data instead of database');
        });
    } catch (error) {
        console.log('>>> Error starting server: ', error);
    }
})();