import React, { useState } from 'react';
import { User, LogoAsset } from '../../types';
import ProfileSettings from './ProfileSettings';
import SubscriptionPanel from './SubscriptionPanel';
import HistoryGallery from './HistoryGallery';
import { UserIcon, CreditCardIcon, HistoryIcon as HistoryDashboardIcon } from './icons';

interface DashboardPageProps {
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    logoHistory: LogoAsset[];
    onEditLogo: (logo: LogoAsset) => void;
    onUpgradePlan: () => void;
    onManageSubscription: () => void;
}

type DashboardTab = 'profile' | 'subscription' | 'history';

const DashboardPage: React.FC<DashboardPageProps> = ({ user, setUser, logoHistory, onEditLogo, onUpgradePlan, onManageSubscription }) => {
    const [activeTab, setActiveTab] = useState<DashboardTab>('history');

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileSettings user={user} setUser={setUser} />;
            case 'subscription':
                return <SubscriptionPanel user={user} onUpgradePlan={onUpgradePlan} onManageSubscription={onManageSubscription} />;
            case 'history':
                return <HistoryGallery logoHistory={logoHistory} onEditLogo={onEditLogo} user={user} />;
            default:
                return null;
        }
    };

    return (
        <div className="animate-fade-in max-w-7xl mx-auto">
            <header className="mb-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-secondary tracking-tighter">
                    My Account
                </h1>
                <p className="mt-2 text-lg text-gray-600">Welcome back, {user.name}. Manage your profile, subscription, and designs.</p>
            </header>

            <div className="flex flex-col md:flex-row gap-12">
                <aside className="md:w-1/4 flex-shrink-0">
                    <nav className="space-y-2">
                        <DashboardTabButton
                            label="Logo History"
                            icon={HistoryDashboardIcon}
                            isActive={activeTab === 'history'}
                            onClick={() => setActiveTab('history')}
                        />
                         <DashboardTabButton
                            label="Subscription"
                            icon={CreditCardIcon}
                            isActive={activeTab === 'subscription'}
                            onClick={() => setActiveTab('subscription')}
                        />
                        <DashboardTabButton
                            label="Profile Settings"
                            icon={UserIcon}
                            isActive={activeTab === 'profile'}
                            onClick={() => setActiveTab('profile')}
                        />
                    </nav>
                </aside>

                <main className="flex-grow">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

interface DashboardTabButtonProps {
    label: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    isActive: boolean;
    onClick: () => void;
}

const DashboardTabButton: React.FC<DashboardTabButtonProps> = ({ label, icon: Icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left font-semibold rounded-lg transition-colors ${
            isActive
                ? 'bg-brand-primary/10 text-brand-primary'
                : 'text-gray-700 hover:bg-gray-100'
        }`}
    >
        <Icon className="w-6 h-6" />
        <span>{label}</span>
    </button>
);

export default DashboardPage;