const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

router.get('/:candidatId', async (req, res) => {
  console.log(`Fetching recommendations for candidate ${req.params.candidatId}`);
  
  try {
    const pythonProcess = spawn('python', [
      path.join(__dirname, '../ml_engine/recommendation_engine.py'),
      '--candidat',
      req.params.candidatId
    ], {
      env: { 
        ...process.env,
        PYTHONUNBUFFERED: '1',
        PYTHONIOENCODING: 'utf-8'
      }
    });

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      const text = data.toString();
      // On capture tout le stdout mais on ne gardera que la dernière ligne (le JSON)
      stdout += text;
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
      console.error('Python stderr:', data.toString());
    });

    const exitCode = await new Promise((resolve, reject) => {
      pythonProcess.on('close', resolve);
      pythonProcess.on('error', reject);
    });

    if (exitCode !== 0) {
      console.error('Python script failed:', stderr);
      return res.status(500).json({ 
        error: 'Recommendation service failed',
        details: stderr.trim() || 'Unknown error'
      });
    }
    
    // Extraire uniquement la ligne JSON (dernière ligne)
    const jsonLine = stdout.trim().split('\n').pop();
    
    try {
      const result = JSON.parse(jsonLine);
      
      // Renvoyer directement le tableau des recommandations + infos candidat
      return res.json({
        success: true,
        recommendations: result.recommendations || [],
        candidatInfo: result.candidat_info || null
      });
      
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw output:', stdout);
      return res.status(500).json({ 
        error: 'Invalid recommendation output',
        details: process.env.NODE_ENV === 'development' ? parseError.message : undefined
      });
    }
  } catch (error) {
    console.error('Recommendation process failed:', error);
    return res.status(500).json({ 
      error: 'Recommendation service unavailable',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
module.exports = router;