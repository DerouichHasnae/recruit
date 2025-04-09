import React, { useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import styles from "./TotalRegistere.module.css"; // Importer le CSS

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const TotalRegistere = () => {
  // Statistiques sur les utilisateurs
  const [userStats, setUserStats] = useState({
    totalCandidates: 500, // Candidats inscrits
    totalRecruiters: 150, // Recruteurs inscrits
    activeCandidates: 350, // Candidats actifs
    activeRecruiters: 120, // Recruteurs actifs
    inactiveUsers: 180, // Utilisateurs inactifs (candidats et recruteurs)
  });

  const userData = [
    { name: "Candidats Inscrits", value: userStats.totalCandidates },
    { name: "Recruteurs Inscrits", value: userStats.totalRecruiters },
  ];

  const activityData = [
    { name: "Candidats Actifs", value: userStats.activeCandidates },
    { name: "Recruteurs Actifs", value: userStats.activeRecruiters },
    { name: "Utilisateurs Inactifs", value: userStats.inactiveUsers },
  ];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Statistiques sur les Utilisateurs</h2>

      {/* Conteneur des cartes */}
      <div className={styles.cardContainer}>
        {/* Statistiques générales */}
        <div className={styles.statCard}>
          <h3 className={styles.cardTitle}>Nombre total d'utilisateurs</h3>
          <p><strong>Candidats Inscrits :</strong> {userStats.totalCandidates}</p>
          <p><strong>Recruteurs Inscrits :</strong> {userStats.totalRecruiters}</p>
        </div>
          {/* Statistiques détaillées par utilisateur */}
          <div className={styles.statCard}>
          <h3 className={styles.cardTitle}>Statistiques détaillées par utilisateur</h3>
          <p><strong>Candidats Actifs :</strong> {userStats.activeCandidates}</p>
          <p><strong>Recruteurs Actifs :</strong> {userStats.activeRecruiters}</p>
          <p><strong>Utilisateurs Inactifs :</strong> {userStats.inactiveUsers}</p>
        </div>

        {/* Graphique du Nombre d'Utilisateurs */}
        <div className={styles.chartCard}>
          <h3 className={styles.cardTitle}>Répartition des utilisateurs</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={userData} dataKey="value" nameKey="name" outerRadius={100} label>
                {userData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      

        {/* Graphique d'Activité des Utilisateurs */}
        <div className={styles.chartCard}>
          <h3 className={styles.cardTitle}>Activité des utilisateurs</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={activityData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TotalRegistere;
