const express = require('express');
const { PythonShell } = require('python-shell');
const router = express.Router();
const path = require('path');
const { spawn } = require('child_process');

router.get('/:candidatId', (req, res) => {
  const pythonProcess = spawn('python', [
    path.join(__dirname, '../ml_engine/recommendation_engine.py'),
    '--candidatId',
    req.params.candidatId
  ]);

  let stdout = '';
  let stderr = '';

  pythonProcess.stdout.on('data', (data) => {
    stdout += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    stderr += data.toString();
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      return res.status(500).json({ error: `Script échoué (code ${code})`, stderr });
    }
    try {
      res.json(JSON.parse(stdout));
    } catch (e) {
      res.status(500).json({ error: "JSON invalide", details: stdout });
    }
  });
});

module.exports = router;