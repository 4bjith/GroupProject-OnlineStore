import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function Router() {
  return (
    <BrowserRouter>
    <Routes>
        
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
    </BrowserRouter>
  )
}

export default Router