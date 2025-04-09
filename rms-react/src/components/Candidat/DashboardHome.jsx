import React, { useState } from "react";
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
import styles from "./DashboardHome.module.css"; // Assurez-vous que ce fichier existe

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DashboardHome = () => {
  const [stats] = useState({
    // Données statiques pour le candidat
    totalCandidatures: 10,
    monthlyCandidatures: [
      { month: "Jan", count: 2 },
      { month: "Feb", count: 4 },
      { month: "Mar", count: 1 },
      { month: "Apr", count: 0 },
      { month: "May", count: 0 },
      { month: "Jun", count: 0 },
      { month: "Jul", count: 0 },
      { month: "Aug", count: 0 },
      { month: "Sep", count: 0 },
      { month: "Oct", count: 0 },
      { month: "Nov", count: 0 },
      { month: "Dec", count: 0 },
    ],
    statusCandidatures: [
      { name: "Acceptée", value: 5 },
      { name: "En attente", value: 3 },
      { name: "Refusée", value: 2 },
    ],
    offresRecommandees: 8,
    nouveauxProfilsOffres: 5,
  });

  const { totalCandidatures, monthlyCandidatures, statusCandidatures, offresRecommandees, nouveauxProfilsOffres } = stats;

  return (
    <div className={styles.dashboardContainer}>
      <h2 className={styles.title}>Statistiques Candidat 📊</h2>

      <div className={styles.chartsContainer}>
        {/* Candidatures Soumises */}
        <div className={styles.chartCard}>
          <div className={styles.textSection}>
            <h3 className={styles.chartTitle}>Candidatures Soumises</h3>
            <p>{totalCandidatures} candidatures soumises</p>
          </div>
        </div>
        <div className={styles.chartCard}>
          <div className={styles.textSection}>
            <h3 className={styles.chartTitle}>Offres Recommandées</h3>
            <p>{offresRecommandees} offres recommandées</p>
          </div>
        </div>
        {/* Bar Chart pour Candidatures par mois */}
        <div className={styles.chartCard}>
          <div className={styles.textSection}>
            <h3 className={styles.chartTitle}>Candidatures par mois</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyCandidatures}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart pour Répartition des Candidatures */}
        <div className={styles.chartCard}>
          <div className={styles.textSection}>
            <h3 className={styles.chartTitle}>Répartition des candidatures</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusCandidatures}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {statusCandidatures.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Offres Recommandées */}
       

        {/* Nouveaux Profils d'Offres */}
        
      </div>
    </div>
  );
};

export default DashboardHome;
