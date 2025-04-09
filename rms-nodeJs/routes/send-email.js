// routes/send-email.js
const express = require('express');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

router.post('/', async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    await sendEmail({ to, subject, text });
    res.status(200).send('Email envoyé avec succès');
  } catch (error) {
    res.status(500).send('Erreur lors de l\'envoi de l\'email');
  }
});

module.exports = router;
