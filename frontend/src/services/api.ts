import axios from 'axios';
import {
  LinkedInProfile,
  OAuthResponse,
  MessageGeneration,
  MessageSendResponse
} from '../types';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

// Separate instance for longer operations like sending messages
const longRunningApi = axios.create({
  baseURL: '/api',
  timeout: 30000, // 30 seconds for message sending
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.error || error.message);
    return Promise.reject(error);
  }
);

longRunningApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.error || error.message);
    return Promise.reject(error);
  }
);

export const authApi = {
  getLinkedInOAuthUrl: async (): Promise<OAuthResponse> => {
    const response = await api.get('/auth/linkedin/url');
    return response.data;
  },

  getConnectedAccount: async () => {
    const response = await api.get('/auth/connected-account');
    return response.data;
  }
};

export const profileApi = {
  getProfile: async (accountId: string): Promise<{ profile: LinkedInProfile }> => {
    const response = await api.get(`/profile/me/${accountId}`);
    return response.data;
  },

  fetchProfile: async (profileUrl: string, accountId: string): Promise<{ profile: LinkedInProfile }> => {
    const response = await api.post('/profile/fetch', {
      profileUrl,
      accountId
    });
    return response.data;
  }
};

export const messageApi = {
  generateMessage: async (
    targetProfileData: LinkedInProfile,
    senderProfileData: LinkedInProfile,
    customPrompt = '',
    variations = 1,
    openaiApiKey?: string
  ): Promise<MessageGeneration> => {
    const response = await api.post('/message/generate', {
      targetProfileData,
      senderProfileData,
      customPrompt,
      variations,
      openaiApiKey
    });
    return response.data;
  },

  sendMessage: async (
    accountId: string,
    recipientId: string,
    message: string
  ): Promise<MessageSendResponse> => {
    const response = await longRunningApi.post('/message/send', {
      accountId,
      recipientId,
      message
    });
    return response.data;
  }
};

export default api; 