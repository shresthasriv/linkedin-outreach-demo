import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Linkedin, LogOut, User, Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const { isAuthenticated, profile, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="glass-card sticky top-0 z-50 border-0 border-b border-white/20 backdrop-blur-xl">
      <div className="section-container">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-br from-linkedin-600 to-blue-600 rounded-xl shadow-lg group-hover:shadow-glow transition-all duration-300">
              <Linkedin className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold gradient-text">LinkedIn Outreach</span>
              <div className="text-xs text-gray-500 -mt-1">AI-Powered</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="btn-ghost font-medium transition-all duration-200 hover:scale-105"
                >
                  Dashboard
                </Link>
                
                <div className="flex items-center space-x-4 pl-6 border-l border-gray-200/50">
                  <div className="flex items-center space-x-3 group">
                    <div className="relative">
                      {profile?.profile_picture ? (
                        <img
                          src={profile.profile_picture}
                          alt={profile.name}
                          className="h-10 w-10 rounded-full ring-2 ring-white shadow-lg group-hover:ring-linkedin-200 transition-all duration-200"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center shadow-lg">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                      )}
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="hidden lg:block">
                      <div className="text-sm font-medium text-gray-900">{profile?.name || 'User'}</div>
                      <div className="text-xs text-gray-500">Connected</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/" 
                className="btn-primary"
              >
                Connect LinkedIn
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 py-4 fade-in">
            <div className="space-y-3">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="block btn-ghost text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  
                  <div className="flex items-center justify-center space-x-3 py-3">
                    {profile?.profile_picture ? (
                      <img
                        src={profile.profile_picture}
                        alt={profile.name}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <User className="h-8 w-8 text-gray-400 bg-gray-100 rounded-full p-1" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {profile?.name || 'User'}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full btn-secondary text-red-600 border-red-200 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/" 
                  className="block btn-primary text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Connect LinkedIn
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 