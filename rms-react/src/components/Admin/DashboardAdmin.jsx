import React from "react";
import Sidebar from "./Sidebar";  // Sidebar qui s'affiche une seule fois
import Topbar from "./Topbar";  // Importation du Topbar
import { Outlet } from "react-router-dom";  // Pour afficher les pages enfant dynamiquement

const DashboardAdmin = () => {
  return (
    <div className="admin-container">
      <Sidebar />  {/* Le sidebar est ici et ne sera pas dupliqué */}
      <div className="admin-content">
        <Topbar />  {/* Le Topbar s'affiche ici */}
        <div className="main-content">
          <Outlet />  {/* Les sous-pages du tableau de bord s'afficheront ici */}
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
