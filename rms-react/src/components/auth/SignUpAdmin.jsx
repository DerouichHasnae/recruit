import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignUpAdmin = () => {
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/admin/signup", values);
      alert(res.data.message);
      navigate("/sign-in");
    } catch (err) {
      alert(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="auth-container">
      <h2>Admin Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        <input type="tel" name="phoneNumber" placeholder="Phone Number" onChange={handleChange} required />
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/sign-in">Sign In</a></p>
    </div>
  );
};

export default SignUpAdmin;
