# Hướng dẫn sửa lỗi và cập nhật dữ liệu thống kê

## Vấn đề đã được sửa

### 1. **Lỗi Comment không tạo được**
- **Nguyên nhân**: Lỗi populate trong commentService
- **Giải pháp**: Sửa cách populate user trong Comment model

### 2. **Dữ liệu thống kê không chính xác**
- **Nguyên nhân**: Dữ liệu được tạo ngẫu nhiên, không phản ánh thực tế
- **Giải pháp**: Tạo script cập nhật thống kê thực tế từ database

## Các script đã tạo

### 1. **updateRealStats.js** - Cập nhật thống kê thực tế
```bash
cd ExpressJS01
npm run update-real-stats
```

**Chức năng:**
- Đếm số bình luận thực tế từ database
- Tính rating trung bình thực tế
- Đếm số lượt mua thực tế
- Đếm số lượt yêu thích thực tế
- Cập nhật tất cả sản phẩm

### 2. **createSampleData.js** - Tạo dữ liệu mẫu
```bash
cd ExpressJS01
npm run create-sample-data
```

**Chức năng:**
- Tạo user test: `test@example.com` / `password123`
- Tạo sản phẩm iPhone 15 Pro Max
- Tạo 5 bình luận mẫu với rating khác nhau
- Tạo 4 đơn hàng mẫu
- Thêm vào favorite và viewed products
- Cập nhật thống kê chính xác

## Cách sử dụng

### 1. **Sửa lỗi comment**
```bash
# Khởi động server
cd ExpressJS01
npm run dev
```

Bây giờ comment sẽ hoạt động bình thường.

### 2. **Cập nhật dữ liệu thống kê thực tế**
```bash
# Cập nhật thống kê cho tất cả sản phẩm
cd ExpressJS01
npm run update-real-stats
```

### 3. **Tạo dữ liệu mẫu để test**
```bash
# Tạo dữ liệu mẫu hoàn chỉnh
cd ExpressJS01
npm run create-sample-data
```

## Dữ liệu mẫu được tạo

### User Test
- **Email**: test@example.com
- **Password**: password123
- **Name**: Người dùng Test

### Sản phẩm mẫu
- **Name**: iPhone 15 Pro Max
- **Price**: 29,990,000 VND
- **Original Price**: 32,990,000 VND
- **Stock**: 50
- **Category**: Điện thoại

### Bình luận mẫu (5 comments)
1. Rating 5: "Sản phẩm rất tốt, camera chụp ảnh rất đẹp..."
2. Rating 4: "iPhone 15 Pro Max có thiết kế đẹp..."
3. Rating 5: "Mua về dùng được 1 tuần, máy chạy mượt mà..."
4. Rating 3: "Thiết kế đẹp nhưng pin hơi nhanh hết..."
5. Rating 5: "Sản phẩm cao cấp, đáng giá tiền..."

### Đơn hàng mẫu (4 orders)
- 3 đơn hàng đã hoàn thành (4 sản phẩm)
- 1 đơn hàng đang chờ xử lý

### Thống kê cuối cùng
- **Bình luận**: 5
- **Rating trung bình**: 4.4
- **Đã mua**: 4 sản phẩm
- **Yêu thích**: 1 người
- **Lượt xem**: 150

## Kiểm tra kết quả

### 1. **Test comment**
1. Đăng nhập với `test@example.com` / `password123`
2. Vào trang sản phẩm iPhone 15 Pro Max
3. Thử tạo bình luận mới
4. Kiểm tra bình luận có hiển thị không

### 2. **Test thống kê**
1. Vào trang sản phẩm
2. Kiểm tra các số liệu:
   - Số bình luận: 5
   - Rating: 4.4/5
   - Đã mua: 4
   - Yêu thích: 1

### 3. **Test favorite**
1. Click nút tim để thêm/xóa yêu thích
2. Kiểm tra số lượt yêu thích có cập nhật không

### 4. **Test purchase**
1. Click "Mua ngay"
2. Điền form đặt hàng
3. Kiểm tra đơn hàng có được tạo không
4. Kiểm tra số lượt mua có cập nhật không

## Troubleshooting

### Nếu comment vẫn không tạo được:
1. Kiểm tra console có lỗi gì không
2. Kiểm tra database connection
3. Kiểm tra user đã đăng nhập chưa
4. Kiểm tra product ID có đúng không

### Nếu thống kê không cập nhật:
1. Chạy script `update-real-stats`
2. Kiểm tra database có dữ liệu không
3. Kiểm tra API có hoạt động không

### Nếu dữ liệu mẫu không tạo được:
1. Kiểm tra database connection
2. Kiểm tra các model có đúng không
3. Xóa dữ liệu cũ và chạy lại script

## Lưu ý quan trọng

1. **Backup dữ liệu** trước khi chạy script cập nhật
2. **Test trên môi trường dev** trước khi deploy production
3. **Kiểm tra logs** để đảm bảo không có lỗi
4. **Monitor performance** khi cập nhật dữ liệu lớn

## API Endpoints để test

### 1. **Test Comment**
```bash
POST /v1/api/products/{productId}/comments
{
    "content": "Bình luận test",
    "rating": 5
}
```

### 2. **Test Favorite**
```bash
POST /v1/api/favorites/{productId}
DELETE /v1/api/favorites/{productId}
```

### 3. **Test Purchase**
```bash
POST /v1/api/purchases
{
    "productId": "product_id",
    "quantity": 1,
    "paymentMethod": "bank_transfer",
    "shippingAddress": {...}
}
```

### 4. **Test Stats**
```bash
GET /v1/api/products/{productId}
GET /v1/api/products/{productId}/comments
```
