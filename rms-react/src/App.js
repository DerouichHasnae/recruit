import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./components/Main";
//import SignUp from "./SignUp"; // For candidates
import SignUpRecruteur from "./components/auth/SignUpRecruteur"; // Updated recruiter signup import
import SignUpCandidat from "./components/auth/SignUpCandidat"; // Updated recruiter signup import
import SignUpAdmin from "./components/auth/SignUpAdmin";
import SignIn from "./components/auth/SignIn";
import ApplyForm from "./components/postulation/ApplyForm";
//import SignIn from "./components/auth/SignIn";

import JobList from "./components/jobs/JobList";

// ✅ Imports pour le tableau de bord administrateur
import DashboardAdmin from "./components/Admin/DashboardAdmin";
import Reports from "./components/Admin/Reports";
import CompanyList from "./components/Admin/CompanyList";
import UserList from "./components/Admin/UserList";
import PagesManagement from "./components/Admin/PagesManagement";
import TotalRegistere from "./components/Admin/TotalRegistere";

// ✅ Imports pour le tableau de bord candidat
import UserDashboard from "./components/Candidat/UserDashboard";
import EducationForm from "./components/Candidat/EducationForm";
import AddDetail from "./components/Candidat/AddDetail";
import ViewVacancies from "./components/Candidat/ViewVacancies";
import AppliedHistory from "./components/Candidat/AppliedHistory";
import CandidateReports from "./components/Candidat/Reports";
import SearchJobs from "./components/Candidat/SearchJob";
import EditProfile from "./components/Candidat/EditProfile";
import Competences from "./components/Candidat/Competences";
import GestionCV from "./components/Candidat/GestionCV";
import Experiences from "./components/Candidat/Experiences";
import CanProfile from "./components/Candidat/CanProfile";
import Notification from "./components/Candidat/Notification";

// ✅ Imports pour le tableau de bord recruteur
import RecruiterDashboard from "./components/Recreteur/RecruiterDashboard";
import OffresPubliees from './components/Recreteur/OffresPubliees';
import PublierOffre from './components/Recreteur/PublierOffre';
import Profile from './components/Recreteur/Profile';
import SearchCandidates from './components/Recreteur/SearchCandidates';

import "./assets/style/auth/auth.scss";

const App = () => {
  return (
    <Routes>
      {/* ✅ Page principale */}
      <Route path="/" element={<Main />} />

      {/* ✅ Authentification */}
        <Route path="/signup-recruteur" element={<SignUpRecruteur />} /> 
        <Route path="/signup-candidat" element={<SignUpCandidat />} /> 
        <Route path="/signup-admin" element={<SignUpAdmin />} />
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="/jobs" element={<JobList/>}/>



      {/* ✅ Tableau de bord administrateur avec Outlet pour une navigation fluide */}
      <Route path="/admin-dashboard" element={<DashboardAdmin />}>
        <Route index element={<h2>Bienvenue sur le tableau de bord administrateur</h2>} />
        <Route path="total-registered" element={<TotalRegistere />} />
        <Route path="company" element={<CompanyList />} />
        <Route path="total-registered-users" element={<UserList />} />
        <Route path="pages" element={<PagesManagement />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      {/* ✅ Tableau de bord candidat avec Outlet pour une navigation fluide */}
      <Route path="/candidates-dashboard" element={<UserDashboard />}>
        <Route index element={<h2>Bienvenue sur votre tableau de bord</h2>} />
        <Route path="education-form" element={<EducationForm />} />
        <Route path="add-detail" element={<AddDetail />} />
        <Route path="view-vacancies" element={<ViewVacancies />} />
        <Route path="applied-history" element={<AppliedHistory />} />
        <Route path="reports" element={<CandidateReports />} />
        <Route path="edite-profile" element={<EditProfile />} />
        <Route path="search-jobs" element={<SearchJobs />} />
        <Route path="competence" element={< Competences/>} />
        <Route path="gestion-cv" element={< GestionCV/>} />
        <Route path="experience" element={<Experiences/>} />
        <Route path="profile" element={<CanProfile/>} />
        <Route path="notification" element={<Notification/>} />
      </Route>

      {/* ✅ Formulaire de postulation (route indépendante) */}
      <Route path="/postuler/:offreId" element={<ApplyForm />} />

      {/* ✅ Tableau de bord recruteur avec Outlet pour une navigation fluide */}
      <Route path="/recruiter-dashboard" element={<RecruiterDashboard />}>
      <Route index element={<h2>Bienvenue sur le tableau de bord recruteur</h2>} />
      <Route path="/recruiter-dashboard/offres-publiées" element={<OffresPubliees />} />
      <Route path="/recruiter-dashboard/publier-offre" element={<PublierOffre />} />
      <Route path="/recruiter-dashboard/profile" element={<Profile />} />
      <Route path="/recruiter-dashboard/search-candidates" element={<SearchCandidates />} />
      </Route>
    </Routes>
  );
};

export default App;
