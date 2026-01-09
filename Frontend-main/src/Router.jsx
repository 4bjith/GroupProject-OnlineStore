import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";


import Categories from './pages/Categories'
import EditProduct from "./components/EditProduct";
import ProductList from "./components/ProductList";
import AddProduct from "./components/AddProduct";
import ViewStore from "./components/ViewStore";
import AddStore from "./components/AddStore";
import EditStore from "./components/EditStore";
import DashLanding from "./components/DashLanding";
import Orders from "./components/Orders";
import Sales from "./components/Sales";
import THomeOne from "./templete001/THomeOne"
import { ToastContainer } from "react-toastify";
import Settings from "./pages/Settings";
import AccountDetails from "./components/AccountDetails";
import Transaction from "./components/Transaction";
import { useQuery } from "@tanstack/react-query";
import api from "./api/axiosClient";
import { useEffect, useState } from "react";
import CreateTemplate from "./admin/CreateTemplate";
import ProductListOne from "./templete001/pages/ProductListOne";
import ProductViewOne from "./templete001/pages/ProductView";
import CartOne from "./templete001/pages/Cart";
import CheckoutOne from "./templete001/pages/Checkout";
import LoginOne from "./templete001/pages/LoginTemp";
import RegisterOne from "./templete001/pages/Register";
import Layout from "./templete001/components/Layout";
import Account from "./templete001/pages/Account";

function Router() {
  const [store, setStore] = useState(null)
  // function to fetch stores
  const { data: stores } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const response = await api.get("/stores")
      return response.data
    }

  })
  useEffect(() => {
    if (stores) {
      setStore(stores)
    }
  }, [stores])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/temp" element={<ProductList />} />
        
        <Route path="/settings" element={<Settings/>} />
        <Route path="/account/details" element={<AccountDetails />} />
        <Route path="/transaction" element={<Transaction />} />
        
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashLanding />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit" element={<EditProduct />} />

          <Route path="categories" element={<Categories />} />

          <Route path="stores" element={<ViewStore />} />
          <Route path="stores/add" element={<AddStore />} />
          <Route path="stores/edit" element={<EditStore />} />

          <Route path="orders" element={<Orders />} />
          <Route path="sales" element={<Sales />} />
        </Route>
        {
          store?.map((i) => (
            <Route key={i._id} path={`/${i.slug}`} element={<Layout store={i} />}>
              <Route index element={i?.templateId?.slug === 'template-001' ? <THomeOne /> : <THomeOne />} />
              <Route path="store-products" element={<ProductListOne storeSlug={i.slug} />} />
              <Route path="product/:id" element={<ProductViewOne storeSlug={i.slug} />} />
              <Route path="cart" element={<CartOne storeSlug={i.slug} />} />
              <Route path="checkout" element={<CheckoutOne storeSlug={i.slug} />} />
              <Route path="login" element={<LoginOne storeSlug={i.slug} />} />
              <Route path="register" element={<RegisterOne storeSlug={i.slug} />} />
              <Route path="account" element={<Account storeSlug={i.slug} />} />
            </Route>
          ))
        }
        <Route path="/adm" element={<CreateTemplate />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default Router;
