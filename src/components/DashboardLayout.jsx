import DashboardSidebar from "./DashboardSidebar";
import "./dashboardLayout.css";

function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <DashboardSidebar />
      <main className="dashboard-content">{children}</main>
    </div>
  );
}

export default DashboardLayout;
