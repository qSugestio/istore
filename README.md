# IStore - E-commerce Application

Full-stack e-commerce application built with Laravel 11 (backend) and Vue.js 3 (frontend).

## Features

### For Customers
- User registration and authentication
- Browse products with category filtering and search
- View product details
- Add products to cart and checkout
- View order history

### For Administrators
- Admin dashboard
- Product management (CRUD operations)
- Order management with status updates

## Tech Stack

### Backend
- PHP 8.3+
- Laravel 11
- MySQL/PostgreSQL
- Laravel Sanctum for API authentication
- Laravel Queues for background jobs

### Frontend
- Vue.js 3 (Composition API)
- TypeScript
- Vue Router
- Pinia for state management
- Axios for API calls

## Architecture Decisions

### Backend Architecture
- **Services Layer**: Business logic is separated into service classes (`AuthService`, `OrderService`, `ProductService`) to keep controllers thin and maintainable.
- **Form Requests**: All input validation is handled through Laravel Form Requests for better organization and reusability.
- **Jobs/Queues**: Order creation triggers a background job (`SendOrderNotification`) to demonstrate queue usage. Currently uses database driver, but can be easily switched to Redis.
- **Caching**: Product listings are cached using Laravel's cache system to improve performance (can be configured to use Redis).

### Frontend Architecture
- **Pinia Stores**: State management is handled through Pinia stores (`auth`, `cart`) for reactive data sharing across components.
- **Composition API**: All components use Vue 3 Composition API with TypeScript for better type safety and code organization.
- **Reusable Components**: Created 8 reusable components (AppHeader, AppFooter, ProductCard, LoadingSpinner, ErrorMessage, Button, Input, CartItem) following DRY principles.
- **API Client**: Centralized axios instance with interceptors for authentication and error handling.

## Setup Instructions

### Prerequisites
- PHP 8.3 or higher
- Composer
- Node.js 18+ and npm
- MySQL/PostgreSQL

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
composer install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Configure database in `.env`:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=istore
DB_USERNAME=root
DB_PASSWORD=your_password
```

6. Run migrations and seeders:
```bash
php artisan migrate
php artisan db:seed
```

7. Start the development server:
```bash
php artisan serve
```

The backend will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Running Queue Worker (Optional)

To process background jobs (order notifications), run:
```bash
php artisan queue:work
```

## Test Credentials

### Admin User
- Email: `admin@istore.com`
- Password: `password`

### Regular Users
- Email: `user@example.com`
- Password: `password`
- Email: `jane@example.com`
- Password: `password`

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/user` - Get current user

### Products
- `GET /api/products` - List products (with filters: category_id, search, page)
- `GET /api/products/{id}` - Get product details
- `GET /api/categories` - List categories

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/{id}` - Update cart item quantity
- `DELETE /api/cart/remove/{id}` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `GET /api/orders` - List user orders
- `GET /api/orders/{id}` - Get order details
- `POST /api/orders` - Create order

### Admin Endpoints (require admin role)
- `GET /api/admin/products` - List all products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product
- `GET /api/admin/orders` - List all orders
- `GET /api/admin/orders/{id}` - Get order details
- `PUT /api/admin/orders/{id}/status` - Update order status

## Database Seeding

The seeders create:
- 1 admin user
- 2 regular users
- 5 categories
- 15 products

## Additional Features Implemented

1. **Pinia for State Management**: Used for auth and cart state
2. **Product Caching**: Products are cached to improve performance (can be configured for Redis)
3. **Events & Listeners**: Order creation dispatches a job for notifications

## Project Structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/
│   ├── Services/
│   └── Jobs/
├── database/
│   ├── migrations/
│   └── seeders/
└── routes/

frontend/
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── stores/         # Pinia stores
│   ├── shared/
│   │   └── api/        # API client and endpoints
│   └── router/         # Vue Router configuration
```

## Notes

- The application uses Laravel Sanctum for API authentication
- CORS is configured to allow requests from the frontend
- Queue driver is set to `database` by default (can be changed to Redis in `.env`)
- Product images are stored as URLs (can be extended to support file uploads)
