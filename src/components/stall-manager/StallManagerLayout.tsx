
import { Outlet } from "react-router-dom";
import StallManagerSidebar from "./StallManagerSidebar";

const StallManagerLayout = () => {
  return (
    <div className="min-h-screen flex">
      <StallManagerSidebar />
      <div className="flex-1 p-8 lg:pl-72">
        <Outlet />
      </div>
    </div>
  );
};

export default StallManagerLayout;
