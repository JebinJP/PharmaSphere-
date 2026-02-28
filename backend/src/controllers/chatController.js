const geminiService = require('../services/geminiService');
const medicineModel = require('../models/medicineModel');

const sendMessage = async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        // Fetch current inventory
        const medicines = await medicineModel.getAllMedicines();

        // Format inventory for AI context
        // Format inventory for AI context
        const inventoryContext = medicines.map(m =>
            `- ${m.name} (ID: ${m.id}): ${m.quantity} units, Price: ₹${m.price}`
        ).join('\n');

        const systemContext = `
You are a knowledgeable pharmacy assistant with access to the real-time inventory.
Here is the current stock list:
${inventoryContext}

Rules:
1. Answer directly based ONLY on the provided inventory list.
2. Do NOT say "Let me check" or ask clarifying questions like "what strength?" or "what brand?".
3. If the user asks for a medicine (e.g., "Paracetamol"), list ALL available variations found in the inventory immediately.
4. If the medicine is not in the list, state clearly that it is out of stock.
5. Provide the exact Name, Quantity, and Price for the items found.
6. Be concise and data-driven.
        `.trim();

        const response = await geminiService.chatWithBot(message, systemContext);
        res.json({ response });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get response from bot' });
    }
};

module.exports = { sendMessage };
