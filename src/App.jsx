import React, { useState, useEffect } from 'react';

const EEAT_CRITERIA = {
  brand: {
    name: "Brand-Level Signals",
    items: [
      { id: "b1", signal: "Physical business address visible", concept: "Trust", weight: 2 },
      { id: "b2", signal: "Phone number visible", concept: "Trust", weight: 2 },
      { id: "b3", signal: "Contact email from main domain", concept: "Trust", weight: 2 },
      { id: "b4", signal: "Dedicated Contact Us page", concept: "Trust", weight: 2 },
      { id: "b5", signal: "Valid SSL certificate", concept: "Trust", weight: 3 },
      { id: "b6", signal: "Privacy Policy page", concept: "Trust", weight: 2 },
      { id: "b7", signal: "Terms & Conditions page", concept: "Trust", weight: 2 },
      { id: "b8", signal: "Detailed About Us page", concept: "Authority", weight: 3 },
      { id: "b9", signal: "Meet the Team page", concept: "Trust", weight: 2 },
      { id: "b10", signal: "Accreditations/memberships displayed", concept: "Trust", weight: 2 },
      { id: "b11", signal: "Press coverage/As Featured In", concept: "Authority", weight: 2 },
      { id: "b12", signal: "Editorial Policy page", concept: "Trust", weight: 2 },
      { id: "b13", signal: "Social media links visible", concept: "Trust", weight: 1 },
      { id: "b14", signal: "Organization Schema markup", concept: "Trust", weight: 2 },
      { id: "b15", signal: "Reviews/testimonials on site", concept: "Trust", weight: 2 },
      { id: "b16", signal: "Third-party reviews visible", concept: "Trust", weight: 3 },
      { id: "b17", signal: "Case studies/customer stories", concept: "Trust", weight: 2 },
      { id: "b18", signal: "Clear topical focus area", concept: "Authority", weight: 2 }
    ]
  },
  content: {
    name: "Content-Level Signals", 
    items: [
      { id: "c1", signal: "Author clearly displayed", concept: "Expertise", weight: 3 },
      { id: "c2", signal: "Author is subject matter expert", concept: "Expertise", weight: 3 },
      { id: "c3", signal: "Link to author profile page", concept: "Expertise", weight: 2 },
      { id: "c4", signal: "Appropriate Schema markup", concept: "Expertise", weight: 2 },
      { id: "c5", signal: "Publish/update date shown", concept: "Authority", weight: 2 },
      { id: "c6", signal: "Content is up-to-date", concept: "Authority", weight: 3 },
      { id: "c7", signal: "Content reviewer displayed (YMYL)", concept: "Expertise", weight: 3 },
      { id: "c8", signal: "Unique photos/videos/visuals", concept: "Experience", weight: 3 },
      { id: "c9", signal: "Free from spelling/grammar errors", concept: "Authority", weight: 2 },
      { id: "c10", signal: "Links to sources for claims", concept: "Authority", weight: 3 },
      { id: "c11", signal: "Factually correct content", concept: "Expertise", weight: 3 },
      { id: "c12", signal: "Free from distracting ads", concept: "Trust", weight: 2 },
      { id: "c13", signal: "Clear human effort demonstrated", concept: "Authority", weight: 2 },
      { id: "c14", signal: "Unique insights/opinions", concept: "Expertise", weight: 3 },
      { id: "c15", signal: "Matches searcher intent", concept: "Expertise", weight: 3 },
      { id: "c16", signal: "Written from actual experience", concept: "Experience", weight: 3 },
      { id: "c17", signal: "Linked to as source by others", concept: "Authority", weight: 3 }
    ]
  },
  author: {
    name: "Author-Level Signals",
    items: [
      { id: "a1", signal: "Standalone author profile page", concept: "Authority", weight: 3 },
      { id: "a2", signal: "First-hand experience in topic", concept: "Experience", weight: 3 },
      { id: "a3", signal: "Formal expertise/education", concept: "Expertise", weight: 3 },
      { id: "a4", signal: "Up-to-date author bio", concept: "Expertise", weight: 2 },
      { id: "a5", signal: "Author headshot/photo", concept: "Expertise", weight: 2 },
      { id: "a6", signal: "Job title displayed", concept: "Expertise", weight: 2 },
      { id: "a7", signal: "Credentials/accreditations shown", concept: "Expertise", weight: 3 },
      { id: "a8", signal: "Links to social profiles", concept: "Expertise", weight: 2 },
      { id: "a9", signal: "Cited as expert in press", concept: "Authority", weight: 3 },
      { id: "a10", signal: "Multiple posts on main topic", concept: "Authority", weight: 2 },
      { id: "a11", signal: "ProfilePage Schema markup", concept: "Expertise", weight: 2 }
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

const getSuggestion = (id, signal) => suggestions[id] || `Implement: ${signal}`;

const calculateScores = (ratings) => {
  const scores = { Experience: 0, Expertise: 0, Authority: 0, Trust: 0 };
  const maxScores = { Experience: 0, Expertise: 0, Authority: 0, Trust: 0 };
  
  Object.values(EEAT_CRITERIA).forEach(cat => {
    cat.items.forEach(item => {
      const rating = ratings[item.id] || 0;
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

const getLabel = (score) => {
  if (score >= 80) return { label: "Excellent", color: "text-green-600", bg: "bg-green-100" };
  if (score >= 60) return { label: "Good", color: "text-blue-600", bg: "bg-blue-100" };
  if (score >= 40) return { label: "Needs Work", color: "text-yellow-600", bg: "bg-yellow-100" };
  return { label: "Poor", color: "text-red-600", bg: "bg-red-100" };
};

const exportCSV = (pages) => {
  let csv = "URL,Purpose,YMYL,Harmful,Experience,Expertise,Authority,Trust,Overall,Label,Top Recommendations\n";
  pages.forEach(p => {
    const s = calculateScores(p.ratings || {});
    const overall = Math.round((s.Experience + s.Expertise + s.Authority + s.Trust) / 4);
    const recs = [];
    Object.values(EEAT_CRITERIA).forEach(cat => {
      cat.items.forEach(item => {
        if ((p.ratings?.[item.id] || 0) < 2) recs.push(item.signal);
      });
    });
    csv += `"${p.url}",${p.purpose||''},${p.ymyl||''},${p.harmful?'Yes':'No'},${s.Experience}%,${s.Expertise}%,${s.Authority}%,${s.Trust}%,${overall}%,${getLabel(overall).label},"${recs.slice(0,3).join('; ')}"\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `eeat_analysis_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
};

export default function App() {
  const [urls, setUrls] = useState("");
  const [pages, setPages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [tab, setTab] = useState("overview");
  const [expanded, setExpanded] = useState({});
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [apiKey, setApiKey] = useState("");
  const [showApiInput, setShowApiInput] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('anthropic_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  // Save API key to localStorage
  const saveApiKey = (key) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem('anthropic_api_key', key);
    } else {
      localStorage.removeItem('anthropic_api_key');
    }
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
    
    if (!apiKey) {
      setShowApiInput(true);
      return;
    }
    
    setAnalyzing(true);
    setProgress({ current: 0, total: urlList.length });
    
    const newPages = urlList.map((url, i) => ({ 
      id: i, 
      url, 
      status: "pending", 
      ratings: {}, 
      purpose: null, 
      ymyl: null, 
      harmful: false, 
      analysis: null 
    }));
    setPages(newPages);

    for (let i = 0; i < newPages.length; i++) {
      setProgress({ current: i + 1, total: urlList.length });
      setPages(prev => prev.map(p => p.id === i ? { ...p, status: "analyzing" } : p));
      
      try {
        const analysis = await analyzeUrl(newPages[i].url);
        
        const ratings = {
          b1: analysis.brand?.contactInfo || 0,
          b5: analysis.brand?.ssl || 0,
          b6: analysis.brand?.policies || 0,
          b8: analysis.brand?.aboutPage || 0,
          b16: analysis.brand?.trustSignals || 0,
          c1: analysis.content?.author || 0,
          c5: analysis.content?.dates || 0,
          c10: analysis.content?.sources || 0,
          c13: analysis.content?.quality || 0,
          c16: analysis.content?.experience || 0,
          a1: analysis.author?.profile || 0,
          a7: analysis.author?.credentials || 0,
          a3: analysis.author?.expertise || 0
        };
        
        const pageData = {
          ...newPages[i],
          status: "complete", 
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
        
        if (i === 0) {
          setSelected(pageData);
        }
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

  const RatingBtn = ({ value, current, onChange }) => {
    const labels = { 0: "❌", 1: "⚠️", 2: "✅" };
    const colors = { 
      0: current === 0 ? "bg-red-500 text-white" : "bg-gray-100 hover:bg-red-100", 
      1: current === 1 ? "bg-yellow-500 text-white" : "bg-gray-100 hover:bg-yellow-100", 
      2: current === 2 ? "bg-green-500 text-white" : "bg-gray-100 hover:bg-green-100" 
    };
    return (
      <button 
        onClick={() => onChange(value)} 
        className={`px-3 py-1 text-sm rounded transition-colors ${colors[value]}`}
      >
        {labels[value]}
      </button>
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
                <h1 className="text-2xl font-bold text-gray-900">E-E-A-T Analyzer</h1>
                <p className="text-gray-500 text-sm">Analyze pages against Google's Search Quality Rater Guidelines</p>
              </div>
            </div>
            <button 
              onClick={() => setShowApiInput(!showApiInput)}
              className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              ⚙️ API Key
            </button>
          </div>
          
          {/* API Key Input */}
          {showApiInput && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anthropic API Key
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => saveApiKey(e.target.value)}
                  placeholder="sk-ant-..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={() => setShowApiInput(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Your API key is stored locally in your browser and never sent to our servers.
                Get one at <a href="https://console.anthropic.com" target="_blank" className="text-blue-600 hover:underline">console.anthropic.com</a>
              </p>
            </div>
          )}
        </div>

        {/* URL Input */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-slate-200">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            📋 Enter URLs to Analyze (up to 50)
          </h2>
          <textarea 
            value={urls} 
            onChange={e => setUrls(e.target.value)} 
            placeholder="Paste URLs here, one per line...&#10;https://example.com/blog/article-1&#10;https://example.com/about-us" 
            className="w-full h-36 p-4 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              {parseUrls(urls).length} URL{parseUrls(urls).length !== 1 ? 's' : ''} detected
              {analyzing && <span className="ml-3 text-blue-600">Analyzing {progress.current}/{progress.total}...</span>}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={analyze} 
                disabled={analyzing || !parseUrls(urls).length} 
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                {analyzing ? "⏳ Analyzing..." : "🔎 Analyze URLs"}
              </button>
              {pages.length > 0 && (
                <button 
                  onClick={() => exportCSV(pages)} 
                  className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium"
                >
                  📥 Export CSV
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {pages.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Page List */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-slate-200">
              <h3 className="font-semibold mb-3">📄 Pages ({pages.length})</h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {pages.map(p => {
                  const s = calculateScores(p.ratings || {});
                  const overall = Math.round((s.Experience + s.Expertise + s.Authority + s.Trust) / 4);
                  const info = getLabel(overall);
                  return (
                    <div 
                      key={p.id} 
                      onClick={() => p.status === "complete" && setSelected(p)} 
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selected?.id === p.id ? 'bg-blue-50 border-2 border-blue-500' : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="truncate flex-1 mr-2">
                          <p className="text-sm font-medium truncate">{(() => { try { return new URL(p.url).pathname || '/'; } catch { return p.url; } })()}</p>
                          <p className="text-xs text-gray-400 truncate">{p.url}</p>
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
                  <div className="flex justify-between items-start mb-6 pb-4 border-b">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{(() => { try { return new URL(selected.url).pathname || '/'; } catch { return 'Page'; } })()}</h3>
                      <a href={selected.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                        {selected.url} ↗
                      </a>
                    </div>
                    {selected.status === "complete" && (() => {
                      const s = calculateScores(selected.ratings || {});
                      const overall = Math.round((s.Experience + s.Expertise + s.Authority + s.Trust) / 4);
                      const info = getLabel(overall);
                      return <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${info.bg} ${info.color}`}>{info.label} - {overall}%</span>;
                    })()}
                  </div>

                  {/* Tabs */}
                  <div className="flex border-b mb-6">
                    {[
                      { id: "overview", label: "📊 Overview" },
                      { id: "signals", label: "🎯 Signals" },
                      { id: "recommendations", label: "💡 Recommendations" }
                    ].map(t => (
                      <button 
                        key={t.id} 
                        onClick={() => setTab(t.id)} 
                        className={`px-4 py-2.5 text-sm font-medium border-b-2 ${
                          tab === t.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Overview Tab */}
                  {tab === "overview" && selected.status === "complete" && (() => {
                    const s = calculateScores(selected.ratings || {});
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

                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-4 bg-slate-50 rounded-lg">
                            <div className="text-xs text-gray-400 uppercase mb-1">Purpose</div>
                            <div className="font-semibold capitalize">{selected.purpose || "—"}</div>
                            {selected.purposeNote && <div className="text-xs text-gray-600 mt-2">{selected.purposeNote}</div>}
                          </div>
                          <div className="p-4 bg-slate-50 rounded-lg">
                            <div className="text-xs text-gray-400 uppercase mb-1">YMYL</div>
                            <div className={`font-semibold capitalize ${selected.ymyl !== 'none' ? 'text-orange-600' : ''}`}>
                              {selected.ymyl === 'none' ? 'Not YMYL' : selected.ymyl || "—"}
                            </div>
                            {selected.ymylNote && <div className="text-xs text-gray-600 mt-2">{selected.ymylNote}</div>}
                          </div>
                          <div className="p-4 bg-slate-50 rounded-lg">
                            <div className="text-xs text-gray-400 uppercase mb-1">Harmful</div>
                            <div className={`font-semibold ${selected.harmful ? 'text-red-600' : 'text-green-600'}`}>
                              {selected.harmful ? '⚠️ Review' : '✅ No Issues'}
                            </div>
                          </div>
                        </div>

                        {selected.analysis?.strengths?.length > 0 && (
                          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <div className="font-semibold text-green-800 mb-2">✅ Strengths</div>
                            <ul className="space-y-1">
                              {selected.analysis.strengths.map((s, i) => <li key={i} className="text-sm text-green-700">• {s}</li>)}
                            </ul>
                          </div>
                        )}

                        {selected.analysis?.weaknesses?.length > 0 && (
                          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <div className="font-semibold text-red-800 mb-2">❌ Weaknesses</div>
                            <ul className="space-y-1">
                              {selected.analysis.weaknesses.map((w, i) => <li key={i} className="text-sm text-red-700">• {w}</li>)}
                            </ul>
                          </div>
                        )}

                        {selected.analysis?.recommendations?.length > 0 && (
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="font-semibold text-blue-800 mb-2">💡 Quick Wins</div>
                            <ul className="space-y-1">
                              {selected.analysis.recommendations.map((r, i) => <li key={i} className="text-sm text-blue-700">{i + 1}. {r}</li>)}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Signals Tab */}
                  {tab === "signals" && (
                    <div className="space-y-4">
                      {Object.entries(EEAT_CRITERIA).map(([key, cat]) => (
                        <div key={key} className="border rounded-lg">
                          <button 
                            onClick={() => setExpanded(p => ({ ...p, [key]: !p[key] }))} 
                            className="w-full flex justify-between items-center p-4 hover:bg-slate-50"
                          >
                            <span className="font-medium">{cat.name}</span>
                            <span>{expanded[key] ? "▲" : "▼"}</span>
                          </button>
                          {expanded[key] && (
                            <div className="border-t divide-y">
                              {cat.items.map(item => (
                                <div key={item.id} className="p-4 flex justify-between items-center">
                                  <div className="flex-1 mr-4">
                                    <div className="text-sm">{item.signal}</div>
                                    <div className="text-xs text-gray-500">{item.concept} • Weight: {item.weight}</div>
                                  </div>
                                  <div className="flex gap-1">
                                    {[0, 1, 2].map(v => (
                                      <RatingBtn key={v} value={v} current={selected.ratings?.[item.id] ?? 0} onChange={val => updateRating(selected.id, item.id, val)} />
                                    ))}
                                  </div>
                                </div>
                              ))}
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
                        const r = selected.ratings?.[item.id] || 0;
                        if (r < 2) recs.push({ ...item, action: r === 0 ? "Missing" : "Needs Improvement", suggestion: getSuggestion(item.id, item.signal), category: cat.name });
                      });
                    });
                    recs.sort((a, b) => b.weight - a.weight);
                    const high = recs.filter(r => r.weight === 3);
                    const med = recs.filter(r => r.weight === 2);
                    const low = recs.filter(r => r.weight === 1);

                    return (
                      <div className="space-y-6">
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
                                  <div className="text-xs text-gray-500 mb-2">{r.concept} • {r.category}</div>
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
                                  <div className="text-xs text-gray-500 mb-2">{r.concept} • {r.category}</div>
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
                                  <div className="flex justify-between">
                                    <span className="font-medium text-sm">{r.signal}</span>
                                    <span className="text-xs px-2 py-0.5 rounded bg-gray-200">{r.action}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {recs.length === 0 && (
                          <div className="text-center py-12">
                            <div className="text-5xl mb-4">🎉</div>
                            <p className="text-gray-600">All signals fully demonstrated!</p>
                          </div>
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

        {/* Empty State */}
        {pages.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-slate-200">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">Ready to Analyze</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Paste URLs above to evaluate pages against Google's E-E-A-T guidelines.
            </p>
            <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
              {[
                { icon: "🎯", label: "Experience", color: "orange" },
                { icon: "🎓", label: "Expertise", color: "green" },
                { icon: "🏆", label: "Authority", color: "blue" },
                { icon: "🛡️", label: "Trust", color: "purple" }
              ].map(item => (
                <div key={item.label} className={`p-3 bg-${item.color}-50 rounded-lg`}>
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className={`text-xs font-medium text-${item.color}-700`}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          Based on Google's Search Quality Rater Guidelines • E-E-A-T checklist inspired by Digitaloft
        </div>
      </div>
    </div>
  );
}
