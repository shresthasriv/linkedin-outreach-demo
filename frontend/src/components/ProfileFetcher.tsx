import React, { useState } from 'react';
import { LinkedInProfile } from '../types';
import { profileApi } from '../services/api';
import { User, MapPin, ExternalLink, Briefcase, GraduationCap, Award } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface ProfileFetcherProps {
  accountId: string;
  onProfileFetched: (profile: LinkedInProfile) => void;
}

const ProfileFetcher: React.FC<ProfileFetcherProps> = ({ accountId, onProfileFetched }) => {
  const [profileUrl, setProfileUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetchedProfile, setFetchedProfile] = useState<LinkedInProfile | null>(null);

  const handleFetchProfile = async () => {
    if (!profileUrl.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await profileApi.fetchProfile(profileUrl.trim(), accountId);
      setFetchedProfile(response.profile);
      onProfileFetched(response.profile);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFetchedProfile(null);
    setProfileUrl('');
    setError(null);
  };

  return (
    <div className="space-y-6">
      {!fetchedProfile ? (
        <div className="card">
          <div className="flex items-center space-x-2 mb-6">
            <div className="p-2 bg-linkedin-600 rounded-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Fetch LinkedIn Profile</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn Profile URL
              </label>
              <input
                type="text"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="input"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-2">
                Enter the LinkedIn profile URL of the person you want to message
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <button
              onClick={handleFetchProfile}
              disabled={!profileUrl.trim() || isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" text="Fetching Profile" />
              ) : (
                <>
                  <User className="h-5 w-5 mr-2" />
                  Fetch Profile Data
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-600 rounded-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Profile Retrieved</h3>
            </div>
            <button
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Fetch Different Profile
            </button>
          </div>

          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-start space-x-4">
              {fetchedProfile.profile_picture_url && (
                <img
                  src={fetchedProfile.profile_picture_url}
                  alt={fetchedProfile.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
              )}
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-gray-900">{fetchedProfile.name}</h4>
                {fetchedProfile.headline && (
                  <p className="text-lg text-gray-600 mt-1">{fetchedProfile.headline}</p>
                )}
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  {fetchedProfile.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{fetchedProfile.location}</span>
                    </div>
                  )}
                  {fetchedProfile.connections_count && (
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{fetchedProfile.connections_count} connections</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Current Position */}
            {fetchedProfile.work_experience && fetchedProfile.work_experience.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Briefcase className="h-5 w-5 text-gray-600" />
                  <h5 className="font-semibold text-gray-900">Current Position</h5>
                </div>
                {fetchedProfile.work_experience.slice(0, 2).map((exp, index) => (
                  <div key={index} className="mb-3 last:mb-0">
                    <p className="font-medium text-gray-900">{exp.position}</p>
                    <p className="text-gray-600">{exp.company}</p>
                    {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {fetchedProfile.education && fetchedProfile.education.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <GraduationCap className="h-5 w-5 text-gray-600" />
                  <h5 className="font-semibold text-gray-900">Education</h5>
                </div>
                {fetchedProfile.education.slice(0, 2).map((edu, index) => (
                  <div key={index} className="mb-2 last:mb-0">
                    <p className="font-medium text-gray-900">{edu.school}</p>
                    {edu.degree && <p className="text-gray-600">{edu.degree}</p>}
                    {edu.field_of_study && <p className="text-sm text-gray-500">{edu.field_of_study}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Top Skills */}
            {fetchedProfile.skills && fetchedProfile.skills.length > 0 && (
              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Award className="h-5 w-5 text-gray-600" />
                  <h5 className="font-semibold text-gray-900">Top Skills</h5>
                </div>
                <div className="flex flex-wrap gap-2">
                  {fetchedProfile.skills.slice(0, 6).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {fetchedProfile.public_profile_url && (
              <div className="border-t pt-4">
                <a
                  href={fetchedProfile.public_profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-linkedin-600 hover:text-linkedin-700 font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View Full LinkedIn Profile</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileFetcher; 