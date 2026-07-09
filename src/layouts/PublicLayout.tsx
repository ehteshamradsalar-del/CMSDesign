import { Outlet } from 'react-router-dom';
import Header from '../components/navigation/Header';

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-ink-50">
      <Header />
      <Outlet />
      {/* Footer can go here once built */}
    </div>
  );
}