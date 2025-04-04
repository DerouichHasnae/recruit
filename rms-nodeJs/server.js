require("dotenv").config();
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const cors = require("cors");
const sequelize = require("./config/database");
const recruteurRoutes = require("./routes/recruteurRoutes");
const adminRoutes = require("./routes/adminRoutes");
const candidatRoutes = require("./routes/candiatRoutes"); // Correction du nom de fichier
const offreRoutes = require("./routes/offresRoutes"); // Ajout de la route des offres
const candiatRoutes = require("./routes/candidatureRoutes");
const recommendationsRouter = require('./routes/recommendations');
const recommendationCandidatRouter = require("./routes/recommendationCandidat");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(bodyParser.json());

// Middleware pour parser les données de formulaire
app.use(bodyParser.urlencoded({ extended: true }));

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
app.use("/candidatures", candiatRoutes);
app.use('/api/recommendations', recommendationsRouter);
app.use('/api/candidates', recommendationCandidatRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

sequelize
  .authenticate()
  .then(() => {
    console.log(" Connected to PostgreSQL");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" Unable to connect to the database:", err);
    process.exit(1);
  });
