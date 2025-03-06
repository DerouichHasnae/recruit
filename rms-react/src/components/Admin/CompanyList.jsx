import React from "react";



const CompanyList = () => {
  return (
    <div className="admin-container">
      
      <div className="admin-content">
        
        <h1>Registered Companies</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Company Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Google</td>
              <td>google@example.com</td>
              <td><button>View</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyList;
