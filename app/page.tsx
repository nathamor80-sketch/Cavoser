'use client'

import { useRouter } from 'next/navigation'
import { useState, Suspense, lazy } from 'react'
import { Search, ShieldCheck, BarChart2, FileText, Globe } from 'lucide-react'

const StoreBackground3D = lazy(() => import('@/components/StoreBackground3D'))

const TRENDING = ['iPhone 15', 'Nike Air Max', 'Mechanical keyboard', 'Lego', 'Coffee maker', 'Gaming chair', 'AirPods Pro']

const SOURCES = [
  { name: 'Amazon',     color: 'text-orange-400', desc: 'Millions of products' },
  { name: 'eBay',       color: 'text-blue-400',   desc: 'New & used items' },
  { name: 'AliExpress', color: 'text-red-400',     desc: 'Factory-direct prices' },
  { name: 'Etsy',       color: 'text-amber-400',   desc: 'Handmade & unique' },
]

const FEATURES = [
  { icon: ShieldCheck, label: 'Reliability scores' },
  { icon: BarChart2,   label: 'Quality/Price comparator' },
  { icon: FileText,    label: 'Detailed product page' },
  { icon: Globe,       label: 'International' },
]

export default function Home() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="min-h-screen bg-[#08080f] flex flex-col relative overflow-hidden">

      <Suspense fallback={<div className="absolute inset-0 bg-[#08080f]" />}>
        <StoreBackground3D />
      </Suspense>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-16 pt-20">

        <div className="mb-6 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium tracking-widest uppercase">
          4 platforms · Millions of products · Best price guaranteed
        </div>

        <div className="text-center mb-8">
          <h1 className="text-6xl sm:text-7xl font-black tracking-tight mb-4 drop-shadow-2xl">
            <span className="gradient-text">UniMarket</span>
          </h1>
          <p className="text-zinc-300 text-lg sm:text-xl max-w-lg mx-auto leading-relaxed">
            Search once. Compare everywhere.
            <br />
            <span className="text-zinc-500 text-base">Amazon, eBay, AliExpress & Etsy in one place.</span>
          </p>
        </div>

        <form onSubmit={handleSearch} className="w-full max-w-2xl mb-6">
          <div className="search-glow flex items-center bg-zinc-900/90 backdrop-blur-sm border border-zinc-700/80 rounded-2xl overflow-hidden shadow-2xl">
            <Search className="ml-5 shrink-0 text-zinc-500" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="flex-1 bg-transparent px-4 py-4 text-base text-white placeholder-zinc-500 outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="m-2 px-7 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl transition-all shadow-lg shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        <div className="flex flex-wrap gap-2 justify-center max-w-2xl mb-16">
          <span className="text-zinc-600 text-sm self-center">Trending</span>
          {TRENDING.map((term) => (
            <button
              key={term}
              onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
              className="text-sm px-3 py-1.5 rounded-full bg-zinc-900/80 backdrop-blur text-zinc-400 hover:bg-indigo-600 hover:text-white border border-zinc-800 hover:border-indigo-500 transition-all"
            >
              {term}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl w-full mb-10">
          {SOURCES.map((src) => (
            <div
              key={src.name}
              className="bg-zinc-900/70 backdrop-blur-sm border border-zinc-800/80 hover:border-zinc-600 rounded-xl p-4 text-center transition-all"
            >
              <p className={`font-bold text-sm ${src.color}`}>{src.name}</p>
              <p className="text-zinc-600 text-xs mt-0.5">{src.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <div className="relative z-10 border-t border-zinc-800/60 bg-zinc-950/70 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-8">
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
