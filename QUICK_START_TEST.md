# 🚀 Quick Start - Test hệ thống tìm kiếm

## ⚡ Test nhanh trong 5 phút

### Bước 1: Khởi động Elasticsearch
```bash
# Sử dụng Docker (khuyến nghị)
docker run -d --name elasticsearch \
  -p 9200:9200 -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  elasticsearch:8.11.0

# Kiểm tra Elasticsearch đã chạy
curl http://localhost:9200
```

### Bước 2: Cấu hình .env
Tạo file `.env` trong thư mục `ExpressJS01`:
```env
DB_HOST=localhost
DB_PORT=27017
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret_key
PORT=8080
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=changeme
```

### Bước 3: Chạy Quick Test
```bash
cd ExpressJS01
npm install
npm run quick-test
```

**Kết quả mong đợi:**
```
🚀 Quick Test - Elasticsearch Search System
==========================================

1️⃣ Testing MongoDB connection...
✅ MongoDB connected successfully

2️⃣ Testing Elasticsearch connection...
✅ Elasticsearch connected successfully

3️⃣ Initializing Elasticsearch index...
✅ Index initialized successfully

4️⃣ Reindexing products...
✅ Products reindexed successfully

5️⃣ Testing search functionality...
✅ Basic search works - Found X products
✅ Suggestions work - Found X suggestions

🎉 All tests passed! Your search system is ready to use.
```

### Bước 4: Khởi động ứng dụng
```bash
# Terminal 1: Backend
cd ExpressJS01
npm run dev

# Terminal 2: Frontend
cd ReactJS01/reactjs01
npm run dev
```

### Bước 5: Test UI
1. Mở trình duyệt: http://localhost:5173/products
2. Gõ từ khóa tìm kiếm
3. Click "Bộ lọc" để mở advanced filters
4. Test các bộ lọc khác nhau

## 🧪 Test API trực tiếp

### Test Basic Search
```bash
curl "http://localhost:8080/v1/api/products/search?query=phone"
```

### Test Advanced Search
```bash
curl "http://localhost:8080/v1/api/products/search?minPrice=100000&maxPrice=5000000&minRating=4.0"
```

### Test Suggestions
```bash
curl "http://localhost:8080/v1/api/products/suggestions?q=lap&limit=5"
```

## 🐛 Troubleshooting nhanh

### Lỗi: Elasticsearch connection failed
```bash
# Kiểm tra Elasticsearch
curl http://localhost:9200

# Nếu không có response, khởi động lại
docker restart elasticsearch
```

### Lỗi: No products found
```bash
# Chạy lại reindex
npm run reindex
```

### Lỗi: Frontend không load
```bash
# Kiểm tra backend
curl http://localhost:8080/v1/api/products

# Kiểm tra frontend
curl http://localhost:5173
```

## ✅ Checklist Test

- [ ] Elasticsearch chạy trên port 9200
- [ ] MongoDB kết nối thành công
- [ ] Products được index vào Elasticsearch
- [ ] Search API trả về kết quả
- [ ] Frontend load được trang products
- [ ] Search box hoạt động
- [ ] Advanced filters hoạt động
- [ ] Auto-complete suggestions hiển thị

## 🎯 Test Cases cơ bản

1. **Fuzzy Search**: Gõ "telefon" → tìm thấy "telephone"
2. **Price Filter**: Set minPrice=100000, maxPrice=5000000
3. **Rating Filter**: Set minRating=4.0
4. **Category Filter**: Chọn một category
5. **Sort**: Thay đổi sortBy và sortOrder
6. **Combined**: Kết hợp nhiều filters

Chúc bạn test thành công! 🎉

