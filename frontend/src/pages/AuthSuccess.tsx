import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckCircle } from 'lucide-react';

const AuthSuccess: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Authentication successful! Getting your account...');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthSuccess = async () => {
      try {
        let attempts = 0;
        const maxAttempts = 5;
        
        while (attempts < maxAttempts) {
          try {
            setMessage(`Getting account... (${attempts + 1}/${maxAttempts})`);
            
            const response = await authApi.getConnectedAccount();
            if (response.success && response.account_id) {
              setMessage('Account found! Loading your profile...');
              await login(response.account_id);
              
              setStatus('success');
              setMessage('Welcome! Redirecting to dashboard...');
              setTimeout(() => navigate('/dashboard'), 2000);
              return;
            }
          } catch (error: any) {
            console.log('Attempt', attempts + 1, 'failed:', error.response?.data?.error || error.message);
          }
          
          attempts++;
          if (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        throw new Error('Could not retrieve account. Please try connecting again.');
      } catch (error: any) {
        console.error('Auth success error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to complete authentication. Please try again.');
        setTimeout(() => navigate('/'), 5000);
      }
    };

    handleAuthSuccess();
  }, [login, navigate]);

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="card text-center">
        {status === 'loading' && (
          <>
            <LoadingSpinner size="lg" />
            <h2 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
              Setting Up Your Account
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-green-800 mb-2">
              LinkedIn Connected Successfully!
            </h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 text-2xl">✕</span>
            </div>
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Connection Failed
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => navigate('/')}
              className="btn-primary"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthSuccess; 