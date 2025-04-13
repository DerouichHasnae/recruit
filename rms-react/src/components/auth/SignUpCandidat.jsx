import React, { useState } from "react";
import "./can.css"
const SignUpCandidat = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier si les mots de passe correspondent
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Créer un FormData pour envoyer les données, y compris l'image
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phoneNumber", phoneNumber);
    formData.append("gender", gender);
    formData.append("address", address);
    formData.append("age", age);
    formData.append("password", password);

    if (profileImage) {
      formData.append("profileImage", profileImage); // Ajouter seulement si l'image est sélectionnée
    }

    try {
      const response = await fetch("http://localhost:5001/candidat/signup", { 
        method: "POST",
        body: formData, // Ne pas ajouter Content-Type pour éviter les erreurs
      });

      // Vérifier si la réponse est bien du JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server did not return JSON");
      }

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful!");
      } else {
        alert(data.message || "Signup failed, please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Something went wrong, please try again.");
    }
  };

  return (
    <div className="auth-candidate-container">
      <div className="auth-candidate-card">
        <div className="auth-candidate-header">
          <h2 className="auth-candidate-title">Candidate Sign Up</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-candidate-form">
          <div className="auth-candidate-input-group">
            <label>Full Name:</label>
            <input 
              type="text" 
              className="auth-candidate-input"
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              required 
            />
          </div>

          <div className="auth-candidate-input-group">
            <label>Email:</label>
            <input 
              type="email" 
              className="auth-candidate-input"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="auth-candidate-input-group">
            <label>Password:</label>
            <input 
              type="password" 
              className="auth-candidate-input"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <div className="auth-candidate-input-group">
            <label>Confirm Password:</label>
            <input 
              type="password" 
              className="auth-candidate-input"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>

          <div className="auth-candidate-input-group">
            <label>Phone Number:</label>
            <input 
              type="tel" 
              className="auth-candidate-input"
              value={phoneNumber} 
              onChange={(e) => setPhoneNumber(e.target.value)} 
              required 
            />
          </div>

          <div className="auth-candidate-input-group">
            <label>Gender:</label>
            <select 
              className="auth-candidate-input auth-candidate-select"
              value={gender} 
              onChange={(e) => setGender(e.target.value)} 
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="auth-candidate-input-group">
            <label>Address:</label>
            <input 
              type="text" 
              className="auth-candidate-input"
              value={address} 
              onChange={(e) => setAddress(e.target.value)} 
              required 
            />
          </div>

          <div className="auth-candidate-input-group">
            <label>Age:</label>
            <input 
              type="number" 
              className="auth-candidate-input"
              value={age} 
              onChange={(e) => setAge(e.target.value)} 
              required 
            />
          </div>

          <div className="auth-candidate-input-group full-width">
            <label>Profile Image:</label>
            <input 
              type="file" 
              className="auth-candidate-input auth-candidate-file-input"
              accept="image/*" 
              onChange={(e) => setProfileImage(e.target.files[0])} 
            />
          </div>

          <button type="submit" className="auth-candidate-submit-btn">
            Register
          </button>

          <p className="auth-candidate-login-link">
            Already have an account? <a href="/sign-in">Sign In</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpCandidat;