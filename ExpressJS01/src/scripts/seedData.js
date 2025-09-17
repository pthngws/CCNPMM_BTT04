const mongoose = require('mongoose');
const Category = require('../models/category');
const Product = require('../models/product');

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

const categories = [
    {
        name: 'Điện thoại',
        description: 'Điện thoại di động và phụ kiện',
        image: 'https://via.placeholder.com/300x200?text=Phone'
    },
    {
        name: 'Laptop',
        description: 'Laptop và máy tính xách tay',
        image: 'https://via.placeholder.com/300x200?text=Laptop'
    },
    {
        name: 'Phụ kiện',
        description: 'Phụ kiện điện tử và công nghệ',
        image: 'https://via.placeholder.com/300x200?text=Accessories'
    },
    {
        name: 'Đồng hồ',
        description: 'Đồng hồ thông minh và đồng hồ đeo tay',
        image: 'https://via.placeholder.com/300x200?text=Watch'
    }
];

const products = [
    // Điện thoại
    {
        name: 'iPhone 15 Pro',
        description: 'iPhone 15 Pro với chip A17 Pro mạnh mẽ',
        price: 29990000,
        originalPrice: 32990000,
        images: ['https://via.placeholder.com/400x400?text=iPhone15Pro'],
        stock: 50,
        tags: ['apple', 'premium', 'camera']
    },
    {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Galaxy S24 Ultra với camera 200MP',
        price: 26990000,
        originalPrice: 29990000,
        images: ['https://via.placeholder.com/400x400?text=GalaxyS24'],
        stock: 30,
        tags: ['samsung', 'android', 'camera']
    },
    {
        name: 'Xiaomi 14 Pro',
        description: 'Xiaomi 14 Pro với camera Leica',
        price: 19990000,
        originalPrice: 22990000,
        images: ['https://via.placeholder.com/400x400?text=Xiaomi14'],
        stock: 25,
        tags: ['xiaomi', 'android', 'value']
    },
    {
        name: 'OnePlus 12',
        description: 'OnePlus 12 với Snapdragon 8 Gen 3',
        price: 18990000,
        originalPrice: 21990000,
        images: ['https://via.placeholder.com/400x400?text=OnePlus12'],
        stock: 20,
        tags: ['oneplus', 'android', 'performance']
    },
    {
        name: 'Google Pixel 8 Pro',
        description: 'Pixel 8 Pro với AI camera',
        price: 22990000,
        originalPrice: 25990000,
        images: ['https://via.placeholder.com/400x400?text=Pixel8Pro'],
        stock: 15,
        tags: ['google', 'android', 'ai']
    },
    {
        name: 'Huawei P60 Pro',
        description: 'Huawei P60 Pro với camera XMAGE',
        price: 17990000,
        originalPrice: 20990000,
        images: ['https://via.placeholder.com/400x400?text=HuaweiP60'],
        stock: 10,
        tags: ['huawei', 'camera', 'premium']
    },

    // Laptop
    {
        name: 'MacBook Pro M3',
        description: 'MacBook Pro M3 với chip M3 mạnh mẽ',
        price: 45990000,
        originalPrice: 49990000,
        images: ['https://via.placeholder.com/400x400?text=MacBookProM3'],
        stock: 20,
        tags: ['apple', 'laptop', 'premium']
    },
    {
        name: 'Dell XPS 15',
        description: 'Dell XPS 15 với màn hình 4K',
        price: 39990000,
        originalPrice: 43990000,
        images: ['https://via.placeholder.com/400x400?text=DellXPS15'],
        stock: 15,
        tags: ['dell', 'laptop', '4k']
    },
    {
        name: 'HP Spectre x360',
        description: 'HP Spectre x360 2-in-1',
        price: 35990000,
        originalPrice: 39990000,
        images: ['https://via.placeholder.com/400x400?text=HPSpectre'],
        stock: 12,
        tags: ['hp', 'laptop', '2in1']
    },
    {
        name: 'Lenovo ThinkPad X1',
        description: 'Lenovo ThinkPad X1 Carbon',
        price: 32990000,
        originalPrice: 36990000,
        images: ['https://via.placeholder.com/400x400?text=ThinkPadX1'],
        stock: 18,
        tags: ['lenovo', 'laptop', 'business']
    },
    {
        name: 'ASUS ROG Zephyrus',
        description: 'ASUS ROG Zephyrus gaming laptop',
        price: 42990000,
        originalPrice: 46990000,
        images: ['https://via.placeholder.com/400x400?text=ROGZephyrus'],
        stock: 8,
        tags: ['asus', 'gaming', 'laptop']
    },
    {
        name: 'MSI Creator 15',
        description: 'MSI Creator 15 cho content creator',
        price: 38990000,
        originalPrice: 42990000,
        images: ['https://via.placeholder.com/400x400?text=MSICreator'],
        stock: 10,
        tags: ['msi', 'creator', 'laptop']
    },

    // Phụ kiện
    {
        name: 'AirPods Pro 2',
        description: 'AirPods Pro 2 với ANC',
        price: 5990000,
        originalPrice: 6990000,
        images: ['https://via.placeholder.com/400x400?text=AirPodsPro2'],
        stock: 100,
        tags: ['apple', 'earbuds', 'wireless']
    },
    {
        name: 'Sony WH-1000XM5',
        description: 'Sony WH-1000XM5 noise cancelling',
        price: 7990000,
        originalPrice: 8990000,
        images: ['https://via.placeholder.com/400x400?text=SonyWH1000XM5'],
        stock: 50,
        tags: ['sony', 'headphones', 'noise-cancelling']
    },
    {
        name: 'Samsung Galaxy Buds2 Pro',
        description: 'Samsung Galaxy Buds2 Pro',
        price: 4990000,
        originalPrice: 5990000,
        images: ['https://via.placeholder.com/400x400?text=GalaxyBuds2Pro'],
        stock: 80,
        tags: ['samsung', 'earbuds', 'wireless']
    },
    {
        name: 'JBL Charge 5',
        description: 'JBL Charge 5 portable speaker',
        price: 2990000,
        originalPrice: 3990000,
        images: ['https://via.placeholder.com/400x400?text=JBLCharge5'],
        stock: 60,
        tags: ['jbl', 'speaker', 'portable']
    },
    {
        name: 'Anker PowerCore 10000',
        description: 'Anker PowerCore 10000 power bank',
        price: 899000,
        originalPrice: 1299000,
        images: ['https://via.placeholder.com/400x400?text=AnkerPowerCore'],
        stock: 120,
        tags: ['anker', 'powerbank', 'portable']
    },
    {
        name: 'Belkin Boost Charge Pro',
        description: 'Belkin Boost Charge Pro wireless charger',
        price: 1990000,
        originalPrice: 2499000,
        images: ['https://via.placeholder.com/400x400?text=BelkinBoost'],
        stock: 40,
        tags: ['belkin', 'wireless-charger', 'fast-charging']
    },

    // Đồng hồ
    {
        name: 'Apple Watch Series 9',
        description: 'Apple Watch Series 9 với S9 chip',
        price: 8990000,
        originalPrice: 9990000,
        images: ['https://via.placeholder.com/400x400?text=AppleWatch9'],
        stock: 30,
        tags: ['apple', 'smartwatch', 'fitness']
    },
    {
        name: 'Samsung Galaxy Watch 6',
        description: 'Samsung Galaxy Watch 6 Classic',
        price: 6990000,
        originalPrice: 7990000,
        images: ['https://via.placeholder.com/400x400?text=GalaxyWatch6'],
        stock: 25,
        tags: ['samsung', 'smartwatch', 'android']
    },
    {
        name: 'Garmin Fenix 7',
        description: 'Garmin Fenix 7 multisport GPS',
        price: 12990000,
        originalPrice: 14990000,
        images: ['https://via.placeholder.com/400x400?text=GarminFenix7'],
        stock: 15,
        tags: ['garmin', 'smartwatch', 'gps']
    },
    {
        name: 'Fitbit Versa 4',
        description: 'Fitbit Versa 4 fitness tracker',
        price: 3990000,
        originalPrice: 4990000,
        images: ['https://via.placeholder.com/400x400?text=FitbitVersa4'],
        stock: 35,
        tags: ['fitbit', 'fitness', 'health']
    },
    {
        name: 'Huawei Watch GT 4',
        description: 'Huawei Watch GT 4 với battery 14 ngày',
        price: 3990000,
        originalPrice: 4990000,
        images: ['https://via.placeholder.com/400x400?text=HuaweiGT4'],
        stock: 20,
        tags: ['huawei', 'smartwatch', 'battery']
    },
    {
        name: 'Amazfit GTR 4',
        description: 'Amazfit GTR 4 với GPS và heart rate',
        price: 2990000,
        originalPrice: 3990000,
        images: ['https://via.placeholder.com/400x400?text=AmazfitGTR4'],
        stock: 45,
        tags: ['amazfit', 'smartwatch', 'value']
    }
];

const seedData = async () => {
    try {
        await connection();
        
        // Xóa dữ liệu cũ
        await Category.deleteMany({});
        await Product.deleteMany({});
        
        // Tạo categories
        const createdCategories = await Category.insertMany(categories);
        console.log(`Created ${createdCategories.length} categories`);
        
        // Tạo products với category mapping
        const phoneCategory = createdCategories.find(cat => cat.name === 'Điện thoại');
        const laptopCategory = createdCategories.find(cat => cat.name === 'Laptop');
        const accessoryCategory = createdCategories.find(cat => cat.name === 'Phụ kiện');
        const watchCategory = createdCategories.find(cat => cat.name === 'Đồng hồ');
        
        const productsWithCategories = products.map((product, index) => {
            let category;
            if (index < 6) category = phoneCategory._id;
            else if (index < 12) category = laptopCategory._id;
            else if (index < 18) category = accessoryCategory._id;
            else category = watchCategory._id;
            
            // Thêm các field mặc định
            return { 
                ...product, 
                category,
                isActive: true,
                isFeatured: index < 3, // 3 sản phẩm đầu tiên của mỗi category sẽ là featured
                isOnSale: product.originalPrice && product.originalPrice > product.price,
                rating: 0,
                reviewCount: 0,
                viewCount: 0,
                purchaseCount: 0,
                commentCount: 0,
                favoriteCount: 0
            };
        });
        
        const createdProducts = await Product.insertMany(productsWithCategories);
        console.log(`Created ${createdProducts.length} products`);
        
        console.log('Seed data completed successfully!');
        
    } catch (error) {
        console.error('Error seeding data:', error);
    } finally {
        await mongoose.disconnect();
        console.log('MongoDB disconnected');
    }
};

seedData();