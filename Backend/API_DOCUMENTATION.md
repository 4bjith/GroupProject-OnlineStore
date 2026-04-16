# Backend API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [Error Handling](#error-handling)
5. [API Endpoints](#api-endpoints)
   - [User Endpoints](#user-endpoints)
   - [Store Endpoints](#store-endpoints)
   - [Product Endpoints](#product-endpoints)
   - [Category Endpoints](#category-endpoints)
   - [Order Endpoints](#order-endpoints)
   - [Payment Endpoints](#payment-endpoints)
   - [Template Endpoints](#template-endpoints)
   - [Offer Endpoints](#offer-endpoints)
   - [Sales Analytics Endpoints](#sales-analytics-endpoints)

---

## Overview

This is a comprehensive API documentation for the Backend service. The API provides endpoints for managing users, stores, products, categories, orders, payments, templates, and offers. 

**Base URL:** `http://localhost:3000`

**API Version:** v1

---

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB connection
- JWT Token for authenticated endpoints

### Environment Setup
Ensure your `.env` file contains:
```
PORT=3000
MONGO_URL=mongodb://your-mongodb-url
JWT_SECRET=your-secret-key
```

### Running the Server
```bash
npm install
npm start
```

---

## Authentication

### JWT Authentication

Many endpoints require authentication using JWT tokens. To authenticate:

1. **Register and Login** to get a JWT token
2. **Include the token** in the Authorization header for protected endpoints

### Header Format
```
Authorization: Bearer <your-jwt-token>
```

**Token Expiry:** 24 hours

---

## Error Handling

### Standard Error Responses

The API returns consistent error responses with appropriate HTTP status codes:

| Status Code | Meaning |
|----------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid request parameters |
| 401 | Unauthorized - Missing or invalid authentication |
| 403 | Forbidden - Invalid token |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 500 | Server Error - Internal server error |

### Error Response Format
```json
{
  "message": "Error description",
  "error": "Optional error details"
}
```

---

## API Endpoints

---

# User Endpoints

## 1. Register User

**Endpoint:** `POST /register/user`

**Authentication:** Not required

**Description:** Register a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "number": "+1234567890",
  "role": "customer"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | User's full name |
| email | string | Yes | Unique email address |
| password | string | Yes | Password (will be hashed) |
| number | string | Yes | Phone number |
| role | string | No | User role: "customer", "merchant", "admin" (default: "customer") |

**Success Response (201):**
```json
{
  "message": "User created successfully"
}
```

**Error Response (400):**
```json
{
  "message": "All fields are required"
}
```

---

## 2. Login User

**Endpoint:** `POST /login/user`

**Authentication:** Not required

**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email |
| password | string | Yes | User's password |

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "customer",
  "user": {
    "id": "60d5ec49c1234567890abcde",
    "email": "john@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Invalid credentials"
}
```

---

## 3. Get User Details

**Endpoint:** `GET /getuserdetails`

**Authentication:** Required (Bearer Token)

**Description:** Retrieve current authenticated user's details

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**
```json
{
  "user": {
    "_id": "60d5ec49c1234567890abcde",
    "name": "John Doe",
    "email": "john@example.com",
    "number": "+1234567890",
    "profilePic": "/uploads/profile123.jpg",
    "role": "customer",
    "address": "123 Main St, City",
    "businessType": "Retail",
    "businessDescription": "Online retail store",
    "accountStatus": "Active",
    "lastLogin": "2024-01-15T10:30:00Z",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

## 4. Get All Users

**Endpoint:** `GET /user/all`

**Authentication:** Required (Bearer Token)

**Description:** Retrieve all users (Admin only)

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**
```json
{
  "users": [
    {
      "_id": "60d5ec49c1234567890abcde",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "accountStatus": "Active",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

## 5. Update User Details

**Endpoint:** `PUT /updateuserdetails`

**Authentication:** Required (Bearer Token)

**Content-Type:** `multipart/form-data`

**Description:** Update authenticated user's profile information

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email |
| name | string | No | Updated name |
| number | string | No | Updated phone number |
| address | string | No | Updated address |
| businessType | string | No | Business type |
| businessDescription | string | No | Business description |
| profilepic | file | No | Profile picture (image file) |

**Success Response (200):**
```json
{
  "message": "User updated successfully",
  "user": {
    "_id": "60d5ec49c1234567890abcde",
    "name": "John Doe Updated",
    "email": "john@example.com",
    "profilePic": "/uploads/profile456.jpg"
  }
}
```

---

# Store Endpoints

## 1. Create Store

**Endpoint:** `POST /stores`

**Authentication:** Not required

**Content-Type:** `multipart/form-data`

**Description:** Create a new store

**Request Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| ownerId | string | Yes | Owner's user ID |
| name | string | Yes | Store name |
| currency | string | Yes | Currency code (e.g., "USD", "INR") |
| templateId | string | Yes | Template ID for store design |
| commissionRate | number | No | Commission rate (0-100) |
| logo | file | No | Store logo (image file) |
| logoUrl | string | No | Logo URL (if not uploading file) |

**Success Response (201):**
```json
{
  "message": "Store created successfully",
  "store": {
    "_id": "60d5ec49c1234567890abcde",
    "ownerId": "60d5ec49c1234567890abcdf",
    "name": "My Store",
    "slug": "my-store",
    "currency": "USD",
    "templateId": "60d5ec49c1234567890abce0",
    "commissionRate": 5,
    "logo": "/uploads/logo.png",
    "isPublished": false,
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 2. Get Store by ID

**Endpoint:** `GET /stores/:id`

**Authentication:** Not required

**Description:** Retrieve store details by ID

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Store ID (MongoDB ObjectId) |

**Success Response (200):**
```json
{
  "_id": "60d5ec49c1234567890abcde",
  "ownerId": "60d5ec49c1234567890abcdf",
  "name": "My Store",
  "slug": "my-store",
  "currency": "USD",
  "templateId": "60d5ec49c1234567890abce0",
  "logo": "/uploads/logo.png",
  "commissionRate": 5,
  "isPublished": true,
  "status": "active"
}
```

---

## 3. Get All Stores

**Endpoint:** `GET /stores`

**Authentication:** Not required

**Description:** Retrieve all stores with template details populated

**Success Response (200):**
```json
[
  {
    "_id": "60d5ec49c1234567890abcde",
    "name": "Store 1",
    "slug": "store-1",
    "currency": "USD",
    "templateId": { /* Template details */ },
    "isPublished": true,
    "status": "active"
  }
]
```

---

## 4. Update Store

**Endpoint:** `PUT /stores/:id`

**Authentication:** Not required

**Content-Type:** `multipart/form-data`

**Description:** Update store details

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Store ID |

**Request Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | No | Updated store name |
| currency | string | No | Updated currency |
| templateId | string | No | Updated template ID |
| commissionRate | number | No | Updated commission rate |
| isPublished | boolean | No | Publish status |
| status | string | No | Store status (active/inactive) |
| domain | string | No | Custom domain |
| logo | file | No | Updated logo (image file) |
| logoUrl | string | No | Logo URL |

**Success Response (200):**
```json
{
  "message": "Store updated successfully",
  "store": { /* Updated store object */ }
}
```

---

## 5. Delete Store

**Endpoint:** `DELETE /stores/:id`

**Authentication:** Not required

**Description:** Delete a store

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Store ID |

**Success Response (200):**
```json
{
  "message": "Store deleted successfully"
}
```

---

# Product Endpoints

## 1. Create Product

**Endpoint:** `POST /products`

**Authentication:** Not required

**Content-Type:** `multipart/form-data`

**Description:** Create a new product with images

**Request Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| storeId | string | Yes | Store ID |
| title | string | Yes | Product title |
| description | string | Yes | Product description |
| category | string | Yes | Category name or ID |
| price | number | Yes | Product price |
| compareAtPrice | number | No | Original price (for discounts) |
| stock | number | Yes | Stock quantity |
| stockKeepingUnit | string | No | SKU code |
| specifications | JSON string | No | Product specifications: `[{"key": "color", "value": "red"}]` |
| tags | JSON string | No | Tags: `["electronics", "premium"]` |
| images | files | No | Product images (max 10 files) |
| imageUrls | JSON string | No | External image URLs: `["https://example.com/img1.jpg"]` |
| market | string | No | Market category |
| isActive | boolean | No | Active status (default: true) |
| isFinite | boolean | No | Finite stock indicator (default: true) |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "60d5ec49c1234567890abcde",
    "storeId": "60d5ec49c1234567890abcdf",
    "title": "Laptop",
    "description": "High-performance laptop",
    "category": "Electronics",
    "price": 999.99,
    "compareAtPrice": 1299.99,
    "stock": 50,
    "stockKeepingUnit": "LAPTOP-001",
    "images": ["/uploads/laptop1.jpg", "/uploads/laptop2.jpg"],
    "specifications": [
      { "key": "RAM", "value": "16GB" },
      { "key": "Storage", "value": "512GB SSD" }
    ],
    "tags": ["electronics", "premium"],
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 2. Get Product by ID

**Endpoint:** `GET /products/:id`

**Authentication:** Not required

**Description:** Retrieve product details by ID

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Product ID |

**Success Response (200):**
```json
{
  "_id": "60d5ec49c1234567890abcde",
  "storeId": { /* Store details */ },
  "title": "Laptop",
  "description": "High-performance laptop",
  "price": 999.99,
  "images": ["/uploads/laptop1.jpg"],
  "stock": 50
}
```

---

## 3. Get All Products

**Endpoint:** `GET /product`

**Authentication:** Not required

**Description:** Retrieve all products with pagination and filtering

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| storeId | string | No | - | Filter by store ID |
| page | number | No | 1 | Page number |
| limit | number | No | 12 | Items per page |
| search | string | No | - | Search by product title |

**Example Request:**
```
GET /product?storeId=60d5ec49c1234567890abcdf&page=1&limit=10&search=laptop
```

**Success Response (200):**
```json
{
  "products": [
    {
      "_id": "60d5ec49c1234567890abcde",
      "title": "Laptop",
      "price": 999.99,
      "stock": 50,
      "images": [],
      "storeId": { /* Store details */ }
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 10
}
```

---

## 4. Update Product

**Endpoint:** `PUT /products/:id`

**Authentication:** Not required

**Content-Type:** `multipart/form-data`

**Description:** Update product details

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Product ID |

**Request Parameters:** Same as Create Product

**Success Response (200):**
```json
{
  "message": "Product updated successfully",
  "product": { /* Updated product object */ }
}
```

---

## 5. Delete Product

**Endpoint:** `DELETE /products/:id`

**Authentication:** Not required

**Description:** Delete a product

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Product ID |

**Success Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

---

# Category Endpoints

## 1. Create Category

**Endpoint:** `POST /category/create`

**Authentication:** Not required

**Content-Type:** `multipart/form-data`

**Description:** Create a new product category

**Request Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| storeId | string | Yes | Store ID |
| catname | string | Yes | Category name |
| catimage | file or string | Yes | Category image (file upload or URL) |

**Success Response (201):**
```json
{
  "_id": "60d5ec49c1234567890abcde",
  "storeId": "60d5ec49c1234567890abcdf",
  "catname": "Electronics",
  "catimage": "/uploads/electronics.jpg",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

---

## 2. Get All Categories

**Endpoint:** `GET /category`

**Authentication:** Not required

**Description:** Retrieve all categories

**Success Response (200):**
```json
[
  {
    "_id": "60d5ec49c1234567890abcde",
    "catname": "Electronics",
    "catimage": "/uploads/electronics.jpg",
    "storeId": { /* Store details */ }
  }
]
```

---

## 3. Get Categories by Store ID

**Endpoint:** `GET /category/:storeId`

**Authentication:** Not required

**Description:** Retrieve categories for a specific store

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| storeId | string | Yes | Store ID |

**Success Response (200):**
```json
[
  {
    "_id": "60d5ec49c1234567890abcde",
    "catname": "Electronics",
    "catimage": "/uploads/electronics.jpg",
    "storeId": "60d5ec49c1234567890abcdf"
  }
]
```

---

## 4. Get Admin Categories (with product counts)

**Endpoint:** `GET /admin-categories`

**Authentication:** Required (Bearer Token)

**Description:** Retrieve all categories with product and offer counts

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**
```json
[
  {
    "_id": "60d5ec49c1234567890abcde",
    "catname": "Electronics",
    "catimage": "/uploads/electronics.jpg",
    "productCount": 25,
    "offerCount": 3,
    "storeId": {
      "_id": "60d5ec49c1234567890abcdf",
      "name": "My Store",
      "ownerId": { "name": "Owner Name", "email": "owner@example.com" }
    }
  }
]
```

---

## 5. Update Category

**Endpoint:** `PUT /category/update/:id`

**Authentication:** Not required

**Content-Type:** `multipart/form-data`

**Description:** Update category details

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Category ID |

**Request Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| catname | string | No | Updated category name |
| catimage | file or string | No | Updated category image |

**Success Response (200):**
```json
{
  "_id": "60d5ec49c1234567890abcde",
  "catname": "Electronics Updated",
  "catimage": "/uploads/electronics-new.jpg"
}
```

---

## 6. Delete Category

**Endpoint:** `DELETE /category/delete/:id`

**Authentication:** Not required

**Description:** Delete a category

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Category ID |

**Success Response (200):**
```json
{
  "message": "Category deleted successfully"
}
```

---

# Order Endpoints

## 1. Create Order

**Endpoint:** `POST /order`

**Authentication:** Not required

**Description:** Create a new order

**Request Body:**
```json
{
  "storeId": "60d5ec49c1234567890abcdf",
  "email": "customer@example.com",
  "items": [
    {
      "productId": "60d5ec49c1234567890abcde",
      "quantity": 2,
      "price": 999.99
    }
  ],
  "shippingAddress": {
    "addressLine1": "123 Main St",
    "city": "New York",
    "postalCode": "10001",
    "country": "USA"
  },
  "totalAmount": 2099.99,
  "shippingPrice": 10.00,
  "paymentMethod": "credit_card",
  "paymentStatus": "pending"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| storeId | string | Yes | Store ID |
| email | string | Yes | Customer email |
| items | array | Yes | Order items |
| items[].productId | string | Yes | Product ID |
| items[].quantity | number | Yes | Quantity ordered |
| items[].price | number | Yes | Item price |
| shippingAddress | object | Yes | Shipping address |
| totalAmount | number | Yes | Total order amount |
| shippingPrice | number | No | Shipping cost |
| paymentMethod | string | No | Payment method |
| paymentStatus | string | No | Payment status |

**Success Response (201):**
```json
{
  "message": "Order Created!"
}
```

---

## 2. Get All Orders

**Endpoint:** `GET /orders`

**Authentication:** Not required

**Description:** Retrieve all orders with pagination

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number |
| limit | number | No | 10 | Items per page |

**Success Response (200):**
```json
{
  "message": "Orders fetched successfully",
  "length": 10,
  "page": 1,
  "orders": [
    {
      "_id": "60d5ec49c1234567890abcde",
      "storeId": { /* Store details */ },
      "userId": { /* User details */ },
      "items": [
        {
          "productId": { /* Product details */ },
          "quantity": 2,
          "price": 999.99
        }
      ],
      "totalAmount": 2099.99,
      "paymentStatus": "pending",
      "orderStatus": "processing",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## 3. Get Customer Orders

**Endpoint:** `GET /order/customer/:id`

**Authentication:** Not required

**Description:** Retrieve orders for a specific customer

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Customer user ID |

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number |
| limit | number | No | 10 | Items per page |

**Success Response (200):**
```json
{
  "message": "order successfully fetched",
  "length": 5,
  "page": 1,
  "orders": [ /* Order objects */ ]
}
```

---

## 4. Get Store Orders

**Endpoint:** `GET /order/store/:id`

**Authentication:** Not required

**Description:** Retrieve orders for a specific store

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Store ID |

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number |
| limit | number | No | 10 | Items per page |

**Success Response (200):**
```json
{
  "message": "order successfully fetched",
  "length": 15,
  "page": 1,
  "orders": [ /* Order objects */ ]
}
```

---

## 5. Update Order Status

**Endpoint:** `PUT /order/:id`

**Authentication:** Not required

**Description:** Update order status

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Order ID |

**Request Body:**
```json
{
  "orderStatus": "shipped"
}
```

**Success Response (200):**
```json
{
  "message": "Order updated successfully"
}
```

---

## 6. Delete Order

**Endpoint:** `DELETE /order/:id`

**Authentication:** Not required

**Description:** Delete an order

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Order ID |

**Success Response (200):**
```json
{
  "message": "Order deleted successfully"
}
```

---

# Payment Endpoints

## 1. Create Payment Details

**Endpoint:** `POST /payment/create`

**Authentication:** Required (Bearer Token)

**Description:** Set up payment details for a merchant

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "kyc": {
    "pan": {
      "number": "AAAPA1234A",
      "verified": true
    },
    "aadhaar": {
      "number": "123456789012",
      "verified": true
    }
  },
  "bank": {
    "accountHolder": "John Doe",
    "accountNumber": "1234567890",
    "ifscCode": "SBIN0001234",
    "bankName": "State Bank of India"
  },
  "upi": {
    "upiId": "johndoe@upi"
  }
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| kyc | object | No | KYC details |
| bank | object | No | Bank account details |
| upi | object | No | UPI details |

**Success Response (201):**
```json
{
  "message": "Payment details created successfully",
  "payment": {
    "_id": "60d5ec49c1234567890abcde",
    "merchantId": "60d5ec49c1234567890abcdf",
    "kyc": { /* KYC details */ },
    "bank": { /* Bank details */ },
    "upi": { /* UPI details */ }
  }
}
```

---

## 2. Get Payment Details

**Endpoint:** `GET /payment`

**Authentication:** Required (Bearer Token)

**Description:** Retrieve payment details for authenticated merchant

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Success Response (200):**
```json
{
  "payment": {
    "_id": "60d5ec49c1234567890abcde",
    "merchantId": "60d5ec49c1234567890abcdf",
    "kyc": { /* KYC details */ },
    "bank": { /* Bank details */ },
    "upi": { /* UPI details */ }
  }
}
```

---

## 3. Update Payment Details

**Endpoint:** `PUT /payment/update/:id`

**Authentication:** Required (Bearer Token)

**Description:** Update payment details

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Payment ID |

**Request Body:** Same as Create Payment Details

**Success Response (200):**
```json
{
  "message": "Payment details updated successfully"
}
```

---

## 4. Delete Payment Details

**Endpoint:** `DELETE /payment/delete/:id`

**Authentication:** Required (Bearer Token)

**Description:** Delete payment details

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Payment ID |

**Success Response (200):**
```json
{
  "message": "Payment details deleted successfully"
}
```

---

# Template Endpoints

## 1. Create Template

**Endpoint:** `POST /templates`

**Authentication:** Not required

**Content-Type:** `multipart/form-data`

**Description:** Create a new store template

**Request Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| templateName | string | Yes | Template name |
| slug | string | Yes | Unique slug |
| description | string | No | Template description |
| previewImage | file | No | Preview image (image file) |
| previewImageUrl | string | No | Preview image URL |
| config | JSON string | No | Template configuration |

**Success Response (201):**
```json
{
  "message": "Template created successfully",
  "template": {
    "_id": "60d5ec49c1234567890abcde",
    "templateName": "Modern Store",
    "slug": "modern-store",
    "previewImage": "/uploads/preview.jpg",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 2. Get All Templates

**Endpoint:** `GET /templates`

**Authentication:** Not required

**Description:** Retrieve all templates

**Success Response (200):**
```json
[
  {
    "_id": "60d5ec49c1234567890abcde",
    "templateName": "Modern Store",
    "slug": "modern-store",
    "previewImage": "/uploads/preview.jpg",
    "description": "A modern e-commerce template"
  }
]
```

---

## 3. Get Template by Slug

**Endpoint:** `GET /templates/:slug`

**Authentication:** Not required

**Description:** Retrieve template details by slug

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| slug | string | Yes | Template slug |

**Success Response (200):**
```json
{
  "_id": "60d5ec49c1234567890abcde",
  "templateName": "Modern Store",
  "slug": "modern-store",
  "previewImage": "/uploads/preview.jpg",
  "config": { /* Template configuration */ }
}
```

---

## 4. Update Template

**Endpoint:** `PUT /templates/:slug`

**Authentication:** Not required

**Content-Type:** `multipart/form-data`

**Description:** Update template details

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| slug | string | Yes | Template slug |

**Request Parameters:** Same as Create Template

**Success Response (200):**
```json
{
  "message": "Template updated successfully",
  "template": { /* Updated template object */ }
}
```

---

## 5. Delete Template

**Endpoint:** `DELETE /templates/:slug`

**Authentication:** Not required

**Description:** Delete a template

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| slug | string | Yes | Template slug |

**Success Response (200):**
```json
{
  "message": "Template deleted successfully"
}
```

---

# Offer Endpoints

## 1. Create Offer

**Endpoint:** `POST /offers`

**Authentication:** Not required

**Description:** Create a new offer

**Request Body:**
```json
{
  "storeId": "60d5ec49c1234567890abcdf",
  "productId": "60d5ec49c1234567890abcde",
  "offerType": "percentage",
  "discountValue": 20,
  "startDate": "2024-01-15T00:00:00Z",
  "endDate": "2024-02-15T00:00:00Z",
  "description": "20% off on all laptops"
}
```

**Parameters:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| storeId | string | Yes | Store ID |
| productId | string | No | Product ID (product-specific offer) |
| offerType | string | Yes | Type: "percentage" or "fixed" |
| discountValue | number | Yes | Discount amount/percentage |
| startDate | date | Yes | Offer start date |
| endDate | date | Yes | Offer end date |
| description | string | No | Offer description |

**Success Response (201):**
```json
{
  "message": "Offer created successfully",
  "offer": {
    "_id": "60d5ec49c1234567890abcde",
    "storeId": "60d5ec49c1234567890abcdf",
    "productId": "60d5ec49c1234567890abce0",
    "offerType": "percentage",
    "discountValue": 20,
    "startDate": "2024-01-15T00:00:00Z",
    "endDate": "2024-02-15T00:00:00Z",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

## 2. Get All Offers

**Endpoint:** `GET /offers`

**Authentication:** Not required

**Description:** Retrieve all offers

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| storeId | string | No | Filter by store ID |

**Success Response (200):**
```json
[
  {
    "_id": "60d5ec49c1234567890abcde",
    "storeId": "60d5ec49c1234567890abcdf",
    "productId": "60d5ec49c1234567890abce0",
    "offerType": "percentage",
    "discountValue": 20,
    "description": "20% off on all laptops",
    "startDate": "2024-01-15T00:00:00Z",
    "endDate": "2024-02-15T00:00:00Z"
  }
]
```

---

## 3. Delete Offer

**Endpoint:** `DELETE /offers/:id`

**Authentication:** Not required

**Description:** Delete an offer

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string | Yes | Offer ID |

**Success Response (200):**
```json
{
  "message": "Offer deleted successfully"
}
```

---

# Sales Analytics Endpoints

## 1. Get Sales Analysis (Dashboard)

**Endpoint:** `GET /sales`

**Authentication:** Not required

**Description:** Get sales analysis data for merchants

**Success Response (200):**
```json
{
  "totalSales": 15000.00,
  "totalOrders": 45,
  "totalRevenue": 15000.00,
  "averageOrderValue": 333.33,
  "topProduct": {
    "productId": "60d5ec49c1234567890abcde",
    "title": "Laptop",
    "sales": 25
  }
}
```

---

## 2. Get Monthly Sales Data

**Endpoint:** `GET /sales/monthly`

**Authentication:** Not required

**Description:** Get monthly sales breakdown

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| storeId | string | No | Filter by store |
| year | number | No | Filter by year |

**Success Response (200):**
```json
{
  "monthly": [
    {
      "month": "January",
      "sales": 3500.00,
      "orders": 10
    },
    {
      "month": "February",
      "sales": 4200.00,
      "orders": 12
    }
  ]
}
```

---

## 3. Get Top Selling Products

**Endpoint:** `GET /sales/top-products`

**Authentication:** Not required

**Description:** Get list of top-selling products

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| limit | number | No | 10 | Number of products to return |
| storeId | string | No | - | Filter by store |

**Success Response (200):**
```json
[
  {
    "productId": "60d5ec49c1234567890abcde",
    "title": "Laptop",
    "sales": 45,
    "revenue": 44999.55
  },
  {
    "productId": "60d5ec49c1234567890abcdf",
    "title": "Mouse",
    "sales": 120,
    "revenue": 1200.00
  }
]
```

---

## 4. Get Dashboard Stats

**Endpoint:** `GET /dashboard/stats`

**Authentication:** Not required

**Description:** Get comprehensive dashboard statistics

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| storeId | string | No | Filter by store |

**Success Response (200):**
```json
{
  "totalRevenue": 50000.00,
  "totalOrders": 150,
  "totalCustomers": 45,
  "totalProducts": 250,
  "pendingOrders": 12,
  "completedOrders": 138,
  "averageOrderValue": 333.33,
  "conversionRate": 3.2
}
```

---

## 5. Get Sales Chart Data

**Endpoint:** `GET /sales/chart`

**Authentication:** Not required

**Description:** Get data for sales chart visualization

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| storeId | string | No | Filter by store |
| period | string | No | Time period (daily, weekly, monthly) |

**Success Response (200):**
```json
{
  "chartData": [
    { "date": "2024-01-01", "sales": 500 },
    { "date": "2024-01-02", "sales": 650 },
    { "date": "2024-01-03", "sales": 720 }
  ]
}
```

---

## File Upload Configuration

### Supported File Types
- **Images:** `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
- **Maximum file size:** 5MB per file

### Upload Endpoints
The following endpoints support file uploads via `multipart/form-data`:
- User profile picture: `PUT /updateuserdetails`
- Store logo: `POST /stores`, `PUT /stores/:id`
- Product images: `POST /products`, `PUT /products/:id`
- Category images: `POST /category/create`, `PUT /category/update/:id`
- Template preview: `POST /templates`, `PUT /templates/:slug`

### Static File Access
Uploaded files are served at:
```
http://localhost:3000/uploads/{filename}
```

---

## Common Response Status Codes

| Status | Meaning | Typical Usage |
|--------|---------|---------------|
| 200 | OK | ✅ Successful GET, PUT, DELETE |
| 201 | Created | ✅ Successful POST |
| 400 | Bad Request | ❌ Missing/invalid parameters |
| 401 | Unauthorized | ❌ Missing authentication token |
| 403 | Forbidden | ❌ Invalid token |
| 404 | Not Found | ❌ Resource doesn't exist |
| 409 | Conflict | ❌ Resource already exists |
| 500 | Server Error | ❌ Internal error |

---

## Rate Limiting & Best Practices

### Recommendations for Frontend Developers

1. **Authentication:**
   - Store JWT token securely (localStorage/sessionStorage)
   - Include token in every authenticated request
   - Handle token expiry (refresh every 24 hours)

2. **Error Handling:**
   - Always check response status code
   - Implement proper error messages for users
   - Log errors for debugging

3. **Performance:**
   - Use pagination for large datasets
   - Cache responses appropriately
   - Implement loading states

4. **Data Validation:**
   - Validate input before sending to API
   - Match field requirements (required vs optional)
   - Handle file uploads correctly

5. **Security:**
   - Use HTTPS in production
   - Never expose JWT tokens in URL
   - Sanitize user input

---

## Example Integration

### Using Fetch API

```javascript
// Authentication
const loginUser = async (email, password) => {
  const response = await fetch('http://localhost:3000/login/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  return data.token; // Save this token
};

// Making Authenticated Requests
const getStores = async (token) => {
  const response = await fetch('http://localhost:3000/stores', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return await response.json();
};

// File Upload
const uploadProduct = async (formData, token) => {
  const response = await fetch('http://localhost:3000/products', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData // multipart/form-data
  });
  
  return await response.json();
};
```

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Missing/invalid token | Verify token is valid and included in Authorization header |
| 404 Not Found | Resource doesn't exist | Check the resource ID and ensure it exists |
| 400 Bad Request | Missing required fields | Verify all required parameters are provided |
| 500 Server Error | Server-side issue | Check server logs and try again later |
| File upload fails | File too large or wrong type | Ensure file < 5MB and is an image |

---

## Support & Contact

For issues or questions:
- Check server logs: `npm logs`
- Review error messages in response
- Validate request format matches documentation
- Ensure all required fields are provided

---

**Last Updated:** January 2024  
**API Version:** v1.0  
**Server:** Node.js + Express + MongoDB
