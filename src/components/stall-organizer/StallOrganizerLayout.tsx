
import { Outlet } from "react-router-dom";
import StallOrganizerSidebar from "./StallOrganizerSidebar";

const StallOrganizerLayout = () => {
  return (
    <div className="min-h-screen flex">
      <StallOrganizerSidebar />
      <div className="flex-1 p-8 lg:pl-72">
        <Outlet />
      </div>
    </div>
  );
};

export default StallOrganizerLayout;
