'use client';

import { CryptoChartSection } from '@/components/chart/cripto-chart-section';
import { Header } from '@/components/header';
import { SupportButton } from '@/components/chart/support-button';
import React from 'react';


export default function ChartPage() {
  return (
    <div className="min-h-screen bg-[#181a20] text-[#eaecef] font-sans">
      <main className="max-w-[1280px] mx-auto px-4 py-6">
        <CryptoChartSection />
      </main>
      <SupportButton />
    </div>
  );
}