// services/canvaService.ts

/**
 * --- MOCK CANVA CONNECT API SERVICE ---
 * In a real-world application, this service would handle:
 * 1. Redirecting the user to Canva's OAuth2 authorization URL.
 * 2. Receiving a callback with an authorization code.
 * 3. Exchanging the code for an access token with a backend server.
 * 4. Making authenticated API calls to Canva's endpoints to upload assets
 *    and create designs.
 *
 * For this frontend-only demo, we simulate these interactions with delays
 * to mimic network latency and provide a realistic UX flow.
 */

/**
 * Simulates getting the URL for Canva's authentication screen.
 * @returns A promise that resolves with a mock URL.
 */
export const getCanvaAuthenticationUrl = async (): Promise<string> => {
  console.log("CANVA_SERVICE: Requesting authentication URL...");
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("CANVA_SERVICE: Received mock authentication URL.");
      resolve('https://www.canva.com/oauth/authorize?mock_token=...&scope=design.create');
    }, 500);
  });
};

/**
 * Simulates uploading an image to Canva and creating a new design from it.
 * In a real implementation, this would involve multiple API calls:
 * - `https://api.canva.com/v1/assets/upload` to upload the image.
 * - `https://api.canva.com/v1/designs/create` with the asset ID to create the design.
 * @param imageBase64 The base64-encoded image data.
 * @returns A promise that resolves with a mock URL to a new Canva design.
 */
export const uploadToCanvaAndCreateDesign = async (imageBase64: string): Promise<string> => {
    console.log("CANVA_SERVICE: Uploading image and creating design...");
    // We don't actually use the imageBase64 in the mock, but it's here to show what would be passed.
    if (!imageBase64) {
        return Promise.reject(new Error("No image data provided."));
    }

    return new Promise(resolve => {
        setTimeout(() => {
            // This is a fictional URL structure for demonstration purposes.
            const mockDesignId = `DAF${Math.random().toString(36).substring(2, 15)}`;
            const designUrl = `https://www.canva.com/design/${mockDesignId}/view`;
            console.log(`CANVA_SERVICE: Mock design created at ${designUrl}`);
            resolve(designUrl);
        }, 2000);
    });
};
