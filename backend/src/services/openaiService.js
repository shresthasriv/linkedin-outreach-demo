const OpenAI = require('openai');
const config = require('../config/config');

class OpenAIService {
  constructor() {
  }

  createClient(apiKey = null) {
    const keyToUse = apiKey
    if (!keyToUse) {
      throw new Error('OpenAI API key is required');
    }
    
    return new OpenAI({
      apiKey: keyToUse
    });
  }

  async generateOutreachMessage(targetProfileData, senderProfileData, customPrompt = '', apiKey = null) {
    try {
      const openai = this.createClient(apiKey);
      
      const systemPrompt = `You are a professional LinkedIn outreach specialist. Generate a personalized, concise, and engaging LinkedIn message based on the provided profile information. The message should be:
- Professional yet friendly
- Maximum 300 characters (LinkedIn message limit)
- Personalized based on the target's role, company, and industry
- Written from the sender's perspective
- Include a specific call to action
- Avoid generic templates
- Never use placeholders like [Your Name] - always use the actual sender's name provided`;

      const userPrompt = `Generate a personalized LinkedIn outreach message:

SENDER (Person writing the message):
- Name: ${senderProfileData.name || 'Professional'}
- Job Title: ${senderProfileData.job_title || 'Professional'}
- Company: ${senderProfileData.company || 'Company'}

TARGET (Person receiving the message):
- Name: ${targetProfileData.name || 'Connection'}
- Job Title: ${targetProfileData.job_title || 'Professional'}
- Company: ${targetProfileData.company || 'Company'}
- Industry: ${targetProfileData.industry || 'Industry'}

${customPrompt ? `Additional context: ${customPrompt}` : ''}

Write a message FROM ${senderProfileData.name || 'the sender'} TO ${targetProfileData.name || 'the target'}. Use the sender's actual name, not placeholders. Make it professional and engaging.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 150,
        temperature: 0.7
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      if (error.message.includes('API key')) {
        throw new Error('Invalid or missing OpenAI API key. Please check your API key.');
      }
      throw new Error(`Failed to generate message: ${error.message}`);
    }
  }

  async generateMultipleVariations(targetProfileData, senderProfileData, count = 3, customPrompt = '', apiKey = null) {
    try {
      const variations = await Promise.all(
        Array(count).fill(null).map(() => this.generateOutreachMessage(targetProfileData, senderProfileData, customPrompt, apiKey))
      );
      return variations;
    } catch (error) {
      throw new Error(`Failed to generate message variations: ${error.message}`);
    }
  }
}

module.exports = new OpenAIService(); 