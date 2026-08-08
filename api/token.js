// api/token.js
export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ error: 'Code is required' });
        }

        const params = new URLSearchParams({
            code: code,
            grant_type: 'authorization_code',
            client_id: 'NDJvSmxEUFpWcmdhUWJRN3RZZS06MTpjaQ',
            redirect_uri: 'https://derciopedro.github.io/bombertwitter',
            code_verifier: 'challenge',
        });

        const response = await fetch('https://api.twitter.com/2/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(
                    'NDJvSmxEUFpWcmdhUWJRN3RZZS06MTpjaQ:YZY1EmQFMLnmO7R-udAjFcfYLJ4vw7QjHt2T59Z8UEKvyV0kLK'
                ).toString('base64')
            },
            body: params.toString()
        });

        const data = await response.json();
        return res.status(response.status).json(data);

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
