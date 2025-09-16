# Hướng dẫn sử dụng các chức năng mới

## Tổng quan
Dự án đã được cập nhật với các chức năng mới:
- Sản phẩm yêu thích
- Sản phẩm tương tự
- Sản phẩm đã xem
- Đếm số khách mua và bình luận

## Backend APIs

### 1. Sản phẩm yêu thích
- `POST /v1/api/favorites/:productId` - Thêm sản phẩm vào yêu thích
- `DELETE /v1/api/favorites/:productId` - Xóa sản phẩm khỏi yêu thích
- `GET /v1/api/favorites` - Lấy danh sách sản phẩm yêu thích
- `GET /v1/api/favorites/:productId/check` - Kiểm tra sản phẩm có trong yêu thích không

### 2. Sản phẩm đã xem
- `POST /v1/api/viewed-products/:productId` - Thêm sản phẩm vào danh sách đã xem
- `GET /v1/api/viewed-products` - Lấy danh sách sản phẩm đã xem
- `DELETE /v1/api/viewed-products/:productId` - Xóa sản phẩm khỏi danh sách đã xem
- `DELETE /v1/api/viewed-products` - Xóa tất cả sản phẩm đã xem

### 3. Bình luận
- `POST /v1/api/products/:productId/comments` - Tạo bình luận mới
- `GET /v1/api/products/:productId/comments` - Lấy danh sách bình luận
- `PUT /v1/api/comments/:commentId` - Cập nhật bình luận
- `DELETE /v1/api/comments/:commentId` - Xóa bình luận
- `POST /v1/api/comments/:commentId/like` - Like/Unlike bình luận

### 4. Đơn hàng
- `POST /v1/api/purchases` - Tạo đơn hàng mới
- `PUT /v1/api/purchases/:purchaseId/status` - Cập nhật trạng thái đơn hàng
- `GET /v1/api/purchases` - Lấy danh sách đơn hàng của user
- `GET /v1/api/purchases/:purchaseId` - Lấy chi tiết đơn hàng
- `GET /v1/api/products/:productId/purchase-stats` - Lấy thống kê mua hàng

### 5. Sản phẩm tương tự
- `GET /v1/api/products/similar/:id` - Lấy sản phẩm tương tự

## Frontend Pages

### 1. Trang sản phẩm yêu thích
- URL: `/favorites`
- Hiển thị danh sách sản phẩm đã thêm vào yêu thích
- Có phân trang và lazy loading

### 2. Trang sản phẩm đã xem
- URL: `/viewed-products`
- Hiển thị danh sách sản phẩm đã xem gần đây
- Hiển thị thời gian xem
- Có thể xóa tất cả hoặc từng sản phẩm

### 3. Component sản phẩm tương tự
- Component `SimilarProducts` có thể sử dụng ở bất kỳ đâu
- Tự động tìm sản phẩm tương tự dựa trên Elasticsearch

## Cập nhật Models

### 1. Product Model
Thêm các trường mới:
- `purchaseCount`: Số lượng đã mua
- `commentCount`: Số lượng bình luận
- `favoriteCount`: Số lượng yêu thích

### 2. User Model
Thêm các trường mới:
- `favoriteProducts`: Mảng ID sản phẩm yêu thích
- `viewedProducts`: Mảng sản phẩm đã xem với thời gian

### 3. Comment Model (Mới)
- Quản lý bình luận và đánh giá sản phẩm
- Hỗ trợ like/unlike bình luận

### 4. Purchase Model (Mới)
- Quản lý đơn hàng và thống kê mua hàng

## Cách sử dụng

### 1. Chạy Backend
```bash
cd ExpressJS01
npm install
npm run dev
```

### 2. Chạy Frontend
```bash
cd ReactJS01/reactjs01
npm install
npm run dev
```

### 3. Cập nhật thống kê sản phẩm
```bash
cd ExpressJS01
npm run update-stats
```

### 4. Reindex Elasticsearch (nếu cần)
```bash
cd ExpressJS01
npm run reindex-new
```

## Tính năng mới trong ProductCard

1. **Nút yêu thích**: Click vào icon tim để thêm/xóa khỏi yêu thích
2. **Thống kê sản phẩm**: Hiển thị số lượt mua, bình luận, yêu thích
3. **Tracking xem sản phẩm**: Tự động thêm vào danh sách đã xem khi click "Xem chi tiết"

## Lưu ý

1. Tất cả API yêu thích, đã xem, bình luận và đơn hàng đều yêu cầu authentication
2. Sản phẩm tương tự sử dụng Elasticsearch More Like This query
3. Thống kê được cập nhật tự động khi có bình luận hoặc đơn hàng mới
4. Danh sách đã xem giới hạn 50 sản phẩm gần nhất
