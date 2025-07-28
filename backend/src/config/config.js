require('dotenv').config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  unipile: {
    apiKey: process.env.UNIPILE_API_KEY,
    apiUrl: process.env.UNIPILE_API_URL || 'https://api.unipile.com/v1'
  },
  
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000'
  },

  backend: {
    url: process.env.BACKEND_URL || 'http://localhost:5000'
  },
  
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  }
};

// Validate critical environment variables
if (!config.unipile.apiKey) {
  console.error('❌ UNIPILE_API_KEY is not set in environment variables');
}

console.log('🔧 Configuration loaded:');
console.log(`   Port: ${config.port}`);
console.log(`   Environment: ${config.nodeEnv}`);
console.log(`   Unipile API URL: ${config.unipile.apiUrl}`);
console.log(`   Unipile API Key: ${config.unipile.apiKey ? '✅ Set' : '❌ Missing'}`);
console.log(`   Frontend URL: ${config.frontend.url}`);
console.log(`   Backend URL: ${config.backend.url}`);

module.exports = config; 