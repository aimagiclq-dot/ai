import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

const CheckIcon: React.FC = () => (
    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);

const pricingPlans = {
    monthly: [
        {
            id: 'free',
            name: 'Free',
            price: '$0',
            frequency: '/month',
            description: 'For individuals starting out with basic logo needs.',
            features: [
                '10 AI logo generations',
                'Low-resolution PNG downloads',
                'For personal use only',
                'Limited customization options',
            ],
            cta: 'Start for Free',
            popular: false,
        },
        {
            id: 'pro_monthly',
            name: 'Pro',
            price: '$29',
            frequency: '/month',
            description: 'For professionals who need high-quality assets and more creative freedom.',
            features: [
                'Unlimited AI logo generations',
                'High-resolution PNG & SVG exports',
                'Transparent backgrounds',
                'Full commercial license',
                'Advanced editor tools',
                'Priority email support',
            ],
            cta: 'Upgrade to Pro',
            popular: true,
        },
        {
            id: 'business_monthly',
            name: 'Business',
            price: '$99',
            frequency: '/month',
            description: 'For teams and agencies managing multiple brands.',
            features: [
                'Everything in Pro, plus:',
                'Shared brand kits',
                'Multi-user collaboration',
                'Dedicated account manager',
                'Custom integrations',
                '24/7 priority support',
            ],
            cta: 'Contact Sales',
            popular: false,
        },
    ],
    yearly: [
        {
            id: 'free',
            name: 'Free',
            price: '$0',
            frequency: '/year',
            description: 'For individuals starting out with basic logo needs.',
            features: [
                '10 AI logo generations',
                'Low-resolution PNG downloads',
                'For personal use only',
                'Limited customization options',
            ],
            cta: 'Start for Free',
            popular: false,
        },
        {
            id: 'pro_yearly',
            name: 'Pro',
            price: '$290',
            frequency: '/year',
            description: 'For professionals who need high-quality assets and more creative freedom.',
            features: [
                'Unlimited AI logo generations',
                'High-resolution PNG & SVG exports',
                'Transparent backgrounds',
                'Full commercial license',
                'Advanced editor tools',
                'Priority email support',
            ],
            cta: 'Upgrade to Pro',
            popular: true,
        },
        {
            id: 'business_yearly',
            name: 'Business',
            price: '$990',
            frequency: '/year',
            description: 'For teams and agencies managing multiple brands.',
            features: [
                'Everything in Pro, plus:',
                'Shared brand kits',
                'Multi-user collaboration',
                'Dedicated account manager',
                'Custom integrations',
                '24/7 priority support',
            ],
            cta: 'Contact Sales',
            popular: false,
        },
    ],
};

interface FaqItemProps {
    question: string;
    answer: string;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
    return (
        <div>
            <h4 className="font-semibold text-lg text-brand-secondary">{question}</h4>
            <p className="mt-2 text-gray-600">{answer}</p>
        </div>
    );
}

interface PricingPageProps {
    onUpgrade: (planId: string) => void;
    isProcessing: boolean;
}

const PricingPage: React.FC<PricingPageProps> = ({ onUpgrade, isProcessing }) => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

    const plans = pricingPlans[billingCycle];

    const handleCtaClick = (plan: typeof plans[0]) => {
        if (plan.name === 'Pro') {
            onUpgrade(plan.id);
        } else if (plan.name === 'Business') {
            window.location.href = 'mailto:sales@logogen.com';
        }
        // Free plan has no action here
    };

    return (
        <div className="animate-fade-in">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-secondary tracking-tighter">
                        Find the perfect plan for your brand
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        From solo projects to large teams, we have a plan that fits your needs.
                    </p>

                    <div className="mt-10 flex justify-center items-center gap-4">
                        <span className={`font-semibold ${billingCycle === 'monthly' ? 'text-brand-primary' : 'text-gray-500'}`}>Monthly</span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 ${billingCycle === 'yearly' ? 'bg-brand-primary' : 'bg-gray-300'}`}
                            aria-label="Toggle billing cycle"
                        >
                            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'}`}/>
                        </button>
                        <span className={`font-semibold ${billingCycle === 'yearly' ? 'text-brand-primary' : 'text-gray-500'}`}>
                            Yearly
                            <span className="ml-2 text-sm font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">Save 15%</span>
                        </span>
                    </div>
                </div>

                <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {plans.map(plan => (
                        <div key={plan.name} className={`relative bg-white rounded-2xl shadow-soft p-8 flex flex-col ${plan.popular ? 'border-2 border-brand-primary' : ''}`}>
                            {plan.popular && (
                                <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-brand-secondary">{plan.name}</h3>
                            <p className="mt-4 text-gray-600 flex-grow">{plan.description}</p>
                            <div className="mt-6">
                                <span className="text-5xl font-extrabold text-brand-secondary">{plan.price}</span>
                                <span className="text-lg font-semibold text-gray-500 ml-1">{plan.frequency}</span>
                            </div>
                            <button
                                onClick={() => handleCtaClick(plan)}
                                disabled={isProcessing && plan.name === 'Pro'}
                                className={`w-full mt-8 py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center disabled:opacity-60 disabled:cursor-wait ${plan.popular ? 'bg-brand-primary text-white hover:opacity-90' : 'bg-brand-lavender text-brand-primary hover:bg-brand-primary/20'}`}
                            >
                                {isProcessing && plan.name === 'Pro' ? <LoadingSpinner /> : plan.cta}
                            </button>
                            <ul className="mt-8 space-y-4">
                                {plan.features.map(feature => (
                                    <li key={feature} className="flex items-start">
                                        <CheckIcon />
                                        <span className="ml-3 text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                 <div className="mt-24 text-center">
                     <h2 className="text-3xl font-bold text-brand-secondary">Frequently Asked Questions</h2>
                     <div className="mt-12 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 text-left">
                         <FaqItem
                             question="Can I change my plan later?"
                             answer="Absolutely! You can upgrade, downgrade, or cancel your plan at any time from your account settings. Changes will be prorated."
                         />
                         <FaqItem
                             question="What is a commercial license?"
                             answer="The commercial license allows you to use your generated logos for any business purpose, including marketing, merchandise, and branding, without any restrictions."
                         />
                         <FaqItem
                             question="Do you offer refunds?"
                             answer="We offer a 7-day money-back guarantee on our Pro and Business plans. If you're not satisfied, just contact support within 7 days of your purchase for a full refund."
                         />
                         <FaqItem
                             question="What file formats are included?"
                             answer="The Pro and Business plans include high-resolution PNG, JPG, and industry-standard SVG (vector) files, which are perfect for both web and print."
                         />
                     </div>
                 </div>

            </div>
        </div>
    );
};

export default PricingPage;