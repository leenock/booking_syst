'use client';

import { useState } from 'react';
import { User, Mail, Lock, Bell, Shield, CreditCard, Camera, Sparkles } from 'lucide-react';
import Image from 'next/image';

export default function UserSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profileImage, setProfileImage] = useState('/default-avatar.jpg');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
  ];

  const renderProfileSettings = () => (
    <div className="space-y-8">
      {/* Profile Photo */}
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8 pb-8 border-b border-gray-100">
        <div className="relative group">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 p-1 transition-transform group-hover:scale-105">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <span className="text-2xl sm:text-3xl font-semibold text-purple-600">JD</span>
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
            <h3 className="text-xl font-semibold text-gray-900">Profile Settings</h3>
            <span className="px-2 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded-full">Pro Member</span>
          </div>
          <p className="text-sm text-gray-600 mb-4">Manage your profile information and preferences</p>
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors shadow-sm hover:shadow-md flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Upload Photo
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          <span className="text-sm text-gray-500">Last updated: 2 days ago</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              defaultValue="john@example.com"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              defaultValue="+1 234 567 890"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              defaultValue="New York, USA"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6">
        <button className="w-full sm:w-auto px-6 py-2.5 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors shadow-sm hover:shadow-md flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
      <div className="space-y-4">
        {[
          { label: 'Booking Updates', description: 'Get notified about your booking status changes' },
          { label: 'Special Offers', description: 'Receive notifications about special offers and promotions' },
          { label: 'Newsletter', description: 'Subscribe to our monthly newsletter' },
          { label: 'Account Security', description: 'Get alerts about security updates' },
        ].map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">{item.label}</p>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked={index < 2} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
      <div className="space-y-4">
        {/* Change Password */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-gray-900">Password</p>
              <p className="text-sm text-gray-600">Last changed 3 months ago</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              Change Password
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Add an extra layer of security</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>

        {/* Login History */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-gray-900">Login History</p>
              <p className="text-sm text-gray-600">View your recent login activity</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
      <div className="space-y-4">
        {/* Add New Card Button */}
        <button className="w-full p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50/50 transition-colors group">
          <div className="flex flex-col items-center justify-center">
            <CreditCard className="w-8 h-8 text-gray-400 group-hover:text-purple-500" />
            <span className="mt-2 text-sm font-medium text-gray-600 group-hover:text-purple-600">Add New Payment Method</span>
          </div>
        </button>

        {/* Saved Cards */}
        {[
          { last4: '4242', brand: 'Visa', expires: '12/24' },
          { last4: '8888', brand: 'Mastercard', expires: '08/25' },
        ].map((card, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white rounded-lg">
                  <CreditCard className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{card.brand} •••• {card.last4}</p>
                  <p className="text-sm text-gray-600">Expires {card.expires}</p>
                </div>
              </div>
              <button className="text-sm text-red-600 hover:text-red-700">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 px-6 py-4 border-b border-gray-100 bg-gray-50/50 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
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

      {/* Tab Content */}
      <div className="p-4 sm:p-6">
        {activeTab === 'profile' && renderProfileSettings()}
        {activeTab === 'notifications' && renderNotificationSettings()}
        {activeTab === 'security' && renderSecuritySettings()}
        {activeTab === 'payment' && renderPaymentSettings()}
      </div>
    </div>
  );
} 