const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize Gemini Client
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

const fs = require('fs');

const fileToGenerativePart = (path, mimeType) => {
    return {
        inlineData: {
            data: fs.readFileSync(path).toString("base64"),
            mimeType
        },
    };
};

const extractPrescriptionData = async (text, imagePath) => {
    if (!genAI) {
        throw new Error("Gemini API Key is missing");
    }

    try {
        const modelName = process.env.GEMINI_MODEL_NAME || "gemini-2.5-flash";
        const model = genAI.getGenerativeModel({ model: modelName });

        const prompt = `Analyze this prescription image and extract the following details in structured JSON format:
        - patientName (string, or null if not found)
        - date (string YYYY-MM-DD, or current date if not found)
        - medicines (array of objects with: name, quantity (number/string), dosage, instructions)
        
        Return ONLY the JSON object, no markdown.`;

        const imagePart = fileToGenerativePart(imagePath, "image/jpeg"); // Assuming JPEG for simplicity, or detect mime

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const textResponse = response.text();

        // Cleanup JSON string if it contains markdown code blocks
        const cleanedText = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanedText);
    } catch (e) {
        console.error("Gemini Extraction Failed:", e);
        return null;
    }
};

const chatWithBot = async (message, context = "You are a helpful pharmacy assistant.") => {
    if (!genAI) {
        return "I am a demo bot (Gemini Key missing). I can help you check inventory or answer basic questions.";
    }

    try {
        const modelName = process.env.GEMINI_MODEL_NAME || "gemini-2.5-flash";
        const model = genAI.getGenerativeModel({ model: modelName });
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: context }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I am ready to assist with pharmacy operations." }],
                },
            ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return "Sorry, I am having trouble connecting to the AI service right now.";
    }
};

module.exports = { extractPrescriptionData, chatWithBot };
