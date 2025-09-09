# 🗂️ Hướng dẫn sử dụng Elasticsearch với Static Data

## 📋 Tổng quan

Hệ thống đã được cấu hình để sử dụng **static data** thay vì database, giúp bạn test Elasticsearch mà không cần cài đặt MongoDB.

## 🎯 Lợi ích của Static Data

✅ **Không cần MongoDB**: Chỉ cần Elasticsearch
✅ **Dữ liệu mẫu phong phú**: 24 sản phẩm, 4 danh mục
✅ **Dễ test**: Dữ liệu có sẵn, không cần seed
✅ **Nhanh chóng**: Khởi động nhanh hơn
✅ **Demo hoàn hảo**: Đủ dữ liệu để test tất cả tính năng

## 📊 Dữ liệu có sẵn

### Categories (4 danh mục)
- 📱 **Điện thoại** (6 sản phẩm)
- 💻 **Laptop** (6 sản phẩm)  
- 🎧 **Phụ kiện** (6 sản phẩm)
- ⌚ **Đồng hồ** (6 sản phẩm)

### Products (24 sản phẩm)
Mỗi sản phẩm có đầy đủ thông tin:
- Tên, mô tả, giá, giá gốc
- Hình ảnh, stock, rating
- Tags, isFeatured, isOnSale
- Discount percentage, viewCount

## 🚀 Cách sử dụng

### Bước 1: Cài đặt Elasticsearch
```bash
# Sử dụng Docker (khuyến nghị)
docker run -d --name elasticsearch \
  -p 9200:9200 -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  elasticsearch:8.11.0
```

### Bước 2: Cấu hình .env
Tạo file `.env` trong thư mục `ExpressJS01`:
```env
# Server Configuration
PORT=8080

# Elasticsearch Configuration
ELASTICSEARCH_URL=http://localhost:9200
ELASTICSEARCH_USERNAME=elastic
ELASTICSEARCH_PASSWORD=changeme

# Không cần MongoDB config
# DB_HOST=localhost
# DB_PORT=27017
# DB_NAME=your_database_name
```

### Bước 3: Cài đặt dependencies
```bash
cd ExpressJS01
npm install
```

### Bước 4: Khởi động Backend
```bash
npm run dev
```

**Kết quả mong đợi:**
```
✅ Elasticsearch connection successful
✅ Created Elasticsearch index: products
✅ Bulk indexed 24 products
🎉 Reindex completed. Indexed 24 products from static data.
Backend Nodejs App listening on port 8080
📊 Using static data instead of database
```

### Bước 5: Test API
```bash
# Test categories
curl http://localhost:8080/v1/api/categories

# Test products
curl http://localhost:8080/v1/api/products

# Test advanced search
curl "http://localhost:8080/v1/api/products/search?query=iPhone&page=1&limit=5"
```

## 🧪 Test Scripts

### Reindex Static Data
```bash
npm run reindex-static
```

### Quick Test
```bash
npm run quick-test
```

### Test Search
```bash
npm run test-search
```

## 🔍 Test Cases với Static Data

### 1. Basic Search
```bash
# Tìm iPhone
curl "http://localhost:8080/v1/api/products/search?query=iPhone"

# Tìm laptop
curl "http://localhost:8080/v1/api/products/search?query=laptop"
```

### 2. Advanced Search
```bash
# Tìm sản phẩm khuyến mãi
curl "http://localhost:8080/v1/api/products/search?isOnSale=true"

# Tìm sản phẩm nổi bật
curl "http://localhost:8080/v1/api/products/search?isFeatured=true"

# Tìm theo khoảng giá
curl "http://localhost:8080/v1/api/products/search?minPrice=1000000&maxPrice=5000000"
```

### 3. Category Filter
```bash
# Tìm điện thoại
curl "http://localhost:8080/v1/api/products/search?category=cat_phone"

# Tìm laptop
curl "http://localhost:8080/v1/api/products/search?category=cat_laptop"
```

### 4. Fuzzy Search
```bash
# Test fuzzy search
curl "http://localhost:8080/v1/api/products/search?query=telefon"
curl "http://localhost:8080/v1/api/products/search?query=macbok"
```

### 5. Suggestions
```bash
# Test suggestions
curl "http://localhost:8080/v1/api/products/suggestions?q=iph&limit=5"
curl "http://localhost:8080/v1/api/products/suggestions?q=lap&limit=5"
```

## 📱 Test Frontend

### Khởi động Frontend
```bash
cd ReactJS01/reactjs01
npm install
npm run dev
```

### Test UI Features
1. **Mở**: http://localhost:5173/products
2. **Search**: Gõ "iPhone", "laptop", "watch"
3. **Filters**: Test các bộ lọc khác nhau
4. **Categories**: Click vào các danh mục
5. **Advanced Search**: Test fuzzy search

## 🎯 Dữ liệu mẫu chi tiết

### Điện thoại (cat_phone)
- iPhone 15 Pro (29,990,000 VND) - Featured, On Sale
- Samsung Galaxy S24 Ultra (26,990,000 VND) - Featured, On Sale
- Xiaomi 14 Pro (19,990,000 VND) - On Sale
- OnePlus 12 (18,990,000 VND) - On Sale
- Google Pixel 8 Pro (22,990,000 VND) - Featured, On Sale
- Huawei P60 Pro (17,990,000 VND) - On Sale

### Laptop (cat_laptop)
- MacBook Pro M3 (45,990,000 VND) - Featured, On Sale
- Dell XPS 15 (35,990,000 VND) - Featured, On Sale
- HP Spectre x360 (29,990,000 VND) - On Sale
- Lenovo ThinkPad X1 (32,990,000 VND) - Featured, On Sale
- ASUS ROG Strix (27,990,000 VND) - On Sale
- MSI Creator 15 (31,990,000 VND) - Featured, On Sale

### Phụ kiện (cat_accessory)
- AirPods Pro 2 (5,990,000 VND) - Featured, On Sale
- Sony WH-1000XM5 (7,990,000 VND) - Featured, On Sale
- Logitech MX Master 3S (2,990,000 VND) - On Sale
- Keychron K8 Pro (3,990,000 VND) - Featured, On Sale
- Anker PowerCore 20000 (1,290,000 VND) - On Sale
- Belkin Boost Charge Pro (1,990,000 VND) - On Sale

### Đồng hồ (cat_watch)
- Apple Watch Series 9 (8,990,000 VND) - Featured, On Sale
- Samsung Galaxy Watch 6 (6,990,000 VND) - Featured, On Sale
- Garmin Fenix 7 (12,990,000 VND) - Featured, On Sale
- Fitbit Versa 4 (3,990,000 VND) - On Sale
- Huawei Watch GT 4 (3,990,000 VND) - On Sale
- Amazfit GTR 4 (2,990,000 VND) - On Sale

## 🐛 Troubleshooting

### Elasticsearch không kết nối
```bash
# Kiểm tra Elasticsearch
curl http://localhost:9200

# Khởi động lại nếu cần
docker restart elasticsearch
```

### Không có dữ liệu
```bash
# Reindex lại
npm run reindex-static

# Hoặc restart server
npm run dev
```

### Frontend không load
```bash
# Kiểm tra backend
curl http://localhost:8080/v1/api/products

# Kiểm tra CORS
```

## ✅ Checklist Test

- [ ] Elasticsearch chạy trên port 9200
- [ ] Backend khởi động thành công
- [ ] 24 products được index
- [ ] API trả về dữ liệu
- [ ] Frontend load được
- [ ] Search hoạt động
- [ ] Filters hoạt động
- [ ] Fuzzy search hoạt động
- [ ] Suggestions hoạt động

## 🎉 Kết quả

Với static data, bạn có thể:
- ✅ Test đầy đủ tính năng Elasticsearch
- ✅ Không cần cài đặt MongoDB
- ✅ Có dữ liệu mẫu phong phú
- ✅ Demo hoàn hảo cho client
- ✅ Phát triển nhanh chóng

Hệ thống sẵn sàng để test và demo! 🚀

