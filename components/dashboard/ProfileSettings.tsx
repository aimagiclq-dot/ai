import React, { useState } from 'react';
import { User } from '../../types';

interface ProfileSettingsProps {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, setUser }) => {
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [isSaved, setIsSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock API call
        setUser(currentUser => currentUser ? { ...currentUser, name, email } : null);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-brand-secondary mb-6">Profile Settings</h2>
            <div className="bg-white rounded-lg shadow p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="font-semibold text-sm text-gray-700 block mb-1.5">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50"
                        />
                    </div>
                     <div>
                        <label htmlFor="email" className="font-semibold text-sm text-gray-700 block mb-1.5">Email address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50"
                        />
                    </div>
                    <div>
                        <button type="submit" className="bg-brand-primary text-white font-semibold px-6 py-2.5 rounded-lg hover:opacity-90">
                            Save Changes
                        </button>
                        {isSaved && <span className="ml-4 text-green-600 font-semibold animate-fade-in">Saved!</span>}
                    </div>
                </form>

                <div className="mt-8 pt-8 border-t">
                    <h3 className="text-lg font-bold text-gray-800">Change Password</h3>
                     <p className="text-sm text-gray-500 mt-1 mb-4">For your security, we recommend choosing a long, unique password.</p>
                     <button className="bg-gray-200 text-gray-800 font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-300">
                        Change Password
                    </button>
                </div>

                 <div className="mt-8 pt-8 border-t">
                    <h3 className="text-lg font-bold text-gray-800">Delete Account</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-4">Permanently delete your account and all of your data. This action cannot be undone.</p>
                    <button className="bg-red-50 text-red-600 font-semibold px-6 py-2.5 rounded-lg hover:bg-red-100">
                        Delete My Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
