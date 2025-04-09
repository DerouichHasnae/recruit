import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./DashboardRecruteur.module.css"; // Assurez-vous que ce fichier existe

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DashboardRecruteur = () => {
  // Remplacer la récupération de données par des données statiques
  const [stats, setStats] = useState({
    publishedOffers: 18,
    totalApplications: 50,
    pendingApplications: 10,
    acceptedApplications: 25,
    rejectedApplications: 5,
    recruitedCandidates: 10,
    recruitmentRate: 20, // En pourcentage
    recommendedOffers: 12,
    suggestedCandidates: 8,
    scheduledInterviews: 6,
    newCandidates: 5,
    applicationRating: 4.5,
  });

  const applicationStatusData = [
    { name: "En attente", value: stats.pendingApplications },
    { name: "Acceptées", value: stats.acceptedApplications },
    { name: "Refusées", value: stats.rejectedApplications },
  ];

  const recruitmentData = [
    { name: "Recrutés", value: stats.recruitedCandidates },
    { name: "Non recrutés", value: stats.totalApplications - stats.recruitedCandidates },
  ];

  // Mise à jour des données pour Offres publiées seulement
  const offersData = [
    { name: "Offres publiées", value: stats.publishedOffers },
  ];

  const monthlyApplicationsData = [
    { month: "Jan", count: 12 },
    { month: "Fév", count: 18 },
    { month: "Mar", count: 20 },
    { month: "Avr", count: 15 },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.title}>Tableau de bord Recruteur </h2>

      <div className={styles.chartsContainer}>
        {/* Statistiques générales */}
        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Offres d'emploi publiées</h3>
          <p>{stats.publishedOffers} offres publiées</p>
        </div>

        <div className={styles.statCard}>
          <h3 className={styles.statTitle}>Candidatures reçues</h3>
          <p>{stats.totalApplications} candidatures reçues</p>
        </div>

        {/* Graphiques */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Répartition des candidatures</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={applicationStatusData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {applicationStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Taux de recrutement</h3>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={recruitmentData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {recruitmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Applications par mois</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyApplicationsData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mise à jour de la chart pour n'afficher que les "Offres publiées" */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Offres publiées</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={offersData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardRecruteur;
