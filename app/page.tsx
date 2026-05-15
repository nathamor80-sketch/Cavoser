'use client'

import { Hero } from '@/components/ui/animated-hero'
import { ShieldCheck, BarChart2, FileText, Globe } from 'lucide-react'

const FEATURES = [
  { icon: ShieldCheck, label: 'Reliability scores' },
  { icon: BarChart2,   label: 'Quality/Price comparator' },
  { icon: FileText,    label: 'Detailed product page' },
  { icon: Globe,       label: 'International' },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-[#07070f] flex flex-col overflow-hidden">
      <Hero />

      {/* Features strip */}
      <div className="relative z-10 border-t border-zinc-800/60 bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-8">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-zinc-500">
              <Icon size={14} className="text-indigo-400 shrink-0" />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
