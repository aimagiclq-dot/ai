import { GoogleGenAI, Modality, Type } from "@google/genai";
import { FontStyle, Industry, Layer, Background, TextElement, ShapeElement, LogoGenerationParams } from "../types";

export const prepareImageParts = (base64Images: string[]): { inlineData: { data: string, mimeType: string } }[] => {
    return base64Images.map(url => {
        if (!url || !url.includes(',')) {
            console.warn('Invalid base64 image URL provided:', url);
            return { inlineData: { data: '', mimeType: 'image/png' } };
        }
        const [header, data] = url.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
        return { inlineData: { data, mimeType } };
    }).filter(part => part.inlineData.data);
};


export async function callGeminiImageModel(prompt: string, images: { inlineData: { data: string, mimeType: string } }[]): Promise<string> {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const contents = { parts: [...images, { text: prompt }] };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: contents,
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const candidate = response?.candidates?.[0];

        if (!candidate) {
            console.error("Invalid response from Gemini: No candidates found.", response);
            throw new Error("The AI returned an empty response. This may be due to a network issue or a problem with the prompt.");
        }

        const finishReason = candidate.finishReason;

        if (finishReason !== 'STOP') {
            console.warn(`Gemini response finished with non-STOP reason: ${finishReason}`, candidate.safetyRatings);
            if (finishReason === 'SAFETY') {
                throw new Error("The request was blocked for safety reasons. Please adjust your prompt and try again.");
            }
            if (finishReason === 'RECITATION') {
                throw new Error("The request was blocked due to potential recitation of copyrighted content. Please rephrase your prompt.");
            }
            throw new Error(`The AI could not complete the request (Reason: ${finishReason}). Please try again or modify your prompt.`);
        }
        
        if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
            console.error("Invalid response structure: No content parts found despite a successful finish reason.", response);
            throw new Error("The AI returned an invalid response structure. Please try again.");
        }

        const imagePart = candidate.content.parts.find(part => part.inlineData);

        if (imagePart?.inlineData) {
            return `data:image/png;base64,${imagePart.inlineData.data}`;
        }

        console.error("No image data in Gemini response parts:", response);
        throw new Error("The AI response did not contain an image. Please try adjusting your prompt to be more specific about creating an image.");

    } catch (error) {
        console.error("Error interacting with Gemini in callGeminiImageModel:", error);
        if (error instanceof Error) {
            // Re-throw specific, user-friendly errors we've already created.
            if (error.message.startsWith("The request was blocked") || error.message.startsWith("The AI could not complete")) {
                throw error;
            }
            // Attempt to parse detailed API errors from the message.
            try {
                const apiError = JSON.parse(error.message);
                if (apiError.error) {
                    if (apiError.error.code === 429) {
                        throw new Error("You've exceeded your API request quota. Please check your plan and billing details.");
                    }
                    if (apiError.error.message) {
                        throw new Error(`The AI service returned an error: ${apiError.error.message}`);
                    }
                }
            } catch (e) {
                // Not a JSON error message, fall through to generic error.
            }
        }
        // Fallback for network errors or other unexpected issues.
        throw new Error("Failed to process the image with AI due to a network or server error.");
    }
}

export async function generateLogo({ name, slogan, industry, colors, fonts, prompt: extraPrompt, referenceImage, layout, iconDescription, style }: LogoGenerationParams): Promise<string> {
    let prompt = `Design a professional, modern logo for a company named "${name}".`;

    if (style) {
        prompt += ` The style should be: ${style}.`;
    }

    // Handle layout and icon/text instructions
    switch (layout) {
        case 'icon-only':
            prompt += ` The logo must be an icon only, without any text. The icon should represent: "${iconDescription || name}".`;
            break;
        case 'text-only':
            prompt += ` The logo must be a text-only wordmark (a logotype). Do not include any icons or symbols.`;
            break;
        case 'icon-top':
            prompt += ` The logo should have an icon positioned above the company name. The icon should represent: "${iconDescription || name}".`;
            break;
        case 'icon-left':
            prompt += ` The logo should have an icon positioned to the left of the company name. The icon should represent: "${iconDescription || name}".`;
            break;
        case 'icon-right':
            prompt += ` The logo should have an icon positioned to the right of the company name. The icon should represent: "${iconDescription || name}".`;
            break;
        default: // Default to icon-top if layout is not provided but description is
            if (iconDescription) {
                prompt += ` The logo should have an icon positioned above the company name, representing: "${iconDescription}".`;
            }
            break;
    }

    if (slogan && layout !== 'icon-only') {
        prompt += ` If appropriate for the design, include the slogan "${slogan}".`;
    }
    if (industry) {
        prompt += ` The company is in the ${industry.name} industry.`;
    }
    if (colors.length > 0) {
        const colorNames = colors.map(c => c.name).join(', ');
        prompt += ` Use a color palette inspired by these colors: ${colorNames}.`;
    }
    if (fonts.length > 0 && layout !== 'icon-only') {
        const fontNames = fonts.map(f => f.name).join(' or ');
        prompt += ` The font should have a style similar to ${fontNames}.`;
    }
    if (referenceImage) {
        prompt += ` Strongly base the style, colors, and composition on the provided reference image, but create a unique design.`;
    }
    if (extraPrompt) {
        prompt += ` Additional user instructions: ${extraPrompt}.`;
    }
    
    prompt += ' The logo must be on a solid, plain, non-textured, pure white background (#FFFFFF). This simple background will be removed later. Do not use a transparent or checkerboard background. Output a high-quality, clean PNG. Do not include any text other than the company name and slogan if they are part of the design.';
    
    const imageParts = referenceImage ? prepareImageParts([referenceImage]) : [];
    return callGeminiImageModel(prompt, imageParts);
}


const getCompositingInstructions = (layers: Layer[], background: Background): { instructions: string, imageParts: { inlineData: { data: string, mimeType: string } }[] } => {
    let instructions = `You are a precise graphic design assistant. Your task is to composite several elements onto a canvas. Follow these instructions exactly in order.`;
    const imageParts: { inlineData: { data: string, mimeType: string } }[] = [];
    let imageCounter = 1;

    // 1. Set up the background
    switch (background.type) {
        case 'color':
            instructions += `\n1. **Canvas**: Start with a solid background of this color: ${background.value}.`;
            break;
        case 'transparent':
            instructions += `\n1. **Canvas**: Start with a transparent background.`;
            break;
        case 'image':
            instructions += `\n1. **Canvas**: Use the first provided image as the background.`;
            imageParts.push(...prepareImageParts([background.value]));
            imageCounter++;
            break;
    }

    const layerStep = imageParts.length > 0 ? 2 : 1;

    // 2. Add layers
    if (layers.length > 0) {
      instructions += `\n${layerStep}. **Overlay Layers**: Add the following layers on top of the canvas, in order from lowest to highest z-index.`;

      const sortedLayers = [...layers].sort((a, b) => a.zIndex - b.zIndex);

      sortedLayers.forEach(layer => {
          if (layer.type === 'image') {
              instructions += `\n- Type: Image, Image Source: Image #${imageCounter}, Position: ${layer.y.toFixed(1)}% from Top, ${layer.x.toFixed(1)}% from Left, Size: ${layer.width.toFixed(1)}% Width, ${layer.height.toFixed(1)}% Height. Object-fit should be 'contain'.`;
              imageParts.push(...prepareImageParts([layer.src]));
              imageCounter++;
          } else if (layer.type === 'text') {
              instructions += `\n- Type: Text, Content: "${layer.text}", Position: ${layer.y.toFixed(1)}% from Top, ${layer.x.toFixed(1)}% from Left, Bounding Box Size: ${layer.width.toFixed(1)}% Width, ${layer.height.toFixed(1)}% Height, Font: ${layer.fontFamily}, ${layer.fontSize}px, ${layer.fontWeight}, ${layer.fontStyle}, Align: ${layer.textAlign}, Color: ${layer.color}.`;
          } else if (layer.type === 'shape') {
              instructions += `\n- Type: Shape, Shape: ${layer.shape}, Position: ${layer.y.toFixed(1)}% from Top, ${layer.x.toFixed(1)}% from Left, Size: ${layer.width.toFixed(1)}% Width, ${layer.height.toFixed(1)}% Height, Color: ${layer.color}.`;
          }
      });
    }

    return { instructions, imageParts };
};

export async function getCompositedImage(layers: Layer[], background: Background): Promise<string> {
    const { instructions, imageParts } = getCompositingInstructions(layers, background);
    const prompt = `${instructions}\n\n**Final Output**: Your final output must be a single, high-quality PNG image showing the result of the composition.`;
    return callGeminiImageModel(prompt, imageParts);
}

export async function generateAiBackground(layers: Layer[], prompt: string): Promise<string> {
    // First, get the logo with a transparent background
    const transparentLogo = await getCompositedImage(layers, { type: 'transparent' });

    // Then, place it on the AI-generated background
    const bgPrompt = `Take the provided logo image (which has a transparent background) and place it onto a new background. The new background should be a high-quality, photorealistic image based on this description: "${prompt}". The logo should be centered and well-integrated into the scene.`;

    return callGeminiImageModel(bgPrompt, prepareImageParts([transparentLogo]));
}


export async function upscaleLogo(layers: Layer[], background: Background): Promise<string> {
    const compositedImage = await getCompositedImage(layers, background);
    const prompt = `Upscale this image to a higher resolution. Enhance the details, sharpen the lines, and make it look crisp and high-quality, suitable for professional use. Do not change the design or composition during the upscaling process.`;
    return callGeminiImageModel(prompt, prepareImageParts([compositedImage]));
}

export async function removeBackground(layers: Layer[]): Promise<string> {
    return getCompositedImage(layers, { type: 'transparent' });
}

export async function removeImageBackground(base64Image: string): Promise<string> {
    const prompt = `**Critical Task: Precision Background Removal.** You are an expert graphic design tool. Your sole function is to identify the primary subject(s) in the provided image and completely remove the background, leaving it fully transparent.
**Instructions:**
1.  **Subject Identification:** Analyze the image to accurately distinguish the foreground subject(s) from the background. Pay close attention to fine details like hair, fur, or complex edges.
2.  **Mask Creation:** Generate a precise, anti-aliased mask around the subject(s).
3.  **Background Removal:** Erase all pixels that are part of the background.
**Output Constraints:**
- The output image **MUST** be a PNG.
- The background of the output image **MUST** be 100% transparent (alpha channel value of 0).
- **DO NOT** replace the background with white, black, a checkerboard pattern, or any other color or visual effect. The background must be empty and transparent.
- Preserve the original resolution and quality of the subject.`;
    return callGeminiImageModel(prompt, prepareImageParts([base64Image]));
}

export async function autoCropImage(base64Image: string): Promise<string> {
    const prompt = `**Critical Task: Smart Bounding Box Crop.** You are an automated cropping tool. Your function is to analyze an image with a transparent background and trim the canvas to the tightest possible bounding box around the visible content.
**Instructions:**
1. **Analyze Alpha Channel:** Scan the image's alpha channel to find the exact coordinates of the top-most, bottom-most, left-most, and right-most non-transparent pixels.
2. **Calculate Bounding Box:** Define a bounding box using these exact coordinates.
3. **Crop:** Crop the image canvas to these dimensions.
**Constraint:** The crop must be pixel-perfect. There should be **zero** extra transparent padding or margin around the subject. The output must be a PNG that preserves the original transparency.`;
    return callGeminiImageModel(prompt, prepareImageParts([base64Image]));
}


export async function refineLogo(layers: Layer[], background: Background, refinementPrompt: string): Promise<string> {
     const compositedImage = await getCompositedImage(layers, background);
     const prompt = `Apply the following refinement to this image: "${refinementPrompt}". The output should be a single PNG image reflecting this change.`;
     return callGeminiImageModel(prompt, prepareImageParts([compositedImage]));
}

export async function generateMockup(layers: Layer[], mockupPrompt: string): Promise<string> {
    const transparentLogo = await getCompositedImage(layers, { type: 'transparent' });
    const prompt = `Place the provided logo onto a realistic mockup. The logo has a transparent background. ${mockupPrompt}. The final image should be a high-quality, photorealistic mockup scene.`;
    return callGeminiImageModel(prompt, prepareImageParts([transparentLogo]));
}

export async function vectorizeLogo(layers: Layer[], background: Background): Promise<string> {
    const finalImage = await getCompositedImage(layers, background);
    const prompt = "Analyze this raster logo image and convert it into a vector graphic. Provide the result as clean, optimized SVG code. The SVG code should be the only content in your response, without any surrounding text, explanations, or markdown fences. Just the raw SVG code starting with `<svg ...>` and ending with `</svg>`.";
    
    const imageParts = prepareImageParts([finalImage]);
    
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro', // Pro model is better for code generation tasks.
            contents: { parts: [...imageParts, {text: prompt}] },
        });

        const candidate = response?.candidates?.[0];

        if (!candidate || (candidate.finishReason !== 'STOP' && candidate.finishReason !== 'MAX_TOKENS')) {
            const finishReason = candidate?.finishReason || 'UNKNOWN';
            console.warn(`Gemini response for vectorization finished with non-STOP reason: ${finishReason}`, candidate?.safetyRatings);
            if (finishReason === 'SAFETY') {
                throw new Error("The vectorization request was blocked for safety reasons.");
            }
            throw new Error(`The AI could not vectorize the logo (Reason: ${finishReason}).`);
        }

        let svgContent = response.text;

        if (!svgContent || svgContent.trim() === '') {
            throw new Error("The AI returned an empty response for vectorization.");
        }
        
        const svgMatch = svgContent.match(/<svg[\s\S]*?<\/svg>/);
        if (svgMatch) {
            svgContent = svgMatch[0];
        } else {
             svgContent = svgContent.replace(/```svg/g, "").replace(/```/g, "").trim();
        }
        
        if (!svgContent.startsWith('<svg')) {
            throw new Error('Invalid SVG code generated.');
        }

        return svgContent;

    } catch (error) {
        console.error("Error vectorizing logo with Gemini:", error);
        if (error instanceof Error) {
            if (error.message.startsWith("The vectorization request was blocked")) {
                throw error;
            }
            try {
                const apiError = JSON.parse(error.message);
                if (apiError.error) {
                    if (apiError.error.code === 429) {
                        throw new Error("You've exceeded your API request quota. Please check your plan and billing details.");
                    }
                    if (apiError.error.message) {
                        throw new Error(`The AI service returned an error: ${apiError.error.message}`);
                    }
                }
            } catch (e) {
                // Not a JSON error message, fall through to generic error.
            }
        }
        throw new Error("Failed to vectorize logo.");
    }
}

export async function vectorizeImageToLayers(base64Image: string): Promise<Layer[]> {
    const prompt = "Analyze the provided logo image. Deconstruct it into its fundamental components: text elements and simple shapes (rectangles, circles). Provide the result as a JSON array where each object represents a single component. For each component, specify its type ('text' or 'shape'), its position (x, y), and its size (width, height) as percentages of the total canvas. Also include specific properties: for text, include the text content, color, approximate fontSize in pixels, fontFamily (suggest a common web font like 'Arial' or 'Helvetica'), fontWeight ('normal' or 'bold'), fontStyle ('normal' or 'italic'), and textAlign ('left', 'center', 'right'). For shapes, include the shape type ('rectangle' or 'circle') and its color. All colors must be in hex format.";

    const imageParts = prepareImageParts([base64Image]);

    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [...imageParts, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING },
                            x: { type: Type.NUMBER },
                            y: { type: Type.NUMBER },
                            width: { type: Type.NUMBER },
                            height: { type: Type.NUMBER },
                            color: { type: Type.STRING },
                            text: { type: Type.STRING },
                            fontSize: { type: Type.NUMBER },
                            fontFamily: { type: Type.STRING },
                            fontWeight: { type: Type.STRING },
                            fontStyle: { type: Type.STRING },
                            textAlign: { type: Type.STRING },
                            shape: { type: Type.STRING },
                        },
                    },
                },
            },
        });
        
        const candidate = response?.candidates?.[0];

        if (!candidate || (candidate.finishReason !== 'STOP' && candidate.finishReason !== 'MAX_TOKENS')) {
            const finishReason = candidate?.finishReason || 'UNKNOWN';
            console.warn(`Gemini response for layer vectorization finished with non-STOP reason: ${finishReason}`, candidate?.safetyRatings);
            if (finishReason === 'SAFETY') {
                throw new Error("The layer vectorization request was blocked for safety reasons.");
            }
            throw new Error(`The AI could not deconstruct the logo (Reason: ${finishReason}).`);
        }

        let jsonStr = response.text.trim();
        if (!jsonStr) {
            throw new Error("The AI returned an empty JSON response.");
        }
        
        const parsedLayers: any[] = JSON.parse(jsonStr);

        return parsedLayers.map((layerData, index) => {
            const baseLayer = {
                id: `${layerData.type}-${Date.now()}-${index}`,
                zIndex: index + 1,
                x: layerData.x ?? 10,
                y: layerData.y ?? 10,
                width: layerData.width ?? 20,
                height: layerData.height ?? 10,
            };

            if (layerData.type === 'text') {
                return {
                    ...baseLayer,
                    type: 'text',
                    text: layerData.text ?? '',
                    color: layerData.color ?? '#000000',
                    fontSize: layerData.fontSize ?? 16,
                    fontFamily: layerData.fontFamily ?? "'Inter', sans-serif",
                    fontWeight: ['normal', 'bold'].includes(layerData.fontWeight) ? layerData.fontWeight : 'normal',
                    fontStyle: ['normal', 'italic'].includes(layerData.fontStyle) ? layerData.fontStyle : 'normal',
                    textAlign: ['left', 'center', 'right'].includes(layerData.textAlign) ? layerData.textAlign : 'left',
                } as TextElement;
            } else if (layerData.type === 'shape') {
                return {
                    ...baseLayer,
                    type: 'shape',
                    shape: ['rectangle', 'circle'].includes(layerData.shape) ? layerData.shape : 'rectangle',
                    color: layerData.color ?? '#000000',
                } as ShapeElement;
            }
            return null;
        // FIX: The type predicate must use a type that is assignable to its parameter's type.
        // The preceding map function only returns `TextElement` or `ShapeElement` (or `null`),
        // so the type guard must be narrowed from `Layer` to `TextElement | ShapeElement`.
        }).filter((l): l is TextElement | ShapeElement => l !== null);

    } catch (error) {
        console.error("Error vectorizing logo to layers with Gemini:", error);
        if (error instanceof Error) {
            if (error.message.startsWith("The layer vectorization request was blocked")) {
                throw error;
            }
            try {
                const apiError = JSON.parse(error.message);
                if (apiError.error) {
                    if (apiError.error.code === 429) {
                        throw new Error("You've exceeded your API request quota. Please check your plan and billing details.");
                    }
                    if (apiError.error.message) {
                        throw new Error(`The AI service returned an error: ${apiError.error.message}`);
                    }
                }
            } catch (e) {
                // Not a JSON error message, fall through to generic error.
            }
        }
        throw new Error("Failed to deconstruct logo into layers.");
    }
}
