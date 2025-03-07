// middlewares/auth.js
const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const token = req.headers.authorization.split(" ")[1]; // Format : "Bearer <token>"
    if (!token) {
      return res.status(401).json({ message: "Authentification requise" });
    }

    // Vérifier le token
    const decodedToken = jwt.verify(token, "votre_clé_secrète"); // Remplacez par votre clé secrète
    req.user = decodedToken; // Ajouter les informations de l'utilisateur à la requête
    next(); // Passer au middleware suivant
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

module.exports = checkAuth;