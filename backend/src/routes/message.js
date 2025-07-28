const express = require('express');
const unipileService = require('../services/unipileService');
const openaiService = require('../services/openaiService');

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { targetProfileData, senderProfileData, customPrompt, variations = 1, openaiApiKey } = req.body;
    
    if (!targetProfileData || !senderProfileData) {
      return res.status(400).json({
        success: false,
        error: 'Both target and sender profile data are required'
      });
    }

    let messages;
    if (variations > 1) {
      messages = await openaiService.generateMultipleVariations(targetProfileData, senderProfileData, variations, customPrompt, openaiApiKey);
    } else {
      const message = await openaiService.generateOutreachMessage(targetProfileData, senderProfileData, customPrompt, openaiApiKey);
      messages = [message];
    }

    res.json({
      success: true,
      messages: messages,
      target_profile_used: {
        name: targetProfileData.name,
        job_title: targetProfileData.job_title,
        company: targetProfileData.company,
        industry: targetProfileData.industry
      },
      sender_profile_used: {
        name: senderProfileData.name,
        job_title: senderProfileData.job_title,
        company: senderProfileData.company
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/send', async (req, res) => {
  try {
    const { accountId, recipientId, message } = req.body;
    
    if (!accountId || !recipientId || !message) {
      return res.status(400).json({
        success: false,
        error: 'Account ID, recipient ID, and message are required'
      });
    }

    if (message.length > 300) {
      return res.status(400).json({
        success: false,
        error: 'Message exceeds LinkedIn character limit (300 characters)'
      });
    }

    const result = await unipileService.sendMessage(accountId, recipientId, message);
    
    res.json({
      success: true,
      message_sent: true,
      message_id: result.id,
      sent_at: new Date().toISOString(),
      message_preview: message.substring(0, 50) + (message.length > 50 ? '...' : '')
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router; 