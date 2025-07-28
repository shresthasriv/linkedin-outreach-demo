import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LinkedInProfile } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ProfileCard from '../components/ProfileCard';
import ProfileFetcher from '../components/ProfileFetcher';
import MessageComposer from '../components/MessageComposer';
import { User, Zap, Send, CheckCircle, Target, MessageSquare } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { profile, accountId } = useAuth();
  const [targetProfile, setTargetProfile] = useState<LinkedInProfile | null>(null);
  const [step, setStep] = useState<'fetch' | 'compose'>('fetch');

  const handleProfileFetched = (fetchedProfile: LinkedInProfile) => {
    setTargetProfile(fetchedProfile);
    setStep('compose');
  };

  const handleMessageSent = () => {
    setTargetProfile(null);
    setStep('fetch');
  };

  const handleStartOver = () => {
    setTargetProfile(null);
    setStep('fetch');
  };

  if (!profile || !accountId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center fade-in">
          <LoadingSpinner size="xl" text="Loading your profile" variant="dots" />
          <p className="mt-6 text-gray-500">Setting up your AI-powered workspace...</p>
        </div>
      </div>
    );
  }

  const stepProgress = [
    { id: 'fetch', name: 'Fetch Profile', icon: Target, completed: !!targetProfile },
    { id: 'compose', name: 'Compose Message', icon: MessageSquare, completed: false }
  ];

  return (
    <div className="space-y-8 fade-in">
      {/* Welcome Header */}
      <div className="text-center space-y-4 py-8">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full text-sm font-medium text-green-800 mb-4 border border-green-200 bounce-in">
          <CheckCircle className="h-4 w-4" />
          <span>LinkedIn Connected Successfully</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 slide-up">
          AI-Powered LinkedIn Outreach
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto slide-up" style={{ animationDelay: '0.2s' }}>
          Fetch any LinkedIn profile and generate personalized messages with AI
        </p>
      </div>

      {/* Progress Steps */}
      <div className="max-w-2xl mx-auto">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-center space-x-8">
            {stepProgress.map((stepItem, stepIdx) => (
              <li key={stepItem.id} className="flex items-center">
                <div className={`flex items-center space-x-3 ${stepIdx !== stepProgress.length - 1 ? 'pr-8' : ''}`}>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    stepItem.completed 
                      ? 'border-green-500 bg-green-500' 
                      : step === stepItem.id 
                        ? 'border-linkedin-500 bg-linkedin-500' 
                        : 'border-gray-300 bg-white'
                  }`}>
                    <stepItem.icon className={`h-5 w-5 ${
                      stepItem.completed || step === stepItem.id ? 'text-white' : 'text-gray-400'
                    }`} />
                  </div>
                  <span className={`text-sm font-medium ${
                    stepItem.completed 
                      ? 'text-green-600' 
                      : step === stepItem.id 
                        ? 'text-linkedin-600' 
                        : 'text-gray-500'
                  }`}>
                    {stepItem.name}
                  </span>
                </div>
                {stepIdx !== stepProgress.length - 1 && (
                  <div className={`h-0.5 w-8 ${stepItem.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Your Profile Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="slide-in-right">
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-5 w-5 text-linkedin-600" />
                <h3 className="font-semibold text-gray-900">Your Profile</h3>
              </div>
              <ProfileCard profile={profile} />
            </div>
          </div>

          {/* Target Profile Summary */}
          {targetProfile && (
            <div className="card slide-in-right" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center space-x-2 mb-4">
                <Target className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">Target Contact</h3>
              </div>
              <div className="flex items-start space-x-3">
                {targetProfile.profile_picture_url && (
                  <img
                    src={targetProfile.profile_picture_url}
                    alt={targetProfile.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{targetProfile.name}</h4>
                  <p className="text-sm text-gray-600">{targetProfile.headline}</p>
                  <p className="text-xs text-gray-500">{targetProfile.company}</p>
                </div>
              </div>
              <button
                onClick={handleStartOver}
                className="mt-3 text-sm text-linkedin-600 hover:text-linkedin-700 underline"
              >
                Change Target
              </button>
            </div>
          )}
        </div>

        {/* Main Workspace */}
        <div className="lg:col-span-3">
          {step === 'fetch' ? (
            <div className="slide-up">
              <ProfileFetcher
                accountId={accountId}
                onProfileFetched={handleProfileFetched}
              />
            </div>
          ) : targetProfile ? (
            <div className="slide-up">
              <MessageComposer
                targetProfile={targetProfile}
                accountId={accountId}
                onMessageSent={handleMessageSent}
              />
            </div>
          ) : null}
        </div>
      </div>

      {/* Feature Highlights */}
      <section className="grid md:grid-cols-3 gap-6 pt-8 slide-up" style={{ animationDelay: '0.5s' }}>
        <div className="card-interactive text-center group">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-linkedin-600 rounded-2xl inline-flex mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Target className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-linkedin-600 transition-colors duration-200">
            Profile Fetching
          </h3>
          <p className="text-sm text-gray-600">
            Fetch detailed LinkedIn profiles with work experience, education, and skills
          </p>
        </div>
        
        <div className="card-interactive text-center group">
          <div className="p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl inline-flex mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-linkedin-600 transition-colors duration-200">
            AI Message Generation
          </h3>
          <p className="text-sm text-gray-600">
            Generate personalized outreach messages using advanced AI technology
          </p>
        </div>
        
        <div className="card-interactive text-center group">
          <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl inline-flex mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <Send className="h-8 w-8 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-linkedin-600 transition-colors duration-200">
            Direct Messaging
          </h3>
          <p className="text-sm text-gray-600">
            Send AI-generated or custom messages directly through LinkedIn
          </p>
        </div>
      </section>
    </div>
  );
};

export default Dashboard; 