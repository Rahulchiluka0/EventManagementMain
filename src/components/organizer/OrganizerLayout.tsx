
import { Outlet } from "react-router-dom";
import OrganizerHeader from "./OrganizerHeader";
import OrganizerSidebar from "./OrganizerSidebar";

const OrganizerLayout = () => {
  return (
    <div className="min-h-screen bg-neutral">
      <OrganizerSidebar />
      <div className="lg:pl-64">
        <OrganizerHeader />
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OrganizerLayout;
