// services/stripeService.ts

/**
 * --- MOCK STRIPE API SERVICE ---
 * This service simulates the backend interactions required for Stripe integration.
 * In a real-world scenario, these functions would make authenticated API calls
 * to your server, which would then communicate with the Stripe API.
 */

/**
 * Simulates creating a Stripe Checkout session on the server.
 * @param planId The ID of the plan the user is purchasing (e.g., 'pro_monthly').
 * @returns A promise that resolves with a mock session object.
 */
export const createCheckoutSession = async (planId: string): Promise<{ sessionId: string }> => {
  console.log(`STRIPE_MOCK: Creating checkout session for plan: ${planId}`);
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.05) { // 95% success rate
        const mockSessionId = `cs_test_${Math.random().toString(36).substring(2)}`;
        console.log(`STRIPE_MOCK: Session created with ID: ${mockSessionId}`);
        resolve({ sessionId: mockSessionId });
      } else {
        console.error("STRIPE_MOCK: Failed to create checkout session.");
        reject(new Error("A network error occurred while creating the checkout session."));
      }
    }, 1500); // Simulate network latency
  });
};

/**
 * Simulates creating a Stripe Customer Portal session on the server.
 * @param customerId The Stripe customer ID for the logged-in user.
 * @returns A promise that resolves with a mock URL to the customer portal.
 */
export const createCustomerPortalSession = async (customerId: string): Promise<{ url: string }> => {
  console.log(`STRIPE_MOCK: Creating customer portal session for customer: ${customerId}`);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (customerId && Math.random() > 0.05) { // 95% success rate
        const mockPortalUrl = `https://billing.stripe.com/p/session/test_${Math.random().toString(36).substring(2)}`;
        console.log(`STRIPE_MOCK: Portal session created at URL: ${mockPortalUrl}`);
        resolve({ url: mockPortalUrl });
      } else {
        console.error("STRIPE_MOCK: Failed to create customer portal session.");
        reject(new Error("A network error occurred while connecting to the customer portal."));
      }
    }, 1200); // Simulate network latency
  });
};