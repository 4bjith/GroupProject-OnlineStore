import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";


import Categories from './pages/Categories'
import EditProduct from "./components/EditProduct";
import ProductList from "./components/ProductList";
import AddProduct from "./components/AddProduct";
import { ToastContainer } from "react-toastify";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/temp" element={<ProductList />} />
        <Route path="/categories" element={<Categories/>} />
    </Routes>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit" element={<EditProduct />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default Router;
