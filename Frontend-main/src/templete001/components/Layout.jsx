import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import useShopStore from '../../Zustand/shopStore';
import { useEffect } from 'react';

const Layout = ({ store }) => {
    const setStore = useShopStore((state) => state.setStore);

    useEffect(() => {
        setStore(store);
    }, [store, setStore]);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar store={store} />
            <main className="flex-grow bg-white">
                <Outlet />
            </main>
            <Footer store={store} />
        </div>
    );
};

export default Layout;
