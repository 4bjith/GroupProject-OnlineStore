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
import { useQuery } from "@tanstack/react-query";
import api from "./api/axiosClient";
import { useEffect } from "react";
import CreateTemplate from "./admin/CreateTemplate";

function Router() {

  // function to fetch stores
  const {data:stores} = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const response = await api.get("/stores")
      return response.data
    }

  })
  useEffect(()=>{
    if (stores){
      console.log(stores)
    }
  },[stores])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/temp" element={<ProductList />} />

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
          stores?.map((i)=>(
            <Route path={`/${i.slug}`} element={<THomeOne />}>
              
            </Route>
          ))
        }
        <Route path="/adm" element={<CreateTemplate/>}/>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default Router;
