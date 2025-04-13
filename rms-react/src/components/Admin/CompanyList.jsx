import React from "react";

const CompanyList = () => {
  // Données par défaut
  const companies = [
    {
      id: 1,
      profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
      fullName: "John Doe",
      email: "john.doe@example.com",
      companyName: "Tech Solutions Inc.",
      companyAddress: "123 Tech Street, San Francisco, CA"
    },
    {
      id: 2,
      profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
      fullName: "Jane Smith",
      email: "jane.smith@example.com",
      companyName: "Innovate Corp",
      companyAddress: "456 Innovation Ave, New York, NY"
    },
    {
      id: 3,
      profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
      fullName: "Robert Johnson",
      email: "robert.j@example.com",
      companyName: "Digital Futures",
      companyAddress: "789 Digital Lane, Austin, TX"
    },
    {
      id: 4,
      profileImage: "https://randomuser.me/api/portraits/women/4.jpg",
      fullName: "Emily Davis",
      email: "emily.d@example.com",
      companyName: "Web Masters",
      companyAddress: "101 Web Way, Boston, MA"
    },
    {
      id: 5,
      profileImage: "https://randomuser.me/api/portraits/men/5.jpg",
      fullName: "Michael Brown",
      email: "michael.b@example.com",
      companyName: "Data Systems",
      companyAddress: "202 Data Drive, Seattle, WA"
    },
    {
      id: 6,
      profileImage: "https://randomuser.me/api/portraits/women/6.jpg",
      fullName: "Sarah Wilson",
      email: "sarah.w@example.com",
      companyName: "Cloud Networks",
      companyAddress: "303 Cloud Circle, Chicago, IL"
    },
    {
      id: 7,
      profileImage: "https://randomuser.me/api/portraits/men/7.jpg",
      fullName: "David Taylor",
      email: "david.t@example.com",
      companyName: "Mobile Tech",
      companyAddress: "404 Mobile Blvd, Los Angeles, CA"
    },
    {
      id: 8,
      profileImage: "https://randomuser.me/api/portraits/women/8.jpg",
      fullName: "Jessica Martinez",
      email: "jessica.m@example.com",
      companyName: "AI Solutions",
      companyAddress: "505 AI Avenue, Atlanta, GA"
    },
    {
      id: 9,
      profileImage: "https://randomuser.me/api/portraits/men/9.jpg",
      fullName: "Thomas Anderson",
      email: "thomas.a@example.com",
      companyName: "Cyber Security",
      companyAddress: "606 Secure Street, Washington, DC"
    },
    {
      id: 10,
      profileImage: "https://randomuser.me/api/portraits/women/10.jpg",
      fullName: "Lisa Jackson",
      email: "lisa.j@example.com",
      companyName: "Software Plus",
      companyAddress: "707 Code Road, Denver, CO"
    }
  ];

  return (
    <div className="admin-container">
      <div className="admin-content">
        <h1>les recruteurs</h1>
        <table className="company-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Company Name</th>
              <th>Company Address</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id}>
                <td>
                  <img 
                    src={company.profileImage} 
                    alt={company.fullName} 
                    className="profile-image"
                  />
                </td>
                <td>{company.fullName}</td>
                <td>{company.email}</td>
                <td>{company.companyName}</td>
                <td>{company.companyAddress}</td>
                <td className="action-buttons">
                  <button className="activate-btn">Activate</button>
                  <button className="deactivate-btn">Deactivate</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .admin-container {
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        
        .admin-content {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
        }
        
        h1 {
          color: #333;
          margin-bottom: 20px;
        }
        
        .company-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        
        .company-table th, 
        .company-table td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        
        .company-table th {
          background-color: #f5f5f5;
          font-weight: bold;
          color: #333;
        }
        
        .company-table tr:hover {
          background-color: #f9f9f9;
        }
        
        .profile-image {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        
        .activate-btn {
          background-color: #4CAF50;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .activate-btn:hover {
          background-color: #45a049;
        }
        
        .deactivate-btn {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .deactivate-btn:hover {
          background-color: #d32f2f;
        }
      `}</style>
    </div>
  );
};

export default CompanyList;