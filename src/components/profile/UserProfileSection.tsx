import React, { useState } from 'react';
import { User, Edit3, Save, X, Camera, Mail, Calendar, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function UserProfileSection() {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await updateProfile(editData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: user.name,
      avatar: user.avatar || '',
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await logout();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <User className="mr-2 text-purple-600 dark:text-purple-400" size={20} />
          Account Information
        </h3>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Edit profile"
          >
            <Edit3 size={16} className="text-gray-600 dark:text-gray-400" />
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={24} className="text-white" />
              )}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 p-1 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-lg">
                <Camera size={12} />
              </button>
            )}
          </div>
          
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editData.name}
                onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter your name"
              />
            ) : (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">{user.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Account holder</p>
              </div>
            )}
          </div>
        </div>

        {/* Account Details */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <Mail size={18} className="text-gray-600 dark:text-gray-400" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">{user.email}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Email address</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <Calendar size={18} className="text-gray-600 dark:text-gray-400" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {user.createdAt.toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Member since</div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <Shield size={18} className="text-green-600 dark:text-green-400" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {user.emailVerified ? 'Verified' : 'Unverified'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Account status</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing ? (
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
            
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              <span>{isLoading ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors font-medium"
            >
              Sign Out
            </button>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Last login: {user.lastLogin.toLocaleDateString()} at {user.lastLogin.toLocaleTimeString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}