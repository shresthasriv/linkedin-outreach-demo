import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Linkedin, MessageSquare, Zap, Users, ArrowRight, CheckCircle, Sparkles, Target, Shield } from 'lucide-react';

const Home: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLinkedInConnect = async () => {
    setLoading(true);
    try {
      const response = await authApi.getLinkedInOAuthUrl();
      window.location.href = response.oauth_url;
    } catch (error) {
      console.error('Failed to get OAuth URL:', error);
      setLoading(false);
    }
  };

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const features = [
    {
      icon: Linkedin,
      title: 'LinkedIn Integration',
      description: 'Securely connect your LinkedIn account via Unipile API with OAuth 2.0',
      color: 'from-blue-500 to-linkedin-600'
    },
    {
      icon: Zap,
      title: 'AI-Powered Messages',
      description: 'Generate personalized outreach messages using advanced OpenAI technology',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Target,
      title: 'Smart Targeting',
      description: 'Send tailored messages based on comprehensive profile data analysis',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Users,
      title: 'Profile Analysis',
      description: 'Deep insights into LinkedIn profiles for enhanced networking success',
      color: 'from-purple-500 to-indigo-600'
    }
  ];

  const stats = [
    { label: 'Response Rate', value: '89%', icon: '📈' },
    { label: 'Time Saved', value: '5x', icon: '⏱️' },
    { label: 'Success Rate', value: '94%', icon: '🎯' },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative py-20 text-center fade-in">
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <Linkedin className="h-96 w-96 text-linkedin-600" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-linkedin-100 to-blue-100 px-4 py-2 rounded-full text-sm font-medium text-linkedin-800 mb-8 border border-linkedin-200 bounce-in">
            <Sparkles className="h-4 w-4" />
            <span>Powered by OpenAI & Unipile API</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight slide-up">
            Transform Your
            <span className="block gradient-text">LinkedIn Outreach</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed slide-up" style={{ animationDelay: '0.2s' }}>
            Harness the power of AI to create personalized, engaging LinkedIn messages that drive meaningful connections and business growth.
          </p>
          
          <div className="slide-up" style={{ animationDelay: '0.4s' }}>
            <button
              onClick={handleLinkedInConnect}
              disabled={loading}
              className="btn-primary text-xl px-10 py-5 inline-flex items-center space-x-3 mx-auto shadow-2xl hover:shadow-glow-lg group"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Linkedin className="h-7 w-7 group-hover:scale-110 transition-transform duration-200" />
                  <span>Start Your AI Journey</span>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
            
            <p className="text-sm text-gray-500 mt-4">
              Free to start • No credit card required • 5-minute setup
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="slide-up">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center card-interactive group">
              <div className="text-4xl mb-3">{stat.icon}</div>
              <div className="text-3xl font-bold gradient-text mb-2 group-hover:scale-110 transition-transform duration-200">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="slide-up">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the perfect blend of AI intelligence and professional networking
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group card-interactive relative overflow-hidden" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-linkedin-600 transition-colors duration-200">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="glass-card max-w-6xl mx-auto slide-up">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Three Simple Steps to Success
          </h2>
          <p className="text-xl text-gray-600">
            Get started in minutes and see results immediately
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              step: '1',
              title: 'Secure Authentication',
              description: 'Connect your LinkedIn account safely using industry-standard OAuth 2.0 encryption',
              icon: Shield,
              color: 'from-green-500 to-emerald-600'
            },
            {
              step: '2',
              title: 'AI Magic Happens',
              description: 'Our advanced AI analyzes profiles and generates compelling, personalized messages',
              icon: Sparkles,
              color: 'from-purple-500 to-indigo-600'
            },
            {
              step: '3',
              title: 'Send & Succeed',
              description: 'Deploy your messages directly through LinkedIn and watch your network grow',
              icon: Target,
              color: 'from-blue-500 to-linkedin-600'
            }
          ].map((step, index) => (
            <div key={index} className="text-center group" style={{ animationDelay: `${index * 0.2}s` }}>
              <div className="relative mb-8">
                <div className={`w-20 h-20 bg-gradient-to-br ${step.color} text-white rounded-3xl flex items-center justify-center text-2xl font-bold mx-auto shadow-2xl group-hover:shadow-glow-lg transition-all duration-300 group-hover:scale-110`}>
                  {step.step}
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-linkedin-600 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 -z-10"></div>
              </div>
              
              <div className="mb-4">
                <step.icon className="h-12 w-12 mx-auto text-gray-400 group-hover:text-linkedin-600 transition-colors duration-200" />
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 group-hover:text-linkedin-600 transition-colors duration-200">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="text-center slide-up">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { icon: CheckCircle, text: 'Powered by OpenAI GPT', color: 'text-green-500' },
            { icon: CheckCircle, text: 'Unipile API Integration', color: 'text-blue-500' },
            { icon: CheckCircle, text: 'Enterprise-Grade Security', color: 'text-purple-500' }
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-center space-x-3 text-gray-700 group" style={{ animationDelay: `${index * 0.1}s` }}>
              <item.icon className={`h-6 w-6 ${item.color} group-hover:scale-110 transition-transform duration-200`} />
              <span className="font-medium group-hover:text-gray-900 transition-colors duration-200">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-16 slide-up">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Networking?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of professionals who've revolutionized their LinkedIn outreach
          </p>
          <button
            onClick={handleLinkedInConnect}
            disabled={loading}
            className="btn-primary text-lg px-8 py-4 inline-flex items-center space-x-3 shadow-2xl hover:shadow-glow-lg group"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Linkedin className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
                <span>Get Started Now</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home; 