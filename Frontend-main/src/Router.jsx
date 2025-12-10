import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'

import EditProduct from './components/EditProduct'
import ProductList from './components/ProductList'

function Router() {
  return (
    <BrowserRouter>
    <Routes>
        
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/temp" element={<ProductList />} />
    </Routes>
    </BrowserRouter>
  )
}

export default Router