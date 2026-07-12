import { Outlet } from 'react-router-dom';
import Header from '../components/navigation/Header';
import Footer from '../components/navigation/Footer';

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-ink-50">
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}