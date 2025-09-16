# Hướng dẫn sửa lỗi Authentication

## Vấn đề đã được sửa

### 1. **Lỗi "Người dùng không tồn tại"**
- **Nguyên nhân**: Middleware auth không có `user.id` trong JWT payload
- **Giải pháp**: Cập nhật JWT payload để bao gồm `id`, `role` và cập nhật middleware

### 2. **Response format không nhất quán**
- **Nguyên nhân**: Các API trả về format khác nhau
- **Giải pháp**: Chuẩn hóa tất cả response theo format `{EC, EM, DT}`

## Các thay đổi chính

### Backend Changes

#### 1. **Middleware Auth** (`src/middleware/auth.js`)
```javascript
// Trước
req.user = {
    email: decoded.email,
    name: decoded.name
}

// Sau
req.user = {
    id: decoded.id,        // ← Thêm ID
    email: decoded.email,
    name: decoded.name,
    role: decoded.role      // ← Thêm role
}
```

#### 2. **User Service** (`src/services/userService.js`)
- Thêm validation input
- Cải thiện error handling
- Chuẩn hóa response format
- Thêm `getCurrentUserService` function

#### 3. **User Controller** (`src/controllers/userController.js`)
- Thêm try-catch cho tất cả functions
- Sử dụng HTTP status codes phù hợp
- Chuẩn hóa error responses

### Frontend Changes

#### 1. **Auth Context** (`src/components/context/auth.context.jsx`)
- Cập nhật user object structure
- Thay đổi API call từ `/user` sang `/account`
- Cập nhật response parsing

#### 2. **Login Page** (`src/pages/login.jsx`)
- Cập nhật response parsing cho format mới
- Cải thiện error messages (tiếng Việt)
- Lưu đầy đủ thông tin user

#### 3. **Register Page** (`src/pages/register.jsx`)
- Cập nhật response parsing
- Cải thiện error messages

## Cách test

### 1. **Chạy Backend**
```bash
cd ExpressJS01
npm run dev
```

### 2. **Chạy Frontend**
```bash
cd ReactJS01/reactjs01
npm run dev
```

### 3. **Test API trực tiếp**
```bash
cd ExpressJS01
node test-auth.js
```

## API Endpoints đã được sửa

### 1. **Register** - `POST /v1/api/register`
```json
// Request
{
    "name": "Test User",
    "email": "test@example.com", 
    "password": "password123"
}

// Response (Success)
{
    "EC": 0,
    "EM": "Đăng ký thành công",
    "DT": {
        "id": "user_id",
        "name": "Test User",
        "email": "test@example.com",
        "role": "User"
    }
}
```

### 2. **Login** - `POST /v1/api/login`
```json
// Request
{
    "email": "test@example.com",
    "password": "password123"
}

// Response (Success)
{
    "EC": 0,
    "EM": "Đăng nhập thành công",
    "DT": {
        "access_token": "jwt_token",
        "user": {
            "id": "user_id",
            "name": "Test User",
            "email": "test@example.com",
            "role": "User"
        }
    }
}
```

### 3. **Account Info** - `GET /v1/api/account`
```json
// Response (Success)
{
    "EC": 0,
    "EM": "Lấy thông tin người dùng thành công",
    "DT": {
        "_id": "user_id",
        "name": "Test User",
        "email": "test@example.com",
        "role": "User",
        "favoriteProducts": [],
        "viewedProducts": []
    }
}
```

## Lưu ý quan trọng

1. **JWT Token**: Bây giờ chứa `id`, `email`, `name`, `role`
2. **User ID**: Có thể truy cập qua `req.user.id` trong middleware
3. **Response Format**: Tất cả API đều trả về `{EC, EM, DT}`
4. **Error Handling**: Cải thiện với messages tiếng Việt
5. **Validation**: Thêm validation cho input data

## Troubleshooting

### Nếu vẫn gặp lỗi "Người dùng không tồn tại":
1. Kiểm tra JWT token có chứa `id` không
2. Kiểm tra database có user với ID đó không
3. Kiểm tra middleware auth có parse đúng không

### Nếu frontend không nhận được user info:
1. Kiểm tra API `/account` có trả về đúng format không
2. Kiểm tra AuthContext có parse response đúng không
3. Kiểm tra localStorage có lưu token không

### Nếu các API mới (favorites, comments) không hoạt động:
1. Đảm bảo đã đăng nhập (có token)
2. Kiểm tra `req.user.id` có tồn tại không
3. Kiểm tra database connection
