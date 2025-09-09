# 🗄️ Hướng dẫn sử dụng Database + Elasticsearch

## 📋 Tổng quan

Hệ thống sử dụng **MongoDB** làm database chính và **Elasticsearch** để index và search. Data được lưu vào MongoDB trước, sau đó Elasticsearch sẽ sync từ database.

## 🏗️ Kiến trúc hệ thống

```
Static Data → MongoDB → Elasticsearch → API → Frontend
```

1. **Static Data**: Dữ liệu mẫu trong `src/data/products.js`
2. **MongoDB**: Database chính lưu trữ dữ liệu
3. **Elasticsearch**: Search engine index từ MongoDB
4. **API**: Cung cấp endpoints cho frontend
5. **Frontend**: Giao diện người dùng

## 🚀 Cài đặt và chạy

### Bước 1: Cài đặt MongoDB
```bash
# Sử dụng Docker (khuyến nghị)
docker run -d --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest

# Hoặc cài đặt trực tiếp
# Tải từ: https://www.mongodb.com/try/download/community
```

### Bước 2: Cài đặt Elasticsearch
```bash
# Sử dụng Docker (khuyến nghị)
docker run -d --name elasticsearch \
  -p 9200:9200 -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  elasticsearch:8.11.0
```

### Bước 3: Cấu hình .env
Tạo file `.env` trong thư mục `ExpressJS01`:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=27017
DB_NAME=ecommerce_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=8080

# Elasticsearch Configuration
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=changeme
```

### Bước 4: Cài đặt dependencies
```bash
cd ExpressJS01
npm install
```

### Bước 5: Seed data vào MongoDB
```bash
npm run seed-db
```

**Kết quả mong đợi:**
```
🌱 Starting data seeding to MongoDB...
✅ Connected to MongoDB
✅ Created 4 categories
✅ Created 24 products
🎉 Data seeding completed successfully!

📊 Summary:
- Categories: 4
- Products: 24

💡 Next steps:
1. Start Elasticsearch: docker run -d --name elasticsearch -p 9200:9200 -e "discovery.type=single-node" -e "xpack.security.enabled=false" elasticsearch:8.11.0
2. Reindex to Elasticsearch: npm run reindex
3. Start server: npm run dev
```

### Bước 6: Reindex data vào Elasticsearch
```bash
npm run reindex
```

**Kết quả mong đợi:**
```
🚀 Starting product reindexing process...
✅ Connected to MongoDB
✅ Elasticsearch connection successful
✅ Created Elasticsearch index: products
✅ Bulk indexed 24 products
🎉 Product reindexing completed successfully!
```

### Bước 7: Khởi động server
```bash
npm run dev
```

**Kết quả mong đợi:**
```
✅ Connected to MongoDB
📊 Database already has data, skipping seed
✅ Elasticsearch connection successful
✅ Created Elasticsearch index: products
✅ Bulk indexed 24 products
🎉 Reindex completed. Indexed 24 products.
Backend Nodejs App listening on port 8080
📊 Data stored in MongoDB, indexed in Elasticsearch
```

## 🧪 Test hệ thống

### Test Database
```bash
# Test MongoDB connection
mongo --eval "db.adminCommand('ismaster')"

# Test API endpoints
curl http://localhost:8080/v1/api/categories
curl http://localhost:8080/v1/api/products
```

### Test Elasticsearch
```bash
# Test Elasticsearch connection
curl http://localhost:9200

# Test search API
curl "http://localhost:8080/v1/api/products/search?query=iPhone"
curl "http://localhost:8080/v1/api/products/search?isOnSale=true"
```

### Test Frontend
```bash
cd ReactJS01/reactjs01
npm install
npm run dev
```

Mở: http://localhost:5173/products

## 📊 Dữ liệu trong Database

### MongoDB Collections

#### Categories Collection
```javascript
{
  _id: ObjectId("..."),
  name: "Điện thoại",
  description: "Các loại điện thoại thông minh",
  image: "https://via.placeholder.com/300x200?text=Phone",
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

#### Products Collection
```javascript
{
  _id: ObjectId("..."),
  name: "iPhone 15 Pro",
  description: "iPhone 15 Pro với chip A17 Pro mạnh mẽ",
  price: 29990000,
  originalPrice: 32990000,
  images: ["https://via.placeholder.com/400x400?text=iPhone15Pro"],
  category: ObjectId("..."),
  stock: 50,
  rating: 4.8,
  reviewCount: 120,
  viewCount: 1500,
  tags: ["apple", "premium", "camera"],
  isActive: true,
  isFeatured: true,
  isOnSale: true,
  discount: 9,
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}
```

### Elasticsearch Index

#### Products Index
```json
{
  "mappings": {
    "properties": {
      "name": {
        "type": "text",
        "analyzer": "standard",
        "fields": {
          "keyword": { "type": "keyword" },
          "suggest": { "type": "completion" }
        }
      },
      "description": { "type": "text" },
      "price": { "type": "float" },
      "category": { "type": "keyword" },
      "rating": { "type": "float" },
      "tags": { "type": "keyword" },
      "isOnSale": { "type": "boolean" },
      "isFeatured": { "type": "boolean" }
    }
  }
}
```

## 🔄 Data Flow

### 1. Initial Setup
```
Static Data → MongoDB (via seed script)
```

### 2. Search Indexing
```
MongoDB → Elasticsearch (via reindex script)
```

### 3. API Requests
```
Frontend → API → MongoDB (for CRUD)
Frontend → API → Elasticsearch (for search)
```

### 4. Data Updates
```
API → MongoDB → Elasticsearch (sync)
```

## 🛠️ Scripts có sẵn

### Database Scripts
```bash
npm run seed-db          # Seed data vào MongoDB
npm run seed-db --force  # Force overwrite existing data
```

### Elasticsearch Scripts
```bash
npm run reindex          # Reindex từ MongoDB sang Elasticsearch
npm run test-search      # Test search functionality
npm run quick-test       # Quick test toàn bộ hệ thống
```

### Development Scripts
```bash
npm run dev              # Start development server
npm start                # Start production server
```

## 🔍 API Endpoints

### Database Endpoints (MongoDB)
```
GET /v1/api/categories              # Lấy tất cả categories
GET /v1/api/categories/:id          # Lấy category theo ID
GET /v1/api/products                # Lấy tất cả products
GET /v1/api/products/:id            # Lấy product theo ID
GET /v1/api/categories/:id/products # Lấy products theo category
POST /v1/api/products               # Tạo product mới
```

### Search Endpoints (Elasticsearch)
```
GET /v1/api/products/search         # Advanced search với filters
GET /v1/api/products/suggestions    # Search suggestions
```

## 🐛 Troubleshooting

### MongoDB Issues
```bash
# Kiểm tra MongoDB
docker ps | grep mongodb
docker logs mongodb

# Kết nối MongoDB
mongo mongodb://localhost:27017/ecommerce_db
```

### Elasticsearch Issues
```bash
# Kiểm tra Elasticsearch
curl http://localhost:9200
docker logs elasticsearch

# Kiểm tra index
curl http://localhost:9200/products/_count
```

### Data Sync Issues
```bash
# Reindex lại
npm run reindex

# Seed lại data
npm run seed-db --force
npm run reindex
```

## ✅ Checklist

- [ ] MongoDB chạy trên port 27017
- [ ] Elasticsearch chạy trên port 9200
- [ ] Data được seed vào MongoDB
- [ ] Data được index vào Elasticsearch
- [ ] API endpoints hoạt động
- [ ] Search functionality hoạt động
- [ ] Frontend kết nối được backend

## 🎯 Lợi ích của kiến trúc này

✅ **Data Persistence**: Dữ liệu được lưu trữ bền vững trong MongoDB
✅ **Fast Search**: Elasticsearch cung cấp tìm kiếm nhanh
✅ **Scalability**: Có thể scale riêng biệt database và search
✅ **Flexibility**: Có thể thay đổi search engine mà không ảnh hưởng data
✅ **Backup**: Dữ liệu được backup trong MongoDB
✅ **Analytics**: Có thể phân tích dữ liệu từ MongoDB

## 🚀 Production Considerations

### MongoDB
- Sử dụng replica set cho high availability
- Backup định kỳ
- Monitoring performance

### Elasticsearch
- Cluster setup cho production
- Index lifecycle management
- Monitoring và alerting

### Data Sync
- Real-time sync với change streams
- Batch sync định kỳ
- Error handling và retry logic

Hệ thống sẵn sàng cho production! 🎉
