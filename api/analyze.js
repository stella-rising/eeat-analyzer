// Vercel Serverless Function for E-E-A-T Analysis
// This proxies requests to Claude API to keep API keys secure

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Get API key from header (user's key) or environment (your key)
  const apiKey = req.headers['x-api-key'] || process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    return res.status(401).json({ 
      error: 'API key required. Please add your Anthropic API key in settings.' 
    });
  }

  const prompt = `Analyze this URL for E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signals based on Google's Search Quality Rater Guidelines.

URL: ${url}

Evaluate the page and return a JSON object with this exact structure:
{
  "purpose": "informational|transactional|navigational|entertainment|service",
  "purposeNote": "Brief explanation of page purpose",
  "ymyl": "health|finance|safety|legal|news|shopping|groups|none",
  "ymylNote": "Why this is/isn't YMYL",
  "harmful": false,
  "harmNote": "Any concerns or 'No harmful content detected'",
  "brand": {
    "contactInfo": 0-2,
    "ssl": 0-2,
    "policies": 0-2,
    "aboutPage": 0-2,
    "trustSignals": 0-2
  },
  "content": {
    "author": 0-2,
    "dates": 0-2,
    "sources": 0-2,
    "quality": 0-2,
    "experience": 0-2
  },
  "author": {
    "profile": 0-2,
    "credentials": 0-2,
    "expertise": 0-2
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "recommendations": ["Top priority fix 1", "Top priority fix 2", "Top priority fix 3"]
}

Rating scale: 0 = Missing/Not found, 1 = Partial/Needs improvement, 2 = Fully demonstrated

Be thorough but concise. Return ONLY valid JSON, no other text.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Claude API error:', error);
      return res.status(response.status).json({ 
        error: error.error?.message || 'Claude API request failed' 
      });
    }

    const data = await response.json();
    let text = data.content[0].text;
    
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      text = jsonMatch[1].trim();
    }
    
    const analysis = JSON.parse(text);
    return res.status(200).json(analysis);
    
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({ 
      error: error.message || 'Analysis failed' 
    });
  }
}
