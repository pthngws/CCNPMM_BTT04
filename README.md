# Full Stack E-commerce Application

Ứng dụng thương mại điện tử với Node.js/Express backend và React frontend, hỗ trợ hiển thị sản phẩm theo danh mục với Lazy Loading.

## Tính năng chính

### Backend (Express.js)
- **Authentication**: Đăng ký, đăng nhập với JWT
- **Product Management**: Quản lý sản phẩm với phân trang
- **Category Management**: Quản lý danh mục sản phẩm
- **API Endpoints**: RESTful API với pagination
- **Database**: MongoDB với Mongoose

### Frontend (React.js)
- **Responsive Design**: Sử dụng Ant Design
- **Lazy Loading**: Infinite scroll với Intersection Observer API
- **Product Display**: Hiển thị sản phẩm theo danh mục
- **Search & Filter**: Tìm kiếm và lọc sản phẩm
- **Authentication**: Đăng nhập/đăng ký với protected routes

## Cài đặt và chạy

### 1. Backend Setup

```bash
cd ExpressJS01
npm install
```

Tạo file `.env` trong thư mục `ExpressJS01`:
```env
PORT=8080
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
```

Chạy seed data để thêm dữ liệu mẫu:
```bash
node seed.js
```

Chạy server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd ReactJS01/reactjs01
npm install
```

Cấu hình backend URL trong `src/config/config.js`:
```javascript
BACKEND_URL: 'http://localhost:8080'
```

Chạy frontend:
```bash
npm run dev
```

## API Endpoints

### Public Routes (không cần authentication)
- `GET /v1/api/categories` - Lấy tất cả danh mục
- `GET /v1/api/categories/:id` - Lấy danh mục theo ID
- `GET /v1/api/products` - Lấy tất cả sản phẩm (có pagination)
- `GET /v1/api/products/:id` - Lấy sản phẩm theo ID
- `GET /v1/api/categories/:categoryId/products` - Lấy sản phẩm theo danh mục

### Protected Routes (cần authentication)
- `POST /v1/api/register` - Đăng ký
- `POST /v1/api/login` - Đăng nhập
- `GET /v1/api/user` - Lấy thông tin user
- `GET /v1/api/account` - Lấy thông tin tài khoản
- `POST /v1/api/categories` - Tạo danh mục mới
- `POST /v1/api/products` - Tạo sản phẩm mới

## Cấu trúc dự án

### Backend
```
ExpressJS01/
├── src/
│   ├── config/          # Cấu hình database, view engine
│   ├── controllers/     # Controllers cho API
│   ├── middleware/      # Authentication, public auth
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── scripts/         # Seed data script
├── server.js            # Entry point
└── seed.js              # Script chạy seed data
```

### Frontend
```
ReactJS01/reactjs01/
├── src/
│   ├── components/
│   │   ├── common/      # ProductCard, CategoryCard, LazyLoading
│   │   ├── context/     # Auth context
│   │   └── layout/      # Header component
│   ├── config/          # App configuration
│   ├── pages/           # Các trang của ứng dụng
│   ├── styles/          # CSS styles
│   └── util/            # API calls, axios config
└── package.json
```

## Tính năng Lazy Loading

### Cách hoạt động
1. **Intersection Observer API**: Theo dõi khi user scroll đến cuối danh sách
2. **Pagination**: Load thêm sản phẩm theo từng trang (12 sản phẩm/trang)
3. **Infinite Scroll**: Tự động load thêm khi scroll xuống cuối
4. **Loading States**: Hiển thị loading indicator khi đang tải

### Implementation
- Component `LazyLoading` sử dụng Intersection Observer
- API hỗ trợ pagination với `page` và `limit` parameters
- Frontend quản lý state cho `currentPage`, `hasMore`, `loading`

## Dữ liệu mẫu

Script seed data tạo:
- **4 danh mục**: Điện thoại, Laptop, Phụ kiện, Đồng hồ
- **24 sản phẩm**: 6 sản phẩm mỗi danh mục
- **Thông tin đầy đủ**: Tên, mô tả, giá, hình ảnh, stock, rating

## Sử dụng

1. **Trang chủ**: Hiển thị danh mục và sản phẩm nổi bật
2. **Danh mục**: Xem tất cả danh mục sản phẩm
3. **Sản phẩm theo danh mục**: Click vào danh mục để xem sản phẩm
4. **Tất cả sản phẩm**: Xem tất cả sản phẩm với lazy loading
5. **Tìm kiếm**: Tìm kiếm sản phẩm theo tên
6. **Lọc**: Lọc theo danh mục và sắp xếp

## Công nghệ sử dụng

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- CORS

### Frontend
- React 19
- React Router DOM
- Ant Design
- Axios
- Vite

## Lưu ý

- Đảm bảo MongoDB đang chạy trước khi start backend
- Cấu hình đúng URL backend trong frontend config
- Chạy seed data để có dữ liệu mẫu
- API products và categories là public, không cần authentication

