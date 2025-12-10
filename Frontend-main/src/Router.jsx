import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

import EditProduct from './components/EditProduct'
import ProductList from './components/ProductList'
import Categories from './pages/Categories'

function Router() {
  return (
    <BrowserRouter>
    <Routes>
        
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/temp" element={<ProductList />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categories" element={<Categories/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default Router