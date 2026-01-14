import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosClient";
import { MdPeople, MdStore, MdAttachMoney, MdBarChart } from "react-icons/md";
import authStore from "../AuthStore";

// Dashboard index showing key metrics
export default function AdminHome() {
    //-----------state variables---------
    const token = authStore(state => state.token);
    const [customers, setCustomers] = useState([])

    // Fetch active customers count
    const { data: owner, isLoading:loadingCustomers } = useQuery({
        queryKey: ["Owner"],
        queryFn: async () => {
            const res = await api.get("/getuserdetails",{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return res.data;
        },enabled: !!token
    })
    
    useEffect(()=>{
        console.log(owner?.user?.name)
        //----filter customer-----
       
    },[owner])

    

    return (
        <div className="p-6 space-y-6">
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
                    <MdPeople className="text-4xl text-blue-500" />
                    <div>
                        <p className="text-gray-600">Active Customers</p>
                        <p className="text-2xl font-semibold">
                            
                        </p>
                    </div>

                </div>
                <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
                    <MdStore className="text-4xl text-green-500" />
                    <div>
                        <p className="text-gray-600">Active Stores</p>
                        <p className="text-2xl font-semibold">
                           
                        </p>
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
                    <MdAttachMoney className="text-4xl text-amber-500" />
                    <div>
                        <p className="text-gray-600">Total Earnings</p>
                        <p className="text-2xl font-semibold">

                        </p>
                    </div>
                </div>
            </div>

            {/* Revenue chart placeholder */}
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center space-x-2 mb-2">
                    <MdBarChart className="text-2xl text-purple-500" />
                    <h2 className="text-lg font-medium">Revenue Chart</h2>
                </div>
                
            </div>
        </div>
    );
}
