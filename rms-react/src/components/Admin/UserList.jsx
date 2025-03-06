import React from "react";



const UserList = () => {
  return (
    <div className="admin-container">
    
      <div className="admin-content">
        
        <h1>Registered Users</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>John Doe</td>
              <td>john@example.com</td>
              <td><button>View</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
