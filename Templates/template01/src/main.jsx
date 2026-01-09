import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Homepage from './homepage'
import ProductPage from './Product_Listing_Page'
import ProductDetailPage from './Product_detail_page'
import ShoppingCartPage from './Shopping_cart_page'
import OrderConfirmationPage from './order_confirmation_page'
import CheckoutPage from './checkout_page'
import WishlistPage from './wishlist'
import About from './about'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<ShoppingCartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
