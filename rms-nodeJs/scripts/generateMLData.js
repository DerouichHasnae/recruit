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

    // Gestion de l'export incrémental
    let lastExportDate = null;
    if (fs.existsSync(LAST_EXPORT_FILE)) {
      lastExportDate = new Date(fs.readFileSync(LAST_EXPORT_FILE, 'utf8'));
    }

    // 1. Export des offres
    const whereOffre = {
      expiration_date: { [Op.gt]: new Date() }
    };
    
    if (lastExportDate) {
      whereOffre[Op.or] = [
        { created_at: { [Op.gt]: lastExportDate } },
        { updated_at: { [Op.gt]: lastExportDate } }
      ];
    }

    const offres = await Offre.findAll({
      attributes: [
        'id', 'title', 'description', 'location', 'salary',
        [sequelize.fn('TO_CHAR', sequelize.col('publication_date'), 'YYYY-MM-DD'), 'publication_date'],
        [sequelize.fn('TO_CHAR', sequelize.col('expiration_date'), 'YYYY-MM-DD'), 'expiration_date'],
        'recruiter_id'
      ],
      where: whereOffre,
      raw: true
    });

    // 2. Export des candidats
    const whereCandidat = lastExportDate ? {
      [Op.or]: [
        { createdAt: { [Op.gt]: lastExportDate } },
        { updatedAt: { [Op.gt]: lastExportDate } }
      ]
    } : {};

    const candidats = await Candidat.findAll({
      attributes: ['id', 'skills', 'address'],
      where: whereCandidat,
      raw: true
    });

    // Mode d'écriture (nouveau fichier ou append)
    const writeMode = lastExportDate ? 'a' : 'w';
    const headerMode = lastExportDate ? false : true;

    // 3. Écriture des fichiers
    if (offres.length > 0) {
      const offresStream = fs.createWriteStream(OFFRE_PATH, {
        flags: writeMode,
        encoding: 'utf8'
      });
      
      if (headerMode) {
        offresStream.write('id,title,description,location,salary,publication_date,expiration_date,recruiter_id\n');
      }
      
      offres.forEach(o => {
        offresStream.write(`"${o.id}","${escapeCsv(o.title)}","${escapeCsv(o.description)}","${escapeCsv(o.location)}","${escapeCsv(o.salary)}","${o.publication_date}","${o.expiration_date}",${o.recruiter_id}\n`);
      });
      
      offresStream.end();
    }

    if (candidats.length > 0) {
      const candidatsStream = fs.createWriteStream(CANDIDAT_PATH, {
        flags: writeMode,
        encoding: 'utf8'
      });
      
      if (headerMode) {
        candidatsStream.write('id,skills,location\n');
      }
      
      candidats.forEach(c => {
        candidatsStream.write(`"${c.id}","${escapeCsv(c.skills || '')}","${escapeCsv(c.address || '')}"\n`);
      });
      
      candidatsStream.end();
    }

    // Mise à jour de la date du dernier export
    fs.writeFileSync(LAST_EXPORT_FILE, new Date().toISOString());

    console.log(`✅ Export ${lastExportDate ? 'incrémental' : 'complet'} réussi :
    - ${offres.length} offres mises à jour
    - ${candidats.length} candidats mis à jour`);

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
