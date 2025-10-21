import { removeImageBackground } from './geminiService';

/**
 * Removes the background from an image using a dedicated third-party API.
 * This function is architected to call a service like Remove.bg.
 * @param base64Image The base64-encoded image data URL (e.g., "data:image/png;base64,...").
 * @returns A promise that resolves with the base64 data URL of the image with the background removed.
 */
export async function removeBackgroundWithApi(base64Image: string): Promise<string> {
    if (!base64Image || !base64Image.startsWith('data:image')) {
        throw new Error('Invalid base64 image format provided.');
    }

    // --- PRODUCTION IMPLEMENTATION EXAMPLE (using Remove.bg) ---
    // In a real-world application with a backend or serverless function, this
    // function would make a call to a dedicated service like Remove.bg.
    // To use this code:
    // 1. Get an API key from https://www.remove.bg/
    // 2. Store it as an environment variable (e.g., REMOVE_BG_API_KEY).
    // 3. Uncomment the code block below.
    /*
    const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;
    if (!REMOVE_BG_API_KEY) {
        throw new Error("Remove.bg API key is not configured.");
    }
    const API_ENDPOINT = 'https://api.remove.bg/v1/removebg';

    const formData = new FormData();
    // Remove the data URL prefix before sending
    formData.append('image_file_b64', base64Image.split(',')[1]);
    formData.append('size', 'auto'); // Automatically determine output size

    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'X-Api-Key': REMOVE_BG_API_KEY,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Remove.bg API error: ${response.statusText} - ${errorText}`);
    }

    // The result is an image blob
    const blob = await response.blob();
    const reader = new FileReader();
    
    // Convert blob back to base64 to display in the app
    return new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
    */

    // --- SANDBOX FALLBACK IMPLEMENTATION ---
    // Since we cannot make authenticated external API calls in this sandboxed
    // environment, we will use the Gemini model as a functional stand-in
    // to keep the application working. The code block above shows the
    // recommended production-ready implementation.
    try {
        return await removeImageBackground(base64Image);
    } catch (error) {
        console.error("Failed to remove background (using AI fallback):", error);
        if (error instanceof Error) {
            throw new Error(`Background removal failed: ${error.message}`);
        }
        throw new Error("An unexpected error occurred during background removal.");
    }
}