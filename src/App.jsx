import React, { useState, useEffect } from 'react';

// =============================================================================
// SIGNAL DEFINITIONS - Separated into Domain-Level and Page-Level
// =============================================================================

// Domain-Level Signals (Brand & Trust) - Only shown in Domain Health tab
const DOMAIN_SIGNALS = {
  brand: {
    name: "Brand & Trust Signals",
    description: "Site-wide signals that establish domain credibility",
    items: [
      { id: "d1", signal: "Physical business address visible", concept: "Trust", weight: 2, manualCheck: false },
      { id: "d2", signal: "Phone number visible", concept: "Trust", weight: 2, manualCheck: false },
      { id: "d3", signal: "Contact email from main domain", concept: "Trust", weight: 2, manualCheck: false },
      { id: "d4", signal: "Dedicated Contact Us page", concept: "Trust", weight: 2, manualCheck: false },
      { id: "d5", signal: "Valid SSL certificate", concept: "Trust", weight: 3, manualCheck: false },
      { id: "d6", signal: "Privacy Policy page", concept: "Trust", weight: 2, manualCheck: false },
      { id: "d7", signal: "Terms & Conditions page", concept: "Trust", weight: 2, manualCheck: false },
      { id: "d8", signal: "Detailed About Us page", concept: "Authority", weight: 3, manualCheck: false },
      { id: "d9", signal: "Meet the Team page", concept: "Trust", weight: 2, manualCheck: false },
      { id: "d10", signal: "Accreditations/memberships displayed", concept: "Trust", weight: 2, manualCheck: true },
      { id: "d11", signal: "Press coverage/As Featured In", concept: "Authority", weight: 2, manualCheck: true },
      { id: "d12", signal: "Editorial Policy page", concept: "Trust", weight: 2, manualCheck: false },
      { id: "d13", signal: "Social media links visible", concept: "Trust", weight: 1, manualCheck: false },
      { id: "d14", signal: "Organization Schema markup", concept: "Trust", weight: 2, manualCheck: true },
      { id: "d15", signal: "Reviews/testimonials on site", concept: "Trust", weight: 2, manualCheck: false },
      { id: "d16", signal: "Third-party reviews (Google, Trustpilot, etc.)", concept: "Trust", weight: 3, manualCheck: true },
      { id: "d17", signal: "Case studies/customer stories", concept: "Trust", weight: 2, manualCheck: false },
      { id: "d18", signal: "Clear topical focus area", concept: "Authority", weight: 2, manualCheck: true }
    ]
  }
};

// Page-Level Signals - Content and Author (filtered by intent)
const PAGE_SIGNALS = {
  content: {
    name: "Content Quality Signals",
    description: "Page-specific content quality indicators",
    items: [
      { id: "c1", signal: "Author clearly displayed", concept: "Expertise", weight: 3, intents: ['informational'], manualCheck: false },
      { id: "c2", signal: "Author is subject matter expert", concept: "Expertise", weight: 3, intents: ['informational'], manualCheck: true },
      { id: "c3", signal: "Link to author profile page", concept: "Expertise", weight: 2, intents: ['informational'], manualCheck: false },
      { id: "c4", signal: "Appropriate Schema markup (Article, Product, etc.)", concept: "Expertise", weight: 2, intents: ['all'], manualCheck: true },
      { id: "c5", signal: "Publish date shown", concept: "Authority", weight: 2, intents: ['informational'], manualCheck: false },
      { id: "c6", signal: "Last updated date shown", concept: "Authority", weight: 2, intents: ['informational'], manualCheck: false },
      { id: "c7", signal: "Content is factually up-to-date", concept: "Authority", weight: 3, intents: ['informational'], manualCheck: true },
      { id: "c8", signal: "Medical/Legal/Financial reviewer (YMYL)", concept: "Expertise", weight: 3, intents: ['informational'], manualCheck: false },
      { id: "c9", signal: "Original photos/videos/visuals", concept: "Experience", weight: 3, intents: ['informational', 'commercial'], manualCheck: true },
      { id: "c10", signal: "Free from spelling/grammar errors", concept: "Authority", weight: 2, intents: ['all'], manualCheck: false },
      { id: "c11", signal: "Links to authoritative sources", concept: "Authority", weight: 3, intents: ['informational'], manualCheck: false },
      { id: "c12", signal: "Factually accurate content", concept: "Expertise", weight: 3, intents: ['informational'], manualCheck: true },
      { id: "c13", signal: "Free from distracting/intrusive ads", concept: "Trust", weight: 2, intents: ['all'], manualCheck: false },
      { id: "c14", signal: "Clear human effort demonstrated", concept: "Authority", weight: 2, intents: ['all'], manualCheck: true },
      { id: "c15", signal: "Unique insights or perspectives", concept: "Expertise", weight: 3, intents: ['informational'], manualCheck: true },
      { id: "c16", signal: "Matches searcher intent", concept: "Expertise", weight: 3, intents: ['all'], manualCheck: true },
      { id: "c17", signal: "Written from first-hand experience", concept: "Experience", weight: 3, intents: ['informational'], manualCheck: true },
      { id: "c18", signal: "Product details accurate and complete", concept: "Expertise", weight: 3, intents: ['commercial'], manualCheck: true },
      { id: "c19", signal: "Clear pricing/availability info", concept: "Trust", weight: 2, intents: ['commercial', 'service'], manualCheck: false },
      { id: "c20", signal: "Clear call-to-action", concept: "Trust", weight: 2, intents: ['commercial', 'service', 'transactional'], manualCheck: false }
    ]
  },
  author: {
    name: "Author Credibility Signals",
    description: "Signals establishing author expertise (primarily for informational content)",
    items: [
      { id: "a1", signal: "Standalone author profile page exists", concept: "Authority", weight: 3, intents: ['informational'], manualCheck: false },
      { id: "a2", signal: "Author has first-hand experience in topic", concept: "Experience", weight: 3, intents: ['informational'], manualCheck: true },
      { id: "a3", signal: "Author has formal expertise/credentials", concept: "Expertise", weight: 3, intents: ['informational'], manualCheck: true },
      { id: "a4", signal: "Author bio is detailed and current", concept: "Expertise", weight: 2, intents: ['informational'], manualCheck: false },
      { id: "a5", signal: "Author headshot/photo displayed", concept: "Expertise", weight: 2, intents: ['informational'], manualCheck: false },
      { id: "a6", signal: "Author job title displayed", concept: "Expertise", weight: 2, intents: ['informational'], manualCheck: false },
      { id: "a7", signal: "Professional credentials shown", concept: "Expertise", weight: 3, intents: ['informational'], manualCheck: true },
      { id: "a8", signal: "Links to author social profiles", concept: "Expertise", weight: 2, intents: ['informational'], manualCheck: false },
      { id: "a9", signal: "Author cited as expert elsewhere", concept: "Authority", weight: 3, intents: ['informational'], manualCheck: true },
      { id: "a10", signal: "Author has multiple posts on topic", concept: "Authority", weight: 2, intents: ['informational'], manualCheck: true },
      { id: "a11", signal: "ProfilePage Schema markup", concept: "Expertise", weight: 2, intents: ['informational'], manualCheck: true }
    ]
  }
};

// Suggestions for each signal
const suggestions = {
  d1: "Add physical business address to footer and Contact page. Avoid PO boxes or virtual addresses.",
  d2: "Display a phone number prominently in header or footer. Consider click-to-call for mobile.",
  d3: "Use professional email from your domain (contact@yourdomain.com), not Gmail/Yahoo.",
  d4: "Create a dedicated Contact Us page with multiple contact methods.",
  d5: "Ensure SSL certificate is installed, valid, and not expired. Check for mixed content warnings.",
  d6: "Create comprehensive Privacy Policy page and link prominently in footer.",
  d7: "Add Terms & Conditions page covering user rights, limitations, and legal disclaimers.",
  d8: "Develop detailed About Us page with company history, mission, team bios, and expertise.",
  d9: "Create Meet the Team page showcasing key team members with photos and backgrounds.",
  d10: "Display industry accreditations, certifications, and professional memberships.",
  d11: "Add 'As Featured In' section with logos and links to press coverage.",
  d12: "Publish Editorial Policy explaining content standards, fact-checking, and update processes.",
  d13: "Add social media icons in header/footer linking to active company profiles.",
  d14: "Implement Organization Schema markup with logo, contact info, and social profiles.",
  d15: "Display customer testimonials and reviews prominently on relevant pages.",
  d16: "Integrate third-party review widgets (Google Reviews, Trustpilot, etc.).",
  d17: "Publish detailed case studies showing real results and customer success stories.",
  d18: "Ensure site maintains clear topical focus rather than covering unrelated subjects.",
  c1: "Add clear author attribution with full name on all content pages.",
  c2: "Ensure content is written by qualified subject matter experts in the field.",
  c3: "Link author names to dedicated author profile pages with full bios.",
  c4: "Implement Article, BlogPosting, Product, or appropriate Schema markup.",
  c5: "Display publish date on all content pages.",
  c6: "Show 'last updated' date, especially for evergreen content.",
  c7: "Review and update content regularly to ensure accuracy.",
  c8: "For YMYL content, display medical/legal/financial reviewer credentials.",
  c9: "Use original photos, screenshots, and videos instead of stock imagery.",
  c10: "Proofread all content. Use grammar tools and consider professional editing.",
  c11: "Add citations and links to authoritative sources when making claims.",
  c12: "Fact-check all content. Cite primary sources and expert opinions.",
  c13: "Remove or minimize intrusive ads. Ensure ads don't interfere with content.",
  c14: "Demonstrate clear effort and original research. Avoid thin or AI-generated content.",
  c15: "Include unique perspectives, expert quotes, and original insights.",
  c16: "Align content with search intent. Check SERP to understand what users expect.",
  c17: "Write from first-hand experience. Include personal insights and real examples.",
  c18: "Ensure product specifications, features, and details are accurate and complete.",
  c19: "Display clear pricing, availability, and shipping information.",
  c20: "Include clear, prominent call-to-action buttons or links.",
  a1: "Create standalone author profile pages with comprehensive bios.",
  a2: "Feature authors with demonstrable first-hand experience in topics.",
  a3: "Highlight formal education, degrees, and professional training.",
  a4: "Keep author bios current with recent achievements and roles.",
  a5: "Add professional headshots to author profiles and bylines.",
  a6: "Display job titles that demonstrate relevant expertise.",
  a7: "Show professional certifications, licenses, and accreditations.",
  a8: "Link to author LinkedIn, Twitter/X, and professional profiles.",
  a9: "Pursue PR opportunities to get authors cited as experts in media.",
  a10: "Build content depth by publishing multiple related articles per author.",
  a11: "Implement ProfilePage Schema markup on author pages."
};

// Check if signal applies to intent
const signalAppliesTo = (signal, intent) => {
  if (!signal.intents || signal.intents.includes('all')) return true;
  return signal.intents.includes(intent);
};

// Calculate page-level scores (content + author signals only)
const calculatePageScores = (ratings, intent) => {
  const scores = { Experience: 0, Expertise: 0, Authority: 0, Trust: 0 };
  const maxScores = { Experience: 0, Expertise: 0, Authority: 0, Trust: 0 };
  
  Object.values(PAGE_SIGNALS).forEach(cat => {
    cat.items.forEach(item => {
      if (!signalAppliesTo(item, intent)) return;
      const rating = ratings[item.id];
      if (rating === undefined || rating === -1) return; // Skip unrated/needs-review
      scores[item.concept] += rating * item.weight;
      maxScores[item.concept] += 2 * item.weight;
    });
  });

  const pct = {};
  Object.keys(scores).forEach(k => {
    pct[k] = maxScores[k] > 0 ? Math.round((scores[k] / maxScores[k]) * 100) : 0;
  });
  return pct;
};

// Calculate domain-level scores (brand signals only)
const calculateDomainScores = (domainRatings) => {
  const scores = { Authority: 0, Trust: 0 };
  const maxScores = { Authority: 0, Trust: 0 };
  
  DOMAIN_SIGNALS.brand.items.forEach(item => {
    const rating = domainRatings[item.id];
    if (rating === undefined || rating === -1) return;
    scores[item.concept] += rating * item.weight;
    maxScores[item.concept] += 2 * item.weight;
  });

  const pct = {};
  Object.keys(scores).forEach(k => {
    pct[k] = maxScores[k] > 0 ? Math.round((scores[k] / maxScores[k]) * 100) : 0;
  });
  
  const overall = Math.round((pct.Authority + pct.Trust) / 2);
  return { ...pct, overall };
};

const getLabel = (score) => {
  if (score >= 80) return { label: "Excellent", color: "text-green-600", bg: "bg-green-100", bgDark: "bg-green-500" };
  if (score >= 60) return { label: "Good", color: "text-blue-600", bg: "bg-blue-100", bgDark: "bg-blue-500" };
  if (score >= 40) return { label: "Needs Work", color: "text-yellow-600", bg: "bg-yellow-100", bgDark: "bg-yellow-500" };
  return { label: "Poor", color: "text-red-600", bg: "bg-red-100", bgDark: "bg-red-500" };
};

const getIntentLabel = (intent) => {
  const labels = {
    informational: { icon: "📚", label: "Informational", desc: "Blog, guide, how-to content" },
    commercial: { icon: "🛒", label: "Commercial", desc: "Product or category pages" },
    transactional: { icon: "💳", label: "Transactional", desc: "Checkout, forms, conversions" },
    navigational: { icon: "🧭", label: "Navigational", desc: "Homepage, hub pages" },
    service: { icon: "🔧", label: "Service", desc: "Service offerings pages" }
  };
  return labels[intent] || { icon: "📄", label: intent || "Unknown", desc: "" };
};

// Get all manual check items
const getManualCheckItems = (pages, domainRatings) => {
  const items = [];
  
  // Domain-level manual checks
  DOMAIN_SIGNALS.brand.items.forEach(item => {
    if (item.manualCheck) {
      const rating = domainRatings[item.id];
      items.push({
        ...item,
        level: 'domain',
        currentRating: rating,
        needsCheck: rating === undefined || rating === -1
      });
    }
  });
  
  // Page-level manual checks
  pages.filter(p => p.status === 'complete').forEach(page => {
    Object.values(PAGE_SIGNALS).forEach(cat => {
      cat.items.forEach(item => {
        if (item.manualCheck && signalAppliesTo(item, page.intent)) {
          const rating = page.ratings[item.id];
          items.push({
            ...item,
            level: 'page',
            pageId: page.id,
            pageUrl: page.url,
            intent: page.intent,
            currentRating: rating,
            needsCheck: rating === undefined || rating === -1
          });
        }
      });
    });
  });
  
  return items;
};

// Export functions
const downloadCSV = (content, filename) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const exportPageCSV = (page) => {
  const s = calculatePageScores(page.ratings || {}, page.intent);
  const overall = Math.round((s.Experience + s.Expertise + s.Authority + s.Trust) / 4);
  
  let csv = "Section,Signal,Rating,Status,Applicable,Recommendation\n";
  
  Object.entries(PAGE_SIGNALS).forEach(([key, cat]) => {
    cat.items.forEach(item => {
      const applies = signalAppliesTo(item, page.intent);
      const rating = page.ratings?.[item.id] ?? 0;
      const status = !applies ? "N/A" : rating === 2 ? "Full" : rating === 1 ? "Partial" : rating === -1 ? "Needs Review" : "Missing";
      const rec = rating < 2 && rating !== -1 && applies ? suggestions[item.id] : "";
      csv += `"${cat.name}","${item.signal}",${applies ? rating : 'N/A'},"${status}","${applies ? 'Yes' : 'No'}","${rec.replace(/"/g, '""')}"\n`;
    });
  });
  
  csv += `\n"SUMMARY","URL","${page.url}","","",""\n`;
  csv += `"","Intent","${page.intent || 'Unknown'}","","",""\n`;
  csv += `"","YMYL","${page.ymyl || 'None'}","","",""\n`;
  csv += `"","Experience Score","${s.Experience}%","","",""\n`;
  csv += `"","Expertise Score","${s.Expertise}%","","",""\n`;
  csv += `"","Authority Score","${s.Authority}%","","",""\n`;
  csv += `"","Trust Score","${s.Trust}%","","",""\n`;
  csv += `"","Overall Score","${overall}%","${getLabel(overall).label}","",""\n`;
  
  downloadCSV(csv, `eeat_page_${new URL(page.url).pathname.replace(/\//g, '_') || 'home'}_${new Date().toISOString().split('T')[0]}.csv`);
};

const exportAllCSV = (pages) => {
  const completedPages = pages.filter(p => p.status === 'complete');
  if (!completedPages.length) return;
  
  let header = "URL,Intent,YMYL";
  Object.values(PAGE_SIGNALS).forEach(cat => {
    cat.items.forEach(item => {
      header += `,"${item.signal}"`;
    });
  });
  header += ",Experience %,Expertise %,Authority %,Trust %,Overall %,Score Label,Top 3 Recommendations\n";
  
  let csv = header;
  
  completedPages.forEach(page => {
    const s = calculatePageScores(page.ratings || {}, page.intent);
    const overall = Math.round((s.Experience + s.Expertise + s.Authority + s.Trust) / 4);
    
    let row = `"${page.url}","${page.intent || ''}","${page.ymyl || 'none'}"`;
    
    Object.values(PAGE_SIGNALS).forEach(cat => {
      cat.items.forEach(item => {
        const applies = signalAppliesTo(item, page.intent);
        const rating = page.ratings?.[item.id] ?? 0;
        row += `,${applies ? rating : 'N/A'}`;
      });
    });
    
    const recs = [];
    Object.values(PAGE_SIGNALS).forEach(cat => {
      cat.items.forEach(item => {
        if (signalAppliesTo(item, page.intent) && (page.ratings?.[item.id] ?? 0) < 2 && page.ratings?.[item.id] !== -1) {
          recs.push({ signal: item.signal, weight: item.weight });
        }
      });
    });
    recs.sort((a, b) => b.weight - a.weight);
    const topRecs = recs.slice(0, 3).map(r => r.signal).join('; ');
    
    row += `,${s.Experience},${s.Expertise},${s.Authority},${s.Trust},${overall},"${getLabel(overall).label}","${topRecs}"`;
    csv += row + "\n";
  });
  
  downloadCSV(csv, `eeat_all_pages_${new Date().toISOString().split('T')[0]}.csv`);
};

const exportExecutiveSummary = (pages, domainRatings) => {
  const completedPages = pages.filter(p => p.status === 'complete');
  if (!completedPages.length) return;
  
  const domainScores = calculateDomainScores(domainRatings);
  
  const avgScores = { Experience: 0, Expertise: 0, Authority: 0, Trust: 0 };
  completedPages.forEach(page => {
    const s = calculatePageScores(page.ratings || {}, page.intent);
    Object.keys(avgScores).forEach(k => avgScores[k] += s[k]);
  });
  Object.keys(avgScores).forEach(k => avgScores[k] = Math.round(avgScores[k] / completedPages.length));
  const overallAvg = Math.round((avgScores.Experience + avgScores.Expertise + avgScores.Authority + avgScores.Trust) / 4);
  
  let csv = "E-E-A-T EXECUTIVE SUMMARY\n";
  csv += `Generated,${new Date().toLocaleString()}\n`;
  csv += `Pages Analyzed,${completedPages.length}\n\n`;
  
  csv += "DOMAIN BRAND & TRUST SCORES\n";
  csv += `Authority Score,${domainScores.Authority}%\n`;
  csv += `Trust Score,${domainScores.Trust}%\n`;
  csv += `Overall Brand Score,${domainScores.overall}%,${getLabel(domainScores.overall).label}\n\n`;
  
  csv += "AVERAGE PAGE SCORES\n";
  csv += `Average Experience,${avgScores.Experience}%\n`;
  csv += `Average Expertise,${avgScores.Expertise}%\n`;
  csv += `Average Authority,${avgScores.Authority}%\n`;
  csv += `Average Trust,${avgScores.Trust}%\n`;
  csv += `Overall Page Average,${overallAvg}%,${getLabel(overallAvg).label}\n\n`;
  
  csv += "DOMAIN BRAND & TRUST RECOMMENDATIONS\n";
  csv += "Signal,Status,Recommendation\n";
  DOMAIN_SIGNALS.brand.items.forEach(item => {
    const rating = domainRatings[item.id] ?? 0;
    if (rating < 2 && rating !== -1) {
      const status = rating === 1 ? "Partial" : "Missing";
      csv += `"${item.signal}","${status}","${suggestions[item.id].replace(/"/g, '""')}"\n`;
    }
  });
  
  csv += "\nPAGE BREAKDOWN\n";
  csv += "URL,Intent,Overall Score,Label\n";
  completedPages.forEach(page => {
    const s = calculatePageScores(page.ratings || {}, page.intent);
    const overall = Math.round((s.Experience + s.Expertise + s.Authority + s.Trust) / 4);
    csv += `"${page.url}","${page.intent || 'Unknown'}",${overall}%,"${getLabel(overall).label}"\n`;
  });
  
  downloadCSV(csv, `eeat_executive_summary_${new Date().toISOString().split('T')[0]}.csv`);
};

// =============================================================================
// MAIN APP COMPONENT
// =============================================================================

export default function App() {
  const [urls, setUrls] = useState("");
  const [pages, setPages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [tab, setTab] = useState("overview");
  const [mainTab, setMainTab] = useState("pages");
  const [expanded, setExpanded] = useState({});
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [apiKey, setApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(false);
  const [domainRatings, setDomainRatings] = useState({});
  const [detectedDomain, setDetectedDomain] = useState(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('anthropic_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const saveApiKey = (key) => {
    setApiKey(key);
    if (key) localStorage.setItem('anthropic_api_key', key);
    else localStorage.removeItem('anthropic_api_key');
  };

  const parseUrls = (text) => text.split('\n').map(u => u.trim()).filter(u => u.startsWith('http')).slice(0, 50);

  const validateSameDomain = (urlList) => {
    if (urlList.length === 0) return { valid: true, domain: null };
    try {
      const domains = urlList.map(u => new URL(u).hostname);
      const uniqueDomains = [...new Set(domains)];
      if (uniqueDomains.length > 1) {
        return { valid: false, domains: uniqueDomains };
      }
      return { valid: true, domain: uniqueDomains[0] };
    } catch {
      return { valid: true, domain: null };
    }
  };

  const analyzeUrl = async (url) => {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(apiKey && { 'X-API-Key': apiKey })
      },
      body: JSON.stringify({ url })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Analysis failed');
    }
    
    return response.json();
  };

  const analyze = async () => {
    const urlList = parseUrls(urls);
    if (!urlList.length) return;
    if (!apiKey) { setShowApiInput(true); return; }
    
    const domainCheck = validateSameDomain(urlList);
    if (!domainCheck.valid) {
      alert(`⚠️ All URLs must be from the same domain.\n\nDetected domains:\n${domainCheck.domains.join('\n')}\n\nPlease remove URLs from other domains.`);
      return;
    }
    
    setDetectedDomain(domainCheck.domain);
    setAnalyzing(true);
    setProgress({ current: 0, total: urlList.length });
    
    const newPages = urlList.map((url, i) => ({ 
      id: i, url, status: "pending", ratings: {}, 
      intent: null, purpose: null, ymyl: null, harmful: false, analysis: null 
    }));
    setPages(newPages);
    setDomainRatings({});

    let firstDomainAnalysis = true;

    for (let i = 0; i < newPages.length; i++) {
      setProgress({ current: i + 1, total: urlList.length });
      setPages(prev => prev.map(p => p.id === i ? { ...p, status: "analyzing" } : p));
      
      try {
        const analysis = await analyzeUrl(newPages[i].url);
        
        const pageRatings = {
          c1: analysis.content?.author ?? 0,
          c2: analysis.content?.authorExpert ?? -1,
          c3: analysis.content?.authorLink ?? 0,
          c4: analysis.content?.schema ?? -1,
          c5: analysis.content?.publishDate ?? 0,
          c6: analysis.content?.updateDate ?? 0,
          c7: analysis.content?.upToDate ?? -1,
          c8: analysis.content?.reviewer ?? 0,
          c9: analysis.content?.uniqueMedia ?? -1,
          c10: analysis.content?.grammar ?? 0,
          c11: analysis.content?.sources ?? 0,
          c12: analysis.content?.factual ?? -1,
          c13: analysis.content?.noAds ?? 0,
          c14: analysis.content?.effort ?? -1,
          c15: analysis.content?.insights ?? -1,
          c16: analysis.content?.intentMatch ?? -1,
          c17: analysis.content?.experience ?? -1,
          c18: analysis.content?.productDetails ?? -1,
          c19: analysis.content?.pricing ?? 0,
          c20: analysis.content?.cta ?? 0,
          a1: analysis.author?.profile ?? 0,
          a2: analysis.author?.firstHand ?? -1,
          a3: analysis.author?.expertise ?? -1,
          a4: analysis.author?.bio ?? 0,
          a5: analysis.author?.photo ?? 0,
          a6: analysis.author?.title ?? 0,
          a7: analysis.author?.credentials ?? -1,
          a8: analysis.author?.social ?? 0,
          a9: analysis.author?.pressCited ?? -1,
          a10: analysis.author?.multiplePosts ?? -1,
          a11: analysis.author?.profileSchema ?? -1
        };
        
        if (firstDomainAnalysis && analysis.domain) {
          setDomainRatings({
            d1: analysis.domain?.contactAddress ?? 0,
            d2: analysis.domain?.phone ?? 0,
            d3: analysis.domain?.email ?? 0,
            d4: analysis.domain?.contactPage ?? 0,
            d5: analysis.domain?.ssl ?? 0,
            d6: analysis.domain?.privacyPolicy ?? 0,
            d7: analysis.domain?.terms ?? 0,
            d8: analysis.domain?.aboutPage ?? 0,
            d9: analysis.domain?.teamPage ?? 0,
            d10: analysis.domain?.accreditations ?? -1,
            d11: analysis.domain?.pressCoverage ?? -1,
            d12: analysis.domain?.editorialPolicy ?? 0,
            d13: analysis.domain?.socialLinks ?? 0,
            d14: analysis.domain?.orgSchema ?? -1,
            d15: analysis.domain?.testimonials ?? 0,
            d16: analysis.domain?.thirdPartyReviews ?? -1,
            d17: analysis.domain?.caseStudies ?? 0,
            d18: analysis.domain?.topicalFocus ?? -1
          });
          firstDomainAnalysis = false;
        }
        
        const pageData = {
          ...newPages[i],
          status: "complete",
          intent: analysis.intent,
          intentNote: analysis.intentNote,
          purpose: analysis.purpose,
          purposeNote: analysis.purposeNote,
          ymyl: analysis.ymyl,
          ymylNote: analysis.ymylNote,
          harmful: analysis.harmful,
          harmNote: analysis.harmNote,
          ratings: pageRatings,
          analysis
        };
        
        setPages(prev => prev.map(p => p.id === i ? pageData : p));
        if (i === 0) setSelected(pageData);
      } catch (e) {
        console.error("Analysis error:", e);
        setPages(prev => prev.map(p => p.id === i ? { ...p, status: "error", error: e.message } : p));
      }
    }
    setAnalyzing(false);
  };

  const updatePageRating = (pageId, itemId, value) => {
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, ratings: { ...p.ratings, [itemId]: value } } : p));
    if (selected?.id === pageId) {
      setSelected(prev => ({ ...prev, ratings: { ...prev.ratings, [itemId]: value } }));
    }
  };

  const updateDomainRating = (itemId, value) => {
    setDomainRatings(prev => ({ ...prev, [itemId]: value }));
  };

  const completedPages = pages.filter(p => p.status === 'complete');
  const domainScores = calculateDomainScores(domainRatings);
  const manualCheckItems = getManualCheckItems(pages, domainRatings);
  const pendingManualChecks = manualCheckItems.filter(item => item.needsCheck).length;

  const RatingBtn = ({ value, current, onChange, disabled }) => {
    const labels = { 0: "❌", 1: "⚠️", 2: "✅" };
    const colors = { 
      0: current === 0 ? "bg-red-500 text-white" : "bg-gray-100 hover:bg-red-100", 
      1: current === 1 ? "bg-yellow-500 text-white" : "bg-gray-100 hover:bg-yellow-100", 
      2: current === 2 ? "bg-green-500 text-white" : "bg-gray-100 hover:bg-green-100" 
    };
    return (
      <button 
        onClick={() => !disabled && onChange(value)} 
        disabled={disabled}
        className={`px-3 py-1 text-sm rounded transition-colors ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${colors[value]}`}
      >
        {labels[value]}
      </button>
    );
  };

  // Page Analysis Component
  const PageAnalysis = () => {
    if (!completedPages.length) {
      return <div className="text-center py-16 text-gray-500">Analyze pages first to see results</div>;
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
          <h3 className="font-semibold mb-3">📄 Pages ({pages.length})</h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {pages.map(p => {
              const s = calculatePageScores(p.ratings || {}, p.intent);
              const overall = Math.round((s.Experience + s.Expertise + s.Authority + s.Trust) / 4);
              const info = getLabel(overall);
              const intentInfo = getIntentLabel(p.intent);
              return (
                <div 
                  key={p.id} 
                  onClick={() => p.status === "complete" && setSelected(p)} 
                  className={`p-3 rounded-lg cursor-pointer transition-all ${selected?.id === p.id ? 'bg-blue-50 border-2 border-blue-500' : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="truncate flex-1 mr-2">
                      <p className="text-sm font-medium truncate">{(() => { try { return new URL(p.url).pathname || '/'; } catch { return p.url; } })()}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        {p.status === "complete" && <span>{intentInfo.icon} {intentInfo.label}</span>}
                      </div>
                    </div>
                    <div>
                      {p.status === "pending" && <span className="text-gray-400 text-xs">Pending</span>}
                      {p.status === "analyzing" && <span className="animate-pulse">⏳</span>}
                      {p.status === "complete" && <span className={`font-bold ${info.color}`}>{overall}%</span>}
                      {p.status === "error" && <span title={p.error}>❌</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
              <div className="flex justify-between items-start mb-4 pb-4 border-b">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{getIntentLabel(selected.intent).icon}</span>
                    <span className="text-xs px-2 py-1 bg-slate-100 rounded-full">{getIntentLabel(selected.intent).label}</span>
                    {selected.ymyl !== 'none' && <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">YMYL: {selected.ymyl}</span>}
                  </div>
                  <h3 className="font-semibold text-lg truncate">{(() => { try { return new URL(selected.url).pathname || '/'; } catch { return 'Page'; } })()}</h3>
                  <a href={selected.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">{selected.url} ↗</a>
                </div>
                {selected.status === "complete" && (() => {
                  const s = calculatePageScores(selected.ratings || {}, selected.intent);
                  const overall = Math.round((s.Experience + s.Expertise + s.Authority + s.Trust) / 4);
                  const info = getLabel(overall);
                  return (
                    <div className="text-right">
                      <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${info.bg} ${info.color}`}>{info.label} - {overall}%</span>
                      <button onClick={() => exportPageCSV(selected)} className="block mt-2 text-xs text-blue-600 hover:underline">Export this page →</button>
                    </div>
                  );
                })()}
              </div>

              <div className="flex border-b mb-6">
                {[
                  { id: "overview", label: "📊 Overview" },
                  { id: "signals", label: "🎯 Signals" },
                  { id: "recommendations", label: "💡 Recommendations" }
                ].map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2.5 text-sm font-medium border-b-2 ${tab === t.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {tab === "overview" && selected.status === "complete" && (() => {
                const s = calculatePageScores(selected.ratings || {}, selected.intent);
                const overall = Math.round((s.Experience + s.Expertise + s.Authority + s.Trust) / 4);
                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-5 gap-4">
                      {Object.entries(s).map(([k, v]) => (
                        <div key={k} className="text-center p-3 bg-slate-50 rounded-lg">
                          <div className={`text-2xl font-bold ${getLabel(v).color}`}>{v}%</div>
                          <div className="text-xs text-gray-500 mt-1">{k}</div>
                        </div>
                      ))}
                      <div className="text-center p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                        <div className={`text-3xl font-bold ${getLabel(overall).color}`}>{overall}%</div>
                        <div className="text-xs text-gray-500 mt-1">Overall</div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="text-xs text-gray-400 uppercase mb-1">Intent Analysis</div>
                      <div className="font-semibold flex items-center gap-2">
                        {getIntentLabel(selected.intent).icon} {getIntentLabel(selected.intent).label}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{selected.intentNote}</div>
                    </div>

                    {selected.analysis?.strengths?.length > 0 && (
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="font-semibold text-green-800 mb-2">✅ Strengths</div>
                        <ul className="space-y-1">{selected.analysis.strengths.map((s, i) => <li key={i} className="text-sm text-green-700">• {s}</li>)}</ul>
                      </div>
                    )}

                    {selected.analysis?.weaknesses?.length > 0 && (
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="font-semibold text-red-800 mb-2">❌ Weaknesses</div>
                        <ul className="space-y-1">{selected.analysis.weaknesses.map((w, i) => <li key={i} className="text-sm text-red-700">• {w}</li>)}</ul>
                      </div>
                    )}
                  </div>
                );
              })()}

              {tab === "signals" && (
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                    <strong>Intent: {getIntentLabel(selected.intent).label}</strong> — Only signals relevant to this page type are shown. Items marked "Manual Check" need your verification.
                  </div>
                  {Object.entries(PAGE_SIGNALS).map(([key, cat]) => {
                    const applicableItems = cat.items.filter(item => signalAppliesTo(item, selected.intent));
                    if (applicableItems.length === 0) return null;
                    
                    return (
                      <div key={key} className="border rounded-lg">
                        <button onClick={() => setExpanded(p => ({ ...p, [key]: !p[key] }))} className="w-full flex justify-between items-center p-4 hover:bg-slate-50">
                          <div>
                            <span className="font-medium">{cat.name}</span>
                            <span className="text-xs text-gray-500 ml-2">({applicableItems.length} signals)</span>
                          </div>
                          <span>{expanded[key] ? "▲" : "▼"}</span>
                        </button>
                        {expanded[key] && (
                          <div className="border-t divide-y">
                            {applicableItems.map(item => {
                              const rating = selected.ratings?.[item.id];
                              const needsReview = rating === -1;
                              return (
                                <div key={item.id} className={`p-4 flex justify-between items-center ${needsReview ? 'bg-yellow-50' : ''}`}>
                                  <div className="flex-1 mr-4">
                                    <div className="text-sm flex items-center gap-2">
                                      {item.signal}
                                      {item.manualCheck && <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded">Manual Check</span>}
                                    </div>
                                    <div className="text-xs text-gray-500">{item.concept} • Weight: {item.weight}</div>
                                    {needsReview && <div className="text-xs text-yellow-700 mt-1">⚠️ Needs manual verification</div>}
                                  </div>
                                  <div className="flex gap-1">
                                    {[0, 1, 2].map(v => (
                                      <RatingBtn key={v} value={v} current={rating === -1 ? -1 : rating} onChange={val => updatePageRating(selected.id, item.id, val)} />
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {tab === "recommendations" && selected.status === "complete" && (() => {
                const recs = [];
                Object.values(PAGE_SIGNALS).forEach(cat => {
                  cat.items.forEach(item => {
                    if (!signalAppliesTo(item, selected.intent)) return;
                    const r = selected.ratings?.[item.id] ?? 0;
                    if (r >= 0 && r < 2) {
                      recs.push({ ...item, action: r === 0 ? "Missing" : "Needs Improvement", suggestion: suggestions[item.id], category: cat.name });
                    }
                  });
                });
                recs.sort((a, b) => b.weight - a.weight);
                const high = recs.filter(r => r.weight === 3);
                const med = recs.filter(r => r.weight === 2);
                const low = recs.filter(r => r.weight === 1);

                return (
                  <div className="space-y-6">
                    <div className="p-3 bg-slate-50 rounded-lg text-sm text-gray-600">
                      Page-specific content & author recommendations. For brand & trust recommendations, see <button onClick={() => setMainTab('domain')} className="text-blue-600 hover:underline">Domain Health</button>.
                    </div>
                    
                    {high.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-red-700 mb-3">🔴 High Priority ({high.length})</h4>
                        <div className="space-y-3">
                          {high.map((r, i) => (
                            <div key={i} className="p-4 bg-red-50 rounded-lg border border-red-200">
                              <div className="flex justify-between mb-2">
                                <span className="font-medium">{r.signal}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${r.action === 'Missing' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>{r.action}</span>
                              </div>
                              <div className="text-sm text-gray-700 bg-white p-3 rounded">{r.suggestion}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {med.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-yellow-700 mb-3">🟡 Medium Priority ({med.length})</h4>
                        <div className="space-y-3">
                          {med.map((r, i) => (
                            <div key={i} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                              <div className="flex justify-between mb-2">
                                <span className="font-medium">{r.signal}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${r.action === 'Missing' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>{r.action}</span>
                              </div>
                              <div className="text-sm text-gray-700 bg-white p-3 rounded">{r.suggestion}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {low.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-600 mb-3">⚪ Low Priority ({low.length})</h4>
                        <div className="space-y-2">
                          {low.map((r, i) => (
                            <div key={i} className="p-3 bg-gray-50 rounded-lg border">
                              <div className="flex justify-between"><span className="font-medium text-sm">{r.signal}</span><span className="text-xs px-2 py-0.5 rounded bg-gray-200">{r.action}</span></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {recs.length === 0 && (
                      <div className="text-center py-12"><div className="text-5xl mb-4">🎉</div><p className="text-gray-600">All applicable content signals fully demonstrated!</p></div>
                    )}
                  </div>
                );
              })()}

              {selected.status === "analyzing" && <div className="text-center py-16"><span className="text-5xl animate-pulse">⏳</span><p className="mt-4">Analyzing...</p></div>}
              {selected.status === "error" && <div className="text-center py-16 text-red-500">❌ {selected.error}</div>}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-16 text-center border border-slate-200">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500">Select a page to view details</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Domain Health Component
  const DomainHealth = () => {
    if (!completedPages.length) {
      return <div className="text-center py-16 text-gray-500">Analyze pages first to see domain health</div>;
    }

    const domainRecs = [];
    DOMAIN_SIGNALS.brand.items.forEach(item => {
      const rating = domainRatings[item.id] ?? 0;
      if (rating >= 0 && rating < 2) {
        domainRecs.push({ ...item, action: rating === 0 ? "Missing" : "Needs Improvement", suggestion: suggestions[item.id] });
      }
    });
    domainRecs.sort((a, b) => b.weight - a.weight);

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-1">Domain Brand & Trust Score</h2>
              <p className="text-indigo-200 text-sm">
                {detectedDomain && <span className="font-mono">{detectedDomain}</span>}
                {' • '}{completedPages.length} pages analyzed
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{domainScores.overall}%</div>
              <div className="text-indigo-200">{getLabel(domainScores.overall).label}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{domainScores.Authority}%</div>
              <div className="text-indigo-200 text-sm">Authority</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold">{domainScores.Trust}%</div>
              <div className="text-indigo-200 text-sm">Trust</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Brand & Trust Signals</h3>
            <span className="text-xs text-gray-500">Click ratings to update</span>
          </div>
          <div className="space-y-3">
            {DOMAIN_SIGNALS.brand.items.map(item => {
              const rating = domainRatings[item.id] ?? 0;
              const needsReview = rating === -1;
              return (
                <div key={item.id} className={`p-4 rounded-lg border ${needsReview ? 'bg-yellow-50 border-yellow-200' : rating === 2 ? 'bg-green-50 border-green-200' : rating === 1 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{item.signal}</span>
                        {item.manualCheck && <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded">Manual Check</span>}
                      </div>
                      <div className="text-xs text-gray-500">{item.concept} • Weight: {item.weight}</div>
                      {needsReview && <div className="text-xs text-yellow-700 mt-1">⚠️ Needs manual verification</div>}
                    </div>
                    <div className="flex gap-1">
                      {[0, 1, 2].map(v => (
                        <RatingBtn key={v} value={v} current={rating === -1 ? -1 : rating} onChange={val => updateDomainRating(item.id, val)} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {domainRecs.length > 0 && (
          <div className="bg-white rounded-xl border p-6">
            <h3 className="font-semibold mb-4">🎯 Brand & Trust Recommendations</h3>
            <div className="space-y-3">
              {domainRecs.map((rec, i) => (
                <div key={i} className={`p-4 rounded-lg border ${rec.weight === 3 ? 'bg-red-50 border-red-200' : rec.weight === 2 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${rec.weight === 3 ? 'bg-red-500' : rec.weight === 2 ? 'bg-yellow-500' : 'bg-gray-400'}`}>
                        {i + 1}
                      </span>
                      <span className="font-medium">{rec.signal}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${rec.action === 'Missing' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'}`}>{rec.action}</span>
                  </div>
                  <div className="text-sm text-gray-700 ml-8">{rec.suggestion}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Manual Checklist Component
  const ManualChecklist = () => {
    const domainChecks = manualCheckItems.filter(item => item.level === 'domain');
    const pageChecks = manualCheckItems.filter(item => item.level === 'page');
    const pendingDomain = domainChecks.filter(item => item.needsCheck).length;
    const pendingPages = pageChecks.filter(item => item.needsCheck).length;

    return (
      <div className="space-y-6">
        <div className={`rounded-xl p-6 ${pendingManualChecks > 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'}`}>
          <div className="flex items-center gap-4">
            <div className="text-4xl">{pendingManualChecks > 0 ? '📋' : '✅'}</div>
            <div>
              <h2 className="text-xl font-semibold">{pendingManualChecks > 0 ? `${pendingManualChecks} Items Need Manual Review` : 'All Manual Checks Complete!'}</h2>
              <p className="text-gray-600 text-sm">
                {pendingManualChecks > 0 
                  ? 'Some signals require human verification for accurate scoring.'
                  : 'Great job! All signals have been verified.'}
              </p>
            </div>
          </div>
        </div>

        {pendingManualChecks > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Why Manual Checks?</h4>
            <p className="text-sm text-blue-700">
              AI can detect presence of elements but can't verify quality, accuracy, or legitimacy. 
              For example, we can see an author bio exists, but only you can verify credentials are real and current.
            </p>
          </div>
        )}

        {domainChecks.length > 0 && (
          <div className="bg-white rounded-xl border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">🏢 Domain-Level Checks</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${pendingDomain > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                {pendingDomain > 0 ? `${pendingDomain} pending` : 'All complete'}
              </span>
            </div>
            <div className="space-y-3">
              {domainChecks.map(item => (
                <div key={item.id} className={`p-4 rounded-lg border ${item.needsCheck ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.signal}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.concept} • Weight: {item.weight}</div>
                    </div>
                    <div className="flex gap-1">
                      {[0, 1, 2].map(v => (
                        <RatingBtn key={v} value={v} current={item.currentRating === -1 ? -1 : item.currentRating} onChange={val => updateDomainRating(item.id, val)} />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pageChecks.length > 0 && (
          <div className="bg-white rounded-xl border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">📄 Page-Level Checks</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${pendingPages > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                {pendingPages > 0 ? `${pendingPages} pending` : 'All complete'}
              </span>
            </div>
            
            {completedPages.map(page => {
              const pageItems = pageChecks.filter(item => item.pageId === page.id);
              if (pageItems.length === 0) return null;
              const pagePending = pageItems.filter(item => item.needsCheck).length;
              
              return (
                <div key={page.id} className="mb-6 last:mb-0">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                    <span className="text-lg">{getIntentLabel(page.intent).icon}</span>
                    <span className="font-medium text-sm truncate flex-1">{(() => { try { return new URL(page.url).pathname || '/'; } catch { return page.url; } })()}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${pagePending > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                      {pagePending > 0 ? `${pagePending} pending` : '✓'}
                    </span>
                  </div>
                  <div className="space-y-2 pl-4">
                    {pageItems.map(item => (
                      <div key={`${page.id}-${item.id}`} className={`p-3 rounded-lg border ${item.needsCheck ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{item.signal}</div>
                            <div className="text-xs text-gray-500">{item.concept}</div>
                          </div>
                          <div className="flex gap-1">
                            {[0, 1, 2].map(v => (
                              <RatingBtn key={v} value={v} current={item.currentRating === -1 ? -1 : item.currentRating} onChange={val => updatePageRating(item.pageId, item.id, val)} />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {manualCheckItems.length === 0 && (
          <div className="text-center py-16 text-gray-500">Analyze pages first to see manual checklist</div>
        )}
      </div>
    );
  };

  // Executive Summary Component
  const ExecutiveSummary = () => {
    if (!completedPages.length) {
      return <div className="text-center py-16 text-gray-500">Analyze pages first to see executive summary</div>;
    }

    const avgScores = { Experience: 0, Expertise: 0, Authority: 0, Trust: 0 };
    completedPages.forEach(page => {
      const s = calculatePageScores(page.ratings || {}, page.intent);
      Object.keys(avgScores).forEach(k => avgScores[k] += s[k]);
    });
    Object.keys(avgScores).forEach(k => avgScores[k] = Math.round(avgScores[k] / completedPages.length));
    const overallAvg = Math.round((avgScores.Experience + avgScores.Expertise + avgScores.Authority + avgScores.Trust) / 4);

    const intentCounts = {};
    completedPages.forEach(p => {
      const intent = p.intent || 'unknown';
      intentCounts[intent] = (intentCounts[intent] || 0) + 1;
    });

    const pageRecCounts = {};
    completedPages.forEach(page => {
      Object.values(PAGE_SIGNALS).forEach(cat => {
        cat.items.forEach(item => {
          const rating = page.ratings?.[item.id] ?? 0;
          if (signalAppliesTo(item, page.intent) && rating >= 0 && rating < 2) {
            if (!pageRecCounts[item.id]) {
              pageRecCounts[item.id] = { ...item, count: 0, suggestion: suggestions[item.id] };
            }
            pageRecCounts[item.id].count++;
          }
        });
      });
    });
    const sortedPageRecs = Object.values(pageRecCounts).sort((a, b) => (b.weight * b.count) - (a.weight * a.count));

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="text-3xl font-bold">{completedPages.length}</div>
            <div className="text-blue-100 text-sm">Pages Analyzed</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="text-3xl font-bold">{domainScores.overall}%</div>
            <div className="text-purple-100 text-sm">Brand Trust Score</div>
          </div>
          <div className={`bg-gradient-to-br ${getLabel(overallAvg).bgDark} rounded-xl p-4 text-white`}>
            <div className="text-3xl font-bold">{overallAvg}%</div>
            <div className="text-white/80 text-sm">Avg Page Score</div>
          </div>
          <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl p-4 text-white">
            <div className="text-3xl font-bold">{pendingManualChecks}</div>
            <div className="text-slate-300 text-sm">Manual Checks Pending</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold mb-4">Average Page Scores</h3>
          <div className="grid grid-cols-4 gap-4">
            {Object.entries(avgScores).map(([k, v]) => (
              <div key={k} className="text-center">
                <div className={`text-2xl font-bold ${getLabel(v).color}`}>{v}%</div>
                <div className="text-xs text-gray-500 mt-1">{k}</div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${getLabel(v).bgDark}`} style={{ width: `${v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold mb-4">Page Intent Distribution</h3>
          <div className="flex flex-wrap gap-3">
            {Object.entries(intentCounts).map(([intent, count]) => {
              const info = getIntentLabel(intent);
              return (
                <div key={intent} className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg">
                  <span className="text-xl">{info.icon}</span>
                  <div>
                    <div className="font-medium">{info.label}</div>
                    <div className="text-xs text-gray-500">{count} page{count !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {sortedPageRecs.length > 0 && (
          <div className="bg-white rounded-xl border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">🎯 Top Content Recommendations</h3>
              <button 
                onClick={() => exportExecutiveSummary(pages, domainRatings)}
                className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                📥 Export Summary
              </button>
            </div>
            <div className="space-y-3">
              {sortedPageRecs.slice(0, 10).map((rec, i) => (
                <div key={rec.id} className={`p-4 rounded-lg border ${i < 3 ? 'bg-red-50 border-red-200' : i < 6 ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${i < 3 ? 'bg-red-500' : i < 6 ? 'bg-yellow-500' : 'bg-gray-400'}`}>
                        {i + 1}
                      </span>
                      <span className="font-medium">{rec.signal}</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-white rounded-full border">
                      {rec.count} of {completedPages.length} pages
                    </span>
                  </div>
                  <div className="text-sm text-gray-700 ml-8">{rec.suggestion}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold mb-4">📊 Page Performance Ranking</h3>
          <div className="space-y-2">
            {completedPages
              .map(page => {
                const s = calculatePageScores(page.ratings || {}, page.intent);
                const overall = Math.round((s.Experience + s.Expertise + s.Authority + s.Trust) / 4);
                return { ...page, overall };
              })
              .sort((a, b) => b.overall - a.overall)
              .map((page, i) => {
                const info = getLabel(page.overall);
                const intentInfo = getIntentLabel(page.intent);
                return (
                  <div key={page.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg cursor-pointer" onClick={() => { setSelected(page); setMainTab('pages'); }}>
                    <span className="w-8 text-center text-gray-400 text-sm">#{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium text-sm">{(() => { try { return new URL(page.url).pathname || '/'; } catch { return page.url; } })()}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{intentInfo.icon} {intentInfo.label}</span>
                        {page.ymyl !== 'none' && <span className="text-orange-600">• YMYL: {page.ymyl}</span>}
                      </div>
                    </div>
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${info.bgDark}`} style={{ width: `${page.overall}%` }} />
                    </div>
                    <span className={`font-bold w-12 text-right ${info.color}`}>{page.overall}%</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  };

  // Main Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🔍</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">E-E-A-T Analyzer <span className="text-sm font-normal text-blue-600">v2.1</span></h1>
                <p className="text-gray-500 text-sm">Single-domain analysis with intent-aware scoring</p>
              </div>
            </div>
            <button onClick={() => setShowApiInput(!showApiInput)} className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
              ⚙️ API Key
            </button>
          </div>
          
          {showApiInput && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Anthropic API Key</label>
              <div className="flex gap-2">
                <input type="password" value={apiKey} onChange={(e) => saveApiKey(e.target.value)} placeholder="sk-ant-..." className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                <button onClick={() => setShowApiInput(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Save</button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Stored locally. Get one at <a href="https://console.anthropic.com" target="_blank" className="text-blue-600 hover:underline">console.anthropic.com</a></p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-200">
          <h2 className="font-semibold mb-3">📋 Enter URLs to Analyze (up to 50)</h2>
          
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-amber-600">⚠️</span>
              <div className="text-sm text-amber-800">
                <strong>Important:</strong> All URLs must be from the <strong>same domain</strong>. Brand signals are analyzed at the domain level.
              </div>
            </div>
          </div>
          
          <textarea 
            value={urls} 
            onChange={e => setUrls(e.target.value)} 
            placeholder="Paste URLs from the same domain, one per line...&#10;https://example.com/blog/article-1&#10;https://example.com/about-us" 
            className="w-full h-32 p-4 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              {parseUrls(urls).length} URL{parseUrls(urls).length !== 1 ? 's' : ''} detected
              {analyzing && <span className="ml-3 text-blue-600">Analyzing {progress.current}/{progress.total}...</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={analyze} disabled={analyzing || !parseUrls(urls).length} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium">
                {analyzing ? "⏳ Analyzing..." : "🔎 Analyze URLs"}
              </button>
              {completedPages.length > 0 && (
                <div className="relative group">
                  <button className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">📥 Export ▾</button>
                  <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <button onClick={() => exportAllCSV(pages)} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm">All Pages (CSV)</button>
                    <button onClick={() => exportExecutiveSummary(pages, domainRatings)} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm">Executive Summary</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {pages.length > 0 && (
          <>
            <div className="flex gap-2 mb-6 flex-wrap">
              {[
                { id: "pages", label: "📄 Page Analysis", count: completedPages.length },
                { id: "domain", label: "🏢 Domain Health" },
                { id: "checklist", label: "📋 Manual Checklist", count: pendingManualChecks > 0 ? pendingManualChecks : null, alert: pendingManualChecks > 0 },
                { id: "executive", label: "📊 Executive Summary" }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setMainTab(t.id)}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${mainTab === t.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-slate-50 border'}`}
                >
                  {t.label}
                  {t.count !== undefined && t.count !== null && (
                    <span className={`ml-1 px-1.5 py-0.5 rounded text-xs ${t.alert ? 'bg-yellow-400 text-yellow-900' : 'bg-white/20'}`}>{t.count}</span>
                  )}
                </button>
              ))}
            </div>

            {mainTab === "pages" && <PageAnalysis />}
            {mainTab === "domain" && <DomainHealth />}
            {mainTab === "checklist" && <ManualChecklist />}
            {mainTab === "executive" && <ExecutiveSummary />}
          </>
        )}

        {pages.length === 0 && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3">Ready to Analyze</h3>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                Evaluate your web pages against Google's E-E-A-T guidelines with domain-wide brand analysis and page-level content scoring.
              </p>
              
              <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
                {[
                  { icon: "🎯", label: "Experience", bg: "bg-orange-50" },
                  { icon: "🎓", label: "Expertise", bg: "bg-green-50" },
                  { icon: "🏆", label: "Authority", bg: "bg-blue-50" },
                  { icon: "🛡️", label: "Trust", bg: "bg-purple-50" }
                ].map(item => (
                  <div key={item.label} className={`p-4 ${item.bg} rounded-xl`}>
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="font-semibold text-gray-800">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">⚠️</div>
                <div>
                  <h4 className="font-bold text-amber-800 mb-2">Single Domain Analysis Only</h4>
                  <p className="text-sm text-amber-700">
                    This tool analyzes pages from <strong>one domain at a time</strong>. Brand signals are evaluated site-wide, 
                    while content signals are per-page. <strong>Do not mix URLs from different domains.</strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200">
              <h4 className="text-lg font-bold mb-6 text-center">🚀 How It Works</h4>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl mx-auto mb-3">1</div>
                  <h5 className="font-semibold mb-2">Paste URLs</h5>
                  <p className="text-sm text-gray-600">Add up to 50 URLs from the same domain</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl mx-auto mb-3">2</div>
                  <h5 className="font-semibold mb-2">AI Analysis</h5>
                  <p className="text-sm text-gray-600">Claude analyzes detectable signals</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl mx-auto mb-3">3</div>
                  <h5 className="font-semibold mb-2">Manual Review</h5>
                  <p className="text-sm text-gray-600">Verify items AI can't confirm</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl mx-auto mb-3">4</div>
                  <h5 className="font-semibold mb-2">Export Results</h5>
                  <p className="text-sm text-gray-600">Download CSV reports</p>
                </div>
              </div>
            </div>

            <div className="text-center py-4">
              <p className="text-gray-500 mb-2">👆 Paste URLs above to get started</p>
              <p className="text-sm text-gray-400">Click ⚙️ API Key to add your Anthropic API key</p>
            </div>
          </div>
        )}

        <div className="mt-8 text-center text-sm text-gray-400">
          Based on Google's Search Quality Rater Guidelines • v2.1
        </div>
      </div>
    </div>
  );
}
