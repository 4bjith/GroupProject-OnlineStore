# Migration Plan: React/Vite to Next.js

## Executive Summary

This document outlines the comprehensive migration plan for converting the frontend from **React/Vite (Frontend-main)** to **Next.js (genmise)**. The migration involves restructuring the application to leverage Next.js App Router, Server-Side Rendering (SSR), and optimized performance features.

**Source**: `Frontend-main` (React 19 + Vite + React Router v7)
**Target**: `genmise` (Next.js 16.2.4 + App Router + TypeScript)

**Estimated Timeline**: 4-6 weeks
**Team Size**: 2-3 developers

---

## Current Architecture Analysis

### Frontend-main Structure

```
Frontend-main/src/
├── AuthStore.js                    # Zustand auth state
├── Router.jsx                      # React Router v7 configuration
├── main.jsx                        # React entry point
├── index.css                       # Global styles
├── api/                            # Axios configuration
│   ├── axiosClient.js
│   └── urls.js
├── Zustand/                        # State management
│   ├── cartStore.js
│   └── shopStore.js
├── admin/                          # Admin panel (11 components)
├── components/                     # Merchant dashboard (17 components)
├── pages/                          # Public pages (6 pages)
├── templete001/                    # Store template system
│   ├── THomeOne.jsx
│   ├── components/ (Layout, Navbar, Footer)
│   ├── pages/ (9 template pages)
│   └── data/
└── utils/                          # Utilities
    └── logger.js
```

### Current Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.10.1",
  "zustand": "^5.0.9",
  "@tanstack/react-query": "^5.90.12",
  "axios": "^1.13.2",
  "framer-motion": "^12.24.12",
  "react-hot-toast": "^2.6.0",
  "react-toastify": "^11.0.5",
  "react-icons": "^5.5.0",
  "recharts": "^3.6.0",
  "i18next": "^25.7.3",
  "react-i18next": "^16.5.1",
  "tailwindcss": "^4.1.17"
}
```

### Current Routing Structure

**Public Routes**:
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

**Merchant Dashboard** (`/dashboard`):
- `/dashboard` - Landing page
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

---

## Migration Strategy

### Phase 1: Setup & Configuration (Week 1)

**Objective**: Configure Next.js environment and install dependencies.

#### Tasks

1. **Install Required Dependencies**
```bash
cd genmise
npm install zustand @tanstack/react-query axios framer-motion
npm install react-hot-toast react-icons recharts
npm install i18next react-i18next i18next-browser-languagedetector
npm install clsx tailwind-merge
```

2. **Configure TypeScript**
- Ensure `tsconfig.json` supports JSX
- Configure path aliases (`@/components`, `@/lib`, etc.)
- Enable strict mode for better type safety

3. **Configure TailwindCSS**
- Migrate from Tailwind v4 to v4 (already compatible)
- Update `tailwind.config.ts` for Next.js
- Configure content paths for Next.js app directory

4. **Environment Variables**
- Create `.env.local` file
- Configure API base URL
- Configure JWT secret (if needed)
- Configure any other environment variables

5. **Directory Structure Setup**
```
genmise/
├── app/
│   ├── (auth)/              # Auth group
│   ├── (dashboard)/         # Merchant dashboard group
│   ├── (admin)/             # Admin panel group
│   ├── [storeSlug]/         # Dynamic store routes
│   ├── api/                 # Next.js API routes (if needed)
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── dashboard/           # Dashboard components
│   ├── admin/               # Admin components
│   └── template/            # Template components
├── lib/
│   ├── api.ts               # Axios configuration
│   ├── auth.ts              # Auth utilities
│   └── utils.ts             # General utilities
├── stores/                  # Zustand stores
│   ├── authStore.ts
│   ├── cartStore.ts
│   └── shopStore.ts
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript types
└── public/                  # Static assets
```

**Deliverables**:
- Configured Next.js project
- All dependencies installed
- Directory structure created
- Environment variables configured

---

### Phase 2: Core Infrastructure (Week 2)

**Objective**: Migrate core infrastructure components (API client, state management, utilities).

#### Tasks

1. **Migrate API Client (axiosClient.js → lib/api.ts)**
```typescript
// genmise/lib/api.ts
import axios from 'axios';
import { authStore } from '@/stores/authStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = authStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStore.getState().logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
```

2. **Migrate Zustand Stores to TypeScript**
```typescript
// genmise/stores/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  role: string | null;
  user: any;
  addUser: (userdata: any) => void;
  addToken: (token: string, role: string) => void;
  removeToken: () => void;
  logout: () => void;
}

export const authStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      user: null,
      addUser: (userdata) => set({ user: userdata }),
      addToken: (token, role) => set({ token, role }),
      removeToken: () => set({ token: null, role: null }),
      logout: () => set({ token: null, user: null, role: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

3. **Migrate Cart Store to TypeScript**
```typescript
// genmise/stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  _id?: string;
  id?: string;
  title: string;
  price: number;
  quantity: number;
  [key: string]: any;
}

interface CartState {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const items = get().items;
        const productId = product._id || product.id;
        const existingItem = items.find((item) => (item._id || item.id) === productId);

        if (existingItem) {
          set({
            items: items.map((item) =>
              (item._id || item.id) === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },
      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => (item._id || item.id) !== productId),
        });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((item) =>
            (item._id || item.id) === productId ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getItemCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
```

4. **Migrate Shop Store to TypeScript**
```typescript
// genmise/stores/shopStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ShopState {
  currentStore: any;
  setStore: (store: any) => void;
}

export const useShopStore = create<ShopState>()(
  persist(
    (set) => ({
      currentStore: null,
      setStore: (store) => set({ currentStore: store }),
    }),
    {
      name: 'shop-storage',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
```

5. **Create Utility Functions**
```typescript
// genmise/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Logger utility (simplified for Next.js)
export const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data);
    }
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
  api: (method: string, url: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${method} ${url}`, data);
    }
  },
};
```

6. **Configure React Query Provider**
```typescript
// genmise/lib/react-query-provider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

7. **Configure Toast Provider**
```typescript
// genmise/lib/toaster-provider.tsx
'use client';

import { Toaster } from 'react-hot-toast';

export function ToasterProvider() {
  return <Toaster position="top-right" />;
}
```

**Deliverables**:
- Migrated API client with TypeScript
- Migrated Zustand stores with TypeScript
- Utility functions created
- React Query provider configured
- Toast provider configured

---

### Phase 3: Public Routes Migration (Week 2-3)

**Objective**: Migrate public pages (Home, Auth, etc.) to Next.js App Router.

#### Tasks

1. **Root Layout (app/layout.tsx)**
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ReactQueryProvider } from '@/lib/react-query-provider';
import { ToasterProvider } from '@/lib/toaster-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Online Store Platform',
  description: 'Multi-tenant e-commerce platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReactQueryProvider>
          {children}
          <ToasterProvider />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
```

2. **Home Page (app/page.tsx)**
- Migrate `Frontend-main/src/pages/Home.jsx` to `app/page.tsx`
- Convert to TypeScript
- Use Next.js Image component for images
- Convert class names to use `cn()` utility

3. **Auth Pages (app/(auth)/login/page.tsx, app/(auth)/register/page.tsx)**
- Migrate `Frontend-main/src/pages/Auth.jsx` to separate login and register pages
- Use Next.js App Router authentication patterns
- Implement form validation with Zod or react-hook-form
- Add error handling for authentication failures

4. **Settings Page (app/dashboard/settings/page.tsx)**
- Migrate `Frontend-main/src/pages/Settings.jsx`
- Convert to TypeScript
- Integrate with Next.js App Router

**Deliverables**:
- Root layout configured
- Home page migrated
- Login and register pages migrated
- Settings page migrated

---

### Phase 4: Merchant Dashboard Migration (Week 3-4)

**Objective**: Migrate all merchant dashboard components and routes.

#### Tasks

1. **Dashboard Layout (app/(dashboard)/layout.tsx)**
```typescript
'use client';

import { authStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = authStore((state) => state.token);

  useEffect(() => {
    if (!token) {
      router.push('/login');
    }
  }, [token, router]);

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard sidebar and header */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r">
          {/* Navigation */}
        </aside>
        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
```

2. **Dashboard Landing (app/(dashboard)/page.tsx)**
- Migrate `Frontend-main/src/components/DashLanding.jsx`
- Convert to TypeScript
- Integrate with React Query for data fetching

3. **Product Management**
- Migrate `ProductList.jsx` → `app/(dashboard)/products/page.tsx`
- Migrate `AddProduct.jsx` → `app/(dashboard)/products/add/page.tsx`
- Migrate `EditProduct.jsx` → `app/(dashboard)/products/edit/[id]/page.tsx`
- Convert to TypeScript
- Use Next.js dynamic routes for edit page

4. **Category Management**
- Migrate `Categories.jsx` → `app/(dashboard)/categories/page.tsx`
- Fix `MdStore` icon issue (replace with `MdShop`)
- Convert to TypeScript

5. **Store Management**
- Migrate `ViewStore.jsx` → `app/(dashboard)/stores/page.tsx`
- Migrate `AddStore.jsx` → `app/(dashboard)/stores/add/page.tsx`
- Migrate `EditStore.jsx` → `app/(dashboard)/stores/edit/[id]/page.tsx`
- Convert to TypeScript

6. **Order Management**
- Migrate `Orders.jsx` → `app/(dashboard)/orders/page.tsx`
- Convert to TypeScript
- Implement real-time updates with polling or WebSocket

7. **Sales Analytics**
- Migrate `Sales.jsx` → `app/(dashboard)/sales/page.tsx`
- Convert Recharts to work with Next.js SSR
- Convert to TypeScript

8. **Offer Management**
- Migrate `Offers.jsx` → `app/(dashboard)/offers/page.tsx`
- Convert to TypeScript

9. **Other Components**
- Migrate `AccountDetails.jsx` → `app/(dashboard)/account/page.tsx`
- Migrate `Transaction.jsx` → `app/(dashboard)/transactions/page.tsx`
- Migrate `Support.jsx` → `app/(dashboard)/support/page.tsx`
- Migrate `Privacy.jsx` → `app/(dashboard)/privacy/page.tsx`
- Migrate `Profile.jsx` → `app/(dashboard)/profile/page.tsx`
- Migrate `Notification.jsx` → `app/(dashboard)/notifications/page.tsx`
- Migrate `Navbar.jsx` → Component in dashboard layout
- Migrate `Language.jsx` → Component in dashboard layout

**Deliverables**:
- Dashboard layout configured
- All 17 dashboard components migrated
- All dashboard routes working
- TypeScript types defined for dashboard components

---

### Phase 5: Admin Panel Migration (Week 4)

**Objective**: Migrate all admin panel components and routes.

#### Tasks

1. **Admin Layout (app/(admin)/layout.tsx)**
```typescript
'use client';

import { authStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const token = authStore((state) => state.token);
  const role = authStore((state) => state.role);

  useEffect(() => {
    if (!token || role !== 'admin') {
      router.push('/login');
    }
  }, [token, role, router]);

  if (!token || role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Admin sidebar and header */}
      <div className="flex">
        <aside className="w-64 bg-gray-800 border-r border-gray-700">
          {/* Admin navigation */}
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
```

2. **Admin Home (app/(admin)/page.tsx)**
- Migrate `AdminHome.jsx`
- Convert to TypeScript

3. **Admin Earnings (app/(admin)/earnings/page.tsx)**
- Migrate `AdminEarnings.jsx`
- Convert to TypeScript

4. **Admin Users (app/(admin)/users/page.tsx)**
- Migrate `AdminUsers.jsx`
- Convert to TypeScript

5. **Admin Stores (app/(admin)/stores/page.tsx)**
- Migrate `AdminStores.jsx`
- Convert to TypeScript

6. **Admin Templates (app/(admin)/templates/page.tsx)**
- Migrate `AdminTemplates.jsx`
- Migrate `AdminCreateTemplate.jsx` → `app/(admin)/templates/create/page.tsx`
- Convert to TypeScript

7. **Admin Products (app/(admin)/products/page.tsx)**
- Migrate `AdminProducts.jsx`
- Convert to TypeScript

8. **Admin Categories (app/(admin)/categories/page.tsx)**
- Migrate `AdminCategories.jsx`
- Fix `MdStore` icon issue (replace with `MdShop`)
- Convert to TypeScript

9. **Admin Orders (app/(admin)/orders/page.tsx)**
- Migrate `AdminOrders.jsx`
- Convert to TypeScript

10. **Admin Settings (app/(admin)/settings/page.tsx)**
- Migrate `AdminSettings.jsx`
- Convert to TypeScript

11. **Admin Dashboard (app/(admin)/dashboard/page.tsx)**
- Migrate `AdminDashboard.jsx`
- Convert to TypeScript

**Deliverables**:
- Admin layout configured
- All 11 admin components migrated
- All admin routes working
- TypeScript types defined for admin components

---

### Phase 6: Dynamic Store Routes & Template System (Week 5)

**Objective**: Migrate dynamic store routes and template system to Next.js.

#### Tasks

1. **Dynamic Store Route Structure**
```
app/
└── [storeSlug]/
    ├── layout.tsx              # Store layout (template-based)
    ├── page.tsx                # Store home (template-based)
    ├── store-products/
    │   └── page.tsx            # Product listing
    ├── product/
    │   └── [id]/
    │       └── page.tsx        # Product detail
    ├── cart/
    │   └── page.tsx            # Shopping cart
    ├── checkout/
    │   └── page.tsx            # Checkout
    ├── login/
    │   └── page.tsx            # Store-specific login
    ├── register/
    │   └── page.tsx            # Store-specific registration
    └── account/
        └── page.tsx            # Customer account
```

2. **Store Layout (app/[storeSlug]/layout.tsx)**
```typescript
import { useShopStore } from '@/stores/shopStore';
import { useEffect } from 'react';
import { notFound } from 'next/navigation';
import api from '@/lib/api';

// Server-side fetch for store data
async function getStore(storeSlug: string) {
  try {
    const response = await api.get(`/stores/slug/${storeSlug}`);
    return response.data;
  } catch (error) {
    return null;
  }
}

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeSlug: string };
}) {
  const store = await getStore(params.storeSlug);

  if (!store) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      {/* Template-based layout */}
      <StoreTemplateProvider store={store}>
        {children}
      </StoreTemplateProvider>
    </div>
  );
}
```

3. **Template Components Migration**
- Migrate `templete001/THomeOne.jsx` → `components/template/template001/Home.tsx`
- Migrate `templete001/components/Layout.jsx` → `components/template/template001/Layout.tsx`
- Migrate `templete001/components/Navbar.jsx` → `components/template/template001/Navbar.tsx`
- Migrate `templete001/components/Footer.jsx` → `components/template/template001/Footer.tsx`
- Convert to TypeScript
- Fix `MdStore` icon issue (replace with `MdShop`)

4. **Template Pages Migration**
- Migrate `templete001/pages/ProductListOne.jsx` → `app/[storeSlug]/store-products/page.tsx`
- Migrate `templete001/pages/ProductView.jsx` → `app/[storeSlug]/product/[id]/page.tsx`
- Migrate `templete001/pages/Cart.jsx` → `app/[storeSlug]/cart/page.tsx`
- Migrate `templete001/pages/Checkout.jsx` → `app/[storeSlug]/checkout/page.tsx`
- Migrate `templete001/pages/LoginTemp.jsx` → `app/[storeSlug]/login/page.tsx`
- Migrate `templete001/pages/Register.jsx` → `app/[storeSlug]/register/page.tsx`
- Migrate `templete001/pages/Account.jsx` → `app/[storeSlug]/account/page.tsx`
- Migrate `templete001/pages/ErrorPage.jsx` → `app/[storeSlug]/error.tsx`
- Migrate `templete001/pages/OrderComplete.jsx` → `app/[storeSlug]/order-complete/page.tsx`
- Convert to TypeScript

5. **Template Provider**
```typescript
// components/template/TemplateProvider.tsx
'use client';

import { useShopStore } from '@/stores/shopStore';
import { useEffect } from 'react';

export function StoreTemplateProvider({ 
  store, 
  children 
}: { 
  store: any; 
  children: React.ReactNode;
}) {
  const setStore = useShopStore((state) => state.setStore);

  useEffect(() => {
    setStore(store);
  }, [store, setStore]);

  return <>{children}</>;
}
```

6. **Dynamic Template Rendering**
```typescript
// app/[storeSlug]/page.tsx
import { notFound } from 'next/navigation';
import Template001Home from '@/components/template/template001/Home';

export default async function StoreHomePage({
  params,
}: {
  params: { storeSlug: string };
}) {
  const store = await getStore(params.storeSlug);

  if (!store) {
    notFound();
  }

  // Render based on template
  if (store.templateId?.slug === 'template-001') {
    return <Template001Home store={store} />;
  }

  // Default to template-001
  return <Template001Home store={store} />;
}
```

**Deliverables**:
- Dynamic store routes configured
- Template system migrated
- All template pages migrated
- Template provider implemented
- Dynamic template rendering working

---

### Phase 7: Internationalization (Week 5)

**Objective**: Configure i18next for Next.js.

#### Tasks

1. **Install i18next Dependencies**
```bash
npm install next-i18next react-i18next i18next
```

2. **Configure i18next**
- Create `next-i18next.config.js`
- Configure language files
- Create language switcher component

3. **Migrate Existing Translations**
- Extract translations from current implementation
- Organize into locale files

**Deliverables**:
- i18next configured for Next.js
- Language switcher component
- Translations migrated

---

### Phase 8: Testing & Optimization (Week 6)

**Objective**: Test the migrated application and optimize performance.

#### Tasks

1. **Testing**
- Test all routes
- Test authentication flow
- Test state management
- Test API calls
- Test dynamic store routes
- Test template rendering

2. **Performance Optimization**
- Implement Next.js Image component for all images
- Implement code splitting for large components
- Optimize bundle size
- Implement lazy loading for routes

3. **SEO Optimization**
- Add metadata to all pages
- Implement structured data
- Optimize page titles and descriptions

4. **Error Handling**
- Implement error boundaries
- Create custom error pages (404, 500)
- Add loading states

5. **Accessibility**
- Ensure all components are accessible
- Add ARIA labels where needed
- Test with screen readers

**Deliverables**:
- Fully tested application
- Performance optimized
- SEO optimized
- Error handling implemented
- Accessibility compliant

---

## Key Migration Challenges & Solutions

### Challenge 1: React Router to Next.js App Router

**Issue**: React Router uses client-side routing with `BrowserRouter`, while Next.js uses file-based routing.

**Solution**:
- Convert React Router `<Route>` components to Next.js file-based routes
- Use Next.js `useRouter` hook for programmatic navigation
- Use Next.js `<Link>` component for navigation links
- Implement route groups `(auth)`, `(dashboard)`, `(admin)` for layout separation

### Challenge 2: Zustand with SSR

**Issue**: Zustand state is client-side only, but Next.js renders on the server.

**Solution**:
- Wrap Zustand providers in `'use client'` directive
- Use `persist` middleware with proper storage configuration
- Handle hydration mismatch with proper initialization
- Use Next.js `useSearchParams` and `usePathname` for route-based state

### Challenge 3: Axios Interceptors with Next.js

**Issue**: Axios interceptors may not work correctly with Next.js SSR.

**Solution**:
- Create separate API client for server-side and client-side
- Use Next.js API routes for server-side API calls
- Implement proper error handling for both environments
- Use cookies for authentication on server-side

### Challenge 4: Dynamic Routes Based on Database

**Issue**: Current app generates routes dynamically based on stores from database.

**Solution**:
- Use Next.js dynamic routes `[storeSlug]`
- Fetch store data server-side in layout or page components
- Implement proper error handling for invalid store slugs
- Use `notFound()` for invalid routes

### Challenge 5: Template System

**Issue**: Template system needs to work with Next.js routing and SSR.

**Solution**:
- Create template provider component
- Implement dynamic template rendering based on store configuration
- Use Next.js Image component for template images
- Ensure templates are SSR-compatible

### Challenge 6: React Query with SSR

**Issue**: React Query needs to handle SSR properly in Next.js.

**Solution**:
- Use `HydrationBoundary` for React Query with Next.js
- Implement proper data fetching patterns
- Use Next.js built-in fetching for initial data
- Configure React Query for SSR

### Challenge 7: File Uploads

**Issue**: File uploads need to work with Next.js API routes or backend.

**Solution**:
- Keep file uploads to backend API
- Use Next.js API routes as proxy if needed
- Implement proper multipart/form-data handling
- Add progress indicators for uploads

---

## File Migration Checklist

### Core Files
- [ ] `AuthStore.js` → `stores/authStore.ts`
- [ ] `Zustand/cartStore.js` → `stores/cartStore.ts`
- [ ] `Zustand/shopStore.js` → `stores/shopStore.ts`
- [ ] `api/axiosClient.js` → `lib/api.ts`
- [ ] `api/urls.js` → `lib/urls.ts`
- [ ] `utils/logger.js` → `lib/logger.ts`
- [ ] `Router.jsx` → Next.js App Router (file-based)
- [ ] `main.jsx` → `app/layout.tsx` + `app/page.tsx`

### Public Pages
- [ ] `pages/Home.jsx` → `app/page.tsx`
- [ ] `pages/Auth.jsx` → `app/(auth)/login/page.tsx` + `app/(auth)/register/page.tsx`
- [ ] `pages/Settings.jsx` → `app/dashboard/settings/page.tsx`

### Dashboard Components
- [ ] `components/DashLanding.jsx` → `app/(dashboard)/page.tsx`
- [ ] `components/ProductList.jsx` → `app/(dashboard)/products/page.tsx`
- [ ] `components/AddProduct.jsx` → `app/(dashboard)/products/add/page.tsx`
- [ ] `components/EditProduct.jsx` → `app/(dashboard)/products/edit/[id]/page.tsx`
- [ ] `components/ViewStore.jsx` → `app/(dashboard)/stores/page.tsx`
- [ ] `components/AddStore.jsx` → `app/(dashboard)/stores/add/page.tsx`
- [ ] `components/EditStore.jsx` → `app/(dashboard)/stores/edit/[id]/page.tsx`
- [ ] `components/Orders.jsx` → `app/(dashboard)/orders/page.tsx`
- [ ] `components/Sales.jsx` → `app/(dashboard)/sales/page.tsx`
- [ ] `components/AccountDetails.jsx` → `app/(dashboard)/account/page.tsx`
- [ ] `components/Transaction.jsx` → `app/(dashboard)/transactions/page.tsx`
- [ ] `components/Support.jsx` → `app/(dashboard)/support/page.tsx`
- [ ] `components/Privacy.jsx` → `app/(dashboard)/privacy/page.tsx`
- [ ] `components/Profile.jsx` → `app/(dashboard)/profile/page.tsx`
- [ ] `components/Notification.jsx` → `app/(dashboard)/notifications/page.tsx`
- [ ] `components/Navbar.jsx` → Dashboard layout component
- [ ] `components/Language.jsx` → Dashboard layout component

### Pages (Dashboard)
- [ ] `pages/Categories.jsx` → `app/(dashboard)/categories/page.tsx`
- [ ] `pages/Offers.jsx` → `app/(dashboard)/offers/page.tsx`

### Admin Components
- [ ] `admin/AdminDashboard.jsx` → `app/(admin)/dashboard/page.tsx`
- [ ] `admin/AdminHome.jsx` → `app/(admin)/page.tsx`
- [ ] `admin/AdminEarnings.jsx` → `app/(admin)/earnings/page.tsx`
- [ ] `admin/AdminUsers.jsx` → `app/(admin)/users/page.tsx`
- [ ] `admin/AdminStores.jsx` → `app/(admin)/stores/page.tsx`
- [ ] `admin/AdminTemplates.jsx` → `app/(admin)/templates/page.tsx`
- [ ] `admin/AdminCreateTemplate.jsx` → `app/(admin)/templates/create/page.tsx`
- [ ] `admin/AdminProducts.jsx` → `app/(admin)/products/page.tsx`
- [ ] `admin/AdminCategories.jsx` → `app/(admin)/categories/page.tsx`
- [ ] `admin/AdminOrders.jsx` → `app/(admin)/orders/page.tsx`
- [ ] `admin/AdminSettings.jsx` → `app/(admin)/settings/page.tsx`

### Template System
- [ ] `templete001/THomeOne.jsx` → `components/template/template001/Home.tsx`
- [ ] `templete001/components/Layout.jsx` → `components/template/template001/Layout.tsx`
- [ ] `templete001/components/Navbar.jsx` → `components/template/template001/Navbar.tsx`
- [ ] `templete001/components/Footer.jsx` → `components/template/template001/Footer.tsx`
- [ ] `templete001/pages/ProductListOne.jsx` → `app/[storeSlug]/store-products/page.tsx`
- [ ] `templete001/pages/ProductView.jsx` → `app/[storeSlug]/product/[id]/page.tsx`
- [ ] `templete001/pages/Cart.jsx` → `app/[storeSlug]/cart/page.tsx`
- [ ] `templete001/pages/Checkout.jsx` → `app/[storeSlug]/checkout/page.tsx`
- [ ] `templete001/pages/LoginTemp.jsx` → `app/[storeSlug]/login/page.tsx`
- [ ] `templete001/pages/Register.jsx` → `app/[storeSlug]/register/page.tsx`
- [ ] `templete001/pages/Account.jsx` → `app/[storeSlug]/account/page.tsx`
- [ ] `templete001/pages/ErrorPage.jsx` → `app/[storeSlug]/error.tsx`
- [ ] `templete001/pages/OrderComplete.jsx` → `app/[storeSlug]/order-complete/page.tsx`
- [ ] `templete001/ProductCard.jsx` → `components/template/template001/ProductCard.tsx`

---

## Benefits of Migration

### Performance Improvements
- **Server-Side Rendering (SSR)**: Faster initial page loads
- **Automatic Code Splitting**: Smaller bundle sizes
- **Image Optimization**: Next.js Image component for optimized images
- **Static Generation**: Static pages can be pre-rendered
- **Edge Runtime**: Deploy to edge for global performance

### SEO Benefits
- **Server-Side Rendering**: Better SEO with server-rendered content
- **Metadata API**: Easy metadata management
- **Sitemap Generation**: Automatic sitemap generation
- **Structured Data**: Easy implementation of structured data

### Developer Experience
- **File-Based Routing**: Simpler routing structure
- **TypeScript Support**: Built-in TypeScript support
- **API Routes**: Built-in API routes for serverless functions
- **Environment Variables**: Built-in environment variable management
- **Fast Refresh**: Faster development with Fast Refresh

### Scalability
- **Serverless Deployment**: Easy deployment to Vercel, Netlify, etc.
- **Edge Functions**: Deploy to edge for global performance
- **Incremental Static Regeneration**: Update static content without rebuilding
- **Image CDN**: Built-in image CDN with Next.js Image

---

## Post-Migration Tasks

1. **Deployment**
   - Deploy to Vercel or Netlify
   - Configure environment variables
   - Set up custom domains
   - Configure CDN

2. **Monitoring**
   - Set up error tracking (Sentry)
   - Set up analytics (Google Analytics)
   - Set up performance monitoring
   - Set up uptime monitoring

3. **Documentation**
   - Update API documentation
   - Update deployment documentation
   - Create developer documentation
   - Create user documentation

4. **Training**
   - Train team on Next.js
   - Train team on TypeScript
   - Train team on new routing structure
   - Train team on new development workflow

---

## Risk Assessment

### High-Risk Items
1. **Dynamic Store Routes**: Complex routing logic that needs careful implementation
2. **State Management with SSR**: Zustand needs proper SSR handling
3. **Template System**: Needs to work with Next.js routing and SSR
4. **Authentication Flow**: Needs to work with both client and server

### Medium-Risk Items
1. **File Uploads**: May need different implementation in Next.js
2. **React Query with SSR**: Needs proper configuration
3. **Internationalization**: Needs to be reconfigured for Next.js
4. **Performance Optimization**: May require additional work

### Low-Risk Items
1. **Component Migration**: Straightforward conversion to TypeScript
2. **Styling**: TailwindCSS works the same in Next.js
3. **API Calls**: Axios works with minimal changes
4. **Utilities**: Easy to migrate to TypeScript

---

## Rollback Plan

If migration encounters critical issues:

1. **Keep Frontend-main Running**: Keep the original Vite app running as backup
2. **Feature Flags**: Implement feature flags to switch between old and new
3. **Gradual Rollout**: Migrate routes gradually rather than all at once
4. **Database Compatibility**: Ensure backend API remains compatible with both frontends

---

## Success Criteria

Migration is considered successful when:

- [ ] All routes from Frontend-main work in genmise
- [ ] All features work as expected
- [ ] Performance is improved (faster page loads, better SEO)
- [ ] TypeScript errors are resolved
- [ ] All tests pass
- [ ] Application is deployed to production
- [ ] No critical bugs in production
- [ ] Team is trained on new stack

---

## Conclusion

This migration plan provides a comprehensive roadmap for converting the frontend from React/Vite to Next.js. The phased approach ensures minimal disruption and allows for thorough testing at each stage. The migration will bring significant performance improvements, better SEO, and improved developer experience.

**Estimated Timeline**: 4-6 weeks
**Team Size**: 2-3 developers
**Risk Level**: Medium (with proper planning and testing)

**Next Steps**:
1. Review and approve this migration plan
2. Set up development environment
3. Begin Phase 1: Setup & Configuration
4. Track progress using the checklist above
