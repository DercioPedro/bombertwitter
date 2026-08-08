// api/token.js - Backend Vercel (COMPLETO)
export default async function handler(req, res) {
    // CORS Headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': 'https://derciopedro.github.io',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
    };

    // Aplicar headers CORS
    Object.entries(corsHeaders).forEach(([key, value]) => {
        res.setHeader(key, value);
    });

    // Responder requisições OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Configurações do Twitter
    const TWITTER_CONFIG = {
        clientId: 'NDJvSmxEUFpWcmdhUWJRN3RZZS06MTpjaQ',
        clientSecret: 'YZY1EmQFMLnmO7R-udAjFcfYLJ4vw7QjHt2T59Z8UEKvyV0kLK',
        redirectUri: 'https://derciopedro.github.io/bombertwitter',
    };

    // Apenas aceita POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Code is required' });
        }

        console.log('🔄 Trocando código por token...');

        // 🔥 PARTE IMPORTANTE QUE ESTAVA FALTANDO
        const params = new URLSearchParams({
            code: code,
            grant_type: 'authorization_code',
            client_id: TWITTER_CONFIG.clientId,
            redirect_uri: TWITTER_CONFIG.redirectUri,
            code_verifier: 'challenge',
        });

        const response = await fetch('https://api.twitter.com/2/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(
                    TWITTER_CONFIG.clientId + ':' + TWITTER_CONFIG.clientSecret
                ).toString('base64')
            },
            body: params.toString()
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('❌ Erro da API:', data);
            return res.status(response.status).json({ 
                error: 'Erro na API do Twitter',
                details: data 
            });
        }

        console.log('✅ Token obtido!');
        return res.status(200).json(data);

    } catch (error) {
        console.error('❌ Erro:', error);
        return res.status(500).json({ 
            error: 'Erro interno',
            message: error.message 
        });
    }
}
