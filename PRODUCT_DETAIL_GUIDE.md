# Hướng dẫn sử dụng trang chi tiết sản phẩm

## Tổng quan
Trang chi tiết sản phẩm (`/product/:id`) đã được xây dựng hoàn chỉnh với đầy đủ các chức năng yêu cầu.

## Các chức năng chính

### 1. **Hiển thị thông tin sản phẩm**
- Hình ảnh sản phẩm với preview
- Tên, mô tả, giá, giá gốc
- Đánh giá trung bình và số lượt đánh giá
- Tags sản phẩm
- Trạng thái tồn kho

### 2. **Sản phẩm yêu thích**
- Nút yêu thích (tim) ở góc phải hình ảnh
- Click để thêm/xóa khỏi danh sách yêu thích
- Hiển thị số lượng người yêu thích
- Yêu cầu đăng nhập

### 3. **Sản phẩm đã xem**
- Tự động thêm vào danh sách đã xem khi vào trang
- Tracking thời gian xem
- Hiển thị trong trang "Sản phẩm đã xem"

### 4. **Sản phẩm tương tự**
- Component `SimilarProducts` hiển thị ở cuối trang
- Sử dụng Elasticsearch More Like This query
- Sắp xếp theo độ tương tự, số lượt mua, rating
- Click để xem chi tiết sản phẩm tương tự

### 5. **Đếm số khách mua**
- Hiển thị số lượng đã bán
- Cập nhật khi có đơn hàng mới
- Hiển thị trong thống kê sản phẩm

### 6. **Hệ thống bình luận và đánh giá**
- Component `CommentSystem` riêng biệt
- Form đánh giá với rating (1-5 sao)
- Bình luận với validation (10-500 ký tự)
- Like/Unlike bình luận
- Phân trang bình luận
- Hiển thị số lượng bình luận

### 7. **Chức năng mua hàng**
- Nút "Thêm vào giỏ" (placeholder)
- Nút "Mua ngay" mở modal đặt hàng
- Component `PurchaseModal` với form đầy đủ
- Validation thông tin giao hàng
- Tính tổng tiền tự động

## Cấu trúc Components

### 1. **ProductDetailPage** (`src/pages/product-detail.jsx`)
- Trang chính hiển thị thông tin sản phẩm
- Quản lý state và logic chính
- Tích hợp các components con

### 2. **CommentSystem** (`src/components/common/CommentSystem.jsx`)
- Form tạo bình luận và đánh giá
- Danh sách bình luận với phân trang
- Like/Unlike bình luận
- Validation input

### 3. **PurchaseModal** (`src/components/common/PurchaseModal.jsx`)
- Modal đặt hàng với form đầy đủ
- Validation thông tin giao hàng
- Tính tổng tiền tự động
- Tích hợp API tạo đơn hàng

### 4. **SimilarProducts** (`src/components/common/SimilarProducts.jsx`)
- Hiển thị sản phẩm tương tự
- Sử dụng API Elasticsearch
- Responsive grid layout

## API Endpoints sử dụng

### 1. **Product APIs**
- `GET /v1/api/products/:id` - Lấy thông tin sản phẩm
- `GET /v1/api/products/similar/:id` - Lấy sản phẩm tương tự

### 2. **Favorite APIs**
- `POST /v1/api/favorites/:productId` - Thêm vào yêu thích
- `DELETE /v1/api/favorites/:productId` - Xóa khỏi yêu thích
- `GET /v1/api/favorites/:productId/check` - Kiểm tra trạng thái yêu thích

### 3. **Viewed Products APIs**
- `POST /v1/api/viewed-products/:productId` - Thêm vào đã xem

### 4. **Comment APIs**
- `POST /v1/api/products/:productId/comments` - Tạo bình luận
- `GET /v1/api/products/:productId/comments` - Lấy danh sách bình luận
- `POST /v1/api/comments/:commentId/like` - Like/Unlike bình luận

### 5. **Purchase APIs**
- `POST /v1/api/purchases` - Tạo đơn hàng

## Cách sử dụng

### 1. **Truy cập trang chi tiết**
```
http://localhost:3000/product/{product_id}
```

### 2. **Các thao tác có thể thực hiện**
- Xem thông tin chi tiết sản phẩm
- Thêm/xóa khỏi yêu thích (cần đăng nhập)
- Đánh giá và bình luận (cần đăng nhập)
- Like/Unlike bình luận (cần đăng nhập)
- Mua hàng (cần đăng nhập)
- Xem sản phẩm tương tự

### 3. **Responsive Design**
- Desktop: Layout 2 cột (hình ảnh + thông tin)
- Mobile: Layout 1 cột, stack vertically
- Tabs cho bình luận và thống kê

## Tính năng đặc biệt

### 1. **Auto-tracking**
- Tự động thêm vào danh sách đã xem
- Cập nhật số lượt xem sản phẩm
- Refresh thống kê khi có bình luận/đơn hàng mới

### 2. **Real-time Updates**
- Thống kê cập nhật ngay khi có bình luận mới
- Số lượt mua cập nhật khi có đơn hàng
- Favorite count cập nhật khi thêm/xóa yêu thích

### 3. **User Experience**
- Loading states cho tất cả actions
- Error handling với messages tiếng Việt
- Validation form chi tiết
- Responsive design

## Lưu ý quan trọng

1. **Authentication**: Hầu hết chức năng yêu cầu đăng nhập
2. **Error Handling**: Tất cả API calls đều có error handling
3. **Performance**: Lazy loading cho sản phẩm tương tự
4. **Security**: Validation input ở cả frontend và backend
5. **UX**: Loading states và feedback cho user

## Troubleshooting

### Nếu không hiển thị sản phẩm:
1. Kiểm tra product ID có đúng không
2. Kiểm tra API `/products/:id` có hoạt động không
3. Kiểm tra console có lỗi không

### Nếu chức năng yêu thích không hoạt động:
1. Kiểm tra đã đăng nhập chưa
2. Kiểm tra API favorites có hoạt động không
3. Kiểm tra token có hợp lệ không

### Nếu bình luận không hiển thị:
1. Kiểm tra API comments có hoạt động không
2. Kiểm tra đã đăng nhập chưa
3. Kiểm tra validation rules

### Nếu sản phẩm tương tự không hiển thị:
1. Kiểm tra Elasticsearch có hoạt động không
2. Kiểm tra API similar products
3. Kiểm tra có sản phẩm tương tự trong database không
