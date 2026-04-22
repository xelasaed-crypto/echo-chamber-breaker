// frontend/src/components/AlternativeViewpoints.jsx
import React from 'react';
import { ExternalLink, BookOpen, Sparkles } from 'lucide-react';

const AlternativeViewpoints = ({ viewpoints }) => {
  return (
    <div className="space-y-4">
      {viewpoints.map((viewpoint, index) => (
        <div 
          key={index} 
          className="bg-gray-900/30 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-purple-500/10 rounded-lg">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-sm font-medium text-purple-400 capitalize tracking-wider">
                  {viewpoint.perspective} Perspective
                </span>
              </div>
              
              <h4 className="text-xl font-serif text-white mb-2 group-hover:text-purple-300 transition">
                {viewpoint.title}
              </h4>
              
              <p className="text-gray-400 text-sm mb-4">
                Source: <span className="text-gray-300">{viewpoint.source}</span>
              </p>
              
              <a
                href={viewpoint.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition"
              >
                Explore this perspective
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      ))}
      
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 rounded-xl border border-purple-500/20">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-white font-medium mb-2">Intellectual Empathy Exercise</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Try to articulate why someone might hold this view, even if you disagree. 
              The goal isn't to change your mind, but to understand the full spectrum of 
              human perspective. This is how we break echo chambers—not through argument, 
              but through understanding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlternativeViewpoints;