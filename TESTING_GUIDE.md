# 🧪 Hướng dẫn Test hệ thống tìm kiếm sản phẩm

## 📋 Bước 1: Cài đặt và khởi động Elasticsearch

### Option 1: Sử dụng Docker (Khuyến nghị)
```bash
# Chạy Elasticsearch với Docker
docker run -d --name elasticsearch \
  -p 9200:9200 -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  elasticsearch:8.11.0

# Kiểm tra Elasticsearch đã chạy
curl http://localhost:9200
```

### Option 2: Cài đặt trực tiếp
1. Tải Elasticsearch 8.x từ: https://www.elastic.co/downloads/elasticsearch
2. Giải nén và chạy: `./bin/elasticsearch`
3. Mặc định chạy trên port 9200

## 📋 Bước 2: Cấu hình Environment

Tạo file `.env` trong thư mục `ExpressJS01`:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=27017
DB_NAME=your_database_name

# JWT Configuration
JWT_SECRET=your_jwt_secret_key

# Server Configuration
PORT=8080

# Elasticsearch Configuration
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=changeme
```

## 📋 Bước 3: Cài đặt dependencies

```bash
# Backend
cd ExpressJS01
npm install

# Frontend
cd ../ReactJS01/reactjs01
npm install
```

## 📋 Bước 4: Khởi động Backend

```bash
cd ExpressJS01
npm run dev
```

Kiểm tra logs để đảm bảo:
- ✅ MongoDB connected
- ✅ Elasticsearch connection successful
- ✅ Created Elasticsearch index: products

## 📋 Bước 5: Reindex Products

```bash
# Trong thư mục ExpressJS01
npm run reindex
```

Kết quả mong đợi:
```
🚀 Starting product reindexing process...
✅ Connected to MongoDB
✅ Elasticsearch connection successful
✅ Created Elasticsearch index: products
✅ Bulk indexed X products
🎉 Product reindexing completed successfully!
```

## 📋 Bước 6: Test Search API

### Test 1: Basic Search
```bash
curl "http://localhost:8080/v1/api/products/search?query=phone&page=1&limit=5"
```

### Test 2: Advanced Search với Filters
```bash
curl "http://localhost:8080/v1/api/products/search?minPrice=100000&maxPrice=5000000&minRating=4.0&sortBy=price&sortOrder=asc"
```

### Test 3: Search Suggestions
```bash
curl "http://localhost:8080/v1/api/products/suggestions?q=lap&limit=5"
```

### Test 4: Fuzzy Search
```bash
curl "http://localhost:8080/v1/api/products/search?query=telefon"
```

## 📋 Bước 7: Test Script tự động

```bash
# Trong thư mục ExpressJS01
npm run test-search
```

Kết quả mong đợi:
```
🧪 Testing Elasticsearch search functionality...
✅ Connected to MongoDB
🔍 Test 1: Basic search for "phone"
Results: X products found
🔍 Test 2: Advanced search with price filter
Results: X products found
🔍 Test 3: Search suggestions for "lap"
Suggestions: laptop, laptop gaming, ...
🔍 Test 4: Fuzzy search for "telefon"
Results: X products found
🔍 Test 5: Search by category
Results: X products found
✅ All tests completed!
```

## 📋 Bước 8: Test Frontend

### Khởi động Frontend
```bash
cd ReactJS01/reactjs01
npm run dev
```

### Test UI Features
1. **Mở trình duyệt**: http://localhost:5173/products
2. **Test Basic Search**: Gõ từ khóa vào search box
3. **Test Advanced Filters**: Click "Bộ lọc" để mở advanced filters
4. **Test Price Slider**: Kéo slider để lọc theo giá
5. **Test Rating Slider**: Kéo slider để lọc theo đánh giá
6. **Test Toggle Switches**: Bật/tắt isOnSale và isFeatured
7. **Test Sort Options**: Thay đổi cách sắp xếp
8. **Test Auto-complete**: Gõ từ khóa để xem suggestions

## 📋 Bước 9: Test Cases chi tiết

### Test Case 1: Fuzzy Search
```
Input: "telefon"
Expected: Tìm thấy "telephone", "phone"
```

### Test Case 2: Price Filter
```
Input: minPrice=100000, maxPrice=5000000
Expected: Chỉ hiển thị sản phẩm trong khoảng giá này
```

### Test Case 3: Rating Filter
```
Input: minRating=4.0
Expected: Chỉ hiển thị sản phẩm có rating >= 4.0
```

### Test Case 4: Category Filter
```
Input: category=electronics
Expected: Chỉ hiển thị sản phẩm trong danh mục electronics
```

### Test Case 5: Combined Filters
```
Input: query=phone, minPrice=100000, maxPrice=5000000, minRating=4.0
Expected: Sản phẩm phone trong khoảng giá và rating phù hợp
```

## 📋 Bước 10: Performance Testing

### Test với nhiều dữ liệu
```bash
# Tạo nhiều products để test
# (Có thể sử dụng seed script hoặc tạo thủ công)
```

### Test Response Time
```bash
# Sử dụng curl với time
time curl "http://localhost:8080/v1/api/products/search?query=test"
```

## 🐛 Troubleshooting

### Lỗi: Elasticsearch connection failed
```bash
# Kiểm tra Elasticsearch có chạy không
curl http://localhost:9200

# Kiểm tra logs
docker logs elasticsearch
```

### Lỗi: No products found
```bash
# Kiểm tra có products trong MongoDB không
# Chạy lại reindex
npm run reindex
```

### Lỗi: Frontend không load
```bash
# Kiểm tra backend có chạy không
curl http://localhost:8080/v1/api/products

# Kiểm tra CORS settings
```

### Lỗi: Search không hoạt động
```bash
# Kiểm tra Elasticsearch index
curl "http://localhost:9200/products/_count"

# Kiểm tra mapping
curl "http://localhost:9200/products/_mapping"
```

## 📊 Kết quả mong đợi

### Backend Tests
- ✅ Elasticsearch connection successful
- ✅ Index created successfully
- ✅ Products indexed successfully
- ✅ Search API returns results
- ✅ Suggestions API works
- ✅ Fuzzy search works

### Frontend Tests
- ✅ AdvancedSearch component loads
- ✅ Search input works
- ✅ Filters work correctly
- ✅ Auto-complete shows suggestions
- ✅ Results display correctly
- ✅ Pagination works
- ✅ Responsive design works

## 🎯 Success Criteria

Hệ thống được coi là hoạt động tốt khi:
1. ✅ Elasticsearch kết nối thành công
2. ✅ Products được index thành công
3. ✅ Search API trả về kết quả chính xác
4. ✅ Fuzzy search hoạt động (tìm được kết quả với lỗi chính tả)
5. ✅ Advanced filters hoạt động
6. ✅ Frontend UI responsive và user-friendly
7. ✅ Performance tốt (< 1s response time)

Chúc bạn test thành công! 🚀

