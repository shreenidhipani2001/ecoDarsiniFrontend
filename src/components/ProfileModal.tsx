'use client';

import { useEffect } from 'react';
import BaseModal from './BaseModal';

export default function ProfileModal({
  user,
  onClose,
}: {
  user: any;
  onClose: () => void;
}) {
  useEffect(() => {
    console.log('ProfileModal mounted with user:', user);
  }, [user]);

  if (!user) return null;

  return (
    <BaseModal title="My Profile" onClose={onClose}>
      <div className="flex flex-col md:flex-row gap-6 bg-gradient-to-br from-green-100 via-green-200 to-green-300 p-8 rounded-2xl shadow-xl">
        
        {/* Left Half - Big Avatar */}
        <div className="flex justify-center items-center md:w-1/3">
          <div className="h-40 w-40 rounded-full bg-green-500 flex items-center justify-center text-white text-6xl font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Right Half - User Info */}
        <div className="flex flex-col justify-center md:w-2/3 gap-6">
          <div>
            <span className="text-green-900 font-bold text-2xl">Name:</span>
            <p className="text-gray-800 font-semibold text-xl mt-1">{user.name}</p>
          </div>

          <div>
            <span className="text-green-900 font-bold text-2xl">Role:</span>
            <p className="text-gray-800 font-semibold text-xl mt-1">{user.role}</p>
          </div>

          <div>
            <span className="text-green-900 font-bold text-2xl">Email:</span>
            <p className="text-gray-800 font-semibold text-xl mt-1">{user.email}</p>
          </div>

          {user.phone && (
            <div>
              <span className="text-green-900 font-bold text-2xl">Phone:</span>
              <p className="text-gray-800 font-semibold text-xl mt-1">{user.phone}</p>
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
}
