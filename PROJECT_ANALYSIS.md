# Project Analysis: GroupProject - Online Store Platform

## Project Concept
This is a **multi-tenant e-commerce platform** that enables merchants to create and manage their own online stores using customizable templates. The platform serves three user roles:
- **Customers**: Browse products, add to cart, checkout, view orders
- **Merchants**: Create stores, manage products/categories, track orders/sales, configure payments
- **Admins**: Oversee platform, manage users/stores/templates, view analytics

## Architecture Overview

### Backend (TypeScript/Express.js)
- **Server**: `src/server.ts` - Express app with MongoDB connection
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Upload**: Multer for images (products, categories, store logos, templates)
- **API Base URL**: `http://localhost:3000`

### Frontend (React + Vite)
- **Framework**: React 19 with Vite
- **Styling**: TailwindCSS v4
- **Routing**: React Router v7
- **State Management**: Zustand (AuthStore, cartStore, shopStore)
- **Data Fetching**: TanStack React Query
- **UI Components**: Custom components with Framer Motion animations

## Backend Module Flows

### 1. User Module
**Model**: `Backend/src/model/User.ts`
- Fields: name, email, password (hashed), number, role (customer/merchant/admin), profilePic, address, businessType, accountStatus
- Pre-save hook: Auto-hash passwords with bcrypt

**Routes**: `Backend/src/router/User.ts`
- `POST /register/user` - Register new user
- `POST /login/user` - Login and receive JWT token
- `GET /getuserdetails` - Get authenticated user details (requires auth)
- `GET /user/all` - Get all users (admin only)
- `PUT /updateuserdetails` - Update user profile (with optional image upload)

**Controller**: `Backend/src/controller/User.controller.ts` - Handles registration, login, user CRUD operations

**Middleware**: `Backend/src/Middleware/LoginCheck.ts` - JWT authentication middleware

### 2. Store Module
**Model**: `Backend/src/model/Store.ts`
- Fields: ownerId (ref: User), name, slug (unique), domain (custom domain), logo, currency, templateId (ref: Template), commissionRate, isPublished, status

**Routes**: `Backend/src/router/Store.ts`
- `POST /stores` - Create store (with logo upload)
- `GET /stores` - Get all stores (with template details populated)
- `GET /stores/:id` - Get store by ID
- `PUT /stores/:id` - Update store
- `DELETE /stores/:id` - Delete store

**Controller**: `Backend/src/controller/StoreController.ts`

### 3. Product Module
**Model**: `Backend/src/model/productModel.ts`
- Fields: storeId (ref: Store), title, description, category, price, compareAtPrice, images (array), stock, stockKeepingUnit, specifications (key-value pairs), tags, market, isActive, isFinite

**Routes**: `Backend/src/router/Product.ts`
- `POST /products` - Create product (up to 10 images)
- `GET /product` - Get all products (with pagination, search, store filter)
- `GET /products/:id` - Get product by ID
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

**Controller**: `Backend/src/controller/productController.ts`

### 4. Category Module
**Model**: `Backend/src/model/categoryModel.ts`
- Fields: storeId (ref: Store), catname, catimage

**Routes**: `Backend/src/router/Category.ts`
- `GET /category` - Get all categories
- `GET /category/:storeId` - Get categories by store
- `GET /admin-categories` - Get categories with product/offer counts (requires auth)
- `POST /category/create` - Create category (with image)
- `PUT /category/update/:id` - Update category
- `DELETE /category/delete/:id` - Delete category

**Controller**: `Backend/src/controller/categoryController.ts`

### 5. Order Module
**Model**: `Backend/src/model/orderModel.ts`
- Fields: userId (ref: User), storeId (ref: Store), items (array with productId, quantity, price), shippingAddress, totalAmount, status (Pending/Confirmed/Shipped/Delivered/Cancelled), paymentMethod, paymentStatus, shippingPrice, isPaid, isDelivered

**Routes**: `Backend/src/router/Order.ts`
- `POST /order` - Create order
- `GET /orders` - Get all orders (paginated)
- `GET /order/customer/:id` - Get orders by customer
- `GET /order/store/:id` - Get orders by store
- `PUT /order/:id` - Update order status
- `DELETE /order/:id` - Delete order
- `GET /sales` - Sales analytics for store owner
- `GET /sales/monthly` - Monthly sales data
- `GET /sales/top-products` - Top selling products
- `GET /dashboard/stats` - Dashboard statistics
- `GET /sales/chart` - Sales chart data

**Controllers**: `Backend/src/controller/orderController.ts`, `Backend/src/controller/salesController.ts`

### 6. Payment Module
**Model**: `Backend/src/model/paymentModel.ts`
- Fields: merchantId (ref: Merchant), kyc (PAN, Aadhaar with verification), bank (account details), upi (UPI ID)
- Sensitive fields hidden with `select: false`

**Routes**: `Backend/src/router/Payment.ts` (all require authentication)
- `GET /payment` - Get payment details for merchant
- `POST /payment/create` - Create payment details
- `PUT /payment/update/:id` - Update payment details
- `DELETE /payment/delete/:id` - Delete payment details

**Controller**: `Backend/src/controller/paymentController.ts`

### 7. Template Module
**Model**: `Backend/src/model/templateModel.ts`
- Fields: name, slug (unique), description, content, previewImage, primaryColor, secondaryColor, author

**Routes**: `Backend/src/router/template.ts`
- `POST /templates` - Create template (with preview image)
- `GET /templates` - Get all templates
- `GET /templates/:slug` - Get template by slug
- `PUT /templates/:slug` - Update template
- `DELETE /templates/:slug` - Delete template

**Controller**: `Backend/src/controller/templateController.ts`

### 8. Offer Module
**Model**: `Backend/src/model/offerModel.ts`
- Fields: title, discountPercentage, category, startDate, endDate, isActive

**Routes**: `Backend/src/router/offer.ts`
- `POST /offer` - Create offer
- `GET /offer` - Get all offers
- `GET /offer/:id` - Get offer by ID
- `PUT /offer/:id` - Update offer
- `DELETE /offer/:id` - Delete offer

**Controller**: `Backend/src/controller/offerController.ts`

## Frontend Module Flows

### 1. Routing Structure (`Frontend-main/src/Router.jsx`)

**Public Routes**:
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

**Merchant Dashboard** (`/dashboard`):
- `/dashboard` - Landing page with stats
- `/dashboard/products` - Product list
- `/dashboard/products/add` - Add product
- `/dashboard/products/edit` - Edit product
- `/dashboard/categories` - Category management
- `/dashboard/stores` - Store management
- `/dashboard/stores/add` - Add store
- `/dashboard/stores/edit` - Edit store
- `/dashboard/orders` - Order management
- `/dashboard/sales` - Sales analytics
- `/dashboard/offers` - Offer management
- `/dashboard/settings` - Settings

**Dynamic Store Routes** (generated per store):
- `/{storeSlug}` - Store home (template-based)
- `/{storeSlug}/store-products` - Product listing
- `/{storeSlug}/product/:id` - Product detail
- `/{storeSlug}/cart` - Shopping cart
- `/{storeSlug}/checkout` - Checkout
- `/{storeSlug}/login` - Store-specific login
- `/{storeSlug}/register` - Store-specific registration
- `/{storeSlug}/account` - Customer account

**Admin Panel** (`/adm`):
- `/adm` - Admin home
- `/adm/earnings` - Platform earnings
- `/adm/users` - User management
- `/adm/stores` - Store management
- `/adm/templates` - Template management
- `/adm/products` - Product oversight
- `/adm/categories` - Category oversight
- `/adm/orders` - Order oversight
- `/adm/settings` - Admin settings

### 2. State Management (Zustand)

**AuthStore** (`Frontend-main/src/AuthStore.js`):
- Stores: token, role, user
- Actions: addUser, addToken, removeToken, logout
- Persistence: localStorage

**CartStore** (`Frontend-main/src/Zustand/cartStore.js`):
- Stores: items array
- Actions: addItem, removeItem, updateQuantity, clearCart
- Computed: getTotalPrice, getItemCount
- Persistence: localStorage

**ShopStore** (`Frontend-main/src/Zustand/shopStore.js`):
- Stores: current store object
- Actions: setStore
- Purpose: Track which store the customer is browsing
- Persistence: sessionStorage

### 3. Template System

**Architecture**:
- Templates are stored in MongoDB with slug identifiers
- Each store references a template via `templateId`
- Frontend dynamically loads template components based on store's template slug
- Currently implemented: `template001` (THomeOne)

**Template Structure** (`Frontend-main/src/templete001/`):
- `THomeOne.jsx` - Home page component
- `components/` - Layout, Navbar, Footer
- `pages/` - ProductListOne, ProductView, Cart, Checkout, LoginTemp, Register, Account
- `data/` - Template-specific data

**Flow**:
1. Router fetches all stores on mount
2. For each store, creates dynamic route with `/{storeSlug}`
3. Layout component sets current store in ShopStore
4. Template components render based on store configuration

### 4. Key Components

**Merchant Dashboard Components** (`Frontend-main/src/components/`):
- `DashLanding.jsx` - Dashboard overview with stats
- `ProductList.jsx` - Product management table
- `AddProduct.jsx` - Product creation form
- `EditProduct.jsx` - Product editing form
- `ViewStore.jsx` - Store management
- `AddStore.jsx` - Store creation
- `EditStore.jsx` - Store editing
- `Orders.jsx` - Order management
- `Sales.jsx` - Sales analytics with charts
- `AccountDetails.jsx` - Account settings
- `Transaction.jsx` - Transaction history

**Admin Components** (`Frontend-main/src/admin/`):
- `AdminDashboard.jsx` - Admin panel layout
- `AdminHome.jsx` - Admin overview
- `AdminUsers.jsx` - User management
- `AdminStores.jsx` - Store oversight
- `AdminTemplates.jsx` - Template management
- `AdminProducts.jsx` - Product oversight
- `AdminCategories.jsx` - Category oversight
- `AdminOrders.jsx` - Order oversight
- `AdminEarnings.jsx` - Platform earnings
- `AdminSettings.jsx` - Admin settings

**Public Pages** (`Frontend-main/src/pages/`):
- `Home.jsx` - Landing page
- `Login.jsx` - Login
- `Register.jsx` - Registration
- `Dashboard.jsx` - Merchant dashboard layout
- `Categories.jsx` - Category management
- `Offers.jsx` - Offer management
- `Settings.jsx` - Settings

## Key Features

### Multi-Tenancy
- Each merchant can create multiple stores
- Stores have unique slugs for URL routing
- Stores can use custom templates

### Template System
- Admins create templates with preview images
- Merchants select templates when creating stores
- Template determines store frontend appearance
- Currently one template implemented (template001)

### Payment Integration
- KYC verification (PAN, Aadhaar)
- Bank account details for payouts
- UPI integration
- Sensitive data protected with `select: false`

### Analytics
- Sales analytics for merchants
- Monthly sales data
- Top selling products
- Dashboard statistics
- Sales charts

### Order Management
- Full order lifecycle (Pending → Confirmed → Shipped → Delivered)
- Order status tracking
- Customer order history
- Store order management

### Cart System
- Client-side cart with Zustand
- Persistent across page refreshes
- Quantity management
- Total price calculation

## Data Flow Examples

### Customer Purchase Flow:
1. Customer browses store at `/{storeSlug}`
2. Views products, adds to cart (CartStore)
3. Proceeds to checkout
4. Creates order via `POST /order`
5. Order stored in MongoDB with status "Pending"
6. Merchant updates order status via dashboard

### Merchant Store Creation Flow:
1. Merchant registers/logs in
2. Navigates to `/dashboard/stores/add`
3. Fills store details, selects template, uploads logo
4. Calls `POST /stores`
5. Store created with unique slug
6. Store route automatically available at `/{slug}`

### Admin Template Creation Flow:
1. Admin logs in, navigates to `/adm/templates`
2. Creates template with name, slug, preview image
3. Calls `POST /templates`
4. Template available for merchants to select

## Technology Stack Summary

**Backend**:
- Node.js with Express.js
- TypeScript
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads
- CORS enabled

**Frontend**:
- React 19
- Vite
- TailwindCSS v4
- React Router v7
- Zustand (state management)
- TanStack React Query (data fetching)
- Axios (HTTP client)
- Framer Motion (animations)
- React Icons
- Recharts (charts)
- i18next (internationalization)

## Project Structure

```
GroupProject/
├── Backend/
│   ├── src/
│   │   ├── Middleware/
│   │   │   └── LoginCheck.ts
│   │   ├── controller/
│   │   │   ├── User.controller.ts
│   │   │   ├── StoreController.ts
│   │   │   ├── productController.ts
│   │   │   ├── categoryController.ts
│   │   │   ├── orderController.ts
│   │   │   ├── paymentController.ts
│   │   │   ├── templateController.ts
│   │   │   ├── offerController.ts
│   │   │   └── salesController.ts
│   │   ├── model/
│   │   │   ├── User.ts
│   │   │   ├── Store.ts
│   │   │   ├── productModel.ts
│   │   │   ├── categoryModel.ts
│   │   │   ├── orderModel.ts
│   │   │   ├── paymentModel.ts
│   │   │   ├── templateModel.ts
│   │   │   └── offerModel.ts
│   │   ├── router/
│   │   │   ├── User.ts
│   │   │   ├── Store.ts
│   │   │   ├── Product.ts
│   │   │   ├── Category.ts
│   │   │   ├── Order.ts
│   │   │   ├── Payment.ts
│   │   │   ├── template.ts
│   │   │   └── offer.ts
│   │   ├── multer.ts
│   │   └── server.ts
│   ├── uploads/
│   ├── package.json
│   ├── tsconfig.json
│   └── API_DOCUMENTATION.md
├── Frontend-main/
│   ├── src/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminHome.jsx
│   │   │   ├── AdminUsers.jsx
│   │   │   ├── AdminStores.jsx
│   │   │   ├── AdminTemplates.jsx
│   │   │   ├── AdminProducts.jsx
│   │   │   ├── AdminCategories.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   ├── AdminEarnings.jsx
│   │   │   └── AdminSettings.jsx
│   │   ├── api/
│   │   │   ├── axiosClient.js
│   │   │   └── urls.js
│   │   ├── components/
│   │   │   ├── DashLanding.jsx
│   │   │   ├── ProductList.jsx
│   │   │   ├── AddProduct.jsx
│   │   │   ├── EditProduct.jsx
│   │   │   ├── ViewStore.jsx
│   │   │   ├── AddStore.jsx
│   │   │   ├── EditStore.jsx
│   │   │   ├── Orders.jsx
│   │   │   ├── Sales.jsx
│   │   │   ├── AccountDetails.jsx
│   │   │   └── Transaction.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── Offers.jsx
│   │   │   └── Settings.jsx
│   │   ├── templete001/
│   │   │   ├── THomeOne.jsx
│   │   │   ├── components/
│   │   │   │   ├── Layout.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Footer.jsx
│   │   │   └── pages/
│   │   │       ├── ProductListOne.jsx
│   │   │       ├── ProductView.jsx
│   │   │       ├── Cart.jsx
│   │   │       ├── Checkout.jsx
│   │   │       ├── LoginTemp.jsx
│   │   │       ├── Register.jsx
│   │   │       └── Account.jsx
│   │   ├── Zustand/
│   │   │   ├── AuthStore.js
│   │   │   ├── cartStore.js
│   │   │   └── shopStore.js
│   │   ├── AuthStore.js
│   │   ├── Router.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── Templates/
    └── template01/
```

## Environment Variables

**Backend (.env)**:
```
PORT=3000
MONGO_URL=mongodb://your-mongodb-url
JWT_SECRET=your-secret-key
```

## Running the Project

**Backend**:
```bash
cd Backend
npm install
npm run dev  # Development with tsx watch
npm start     # Production
```

**Frontend**:
```bash
cd Frontend-main
npm install
npm run dev    # Development
npm run build  # Production build
```

## API Documentation
Detailed API documentation is available at `Backend/API_DOCUMENTATION.md`
