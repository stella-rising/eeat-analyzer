import React, { useState, useEffect } from 'react';

// Intent-based signal applicability
const INTENT_SIGNALS = {
  informational: {
    required: ['c1', 'c2', 'c3', 'c5', 'c6', 'c10', 'c11', 'c14', 'c15', 'c16', 'a1', 'a2', 'a3', 'a4', 'a7'],
    optional: ['c7', 'c8', 'c9', 'c13', 'c17', 'a5', 'a6', 'a8', 'a9', 'a10', 'a11'],
    notApplicable: ['b15', 'b16', 'b17'] // Reviews less critical for info content
  },
  commercial: {
    required: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b10', 'b14', 'b15', 'b16', 'b17', 'c12'],
    optional: ['b8', 'b9', 'b11', 'b13', 'c5', 'c8', 'c9'],
    notApplicable: ['c1', 'c2', 'c3', 'c7', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'a11'] // Author signals less critical
  },
  transactional: {
    required: ['b1', 'b2', 'b3', 'b5', 'b6', 'b7', 'b10', 'b14', 'c12'],
    optional: ['b4', 'b8', 'b15', 'b16'],
    notApplicable: ['c1', 'c2', 'c3', 'c5', 'c6', 'c7', 'c10', 'c11', 'c14', 'c16', 'c17', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'a11']
  },
  navigational: {
    required: ['b1', 'b2', 'b3', 'b4', 'b5', 'b8', 'b13', 'b14', 'b18'],
    optional: ['b6', 'b7', 'b9', 'b10', 'b11', 'b12'],
    notApplicable: ['c1', 'c2', 'c3', 'c5', 'c6', 'c7', 'c10', 'c11', 'c14', 'c16', 'c17', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10', 'a11']
  },
  service: {
    required: ['b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'b10', 'b14', 'b15', 'b16', 'b17'],
    optional: ['b11', 'b12', 'b13', 'c5', 'c8', 'c9', 'c12', 'c13'],
    notApplicable: ['c1', 'c2', 'c3', 'c7', 'c10', 'c11', 'c14', 'c16', 'c17', 'a1', 'a3', 'a7']
  }
};

const EEAT_CRITERIA = {
  brand: {
    name: "Brand & Trust Signals",
    description: "Domain-wide signals that establish brand credibility",
    items: [
      { id: "b1", signal: "Physical business address visible", concept: "Trust", weight: 2, intents: ['all'] },
      { id: "b2", signal: "Phone number visible", concept: "Trust", weight: 2, intents: ['all'] },
      { id: "b3", signal: "Contact email from main domain", concept: "Trust", weight: 2, intents: ['all'] },
      { id: "b4", signal: "Dedicated Contact Us page", concept: "Trust", weight: 2, intents: ['all'] },
      { id: "b5", signal: "Valid SSL certificate", concept: "Trust", weight: 3, intents: ['all'] },
      { id: "b6", signal: "Privacy Policy page", concept: "Trust", weight: 2, intents: ['all'] },
      { id: "b7", signal: "Terms & Conditions page", concept: "Trust", weight: 2, intents: ['all'] },
      { id: "b8", signal: "Detailed About Us page", concept: "Authority", weight: 3, intents: ['all'] },
      { id: "b9", signal: "Meet the Team page", concept: "Trust", weight: 2, intents: ['informational', 'service'] },
      { id: "b10", signal: "Accreditations/memberships displayed", concept: "Trust", weight: 2, intents: ['all'] },
      { id: "b11", signal: "Press coverage/As Featured In", concept: "Authority", weight: 2, intents: ['all'] },
      { id: "b12", signal: "Editorial Policy page", concept: "Trust", weight: 2, intents: ['informational'] },
      { id: "b13", signal: "Social media links visible", concept: "Trust", weight: 1, intents: ['all'] },
      { id: "b14", signal: "Organization Schema markup", concept: "Trust", weight: 2, intents: ['all'] },
      { id: "b15", signal: "Reviews/testimonials on site", concept: "Trust", weight: 2, intents: ['commercial', 'service'] },
      { id: "b16", signal: "Third-party reviews visible", concept: "Trust", weight: 3, intents: ['commercial', 'service'] },
      { id: "b17", signal: "Case studies/customer stories", concept: "Trust", weight: 2, intents: ['commercial', 'service'] },
      { id: "b18", signal: "Clear topical focus area", concept: "Authority", weight: 2, intents: ['all'] }
    ]
  },
  content: {
    name: "Content Quality Signals",
    description: "Page-level content quality indicators",
    items: [
      { id: "c1", signal: "Author clearly displayed", concept: "Expertise", weight: 3, intents: ['informational'] },
      { id: "c2", signal: "Author is subject matter expert", concept: "Expertise", weight: 3, intents: ['informational'] },
      { id: "c3", signal: "Link to author profile page", concept: "Expertise", weight: 2, intents: ['informational'] },
      { id: "c4", signal: "Appropriate Schema markup", concept: "Expertise", weight: 2, intents: ['all'] },
      { id: "c5", signal: "Publish/update date shown", concept: "Authority", weight: 2, intents: ['informational'] },
      { id: "c6", signal: "Content is up-to-date", concept: "Authority", weight: 3, intents: ['informational'] },
      { id: "c7", signal: "Content reviewer displayed (YMYL)", concept: "Expertise", weight: 3, intents: ['informational'] },
      { id: "c8", signal: "Unique photos/videos/visuals", concept: "Experience", weight: 3, intents: ['all'] },
      { id: "c9", signal: "Free from spelling/grammar errors", concept: "Authority", weight: 2, intents: ['all'] },
      { id: "c10", signal: "Links to sources for claims", concept: "Authority", weight: 3, intents: ['informational'] },
      { id: "c11", signal: "Factually correct content", concept: "Expertise", weight: 3, intents: ['informational'] },
      { id: "c12", signal: "Free from distracting ads", concept: "Trust", weight: 2, intents: ['all'] },
      { id: "c13", signal: "Clear human effort demonstrated", concept: "Authority", weight: 2, intents: ['all'] },
      { id: "c14", signal: "Unique insights/opinions", concept: "Expertise", weight: 3, intents: ['informational'] },
      { id: "c15", signal: "Matches searcher intent", concept: "Expertise", weight: 3, intents: ['all'] },
      { id: "c16", signal: "Written from actual experience", concept: "Experience", weight: 3, intents: ['informational'] },
      { id: "c17", signal: "Linked to as source by others", concept: "Authority", weight: 3, intents: ['informational'] }
    ]
  },
  author: {
    name: "Author Credibility Signals",
    description: "Signals establishing author expertise (primarily for informational content)",
    items: [
      { id: "a1", signal: "Standalone author profile page", concept: "Authority", weight: 3, intents: ['informational'] },
      { id: "a2", signal: "First-hand experience in topic", concept: "Experience", weight: 3, intents: ['informational'] },
      { id: "a3", signal: "Formal expertise/education", concept: "Expertise", weight: 3, intents: ['informational'] },
      { id: "a4", signal: "Up-to-date author bio", concept: "Expertise", weight: 2, intents: ['informational'] },
      { id: "a5", signal: "Author headshot/photo", concept: "Expertise", weight: 2, intents: ['informational'] },
      { id: "a6", signal: "Job title displayed", concept: "Expertise", weight: 2, intents: ['informational'] },
      { id: "a7", signal: "Credentials/accreditations shown", concept: "Expertise", weight: 3, intents: ['informational'] },
      { id: "a8", signal: "Links to social profiles", concept: "Expertise", weight: 2, intents: ['informational'] },
      { id: "a9", signal: "Cited as expert in press", concept: "Authority", weight: 3, intents: ['informational'] },
      { id: "a10", signal: "Multiple posts on main topic", concept: "Authority", weight: 2, intents: ['informational'] },
      { id: "a11", signal: "ProfilePage Schema markup", concept: "Expertise", weight: 2, intents: ['informational'] }
    ]
  }
};

const suggestions = {
  b1: "Add physical business address to footer and Contact page. Avoid PO boxes or virtual addresses.",
  b2: "Display a phone number prominently in header or footer. Consider click-to-call for mobile.",
  b3: "Use professional email from your domain (contact@yourdomain.com), not Gmail/Yahoo.",
  b4: "Create a dedicated Contact Us page with multiple contact methods.",
  b5: "Ensure SSL certificate is installed, valid, and not expired. Check for mixed content warnings.",
  b6: "Create comprehensive Privacy Policy page and link prominently in footer.",
  b7: "Add Terms & Conditions page covering user rights, limitations, and legal disclaimers.",
  b8: "Develop detailed About Us page with company history, mission, team bios, and expertise.",
  b9: "Create Meet the Team page showcasing key team members with photos and backgrounds.",
  b10: "Display industry accreditations, certifications, and professional memberships.",
  b11: "Add 'As Featured In' section with logos and links to press coverage.",
  b12: "Publish Editorial Policy explaining content standards, fact-checking, and update processes.",
  b13: "Add social media icons in header/footer linking to active company profiles.",
  b14: "Implement Organization Schema markup with logo, contact info, and social profiles.",
  b15: "Display customer testimonials and reviews prominently on relevant pages.",
  b16: "Integrate third-party review widgets (Google Reviews, Trustpilot, etc.).",
  b17: "Publish detailed case studies showing real results and customer success stories.",
  b18: "Ensure site maintains clear topical focus rather than covering unrelated subjects.",
  c1: "Add clear author attribution with full name on all content pages.",
  c2: "Ensure content is written by qualified subject matter experts in the field.",
  c3: "Link author names to dedicated author profile pages with full bios.",
  c4: "Implement Article, BlogPosting, or appropriate Schema markup for content.",
  c5: "Display publish date and 'last updated' date on all content pages.",
  c6: "Review and update content regularly. Add update log for significant changes.",
  c7: "For YMYL content, display medical/legal/financial reviewer credentials.",
  c8: "Use original photos, screenshots, and videos instead of stock imagery.",
  c9: "Proofread all content. Use grammar tools and consider professional editing.",
  c10: "Add citations and links to authoritative sources when making claims.",
  c11: "Fact-check all content. Cite primary sources and expert opinions.",
  c12: "Remove or minimize intrusive ads. Ensure ads don't interfere with content.",
  c13: "Demonstrate clear effort and original research. Avoid thin or AI-generated content.",
  c14: "Include unique perspectives, expert quotes, and original insights.",
  c15: "Align content with search intent. Check SERP to understand what users expect.",
  c16: "Write from first-hand experience. Include personal insights and real examples.",
  c17: "Create link-worthy content. Build relationships for editorial mentions.",
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
const signalAppliesTo = (signalId, intent) => {
  if (!intent || intent === 'all') return { applies: true, required: false };
  const config = INTENT_SIGNALS[intent];
  if (!config) return { applies: true, required: false };
  
  if (config.notApplicable?.includes(signalId)) return { applies: false, required: false };
  if (config.required?.includes(signalId)) return { applies: true, required: true };
  if (config.optional?.includes(signalId)) return { applies: true, required: false };
  return { applies: true, required: false };
};

// Calculate scores with intent awareness
const calculateScores = (ratings, intent) => {
  const scores = { Experience: 0, Expertise: 0, Authority: 0, Trust: 0 };
  const maxScores = { Experience: 0, Expertise: 0, Authority: 0, Trust: 0 };
  
  Object.values(EEAT_CRITERIA).forEach(cat => {
    cat.items.forEach(item => {
      const { applies } = signalAppliesTo(item.id, intent);
      if (!applies) return; // Skip N/A signals
      
      const rating = ratings[item.id] ?? 0;
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

// Calculate domain-wide brand score (aggregate brand signals)
const calculateDomainScore = (pages) => {
  if (!pages.length) return null;
  
  const brandSignals = EEAT_CRITERIA.brand.items.map(item => item.id);
  const signalScores = {};
  
  brandSignals.forEach(id => {
    const ratings = pages.filter(p => p.status === 'complete').map(p => p.ratings?.[id] ?? 0);
    if (ratings.length) {
      signalScores[id] = Math.max(...ratings); // Use best rating across pages
    }
  });
  
  let total = 0, max = 0;
  EEAT_CRITERIA.brand.items.forEach(item => {
    total += (signalScores[item.id] ?? 0) * item.weight;
    max += 2 * item.weight;
  });
  
  return {
    score: max > 0 ? Math.round((total / max) * 100) : 0,
    signals: signalScores
  };
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

// Export single page CSV
const exportPageCSV = (page) => {
  const s = calculateScores(page.ratings || {}, page.intent);
  const overall = Math.round((s.Experience + s.Expertise + s.Authority + s.Trust) / 4);
  
  let csv = "Section,Signal,Rating,Status,Recommendation\n";
  
  Object.entries(EEAT_CRITERIA).forEach(([key, cat]) => {
    cat.items.forEach(item => {
      const { applies } = signalAppliesTo(item.id, page.intent);
      const rating = page.ratings?.[item.id] ?? 0;
      const status = !applies ? "N/A" : rating === 2 ? "Full" : rating === 1 ? "Partial" : "Missing";
      const rec = rating < 2 && applies ? suggestions[item.id] : "";
      csv += `"${cat.name}","${item.signal}",${rating},"${status}","${rec.replace(/"/g, '""')}"\n`;
    });
  });
  
  // Add summary row
  csv += `\n"SUMMARY","URL","${page.url}","",""\n`;
  csv += `"","Intent","${page.intent || 'Unknown'}","",""\n`;
  csv += `"","YMYL","${page.ymyl || 'None'}","",""\n`;
  csv += `"","Experience Score","${s.Experience}%","",""\n`;
  csv += `"","Expertise Score","${s.Expertise}%","",""\n`;
  csv += `"","Authority Score","${s.Authority}%","",""\n`;
  csv += `"","Trust Score","${s.Trust}%","",""\n`;
  csv += `"","Overall Score","${overall}%","${getLabel(overall).label}",""\n`;
  
  downloadCSV(csv, `eeat_${new URL(page.url).hostname}_${new Date().toISOString().split('T')[0]}.csv`);
};

// Export all pages CSV
const exportAllCSV = (pages) => {
  const completedPages = pages.filter(p => p.status === 'complete');
  if (!completedPages.length) return;
  
  // Build header with all signals
  let header = "URL,Intent,YMYL,Harmful";
  Object.values(EEAT_CRITERIA).forEach(cat => {
    cat.items.forEach(item => {
      header += `,"${item.signal}"`;
    });
  });
  header += ",Experience %,Expertise %,Authority %,Trust %,Overall %,Score Label,Top 3 Recommendations\n";
  
  let csv = header;
  
  completedPages.forEach(page => {
    const s = calculateScores(page.ratings || {}, page.intent);
    const overall = Math.round((s.Experience + s.Expertise + s.Authority + s.Trust) / 4);
    
    let row = `"${page.url}","${page.intent || ''}","${page.ymyl || 'none'}","${page.harmful ? 'Yes' : 'No'}"`;
    
    Object.values(EEAT_CRITERIA).forEach(cat => {
      cat.items.forEach(item => {
        const { applies } = signalAppliesTo(item.id, page.intent);
        const rating = page.ratings?.[item.id] ?? 0;
        row += `,${applies ? rating : 'N/A'}`;
      });
    });
    
    // Get top recommendations
    const recs = [];
    Object.values(EEAT_CRITERIA).forEach(cat => {
      cat.items.forEach(item => {
        const { applies } = signalAppliesTo(item.id, page.intent);
        if (applies && (page.ratings?.[item.id] ?? 0) < 2) {
          recs.push({ signal: item.signal, weight: item.weight });
        }
      });
    });
    recs.sort((a, b) => b.weight - a.weight);
    const topRecs = recs.slice(0, 3).map(r => r.signal).join('; ');
    
    row += `,${s.Experience},${s.Expertise},${s.Authority},${s.Trust},${overall},"${getLabel(overall).label}","${topRecs}"`;
    csv += row + "\n";
  });
  
  downloadCSV(csv, `eeat_analysis_all_${new Date().toISOString().split('T')[0]}.csv`);
};

// Export executive summary
const exportExecutiveSummary = (pages, domainScore) => {
  const completedPages = pages.filter(p => p.status === 'complete');
  if (!completedPages.length) return;
  
  const avgScores = { Experience: 0, Expertise: 0, Authority: 0, Trust: 0 };
  completedPages.forEach(page => {
    const s = calculateScores(page.ratings || {}, page.intent);
    Object.keys(avgScores).forEach(k => avgScores[k] += s[k]);
  });
  Object.keys(avgScores).forEach(k => avgScores[k] = Math.round(avgScores[k] / completedPages.length));
  const overallAvg = Math.round((avgScores.Experience + avgScores.Expertise + avgScores.Authority + avgScores.Trust) / 4);
  
  // Aggregate recommendations
  const recCounts = {};
  completedPages.forEach(page => {
    Object.values(EEAT_CRITERIA).forEach(cat => {
      cat.items.forEach(item => {
        const { applies } = signalAppliesTo(item.id, page.intent);
        if (applies && (page.ratings?.[item.id] ?? 0) < 2) {
          if (!recCounts[item.id]) {
            recCounts[item.id] = { id: item.id, signal: item.signal, weight: item.weight, count: 0, suggestion: suggestions[item.id] };
          }
          recCounts[item.id].count++;
        }
      });
    });
  });
  
  const sortedRecs = Object.values(recCounts).sort((a, b) => (b.weight * b.count) - (a.weight * a.count));
  
  let csv = "E-E-A-T EXECUTIVE SUMMARY\n";
  csv += `Generated,${new Date().toLocaleString()}\n`;
  csv += `Pages Analyzed,${completedPages.length}\n\n`;
  
  csv += "DOMAIN-WIDE SCORES\n";
  csv += `Brand Trust Score,${domainScore?.score || 0}%\n`;
  csv += `Average Experience,${avgScores.Experience}%\n`;
  csv += `Average Expertise,${avgScores.Expertise}%\n`;
  csv += `Average Authority,${avgScores.Authority}%\n`;
  csv += `Average Trust,${avgScores.Trust}%\n`;
  csv += `Overall Average,${overallAvg}%,${getLabel(overallAvg).label}\n\n`;
  
  csv += "PAGE BREAKDOWN\n";
  csv += "URL,Intent,Overall Score,Label\n";
  completedPages.forEach(page => {
    const s = calculateScores(page.ratings || {}, page.intent);
    const overall = Math.round((s.Experience + s.Expertise + s.Authority + s.Trust) / 4);
    csv += `"${page.url}","${page.intent || 'Unknown'}",${overall}%,"${getLabel(overall).label}"\n`;
  });
  
  csv += "\nTOP PRIORITY RECOMMENDATIONS\n";
  csv += "Priority,Signal,Pages Affected,Recommendation\n";
  sortedRecs.slice(0, 10).forEach((rec, i) => {
    csv += `${i + 1},"${rec.signal}",${rec.count},"${rec.suggestion.replace(/"/g, '""')}"\n`;
  });
  
  csv += "\nBRAND SIGNAL STATUS\n";
  csv += "Signal,Status,Recommendation\n";
  EEAT_CRITERIA.brand.items.forEach(item => {
    const rating = domainScore?.signals?.[item.id] ?? 0;
    const status = rating === 2 ? "Full" : rating === 1 ? "Partial" : "Missing";
    const rec = rating < 2 ? suggestions[item.id] : "";
    csv += `"${item.signal}","${status}","${rec.replace(/"/g, '""')}"\n`;
  });
  
  downloadCSV(csv, `eeat_executive_summary_${new Date().toISOString().split('T')[0]}.csv`);
};

const downloadCSV = (content, filename) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export default function App() {
  const [urls, setUrls] = useState("");
  const [pages, setPages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [tab, setTab] = useState("overview");
  const [mainTab, setMainTab] = useState("pages"); // pages | domain | executive
  const [expanded, setExpanded] = useState({});
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [apiKey, setApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(false);

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
    
    setAnalyzing(true);
    setProgress({ current: 0, total: urlList.length });
    
    const newPages = urlList.map((url, i) => ({ 
      id: i, url, status: "pending", ratings: {}, 
      intent: null, purpose: null, ymyl: null, harmful: false, analysis: null 
    }));
    setPages(newPages);

    for (let i = 0; i < newPages.length; i++) {
      setProgress({ current: i + 1, total: urlList.length });
      setPages(prev => prev.map(p => p.id === i ? { ...p, status: "analyzing" } : p));
      
      try {
        const analysis = await analyzeUrl(newPages[i].url);
        
        const ratings = {
          b1: analysis.brand?.contactInfo ?? 0,
          b2: analysis.brand?.contactInfo ?? 0,
          b3: analysis.brand?.contactInfo ?? 0,
          b4: analysis.brand?.contactInfo ?? 0,
          b5: analysis.brand?.ssl ?? 0,
          b6: analysis.brand?.policies ?? 0,
          b7: analysis.brand?.policies ?? 0,
          b8: analysis.brand?.aboutPage ?? 0,
          b9: analysis.brand?.aboutPage ?? 0,
          b10: analysis.brand?.accreditations ?? 0,
          b11: analysis.brand?.trustSignals ?? 0,
          b12: analysis.brand?.policies ?? 0,
          b13: analysis.brand?.socialLinks ?? 0,
          b14: analysis.brand?.orgSchema ?? 0,
          b15: analysis.brand?.trustSignals ?? 0,
          b16: analysis.brand?.trustSignals ?? 0,
          b17: analysis.brand?.trustSignals ?? 0,
          b18: analysis.brand?.aboutPage ?? 0,
          c1: analysis.content?.author ?? 0,
          c2: analysis.content?.authorExpert ?? 0,
          c3: analysis.content?.authorLink ?? 0,
          c4: analysis.content?.schema ?? 0,
          c5: analysis.content?.dates ?? 0,
          c6: analysis.content?.upToDate ?? 0,
          c7: analysis.content?.reviewer ?? 0,
          c8: analysis.content?.uniqueMedia ?? 0,
          c9: analysis.content?.grammar ?? 0,
          c10: analysis.content?.sources ?? 0,
          c11: analysis.content?.factual ?? 0,
          c12: analysis.content?.noAds ?? 0,
          c13: analysis.content?.effort ?? 0,
          c14: analysis.content?.insights ?? 0,
          c15: analysis.content?.intentMatch ?? 0,
          c16: analysis.content?.experience ?? 0,
          c17: analysis.content?.backlinks ?? 0,
          a1: analysis.author?.profile ?? 0,
          a2: analysis.author?.firstHand ?? 0,
          a3: analysis.author?.expertise ?? 0,
          a4: analysis.author?.bio ?? 0,
          a5: analysis.author?.photo ?? 0,
          a6: analysis.author?.title ?? 0,
          a7: analysis.author?.credentials ?? 0,
          a8: analysis.author?.social ?? 0,
          a9: analysis.author?.pressCited ?? 0,
          a10: analysis.author?.multiplePosts ?? 0,
          a11: analysis.author?.profileSchema ?? 0
        };
        
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
          ratings,
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

  const updateRating = (pageId, itemId, value) => {
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, ratings: { ...p.ratings, [itemId]: value } } : p));
    if (selected?.id === pageId) {
      setSelected(prev => ({ ...prev, ratings: { ...prev.ratings, [itemId]: value } }));
    }
  };

  const domainScore = calculateDomainScore(pages);
  const completedPages = pages.filter(p => p.status === 'complete');

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

  // Executive Summary Component
  const ExecutiveSummary = () => {
    if (!completedPages.length) {
      return <div className="text-center py-16 text-gray-500">Analyze pages first to see executive summary</div>;
    }

    const avgScores = { Experience: 0, Expertise: 0, Authority: 0, Trust: 0 };
    completedPages.forEach(page => {
      const s = calculateScores(page.ratings || {}, page.intent);
      Object.keys(avgScores).forEach(k => avgScores[k] += s[k]);
    });
    Object.keys(avgScores).forEach(k => avgScores[k] = Math.round(avgScores[k] / completedPages.length));
    const overallAvg = Math.round((avgScores.Experience + avgScores.Expertise + avgScores.Authority + avgScores.Trust) / 4);

    // Aggregate recommendations
    const recCounts = {};
    completedPages.forEach(page => {
      Object.values(EEAT_CRITERIA).forEach(cat => {
        cat.items.forEach(item => {
          const { applies } = signalAppliesTo(item.id, page.intent);
          if (applies && (page.ratings?.[item.id] ?? 0) < 2) {
            if (!recCounts[item.id]) {
              recCounts[item.id] = { id: item.id, signal: item.signal, weight: item.weight, count: 0, suggestion: suggestions[item.id], category: cat.name };
            }
            recCounts[item.id].count++;
          }
        });
      });
    });
    const sortedRecs = Object.values(recCounts).sort((a, b) => (b.weight * b.count) - (a.weight * a.count));

    // Intent breakdown
    const intentCounts = {};
    completedPages.forEach(p => {
      const intent = p.intent || 'unknown';
      intentCounts[intent] = (intentCounts[intent] || 0) + 1;
    });

    return (
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="text-3xl font-bold">{completedPages.length}</div>
            <div className="text-blue-100 text-sm">Pages Analyzed</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="text-3xl font-bold">{domainScore?.score || 0}%</div>
            <div className="text-purple-100 text-sm">Brand Trust Score</div>
          </div>
          <div className={`bg-gradient-to-br ${getLabel(overallAvg).bgDark} rounded-xl p-4 text-white`}>
            <div className="text-3xl font-bold">{overallAvg}%</div>
            <div className="text-white/80 text-sm">Avg E-E-A-T Score</div>
          </div>
          <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl p-4 text-white">
            <div className="text-3xl font-bold">{sortedRecs.length}</div>
            <div className="text-slate-300 text-sm">Issues Found</div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold mb-4">Average Scores Across All Pages</h3>
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

        {/* Intent Breakdown */}
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

        {/* Top Priority Recommendations */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">🎯 Top Priority Recommendations</h3>
            <button 
              onClick={() => exportExecutiveSummary(pages, domainScore)}
              className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              📥 Export Summary
            </button>
          </div>
          <div className="space-y-3">
            {sortedRecs.slice(0, 10).map((rec, i) => (
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
                <div className="text-xs text-gray-500 mb-2">{rec.category}</div>
                <div className="text-sm text-gray-700">{rec.suggestion}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Page Performance */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold mb-4">📊 Page Performance</h3>
          <div className="space-y-2">
            {completedPages
              .map(page => {
                const s = calculateScores(page.ratings || {}, page.intent);
                const overall = Math.round((s.Experience + s.Expertise + s.Authority + s.Trust) / 4);
                return { ...page, overall };
              })
              .sort((a, b) => b.overall - a.overall)
              .map((page, i) => {
                const info = getLabel(page.overall);
                const intentInfo = getIntentLabel(page.intent);
                return (
                  <div key={page.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-lg">
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

  // Domain Analysis Component
  const DomainAnalysis = () => {
    if (!completedPages.length) {
      return <div className="text-center py-16 text-gray-500">Analyze pages first to see domain analysis</div>;
    }

    return (
      <div className="space-y-6">
        {/* Domain Score Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-1">Domain Brand Trust Score</h2>
              <p className="text-indigo-200 text-sm">Aggregated brand signals across {completedPages.length} pages</p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{domainScore?.score || 0}%</div>
              <div className="text-indigo-200">{getLabel(domainScore?.score || 0).label}</div>
            </div>
          </div>
        </div>

        {/* Brand Signals Grid */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold mb-4">Brand & Trust Signals Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EEAT_CRITERIA.brand.items.map(item => {
              const rating = domainScore?.signals?.[item.id] ?? 0;
              const status = rating === 2 ? { icon: "✅", label: "Full", bg: "bg-green-50 border-green-200" } 
                           : rating === 1 ? { icon: "⚠️", label: "Partial", bg: "bg-yellow-50 border-yellow-200" }
                           : { icon: "❌", label: "Missing", bg: "bg-red-50 border-red-200" };
              return (
                <div key={item.id} className={`p-3 rounded-lg border ${status.bg}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{status.icon}</span>
                      <span className="font-medium text-sm">{item.signal}</span>
                    </div>
                    <span className="text-xs text-gray-500">{item.concept}</span>
                  </div>
                  {rating < 2 && (
                    <div className="mt-2 text-xs text-gray-600 pl-6">{suggestions[item.id]}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Author Coverage */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold mb-4">Author Credibility Coverage</h3>
          <p className="text-sm text-gray-600 mb-4">
            Author signals are primarily relevant for informational content. 
            {completedPages.filter(p => p.intent === 'informational').length} of {completedPages.length} pages are informational.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {EEAT_CRITERIA.author.items.map(item => {
              // Get average rating from informational pages only
              const infoPages = completedPages.filter(p => p.intent === 'informational');
              const ratings = infoPages.map(p => p.ratings?.[item.id] ?? 0);
              const avgRating = ratings.length ? Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length) : 0;
              
              const status = avgRating >= 1.5 ? { icon: "✅", label: "Good", bg: "bg-green-50 border-green-200" }
                           : avgRating >= 0.5 ? { icon: "⚠️", label: "Partial", bg: "bg-yellow-50 border-yellow-200" }
                           : { icon: "❌", label: "Missing", bg: "bg-red-50 border-red-200" };
              
              return (
                <div key={item.id} className={`p-3 rounded-lg border ${status.bg}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{status.icon}</span>
                      <span className="font-medium text-sm">{item.signal}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {infoPages.length ? `${Math.round(avgRating * 50)}% coverage` : 'N/A'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🔍</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">E-E-A-T Analyzer <span className="text-sm font-normal text-blue-600">v2.0</span></h1>
                <p className="text-gray-500 text-sm">Intent-aware analysis with domain-wide scoring</p>
              </div>
            </div>
            <button 
              onClick={() => setShowApiInput(!showApiInput)}
              className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              ⚙️ API Key
            </button>
          </div>
          
          {showApiInput && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">Anthropic API Key</label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => saveApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={() => setShowApiInput(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Save</button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Stored locally in your browser. Get one at <a href="https://console.anthropic.com" target="_blank" className="text-blue-600 hover:underline">console.anthropic.com</a></p>
            </div>
          )}
        </div>

        {/* URL Input */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-200">
          <h2 className="font-semibold mb-3 flex items-center gap-2">📋 Enter URLs to Analyze (up to 50)</h2>
          <textarea 
            value={urls} 
            onChange={e => setUrls(e.target.value)} 
            placeholder="Paste URLs here, one per line..." 
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
                  <button className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                    📥 Export ▾
                  </button>
                  <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <button onClick={() => exportAllCSV(pages)} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm">Export All Pages (CSV)</button>
                    <button onClick={() => exportExecutiveSummary(pages, domainScore)} className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm">Executive Summary (CSV)</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        {pages.length > 0 && (
          <>
            <div className="flex gap-2 mb-6">
              {[
                { id: "pages", label: "📄 Page Analysis", count: completedPages.length },
                { id: "domain", label: "🏢 Domain Health" },
                { id: "executive", label: "📊 Executive Summary" }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setMainTab(t.id)}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    mainTab === t.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-slate-50 border'
                  }`}
                >
                  {t.label} {t.count !== undefined && <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs">{t.count}</span>}
                </button>
              ))}
            </div>

            {/* Page Analysis View */}
            {mainTab === "pages" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Page List */}
                <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
                  <h3 className="font-semibold mb-3">📄 Pages ({pages.length})</h3>
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {pages.map(p => {
                      const s = calculateScores(p.ratings || {}, p.intent);
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

                {/* Page Details */}
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
                          const s = calculateScores(selected.ratings || {}, selected.intent);
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

                      {/* Page Tabs */}
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

                      {/* Overview Tab */}
                      {tab === "overview" && selected.status === "complete" && (() => {
                        const s = calculateScores(selected.ratings || {}, selected.intent);
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

                      {/* Signals Tab */}
                      {tab === "signals" && (
                        <div className="space-y-4">
                          <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                            <strong>Intent: {getIntentLabel(selected.intent).label}</strong> — Signals marked N/A are less relevant for this page type.
                          </div>
                          {Object.entries(EEAT_CRITERIA).map(([key, cat]) => (
                            <div key={key} className="border rounded-lg">
                              <button onClick={() => setExpanded(p => ({ ...p, [key]: !p[key] }))} className="w-full flex justify-between items-center p-4 hover:bg-slate-50">
                                <div>
                                  <span className="font-medium">{cat.name}</span>
                                  <span className="text-xs text-gray-500 ml-2">{cat.description}</span>
                                </div>
                                <span>{expanded[key] ? "▲" : "▼"}</span>
                              </button>
                              {expanded[key] && (
                                <div className="border-t divide-y">
                                  {cat.items.map(item => {
                                    const { applies, required } = signalAppliesTo(item.id, selected.intent);
                                    return (
                                      <div key={item.id} className={`p-4 flex justify-between items-center ${!applies ? 'bg-gray-50 opacity-60' : ''}`}>
                                        <div className="flex-1 mr-4">
                                          <div className="text-sm flex items-center gap-2">
                                            {item.signal}
                                            {!applies && <span className="text-xs px-1.5 py-0.5 bg-gray-200 rounded">N/A for {selected.intent}</span>}
                                            {required && <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">Required</span>}
                                          </div>
                                          <div className="text-xs text-gray-500">{item.concept} • Weight: {item.weight}</div>
                                        </div>
                                        <div className="flex gap-1">
                                          {[0, 1, 2].map(v => (
                                            <RatingBtn key={v} value={v} current={selected.ratings?.[item.id] ?? 0} onChange={val => updateRating(selected.id, item.id, val)} disabled={!applies} />
                                          ))}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Recommendations Tab */}
                      {tab === "recommendations" && selected.status === "complete" && (() => {
                        const recs = [];
                        Object.values(EEAT_CRITERIA).forEach(cat => {
                          cat.items.forEach(item => {
                            const { applies, required } = signalAppliesTo(item.id, selected.intent);
                            if (!applies) return;
                            const r = selected.ratings?.[item.id] || 0;
                            if (r < 2) recs.push({ ...item, action: r === 0 ? "Missing" : "Needs Improvement", suggestion: suggestions[item.id], category: cat.name, required });
                          });
                        });
                        recs.sort((a, b) => {
                          if (a.required !== b.required) return b.required - a.required;
                          return b.weight - a.weight;
                        });

                        const required = recs.filter(r => r.required);
                        const high = recs.filter(r => !r.required && r.weight === 3);
                        const med = recs.filter(r => !r.required && r.weight === 2);
                        const low = recs.filter(r => !r.required && r.weight === 1);

                        return (
                          <div className="space-y-6">
                            {required.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-purple-700 mb-3">🎯 Required for {getIntentLabel(selected.intent).label} Pages ({required.length})</h4>
                                <div className="space-y-3">
                                  {required.map((r, i) => (
                                    <div key={i} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
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
                              <div className="text-center py-12"><div className="text-5xl mb-4">🎉</div><p className="text-gray-600">All applicable signals fully demonstrated!</p></div>
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
            )}

            {/* Domain Health View */}
            {mainTab === "domain" && <DomainAnalysis />}

            {/* Executive Summary View */}
            {mainTab === "executive" && <ExecutiveSummary />}
          </>
        )}

        {/* Empty State - Instructional Landing */}
        {pages.length === 0 && (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3">Ready to Analyze</h3>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                Evaluate your web pages against Google's E-E-A-T guidelines. This tool analyzes 46 signals 
                across four key dimensions that Google uses to assess content quality.
              </p>
              
              {/* E-E-A-T Icons */}
              <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
                {[
                  { icon: "🎯", label: "Experience", desc: "First-hand knowledge", bg: "bg-orange-50" },
                  { icon: "🎓", label: "Expertise", desc: "Subject mastery", bg: "bg-green-50" },
                  { icon: "🏆", label: "Authority", desc: "Industry recognition", bg: "bg-blue-50" },
                  { icon: "🛡️", label: "Trust", desc: "Credibility signals", bg: "bg-purple-50" }
                ].map(item => (
                  <div key={item.label} className={`p-4 ${item.bg} rounded-xl`}>
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="font-semibold text-gray-800">{item.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200">
              <h4 className="text-lg font-bold mb-6 text-center">🚀 How It Works</h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl mx-auto mb-3">1</div>
                  <h5 className="font-semibold mb-2">Paste Your URLs</h5>
                  <p className="text-sm text-gray-600">Enter up to 50 URLs in the text box above, one per line. The tool works with any publicly accessible webpage.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl mx-auto mb-3">2</div>
                  <h5 className="font-semibold mb-2">AI-Powered Analysis</h5>
                  <p className="text-sm text-gray-600">Claude AI evaluates each page against 46 E-E-A-T signals, automatically detecting page intent to apply the right criteria.</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-xl mx-auto mb-3">3</div>
                  <h5 className="font-semibold mb-2">Get Actionable Results</h5>
                  <p className="text-sm text-gray-600">Review scores, identify gaps, and export prioritized recommendations to improve your content quality.</p>
                </div>
              </div>
            </div>

            {/* How Pages Are Judged */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200">
              <h4 className="text-lg font-bold mb-6 text-center">⚖️ How Pages Are Judged</h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <h5 className="font-semibold">Intent-Aware Scoring</h5>
                      <p className="text-sm text-gray-600">The tool detects whether your page is informational, commercial, transactional, navigational, or service-focused—then applies only the relevant signals. A product page won't be penalized for missing author bios.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl">📊</div>
                    <div>
                      <h5 className="font-semibold">Weighted Signals</h5>
                      <p className="text-sm text-gray-600">Not all signals are equal. Critical signals like SSL certificates, source citations, and author credentials are weighted higher (3x) than nice-to-haves like social media links (1x).</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="text-2xl">✅</div>
                    <div>
                      <h5 className="font-semibold">Three-Tier Ratings</h5>
                      <p className="text-sm text-gray-600">Each signal is rated: ✅ Full (2 pts), ⚠️ Partial (1 pt), or ❌ Missing (0 pts). You can manually adjust any rating after the AI analysis.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl">⚠️</div>
                    <div>
                      <h5 className="font-semibold">YMYL Detection</h5>
                      <p className="text-sm text-gray-600">Pages about health, finance, safety, or legal topics ("Your Money or Your Life") are flagged and held to higher standards per Google's guidelines.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Explained */}
            <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200">
              <h4 className="text-lg font-bold mb-6 text-center">✨ What You Can Do</h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl mb-2">📄</div>
                  <h5 className="font-semibold mb-2">Page Analysis</h5>
                  <p className="text-sm text-gray-600 mb-3">Deep-dive into individual pages. View scores across all four E-E-A-T dimensions, see strengths and weaknesses, and get specific recommendations.</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Overview with score breakdown</li>
                    <li>• All 46 signals with ratings</li>
                    <li>• Prioritized recommendations</li>
                    <li>• Export individual page reports</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl mb-2">🏢</div>
                  <h5 className="font-semibold mb-2">Domain Health</h5>
                  <p className="text-sm text-gray-600 mb-3">See your brand's overall trust signals aggregated across all analyzed pages. Identifies site-wide issues vs. page-specific problems.</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Domain-wide trust score</li>
                    <li>• Brand signal status grid</li>
                    <li>• Author credibility coverage</li>
                    <li>• Site-wide recommendations</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="text-2xl mb-2">📊</div>
                  <h5 className="font-semibold mb-2">Executive Summary</h5>
                  <p className="text-sm text-gray-600 mb-3">Get a high-level view perfect for stakeholder reports. Shows averages, rankings, and the top issues to fix across all pages.</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>• Average scores across pages</li>
                    <li>• Page performance ranking</li>
                    <li>• Top 10 priority fixes</li>
                    <li>• Export summary to CSV</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Export Options */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-start gap-4">
                <div className="text-3xl">📥</div>
                <div>
                  <h4 className="font-bold mb-2">Export Your Results</h4>
                  <p className="text-sm text-gray-700 mb-3">All analysis data can be exported to CSV for use in Excel, Google Sheets, or your reporting tools:</p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 bg-white rounded-full text-sm border border-green-200">📄 Single Page Report</span>
                    <span className="px-3 py-1 bg-white rounded-full text-sm border border-green-200">📋 All Pages Data</span>
                    <span className="px-3 py-1 bg-white rounded-full text-sm border border-green-200">📊 Executive Summary</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Get Started CTA */}
            <div className="text-center py-4">
              <p className="text-gray-500 mb-2">👆 Paste your URLs in the text box above to get started</p>
              <p className="text-sm text-gray-400">First time? Click ⚙️ API Key to add your Anthropic API key</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          Based on Google's Search Quality Rater Guidelines • E-E-A-T checklist inspired by Digitaloft • v2.0 with intent-aware scoring
        </div>
      </div>
    </div>
  );
}
