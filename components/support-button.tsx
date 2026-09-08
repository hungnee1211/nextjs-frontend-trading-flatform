import React from 'react';
import { Headphones } from 'lucide-react';

export function SupportButton() {
  return (
    <div className="fixed bottom-6 right-6">
      <div className="bg-[#F0B90B] text-black p-3 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform">
        <Headphones className="w-5 h-5" />
      </div>
    </div>
  );
}