const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { Candidat, Offre } = require('../models');

// Configuration
const DATA_DIR = path.join(__dirname, '..', 'ml_engine', 'data');
const OFFRE_PATH = path.join(DATA_DIR, 'offres.csv');
const CANDIDAT_PATH = path.join(DATA_DIR, 'candidats.csv');
const LAST_EXPORT_FILE = path.join(DATA_DIR, '.last_export');

async function exportData() {
  try {
    await sequelize.authenticate();
    
    // Créer le dossier si inexistant
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // 1. Export des offres
    const offres = await Offre.findAll({
      attributes: [
        'id', 'title', 'description', 'location', 'salary',
        [sequelize.fn('TO_CHAR', sequelize.col('publication_date'), 'YYYY-MM-DD'), 'publication_date'],
        [sequelize.fn('TO_CHAR', sequelize.col('expiration_date'), 'YYYY-MM-DD'), 'expiration_date'],
        'recruiter_id', 'created_at', 'updated_at'
      ],
      raw: true
    });

    // 2. Export des candidats
    const candidats = await Candidat.findAll({
      attributes: [
        'id', 'fullName', 'email', 'phoneNumber', 'gender', 'address', 'age', 
        'password', 'profileImage', 'skills', 'createdAt', 'updatedAt'
      ],
      raw: true
    });

    // Mode d'écriture (écrire depuis le début)
    const writeMode = 'w';
    const headerMode = true;

    // 3. Écriture des fichiers
    if (offres.length > 0) {
      const offresStream = fs.createWriteStream(OFFRE_PATH, {
        flags: writeMode,
        encoding: 'utf8'
      });
      
      if (headerMode) {
        offresStream.write('id,title,description,location,salary,publication_date,expiration_date,recruiter_id,created_at,updated_at\n');
      }
      
      offres.forEach(o => {
        offresStream.write(`"${o.id}","${escapeCsv(o.title)}","${escapeCsv(o.description)}","${escapeCsv(o.location)}","${escapeCsv(o.salary)}","${o.publication_date}","${o.expiration_date}",${o.recruiter_id},"${o.created_at}","${o.updated_at}"\n`);
      });
      
      offresStream.end();
    }

    if (candidats.length > 0) {
      const candidatsStream = fs.createWriteStream(CANDIDAT_PATH, {
        flags: writeMode,
        encoding: 'utf8'
      });
      
      if (headerMode) {
        candidatsStream.write('id,fullName,email,phoneNumber,gender,address,age,password,profileImage,skills,createdAt,updatedAt\n');
      }
      
      candidats.forEach(c => {
        candidatsStream.write(`"${c.id}","${escapeCsv(c.fullName)}","${escapeCsv(c.email)}","${escapeCsv(c.phoneNumber)}","${escapeCsv(c.gender)}","${escapeCsv(c.address)}",${c.age},"${escapeCsv(c.password)}","${escapeCsv(c.profileImage)}","${escapeCsv(c.skills)}","${c.createdAt}","${c.updatedAt}"\n`);
      });
      
      candidatsStream.end();
    }

    // Mise à jour de la date du dernier export
    fs.writeFileSync(LAST_EXPORT_FILE, new Date().toISOString());

    console.log(`✅ Export complet réussi :
    - ${offres.length} offres exportées
    - ${candidats.length} candidats exportés`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'export :', error);
    process.exit(1);
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
  }
}

function escapeCsv(str) {
  return String(str || '')
    .replace(/"/g, '""')
    .replace(/\r?\n/g, ' ')
    .trim();
}

// Exécution
exportData();
