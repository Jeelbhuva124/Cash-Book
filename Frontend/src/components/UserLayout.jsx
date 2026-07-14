import { Outlet } from 'react-router-dom';
import { UserNavbar } from './Header';
import { UserFooter } from './Footer';

export const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <UserNavbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <UserFooter />
    </div>
  );
};
