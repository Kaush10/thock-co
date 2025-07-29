import React from 'react';
import { GENERAL_INFO } from '../lib/pricingData';
import { CheckCircle, Truck, Clock, Award } from 'lucide-react';

const ICONS: Record<string, React.ReactNode> = {
  'check-circle': <CheckCircle className="inline w-5 h-5 mr-2 text-green-400" />,
  'truck': <Truck className="inline w-5 h-5 mr-2 text-blue-400" />,
  'clock': <Clock className="inline w-5 h-5 mr-2 text-yellow-400" />,
  'award': <Award className="inline w-5 h-5 mr-2 text-pink-400" />,
};

export const GeneralInfoCard: React.FC = () => (
  <div className="glass-card p-5 w-full max-w-xl mx-auto mt-8 mb-4">
    <h3 className="text-lg font-bold mb-4 text-center text-interactive">General Information</h3>
    <ul className="space-y-3">
      {GENERAL_INFO.map((info) => (
        <li key={info.label} className="flex items-start gap-2">
          <span>{ICONS[info.icon]}</span>
          <span className="text-sm font-medium text-white/90">{info.label}:</span>
          <span className="text-sm text-white/70">{info.value}</span>
        </li>
      ))}
    </ul>
  </div>
);
