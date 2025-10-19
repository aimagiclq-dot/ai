// services/removeBgService.ts
import { removeImageBackground } from './geminiService';

/**
 * Removes the background from an image using the Gemini AI model.
 * @param base64Image The base64-encoded image data URL (e.g., "data:image/png;base64,...").
 * @returns A promise that resolves with the base64 data URL of the image with the background removed.
 */
export async function removeBackgroundWithApi(base64Image: string): Promise<string> {
    if (!base64Image || !base64Image.startsWith('data:image')) {
        throw new Error('Invalid base64 image format provided.');
    }

    try {
        // The core logic is now delegated to the AI service
        return await removeImageBackground(base64Image);
    } catch (error) {
        console.error("Failed to remove background with AI:", error);
        // Re-throw for the UI component to handle and display
        if (error instanceof Error) {
            throw new Error(`AI background removal failed: ${error.message}`);
        }
        throw new Error("An unexpected error occurred during AI background removal.");
    }
}
