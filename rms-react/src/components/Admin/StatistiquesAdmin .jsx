import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import styles from "./StatistiquesAdmin.module.css"; // Assurez-vous d'ajouter le fichier CSS

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const StatistiquesAdmin = () => {
  // Statistiques sur les candidatures, offres et entretiens
  const [stats, setStats] = useState({
    submittedApplications: 120,
    acceptedApplications: 80,
    pendingApplications: 30,
    rejectedApplications: 10,
    publishedOffers: 60,
    offersWithApplications: 45,
    scheduledInterviews: 25,
  });

  const applicationStatusData = [
    { name: "Acceptées", value: stats.acceptedApplications },
    { name: "En Attente", value: stats.pendingApplications },
    { name: "Refusées", value: stats.rejectedApplications },
  ];

  const offerData = [
    { name: "Offres Publiées", value: stats.publishedOffers },
    { name: "Offres avec Candidatures", value: stats.offersWithApplications },
  ];

  const interviewData = [
    { name: "Entretiens Programmés", value: stats.scheduledInterviews },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.title}>Tableau de Bord Administrateur</h2>

      <div className={styles.chartsContainer}>
        {/* Candidatures soumises */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Statistiques Candidatures</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={applicationStatusData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {applicationStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Offres publiées */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Statistiques Offres</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={offerData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Entretiens programmés */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Statistiques Entretiens</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={interviewData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatistiquesAdmin;
