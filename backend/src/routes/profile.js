const express = require('express');
const unipileService = require('../services/unipileService');

const router = express.Router();

router.get('/me/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    const profile = await unipileService.getProfile(accountId);
    
    res.json({
      success: true,
      profile: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/fetch', async (req, res) => {
  try {
    const { profileUrl, accountId } = req.body;
    
    if (!profileUrl || !accountId) {
      return res.status(400).json({
        success: false,
        error: 'Profile URL and account ID are required'
      });
    }

    const profile = await unipileService.getUserProfile(profileUrl, accountId);
    
    res.json({
      success: true,
      profile: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 