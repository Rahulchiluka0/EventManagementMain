
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-neutral">
      <Sidebar />
      <div className="lg:pl-64">
        {/* <Header /> */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
