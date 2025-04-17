'use client';

import { useState, useEffect } from 'react';
import { User, Camera, Sparkles } from 'lucide-react';
import UserAuthService from "@/app/services/user_auth";
import toast, { Toaster } from 'react-hot-toast';

type StatusFilter = "all" | "active" | "inactive";

export default function UserSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState<any>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhoneNumber] = useState('');
  const [isActive, setStatusFilter] = useState<StatusFilter>("all");

  // Load user data
  const loadUserData = () => {
    const user = UserAuthService.getUserData();
    if (user) {
      setUserData(user);
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setEmail(user.email || '');
      setPhoneNumber(user.phone || '');
      setStatusFilter(user.isActive ? "active" : "inactive"); 
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  // Handle update
  const handleUpdate = async () => {
    const updatedUser = {
      firstName,
      lastName,
      phone,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/visitor-accounts/users/${userData?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${UserAuthService.getToken()}`,
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Profile updated successfully');
        UserAuthService.saveUserData(data);
        loadUserData();
       
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update error:', err);
      toast.error('An error occurred while updating.');
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-8">
      {/* Profile Photo */}
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8 pb-8 border-b border-gray-100">
        <div className="relative group">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 p-1 transition-transform group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <span className="text-2xl sm:text-3xl font-semibold text-purple-600">
                {firstName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <button
            className="absolute bottom-0 right-0 p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 shadow-lg group-hover:scale-110"
            aria-label="Change profile photo"
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">
              Profile Settings
            </h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              userData?.isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
              }`} >
              {userData?.isActive ? 'Active' : 'Inactive'} Account
              </span>
          </div>
          <p className="text-sm text-gray-600 mb-4 font-semibold">
            Manage your profile information and preferences,{" "}
            {`${firstName.toUpperCase()} ${lastName.toUpperCase()}`}
          </p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Personal Information
          </h3>
          <span className="text-sm text-gray-500">Last updated: Just now</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              readOnly
              value={email}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6">
        <button
          onClick={handleUpdate}
          className="w-full sm:w-auto px-6 py-2.5 text-white bg-purple-600 rounded-lg hover:bg-purple-700 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Update Changes
        </button>
      </div>
    </div>
  );

  const tabs = [{ id: 'profile', label: 'Profile', icon: User }];

  return (
    <div className="max-w-5xl mx-auto">
      
      <div className="flex flex-wrap gap-2 px-6 py-4 border-b border-gray-100 bg-gray-50/50 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === tab.id
                ? 'text-purple-600 bg-white shadow-sm font-medium'
                : 'text-gray-600 hover:bg-white hover:text-purple-600'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="p-4 sm:p-6">
        {activeTab === 'profile' && renderProfileSettings()}
      </div>
    </div>
  );
}