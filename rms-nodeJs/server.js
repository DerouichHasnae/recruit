require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const recruteurRoutes = require("./routes/recruteurRoutes");
const adminRoutes = require("./routes/adminRoutes");
const candidatRoutes = require("./routes/candiatRoutes"); // Correction du nom de fichier
const offreRoutes = require("./routes/offresRoutes"); // Ajout de la route des offres
const competenceRoutes = require("./routes/competenceRoutes"); 

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));

// Routes
app.use("/admin", adminRoutes);
app.use("/candidat", candidatRoutes);
app.use("/recruteur", recruteurRoutes);
app.use("/offre", offreRoutes); 
app.use("/competences", competenceRoutes); 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

sequelize.sync()
  .then(() => {
    console.log('Les tables ont été synchronisées');
  })
  .catch((error) => {
    console.error('Erreur lors de la synchronisation des tables', error);
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL");
    await sequelize.sync();
    console.log("✅ Database synchronized");
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
});
