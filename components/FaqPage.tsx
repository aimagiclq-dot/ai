import React from 'react';
import Accordion from './Accordion';

const FaqPage: React.FC = () => {
    return (
        <div className="animate-fade-in max-w-5xl mx-auto">
            <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-secondary tracking-tighter">
                    Frequently Asked Questions
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                    Have a question? We've got answers. If you can't find what you're looking for, feel free to contact our support team.
                </p>
            </div>
            
            <div className="mt-16 space-y-10">
                <div>
                    <h2 className="text-2xl font-bold text-brand-secondary mb-6 border-b pb-3">General</h2>
                    <div className="space-y-4">
                        <Accordion title="How does the AI logo generator work?">
                            Our AI uses advanced generative models. You provide it with your company name, industry, color preferences, and font styles, and it creates multiple unique logo concepts based on your input. It combines design principles with machine learning to produce professional-quality results in seconds.
                        </Accordion>
                        <Accordion title="What if I don't like the generated logos?">
                            No problem! You can either refine your inputs and generate a new batch of logos, or you can select the concept that's closest to your vision and use our powerful editor to customize it. You can change colors, fonts, layouts, and more until you're completely satisfied.
                        </Accordion>
                    </div>
                </div>

                 <div>
                    <h2 className="text-2xl font-bold text-brand-secondary mb-6 border-b pb-3">Billing & Plans</h2>
                    <div className="space-y-4">
                        <Accordion title="Can I change my plan later?">
                            Absolutely! You can upgrade, downgrade, or cancel your plan at any time from your account settings. Changes will be prorated to ensure you only pay for what you use.
                        </Accordion>
                         <Accordion title="Do you offer refunds?">
                            We offer a 7-day money-back guarantee on our Pro and Business plans. If you're not satisfied, just contact support within 7 days of your purchase for a full refund.
                        </Accordion>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-brand-secondary mb-6 border-b pb-3">Licensing & Usage</h2>
                    <div className="space-y-4">
                        <Accordion title="What is a commercial license?">
                           The commercial license, included with our Pro and Business plans, allows you to use your generated logos for any business purpose. This includes marketing materials, websites, merchandise, and branding, without any future restrictions or royalties.
                        </Accordion>
                        <Accordion title="What file formats are included with a Pro plan?">
                           The Pro and Business plans include high-resolution files suitable for both web and print. You'll receive PNG files (with transparent backgrounds), JPGs, and industry-standard SVG (vector) files that can be scaled to any size without losing quality.
                        </Accordion>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FaqPage;
