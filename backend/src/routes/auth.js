const express = require('express');
const unipileService = require('../services/unipileService');
const config = require('../config/config');

const router = express.Router();

router.get('/linkedin/url', async (req, res) => {
  try {
    const successRedirectUrl = `${config.frontend.url}/auth/success`;
    const failureRedirectUrl = `${config.frontend.url}/auth/error`;
    
    const oauthData = await unipileService.getOAuthUrl(successRedirectUrl, failureRedirectUrl);
    
    res.json({
      success: true,
      oauth_url: oauthData.oauth_url
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/connected-account', async (req, res) => {
  try {
    const accounts = await unipileService.listAccounts();
    
    if (accounts && accounts.length > 0) {
      const latestAccount = accounts[accounts.length - 1];
      res.json({
        success: true,
        account_id: latestAccount.id
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'No accounts found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 