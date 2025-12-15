import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosClient";
import authStore from "../AuthStore";

function Profile() {

    const token = authStore((state) => state.token)
    // console.log(token)

    const { data, isloading, error } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const res = await api.get("/getuserdetails", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            return res.data;
        }
    })
    // console.log(data)
    
    if (isloading) {
        return <div>Loading...</div>
    }
    if (error) {
        return <div>Error:{error.message}</div>
    }
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            <h1 className="text-3xl font-semibold p-4 text-center">Personalisation</h1>
            <div className="flex flex-col gap-5">
                <p className="text-xl font-semibold">Name:{data?.user?.name}</p>
                <p className="text-xl font-semibold">Email:{data?.user?.email}</p>
                <p className="text-xl font-semibold">Number:{data?.user?.number}</p>
                <p className="text-xl font-semibold">ProfilePic:{data?.user?.profilepic}</p>
            </div>
        </div>
    );
}

export default Profile;