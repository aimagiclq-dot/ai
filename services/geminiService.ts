import { GoogleGenAI, Modality, Type } from "@google/genai";
import { FontStyle, Industry, Layer, Background, TextElement, ShapeElement } from "../types";

interface LogoGenerationParams {
    name: string;
    slogan?: string;
    industry: Industry | null;
    colors: { name: string }[];
    fonts: FontStyle[];
    prompt?: string;
}

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

    const parts = [...images, { text: prompt }];
    const contents = { parts };

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: contents,
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const candidate = response?.candidates?.[0];

        // Handle cases where the response is empty or blocked.
        if (!candidate || !candidate.content || !candidate.content.parts) {
            console.error("Invalid response structure from Gemini, no content found:", response);
            const isSafetyBlock = candidate?.finishReason === 'SAFETY';
            if (isSafetyBlock) {
                throw new Error("The request was blocked by the AI's safety settings. Please modify your prompt.");
            }
            throw new Error("The AI returned an empty or invalid response. This can happen due to safety filters or an unclear prompt.");
        }

        // Check for non-STOP finish reasons, especially safety.
        if (candidate.finishReason && candidate.finishReason !== 'STOP') {
             console.warn('Gemini response finished with reason:', candidate.finishReason);
             if (candidate.finishReason === 'SAFETY') {
                throw new Error("The request was blocked by the AI's safety settings. Please modify your prompt.");
             }
        }
        
        // Find the first part that contains image data.
        const imagePart = candidate.content.parts.find(part => part.inlineData);

        if (imagePart?.inlineData) {
            const base64ImageBytes: string = imagePart.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }

        // If we reach here, no image was found in a successful response.
        console.error("Invalid response structure from Gemini:", response);
        throw new Error("No image data found in the AI response. The prompt may have been blocked or the response was empty.");

    } catch (error) {
        console.error("Error interacting with Gemini:", error);
        // Propagate specific, user-friendly errors.
        if (error instanceof Error && (error.message.includes("safety settings") || error.message.includes("invalid response"))) {
            throw error;
        }
        // Fallback to a generic error message.
        throw new Error("Failed to process image with AI.");
    }
}

export async function generateLogo({ name, slogan, industry, colors, fonts, prompt: extraPrompt }: LogoGenerationParams): Promise<string> {
    let prompt = `Create a professional, modern, and clean logo for a company named "${name}".`;
    if (slogan) {
        prompt += ` The company's slogan is "${slogan}".`;
    }
    if (industry) {
        prompt += ` The industry is ${industry.name}.`;
    }
    if (colors.length > 0) {
        const colorNames = colors.map(c => c.name.toLowerCase()).join(' and ');
        prompt += ` The desired color palette is ${colorNames}.`;
    }
    if (fonts.length > 0) {
        const fontNames = fonts.map(f => f.name).join(' or ');
        prompt += ` The font style should be in the style of ${fontNames}.`;
    }
     if (extraPrompt) {
        prompt += ` Additional instructions: ${extraPrompt}.`
    }
    prompt += ' The logo should be iconic, memorable, and vector-friendly. Provide the logo on a solid white background unless other background colors are specified. The output must be a high-quality PNG. Do not include any text other than the company name and slogan if provided.'

    return callGeminiImageModel(prompt, []);
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

        let svgContent = response.text;
        
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
        throw new Error("Failed to vectorize logo.");
    }
}

export async function vectorizeImageToLayers(base64Image: string): Promise<Layer[]> {
    const prompt = "Analyze the provided logo image. Deconstruct it into its fundamental components: text elements and simple shapes (rectangles, circles). Provide the result as a JSON array where each object represents a single component. For each component, specify its type ('text' or 'shape'), its position (x, y), and its size (width, height) as percentages of the total canvas. Also include specific properties: for text, include the text content, color, approximate fontSize in pixels, fontFamily (suggest a common web font like 'Arial' or 'Helvetica'), fontWeight ('normal' or 'bold'), fontStyle ('normal' or 'italic'), and textAlign ('left', 'center', or 'right'). For shapes, include the shape type ('rectangle' or 'circle') and its color. All colors must be in hex format.";

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
        
        let jsonStr = response.text.trim();
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
        throw new Error("Failed to vectorize logo.");
    }
}