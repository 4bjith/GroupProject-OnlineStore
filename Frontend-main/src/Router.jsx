import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import EditProduct from "./components/EditProduct";
import ProductList from "./components/ProductList";
import AddProduct from "./components/AddProduct";
import ViewStore from "./components/ViewStore";
import AddStore from "./components/AddStore";
import EditStore from "./components/EditStore";
import { ToastContainer } from "react-toastify";

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/temp" element={<ProductList />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit" element={<EditProduct />} />

          <Route path="stores" element={<ViewStore />} />
          <Route path="stores/add" element={<AddStore />} />
          <Route path="stores/edit" element={<EditStore />} />
        </Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default Router;
