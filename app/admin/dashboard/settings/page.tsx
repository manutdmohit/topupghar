'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Shield, User } from 'lucide-react';

export default function AdminSettingsPage() {
  const { adminUser, loading: authLoading } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }
    if (!hasUpperCase) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!hasLowerCase) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!hasNumbers) {
      return 'Password must contain at least one number';
    }
    if (!hasSpecialChar) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.currentPassword) {
      toast.error('Current password is required');
      return;
    }

    if (!formData.newPassword) {
      toast.error('New password is required');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    try {
      setLoading(true);

      if (!adminUser) {
        toast.error('Admin user not found. Please log in again.');
        return;
      }

      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': adminUser.email,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }

      toast.success(
        'Password updated successfully! Please log in with your new password.'
      );

      // Clear admin session and redirect to login
      localStorage.removeItem('adminUser');
      setTimeout(() => {
        window.location.href = '/admin/login';
      }, 1500);

      // Reset form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update password'
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-800">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated, the hook will redirect to login
  if (!adminUser) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Settings
        </h1>
        <p className="text-gray-600">
          Manage your admin account settings and security
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Admin Account</h3>
                <p className="text-sm text-gray-500">{adminUser.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Security Settings
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg">
                <Lock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Password Management
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                Change Password
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Update your admin password to keep your account secure
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your current password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Requirements */}
                {formData.newPassword && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      Password Requirements:
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li
                        className={`flex items-center ${
                          formData.newPassword.length >= 8
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }`}
                      >
                        <span className="mr-2">•</span>
                        At least 8 characters long
                      </li>
                      <li
                        className={`flex items-center ${
                          /[A-Z]/.test(formData.newPassword)
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }`}
                      >
                        <span className="mr-2">•</span>
                        One uppercase letter
                      </li>
                      <li
                        className={`flex items-center ${
                          /[a-z]/.test(formData.newPassword)
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }`}
                      >
                        <span className="mr-2">•</span>
                        One lowercase letter
                      </li>
                      <li
                        className={`flex items-center ${
                          /\d/.test(formData.newPassword)
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }`}
                      >
                        <span className="mr-2">•</span>
                        One number
                      </li>
                      <li
                        className={`flex items-center ${
                          /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)
                            ? 'text-green-600'
                            : 'text-gray-500'
                        }`}
                      >
                        <span className="mr-2">•</span>
                        One special character
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Confirm your new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-2">
                    {formData.newPassword === formData.confirmPassword ? (
                      <p className="text-sm text-green-600">
                        ✓ Passwords match
                      </p>
                    ) : (
                      <p className="text-sm text-red-600">
                        ✗ Passwords do not match
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating Password...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
