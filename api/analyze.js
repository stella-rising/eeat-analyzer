// Vercel Serverless Function for E-E-A-T Analysis v2.1
// Includes intent-aware scoring and manual check flags

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

  const prompt = `Analyze this URL for E-E-A-T signals: ${url}

You are an E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) analyzer. Fetch and analyze the webpage, then evaluate it against Google's Search Quality Rater Guidelines.

INTENT DEFINITIONS:
- informational: Blog posts, guides, how-to articles, educational content
- commercial: Product pages, category pages, comparison pages
- transactional: Checkout pages, signup forms, contact forms
- navigational: Homepage, hub pages, site navigation pages
- service: Service offering pages, pricing pages

First, determine the page's PRIMARY INTENT from the above categories.

RATING RULES:
- Use 0-2 scale: 0 = missing/not found, 1 = partial/weak, 2 = strong/complete
- Use -1 for signals that REQUIRE MANUAL VERIFICATION (you cannot accurately assess from page content alone)

Signals that should typically be -1 (need manual check):
- Domain: accreditations, pressCoverage, orgSchema, thirdPartyReviews, topicalFocus
- Content: authorExpert, schema, upToDate, uniqueMedia, factual, effort, insights, intentMatch, experience, productDetails
- Author: firstHand, expertise, credentials, pressCited, multiplePosts, profileSchema

Return ONLY this JSON structure:
{
  "intent": "informational|commercial|transactional|navigational|service",
  "intentNote": "Brief explanation of why this intent was chosen",
  "purpose": "Brief description of page purpose",
  "purposeNote": "Additional context about the page",
  "ymyl": "none|health|finance|legal|news|safety|other",
  "ymylNote": "Why this YMYL classification",
  "harmful": false,
  "harmNote": "",
  "domain": {
    "contactAddress": 0-2,
    "phone": 0-2,
    "email": 0-2,
    "contactPage": 0-2,
    "ssl": 0-2,
    "privacyPolicy": 0-2,
    "terms": 0-2,
    "aboutPage": 0-2,
    "teamPage": 0-2,
    "accreditations": -1,
    "pressCoverage": -1,
    "editorialPolicy": 0-2,
    "socialLinks": 0-2,
    "orgSchema": -1,
    "testimonials": 0-2,
    "thirdPartyReviews": -1,
    "caseStudies": 0-2,
    "topicalFocus": -1
  },
  "content": {
    "author": 0-2,
    "authorExpert": -1,
    "authorLink": 0-2,
    "schema": -1,
    "publishDate": 0-2,
    "updateDate": 0-2,
    "upToDate": -1,
    "reviewer": 0-2,
    "uniqueMedia": -1,
    "grammar": 0-2,
    "sources": 0-2,
    "factual": -1,
    "noAds": 0-2,
    "effort": -1,
    "insights": -1,
    "intentMatch": -1,
    "experience": -1,
    "productDetails": -1,
    "pricing": 0-2,
    "cta": 0-2
  },
  "author": {
    "profile": 0-2,
    "firstHand": -1,
    "expertise": -1,
    "bio": 0-2,
    "photo": 0-2,
    "title": 0-2,
    "credentials": -1,
    "social": 0-2,
    "pressCited": -1,
    "multiplePosts": -1,
    "profileSchema": -1
  },
  "strengths": ["list of 3-5 E-E-A-T strengths found on this page"],
  "weaknesses": ["list of 3-5 E-E-A-T weaknesses found on this page"],
  "recommendations": ["list of 3-5 priority recommendations for this page"]
}

For commercial/transactional pages, author signals may not apply - rate them 0.

IMPORTANT: Return ONLY valid JSON, no markdown code blocks or explanation.`;

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
        max_tokens: 3000,
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
    
    // Extract JSON from response (handle markdown code blocks if present)
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      text = jsonMatch[1].trim();
    }
    
    // Try to find JSON object if not clean
    if (!text.startsWith('{')) {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        text = text.slice(jsonStart, jsonEnd + 1);
      }
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
