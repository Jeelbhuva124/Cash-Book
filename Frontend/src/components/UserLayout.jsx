import { Outlet } from 'react-router-dom';
import { UserNavbar } from './Header';
import { UserFooter } from './Footer';
import { ScrollToTop } from './ScrollToTop';

export const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <UserNavbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <UserFooter />
      <ScrollToTop />
    </div>
  );
};
