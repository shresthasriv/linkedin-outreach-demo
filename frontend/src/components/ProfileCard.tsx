import React from 'react';
import { LinkedInProfile } from '../types';
import { User, Building, MapPin, Briefcase, ExternalLink, Star } from 'lucide-react';

interface ProfileCardProps {
  profile: LinkedInProfile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <div className="card relative overflow-hidden group">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-linkedin-50 to-blue-50 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        {/* Profile Header */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            {profile.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt={profile.name}
                className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-white shadow-2xl group-hover:ring-linkedin-200 transition-all duration-300"
              />
            ) : (
              <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-2xl ring-4 ring-white">
                <User className="w-12 h-12 text-gray-500" />
              </div>
            )}
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-linkedin-600 transition-colors duration-200">
            {profile.name}
          </h2>
          
          {profile.headline && (
            <p className="text-sm text-gray-600 mb-3 leading-relaxed px-2">
              {profile.headline}
            </p>
          )}
          
          <div className="inline-flex items-center space-x-1 bg-gradient-to-r from-linkedin-100 to-blue-100 px-3 py-1 rounded-full text-xs font-medium text-linkedin-800 border border-linkedin-200">
            <Star className="h-3 w-3" />
            <span>LinkedIn Connected</span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          {profile.job_title && (
            <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg border border-gray-100 group-hover:bg-white/70 transition-colors duration-200">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Position</div>
                <div className="text-sm font-medium text-gray-700">{profile.job_title}</div>
              </div>
            </div>
          )}

          {profile.company && (
            <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg border border-gray-100 group-hover:bg-white/70 transition-colors duration-200">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Building className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Company</div>
                <div className="text-sm font-medium text-gray-700">{profile.company}</div>
              </div>
            </div>
          )}

          {profile.location && (
            <div className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg border border-gray-100 group-hover:bg-white/70 transition-colors duration-200">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Location</div>
                <div className="text-sm font-medium text-gray-700">{profile.location}</div>
              </div>
            </div>
          )}

          {profile.industry && (
            <div className="p-3 bg-white/50 rounded-lg border border-gray-100 group-hover:bg-white/70 transition-colors duration-200">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Industry</div>
              <div className="text-sm font-medium text-gray-700">{profile.industry}</div>
            </div>
          )}
        </div>

        {profile.summary && (
          <div className="mt-6 p-4 bg-white/60 rounded-xl border border-gray-100 group-hover:bg-white/80 transition-colors duration-200">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-3 flex items-center">
              <div className="w-2 h-2 bg-linkedin-500 rounded-full mr-2"></div>
              About
            </div>
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
              {profile.summary}
            </p>
          </div>
        )}

        {profile.profile_url && (
          <div className="mt-6 pt-4 border-t border-gray-200/50">
            <a
              href={profile.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link inline-flex items-center space-x-2 text-linkedin-600 hover:text-linkedin-700 font-medium transition-all duration-200 hover:scale-105"
            >
              <span>View LinkedIn Profile</span>
              <ExternalLink className="h-4 w-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform duration-200" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard; 