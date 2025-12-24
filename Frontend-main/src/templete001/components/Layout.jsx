import Navbar from './Navbar';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const Layout = ({ store }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar store={store} />
            <main className="flex-grow bg-white">
                <Outlet context={{ store }} />
            </main>
            <Footer store={store} />
        </div>
    );
};

export default Layout;
