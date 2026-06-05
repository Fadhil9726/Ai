// api/ai.js
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message, email } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const OPENROUTER_API_KEY = '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';

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://dilzx-ai.vercel.app',
                'X-Title': 'DILZX AI'
            },
            body: JSON.stringify({
                model: 'openai/gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are DILZX AI, a helpful and friendly AI assistant. Respond naturally and helpfully.'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error('OpenRouter error:', data.error);
            return res.status(200).json({
                success: true,
                reply: "I'm having some technical difficulties right now. Please try again in a moment. - DILZX AI"
            });
        }

        const reply = data.choices?.[0]?.message?.content || "I'm not sure how to respond to that. Could you rephrase?";

        // Log usage untuk admin (opsional)
        console.log(`[AI] User: ${email} | Message: ${message.substring(0, 50)}...`);

        return res.status(200).json({
            success: true,
            reply: reply
        });

    } catch (error) {
        console.error('AI Error:', error);
        return res.status(200).json({
            success: true,
            reply: "Connection error. Please try again later. - DILZX AI"
        });
    }
}