import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";


const AdminProfile = () => {
  return (
    <div className="admin-container">

      <Sidebar />
      <div className="admin-content">
        
        <Topbar />
        <h1>Admin Profile</h1>
        <form>
          <label>Username</label>
          <input type="text" placeholder="Admin" />
          <label>Email</label>
          <input type="email" placeholder="admin@example.com" />
          <label>New Password</label>
          <input type="password" />
          <button>Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
