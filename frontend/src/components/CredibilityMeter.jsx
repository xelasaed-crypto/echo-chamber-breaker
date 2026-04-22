// frontend/src/components/CredibilityMeter.jsx
import React from 'react';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';

const CredibilityMeter = ({ score }) => {
  const percentage = (score * 100).toFixed(0);
  
  const getCredibilityInfo = () => {
    if (score >= 0.7) return {
      icon: ShieldCheck,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      text: 'High Credibility'
    };
    if (score >= 0.4) return {
      icon: Shield,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      text: 'Medium Credibility'
    };
    return {
      icon: ShieldAlert,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/30',
      text: 'Low Credibility'
    };
  };

  const info = getCredibilityInfo();
  const Icon = info.icon;

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${info.bgColor} border ${info.borderColor}`}>
      <Icon className={`w-4 h-4 ${info.color}`} />
      <span className={`text-sm font-medium ${info.color}`}>
        {info.text} ({percentage}%)
      </span>
    </div>
  );
};

export default CredibilityMeter;