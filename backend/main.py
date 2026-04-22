# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import List, Dict, Optional
import httpx
from bs4 import BeautifulSoup
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import warnings
warnings.filterwarnings('ignore')

app = FastAPI(title="Echo Chamber Breaker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Lazy load the model to save memory
stance_classifier = None

def get_classifier():
    global stance_classifier
    if stance_classifier is None:
        from transformers import pipeline
        print("Loading model (this may take a moment on first run)...")
        stance_classifier = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli",
            device=-1  # CPU
        )
    return stance_classifier

# Perspective dimensions we analyze
PERSPECTIVE_DIMENSIONS = [
    "economic conservative",
    "economic progressive",
    "social conservative", 
    "social progressive",
    "libertarian",
    "environmentalist",
    "techno-optimist",
    "techno-skeptic",
    "globalist",
    "nationalist"
]

class ArticleRequest(BaseModel):
    url: Optional[HttpUrl] = None
    text: Optional[str] = None

class PerspectiveAnalysis(BaseModel):
    dimensions: Dict[str, float]
    primary_perspective: str
    confidence: float
    source_credibility: float
    alternative_viewpoints: List[Dict[str, str]]

async def extract_article_content(url: str) -> Dict:
    """Extract article text and metadata from URL"""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, follow_redirects=True)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style", "nav", "header", "footer"]):
                script.decompose()
                
            # Get text
            text = ' '.join(soup.stripped_strings)
            
            # Get title
            title = soup.title.string if soup.title else "Untitled"
            
            # Basic source credibility
            domain = url.split('/')[2]
            credible_domains = [
                'reuters.com', 'apnews.com', 'bbc.com', 'npr.org',
                'nature.com', 'science.org', 'economist.com'
            ]
            credibility = 0.8 if any(d in domain for d in credible_domains) else 0.5
            
            return {
                "text": text[:3000],  # Limit for API performance
                "title": title,
                "domain": domain,
                "credibility": credibility
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch article: {str(e)}")

async def analyze_perspective(text: str) -> Dict:
    """Analyze text for perspective dimensions"""
    classifier = get_classifier()
    
    results = classifier(
        text[:1000],  # Limit text length
        candidate_labels=PERSPECTIVE_DIMENSIONS,
        multi_label=True
    )
    
    dimensions = dict(zip(results['labels'], results['scores']))
    primary = results['labels'][0]
    confidence = results['scores'][0]
    
    return {
        "dimensions": dimensions,
        "primary_perspective": primary,
        "confidence": confidence
    }

@app.post("/analyze", response_model=PerspectiveAnalysis)
async def analyze_article(request: ArticleRequest):
    """Main endpoint: analyze an article for perspective"""
    try:
        # ADD THIS LOGGING
        print("=" * 50)
        print("RECEIVED REQUEST:")
        print(f"URL: {request.url}")
        print(f"Text present: {'Yes' if request.text else 'No'}")
        if request.text:
            print(f"Text preview: {request.text[:100]}...")
        print("=" * 50)
        # Extract content
        if request.text:
            article_data = {
                "text": request.text[:3000],
                "title": "Direct Input",
                "domain": "manual-entry",
                "credibility": 0.5
            }
        elif request.url:
            article_data = await extract_article_content(str(request.url))
        else:
            # This will tell us if we're getting empty requests
            print("WARNING: Neither URL nor text provided!")
            raise HTTPException(status_code=400, detail="Either url or text must be provided")
        
        # Analyze perspective
        perspective_data = await analyze_perspective(article_data["text"])
        
        # Generate alternative viewpoints
        opposite_map = {
            "economic conservative": "economic progressive",
            "economic progressive": "economic conservative",
            "social conservative": "social progressive",
            "social progressive": "social conservative",
        }
        
        primary = perspective_data["primary_perspective"]
        opposite = opposite_map.get(primary, "alternative")
        
        alternatives = [
            {
                "title": f"Understanding the {opposite} perspective",
                "source": "Perspective Library",
                "url": f"https://www.google.com/search?q={opposite.replace(' ', '+')}+perspective",
                "perspective": opposite
            },
            {
                "title": f"Why {primary} isn't the only way to see it",
                "source": "Viewpoint Diversifier",
                "url": "#",
                "perspective": "balanced"
            }
        ]
        
        return PerspectiveAnalysis(
            dimensions=perspective_data["dimensions"],
            primary_perspective=perspective_data["primary_perspective"],
            confidence=perspective_data["confidence"],
            source_credibility=article_data["credibility"],
            alternative_viewpoints=alternatives
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Echo Chamber Breaker API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)