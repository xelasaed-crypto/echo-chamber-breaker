// frontend/src/App.jsx - SIMPLIFIED WORKING VERSION
import React, { useState } from 'react';

function App() {
  const [inputText, setInputText] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [inputMode, setInputMode] = useState('url'); // 'url' or 'text'

  const analyzeContent = async () => {
    setLoading(true);
    setError(null);
    
    const payload = inputMode === 'url' 
      ? { url } 
      : { text: inputText };
    
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Analysis failed');
      }
      
      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sampleTexts = {
    conservative: "The free market is the best solution for economic growth. Government intervention only creates inefficiency and stifles innovation. Lower taxes and deregulation will unleash the entrepreneurial spirit that drives prosperity.",
    progressive: "Climate change is the defining crisis of our time. We need immediate government action, green investments, and systemic change to transition away from fossil fuels and protect vulnerable communities.",
    tech: "Artificial intelligence will revolutionize every industry. From healthcare to education, AI-powered solutions will increase efficiency and create unprecedented opportunities for human flourishing."
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0f172a', 
      color: '#f1f5f9',
      padding: '20px'
    }}>
      <div className="container">
        {/* Header */}
        <header style={{ 
          padding: '40px 0', 
          borderBottom: '1px solid #334155' 
        }}>
          <h1 style={{ 
            fontSize: '48px', 
            marginBottom: '10px',
            background: 'linear-gradient(135deg, #a78bfa 0%, #6366f1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            🔮 Echo Chamber Breaker
          </h1>
          <p style={{ fontSize: '20px', color: '#94a3b8' }}>
            Analyze the perspective landscape of any text or article
          </p>
        </header>

        {/* Main Content */}
        <main style={{ padding: '40px 0' }}>
          
          {/* What does this do? */}
          <div style={{
            backgroundColor: '#1e293b',
            padding: '30px',
            borderRadius: '12px',
            marginBottom: '40px',
            border: '1px solid #334155'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>What does this do?</h2>
            <p style={{ marginBottom: '15px', lineHeight: '1.6', color: '#cbd5e1' }}>
              Echo Chamber Breaker analyzes any text or article and shows you its <strong>ideological perspective</strong> across 
              10 different dimensions (economic, social, technological, etc.).
            </p>
            <p style={{ lineHeight: '1.6', color: '#cbd5e1' }}>
              It then suggests <strong>alternative viewpoints</strong> to help you understand the full spectrum of opinions 
              on any topic - breaking you out of your algorithmic bubble.
            </p>
          </div>

          {/* Input Mode Toggle */}
          <div style={{ marginBottom: '30px' }}>
            <button 
              onClick={() => setInputMode('url')}
              style={{
                padding: '10px 20px',
                backgroundColor: inputMode === 'url' ? '#6366f1' : '#1e293b',
                color: 'white',
                border: 'none',
                borderRadius: '8px 0 0 8px',
                cursor: 'pointer',
                marginRight: '2px'
              }}
            >
              Analyze URL
            </button>
            <button 
              onClick={() => setInputMode('text')}
              style={{
                padding: '10px 20px',
                backgroundColor: inputMode === 'text' ? '#6366f1' : '#1e293b',
                color: 'white',
                border: 'none',
                borderRadius: '0 8px 8px 0',
                cursor: 'pointer'
              }}
            >
              Analyze Text
            </button>
          </div>

          {/* Input Area */}
          <div style={{ marginBottom: '30px' }}>
            {inputMode === 'url' ? (
              <div>
                <label style={{ display: 'block', marginBottom: '10px', color: '#cbd5e1' }}>
                  Enter a news article URL:
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.reuters.com/world/article..."
                  style={{
                    width: '100%',
                    padding: '15px',
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    marginBottom: '15px'
                  }}
                />
              </div>
            ) : (
              <div>
                <label style={{ display: 'block', marginBottom: '10px', color: '#cbd5e1' }}>
                  Paste text to analyze:
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste any text here to analyze its perspective..."
                  rows="6"
                  style={{
                    width: '100%',
                    padding: '15px',
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '16px',
                    marginBottom: '15px',
                    resize: 'vertical'
                  }}
                />
              </div>
            )}

            {/* Sample Text Buttons */}
            {inputMode === 'text' && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ marginBottom: '10px', color: '#94a3b8', fontSize: '14px' }}>
                  Try a sample:
                </p>
                <button
                  onClick={() => setInputText(sampleTexts.conservative)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#334155',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    marginRight: '10px',
                    marginBottom: '10px',
                    cursor: 'pointer'
                  }}
                >
                  Economic View
                </button>
                <button
                  onClick={() => setInputText(sampleTexts.progressive)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#334155',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    marginRight: '10px',
                    marginBottom: '10px',
                    cursor: 'pointer'
                  }}
                >
                  Environmental View
                </button>
                <button
                  onClick={() => setInputText(sampleTexts.tech)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#334155',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Tech Optimist View
                </button>
              </div>
            )}

            <button
              onClick={analyzeContent}
              disabled={loading}
              style={{
                padding: '15px 30px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1
              }}
            >
              {loading ? '🔍 Analyzing...' : '🔮 Analyze Perspective'}
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div style={{
              backgroundColor: '#7f1d1d',
              border: '1px solid #ef4444',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '30px',
              color: '#fca5a5'
            }}>
              ❌ Error: {error}
            </div>
          )}

          {/* Results */}
          {analysis && (
            <div style={{
              backgroundColor: '#1e293b',
              padding: '30px',
              borderRadius: '12px',
              border: '1px solid #334155'
            }}>
              <h2 style={{ fontSize: '28px', marginBottom: '30px' }}>Analysis Results</h2>
              
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '15px', color: '#a78bfa' }}>
                  Primary Perspective
                </h3>
                <div style={{ fontSize: '32px', marginBottom: '10px', textTransform: 'capitalize' }}>
                  {analysis.primary_perspective}
                </div>
                <p style={{ color: '#94a3b8' }}>
                  Confidence: {(analysis.confidence * 100).toFixed(1)}% | 
                  Source Credibility: {(analysis.source_credibility * 100).toFixed(0)}%
                </p>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ fontSize: '20px', marginBottom: '15px', color: '#a78bfa' }}>
                  Perspective Dimensions
                </h3>
                <div style={{ display: 'grid', gap: '10px' }}>
                  {Object.entries(analysis.dimensions).map(([dim, value]) => (
                    <div key={dim} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '200px', textTransform: 'capitalize' }}>{dim}:</span>
                      <div style={{ flex: 1, backgroundColor: '#334155', height: '20px', borderRadius: '10px' }}>
                        <div style={{
                          width: `${value * 100}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%)',
                          borderRadius: '10px',
                          transition: 'width 0.3s'
                        }} />
                      </div>
                      <span style={{ width: '60px', textAlign: 'right' }}>
                        {(value * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '20px', marginBottom: '15px', color: '#a78bfa' }}>
                  🌍 Alternative Viewpoints to Explore
                </h3>
                {analysis.alternative_viewpoints.map((vp, i) => (
                  <div key={i} style={{
                    padding: '15px',
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    marginBottom: '10px'
                  }}>
                    <div style={{ textTransform: 'capitalize', color: '#a78bfa', marginBottom: '5px' }}>
                      {vp.perspective} Perspective
                    </div>
                    <div style={{ fontSize: '18px', marginBottom: '5px' }}>
                      {vp.title}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '14px' }}>
                      Source: {vp.source}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;