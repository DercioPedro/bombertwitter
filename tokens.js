// token.js - Backend na raiz do projeto
module.exports = async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', 'https://derciopedro.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const TWITTER_CONFIG = {
        clientId: 'NDJvSmxEUFpWcmdhUWJRN3RZZS06MTpjaQ',
        clientSecret: 'YZY1EmQFMLnmO7R-udAjFcfYLJ4vw7QjHt2T59Z8UEKvyV0kLK',
        redirectUri: 'https://derciopedro.github.io/bombertwitter',
    };

    if (req.method === 'POST') {
        try {
            const { code } = req.body;

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
                return res.status(response.status).json({ error: data });
            }

            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
