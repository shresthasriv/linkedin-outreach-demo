const axios = require('axios');
const FormData = require('form-data');
const config = require('../config/config');

class UnipileService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: config.unipile.apiUrl,
      timeout: 25000, // 25 seconds timeout for Unipile API calls
      headers: {
        'X-API-KEY': config.unipile.apiKey
      }
    });

    // Add response interceptor for better error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timed out. Please try again.');
        }
        throw error;
      }
    );
  }

  async getOAuthUrl(successRedirectUrl, failureRedirectUrl) {
    try {
      const expiresOn = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      
      const response = await this.apiClient.post('/hosted/accounts/link', {
        type: "create",
        providers: ["LINKEDIN"],
        api_url: config.unipile.apiUrl.replace('/api/v1', ''),
        expiresOn: expiresOn,
        success_redirect_url: successRedirectUrl,
        failure_redirect_url: failureRedirectUrl
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return {
        oauth_url: response.data.url
      };
    } catch (error) {
      throw new Error(`Failed to get OAuth URL: ${error.response?.data?.message || error.message}`);
    }
  }

  async getProfile(accountId) {
    try {
      const response = await this.apiClient.get(`/accounts/${accountId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const accountData = response.data;
      
      const connectionParams = accountData.connection_params?.im || {};
      
      return {
        name: accountData.name || connectionParams.username,
        job_title: connectionParams.headline,
        company: null,
        industry: null,
        location: null,
        profile_url: connectionParams.publicIdentifier ? `https://linkedin.com/in/${connectionParams.publicIdentifier}` : null,
        profile_picture: null,
        headline: connectionParams.headline,
        summary: null
      };
    } catch (error) {
      throw new Error(`Failed to fetch profile: ${error.response?.data?.message || error.message}`);
    }
  }

  async sendMessage(accountId, recipientId, messageText) {
    try {
      console.log('Sending message with:', { accountId, recipientId, messageText });
      
      // Try to get the LinkedIn internal ID from the provided recipientId
      let actualRecipientId = recipientId;
      
      // If recipientId looks like a username or URL, search for the user to get internal ID
      if (recipientId.includes('linkedin.com/in/') || !recipientId.startsWith('ACoAAA')) {
        try {
          let searchQuery = recipientId;
          
          // Extract username from LinkedIn URL
          if (recipientId.includes('linkedin.com/in/')) {
            const urlParts = recipientId.split('/');
            searchQuery = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
          }
          
          console.log('Searching for user:', searchQuery);
          
          // Use the users endpoint to get user by public identifier
          const response = await this.apiClient.get(`/users/${searchQuery}`, {
            params: {
              account_id: accountId
            },
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (response.data && response.data.provider_id) {
            actualRecipientId = response.data.provider_id;
            console.log('Found internal ID:', actualRecipientId);
          }
        } catch (searchError) {
          console.error('User search failed:', searchError.response?.data);
          // Continue with original recipientId if search fails
        }
      }
      
      const formData = new FormData();
      formData.append('account_id', accountId);
      formData.append('text', messageText);
      formData.append('attendees_ids', actualRecipientId);
      formData.append('linkedin[api]', 'classic');
      
      const response = await this.apiClient.post('/chats', formData, {
        headers: {
          ...formData.getHeaders(),
          'X-API-KEY': this.apiClient.defaults.headers['X-API-KEY']
        }
      });
      return response.data;
    } catch (error) {
      console.error('Unipile API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(`Failed to send message: ${error.response?.data?.message || error.message}`);
    }
  }

  async listAccounts() {
    try {
      const response = await this.apiClient.get('/accounts', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data.items || response.data;
    } catch (error) {
      throw new Error(`Failed to list accounts: ${error.response?.data?.message || error.message}`);
    }
  }

  async getUserProfile(identifier, accountId) {
    try {
      console.log('Fetching profile for:', identifier);
      
      let searchQuery = identifier;
      if (identifier.includes('linkedin.com/in/')) {
        const urlParts = identifier.split('/');
        searchQuery = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2];
      }
      
      const response = await this.apiClient.get(`/users/${searchQuery}`, {
        params: {
          account_id: accountId
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const profileData = response.data;
      
      return {
        provider_id: profileData.provider_id,
        public_identifier: profileData.public_identifier,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
        headline: profileData.headline,
        summary: profileData.summary,
        location: profileData.location,
        profile_picture_url: profileData.profile_picture_url,
        profile_picture_url_large: profileData.profile_picture_url_large,
        company: profileData.work_experience?.[0]?.company || 'Not specified',
        job_title: profileData.work_experience?.[0]?.position || profileData.headline || 'Not specified',
        industry: profileData.work_experience?.[0]?.skills?.join(', ') || 'Not specified',
        work_experience: profileData.work_experience,
        education: profileData.education,
        skills: profileData.skills,
        connections_count: profileData.connections_count,
        public_profile_url: profileData.public_profile_url
      };
    } catch (error) {
      console.error('Failed to fetch user profile:', error.response?.data);
      throw new Error(`Failed to fetch user profile: ${error.response?.data?.message || error.message}`);
    }
  }
}

module.exports = new UnipileService(); 