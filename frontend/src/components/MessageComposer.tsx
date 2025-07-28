import React, { useState } from 'react';
import { LinkedInProfile, MessageGeneration } from '../types';
import { messageApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Zap, Send, Edit3, Copy, RefreshCw, Sparkles, PenTool } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import ApiKeyManager from './ApiKeyManager';

interface MessageComposerProps {
  targetProfile: LinkedInProfile;
  accountId: string;
  onMessageSent: () => void;
}

const MessageComposer: React.FC<MessageComposerProps> = ({ 
  targetProfile, 
  accountId, 
  onMessageSent 
}) => {
  const { profile: senderProfile } = useAuth();
  const [mode, setMode] = useState<'ai' | 'custom'>('ai');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [generatedMessages, setGeneratedMessages] = useState<MessageGeneration | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [openaiApiKey, setOpenaiApiKey] = useState('');

  const handleGenerateMessage = async (variations = 1) => {
    if (mode === 'ai' && !openaiApiKey) {
      setSendStatus({ type: 'error', message: 'Please enter your OpenAI API key first.' });
      return;
    }

    if (!senderProfile) {
      setSendStatus({ type: 'error', message: 'Sender profile not available. Please refresh the page.' });
      return;
    }

    setIsGenerating(true);
    setSendStatus(null);
    
    try {
      const targetProfileData = {
        name: targetProfile.name,
        job_title: targetProfile.job_title,
        company: targetProfile.company,
        industry: targetProfile.industry
      };

      const senderProfileData = {
        name: senderProfile.name,
        job_title: senderProfile.job_title || senderProfile.headline || 'Professional',
        company: senderProfile.company || 'Company',
        industry: senderProfile.industry || 'Industry'
      };
      
      const result = await messageApi.generateMessage(targetProfileData, senderProfileData, customPrompt, variations, openaiApiKey);
      setGeneratedMessages(result);
      setSelectedMessage(result.messages[0] || '');
    } catch (error: any) {
      setSendStatus({ 
        type: 'error', 
        message: error.message || 'Failed to generate message. Please try again.' 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendMessage = async () => {
    const messageToSend = mode === 'ai' ? selectedMessage : customMessage;
    if (!messageToSend.trim()) return;

    setIsSending(true);
    setSendStatus(null);

    try {
      const recipientId = targetProfile.provider_id || targetProfile.public_identifier || '';
      await messageApi.sendMessage(accountId, recipientId, messageToSend);
      setSendStatus({ type: 'success', message: 'Message sent successfully! 🎉' });
      
      setCustomMessage('');
      setSelectedMessage('');
      setGeneratedMessages(null);
      onMessageSent();
    } catch (error) {
      setSendStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getCurrentMessage = () => {
    return mode === 'ai' ? selectedMessage : customMessage;
  };

  const messageLength = getCurrentMessage().length;
  const isOverLimit = messageLength > 300;

  return (
    <div className="space-y-6">
      {/* API Key Manager - Only show in AI mode */}
      {mode === 'ai' && (
        <div className="slide-up">
          <ApiKeyManager onApiKeyChange={setOpenaiApiKey} />
        </div>
      )}

      {/* Mode Toggle */}
      <div className="card">
        <div className="flex items-center justify-center">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setMode('ai')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'ai'
                  ? 'bg-white text-linkedin-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>AI Generated</span>
            </button>
            <button
              onClick={() => setMode('custom')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                mode === 'custom'
                  ? 'bg-white text-linkedin-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <PenTool className="h-4 w-4" />
              <span>Write Custom</span>
            </button>
          </div>
        </div>
      </div>

      {mode === 'ai' ? (
        /* AI Generation Mode */
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center space-x-2 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">AI Message Generator</h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Instructions (Optional)
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="e.g., Mention our mutual connection, Focus on collaboration opportunities..."
                  className="input min-h-[80px] resize-none"
                  disabled={isGenerating}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleGenerateMessage(1)}
                  disabled={isGenerating || !openaiApiKey}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <LoadingSpinner size="sm" text="Generating" />
                  ) : (
                    <>
                      <Zap className="h-5 w-5 mr-2" />
                      Generate Message
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleGenerateMessage(3)}
                  disabled={isGenerating || !openaiApiKey}
                  className="btn-secondary"
                >
                  {isGenerating ? (
                    <RefreshCw className="h-5 w-5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-5 w-5" />
                  )}
                  3 Variations
                </button>
              </div>
            </div>
          </div>

          {generatedMessages && (
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-4">Generated Messages</h4>
              <div className="space-y-3">
                {generatedMessages.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedMessage === message
                        ? 'border-linkedin-500 bg-linkedin-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-gray-900 flex-1">{message}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(message);
                        }}
                        className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {message.length} characters
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Custom Message Mode */
        <div className="card">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg">
              <Edit3 className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Write Custom Message</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder={`Hi ${targetProfile.name},\n\nI hope this message finds you well. I came across your profile and was impressed by your work at ${targetProfile.company}.\n\nI'd love to connect and explore potential collaboration opportunities.\n\nBest regards`}
                className="input min-h-[120px] resize-none"
                maxLength={300}
              />
              <div className="mt-2 flex justify-between text-xs">
                <span className="text-gray-500">Write your personalized message</span>
                <span className={`${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
                  {messageLength}/300 characters
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Send Section */}
      {getCurrentMessage() && (
        <div className="card">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-gradient-to-r from-linkedin-600 to-blue-600 rounded-lg">
              <Send className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Send Message</h3>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                {targetProfile.profile_picture_url && (
                  <img
                    src={targetProfile.profile_picture_url}
                    alt={targetProfile.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">{targetProfile.name}</p>
                  <p className="text-sm text-gray-600">{targetProfile.headline}</p>
                </div>
              </div>
              <div className="p-3 bg-white rounded border">
                <p className="text-gray-900 whitespace-pre-wrap">{getCurrentMessage()}</p>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {messageLength}/300 characters
              </div>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!getCurrentMessage() || isOverLimit || isSending}
              className="btn-primary w-full flex items-center justify-center space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <LoadingSpinner size="sm" text="Sending" />
              ) : (
                <>
                  <Send className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  <span>Send Message via LinkedIn</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {sendStatus && (
        <div className={`p-6 rounded-2xl border-2 transition-all duration-300 scale-in ${
          sendStatus.type === 'success' 
            ? 'bg-green-50 text-green-800 border-green-200 shadow-glow' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          <div className="flex items-center space-x-3">
            {sendStatus.type === 'success' ? (
              <Send className="h-6 w-6 text-green-600" />
            ) : (
              <Zap className="h-6 w-6 text-red-600" />
            )}
            <span className="font-medium text-lg">{sendStatus.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageComposer; 