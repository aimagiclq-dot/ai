import React from 'react';
import { User } from '../../types';

interface SubscriptionPanelProps {
    user: User;
    onUpgradePlan: () => void;
    onManageSubscription: () => void;
}

const SubscriptionPanel: React.FC<SubscriptionPanelProps> = ({ user, onUpgradePlan, onManageSubscription }) => {
    const isFree = user.plan === 'free';
    const usagePercentage = isFree ? Math.min((user.generationsUsed / user.generationLimit) * 100, 100) : 100;
    const nextResetDate = new Date();
    nextResetDate.setMonth(nextResetDate.getMonth() + 1);
    nextResetDate.setDate(1);

    return (
         <div>
            <h2 className="text-3xl font-bold text-brand-secondary mb-6">Your Subscription</h2>
            <div className="bg-white rounded-lg shadow p-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Current Plan</h3>
                        <p className="text-4xl font-extrabold text-brand-primary capitalize mt-1">{user.plan}</p>
                    </div>
                    {isFree ? (
                        <button onClick={onUpgradePlan} className="bg-brand-primary text-white font-semibold px-6 py-2.5 rounded-lg hover:opacity-90">
                            Upgrade Plan
                        </button>
                    ) : (
                         <button onClick={onManageSubscription} className="bg-gray-200 text-gray-800 font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-300">
                            Manage Subscription
                        </button>
                    )}
                </div>

                <div className="mt-8 pt-8 border-t">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Usage This Month</h3>
                    {isFree ? (
                        <>
                            <div className="flex justify-between font-semibold text-gray-600 mb-2">
                                <span>Logo Generations</span>
                                <span>{user.generationsUsed} / {user.generationLimit}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-brand-primary h-2.5 rounded-full" style={{ width: `${usagePercentage}%` }}></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                                Your limit will reset on {nextResetDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}.
                            </p>
                        </>
                    ) : (
                        <p className="text-gray-600">You have unlimited logo generations on the {user.plan} plan. Create freely!</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default SubscriptionPanel;