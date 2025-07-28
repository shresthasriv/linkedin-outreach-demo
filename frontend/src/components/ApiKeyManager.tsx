import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

interface ApiKeyManagerProps {
  onApiKeyChange: (apiKey: string) => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      onApiKeyChange(savedApiKey);
      setIsValid(true);
    }
  }, [onApiKeyChange]);

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    
    if (value.trim()) {
      const isValidFormat = value.startsWith('sk-') && value.length > 20;
      setIsValid(isValidFormat);
      
      if (isValidFormat) {
        localStorage.setItem('openai_api_key', value);
        onApiKeyChange(value);
      } else {
        onApiKeyChange('');
      }
    } else {
      setIsValid(null);
      localStorage.removeItem('openai_api_key');
      onApiKeyChange('');
    }
  };

  const clearApiKey = () => {
    setApiKey('');
    setIsValid(null);
    localStorage.removeItem('openai_api_key');
    onApiKeyChange('');
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <div className="p-2 bg-green-600 rounded-lg">
          <Key className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">OpenAI API Key</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your OpenAI API Key
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="sk-..."
              className={`input pr-20 ${
                isValid === true 
                  ? 'border-green-300 focus:border-green-500' 
                  : isValid === false 
                    ? 'border-red-300 focus:border-red-500' 
                    : ''
              }`}
            />
            <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
              {isValid === true && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {isValid === false && (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showApiKey ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          {isValid === false && (
            <p className="mt-2 text-sm text-red-600">
              Please enter a valid OpenAI API key (starts with 'sk-')
            </p>
          )}
          
          {isValid === true && (
            <p className="mt-2 text-sm text-green-600">
              API key saved and ready to use
            </p>
          )}
        </div>

        <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          </div>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Need an OpenAI API Key?</p>
            <p className="mb-2">
              Get your API key from OpenAI to use AI message generation. Your key is stored locally and never shared.
            </p>
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Get API Key from OpenAI</span>
            </a>
          </div>
        </div>

        {apiKey && (
          <button
            onClick={clearApiKey}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            Clear API Key
          </button>
        )}
      </div>
    </div>
  );
};

export default ApiKeyManager; 