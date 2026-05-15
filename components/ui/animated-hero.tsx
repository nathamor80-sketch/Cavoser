'use client'

import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

const TRENDING = ['iPhone 15', 'Nike Air Max', 'Mechanical keyboard', 'AirPods Pro', 'Coffee maker', 'Lego', 'PS5', 'MacBook']

function DepthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      <div className="absolute inset-0 bg-[#07070f]" />
      <motion.div className="absolute rounded-full"
        style={{ width: 900, height: 900, top: '-25%', left: '-20%', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 65%)', filter: 'blur(60px)' }}
        animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div className="absolute rounded-full"
        style={{ width: 700, height: 700, top: '0%', right: '-15%', background: 'radial-gradient(circle, rgba(217,70,239,0.12) 0%, transparent 65%)', filter: 'blur(70px)' }}
        animate={{ x: [0, -35, 0], y: [0, 45, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div className="absolute rounded-full"
        style={{ width: 500, height: 500, bottom: '-5%', left: '30%', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 65%)', filter: 'blur(80px)' }}
        animate={{ x: [0, 30, -20, 0], y: [0, -35, 20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Grid */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: '55%',
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.9) 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.9) 100%)',
        transform: 'perspective(500px) rotateX(60deg)',
        transformOrigin: 'top center',
      }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 35%, rgba(7,7,15,0.9) 100%)' }} />
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#07070f] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#07070f] to-transparent" />
      {Array.from({ length: 18 }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ width: Math.random() * 2 + 1, height: Math.random() * 2 + 1, background: 'rgba(139,92,246,0.5)', left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ y: [0, -(Math.random() * 80 + 40)], opacity: [0, 0.7, 0] }}
          transition={{ duration: Math.random() * 6 + 6, repeat: Infinity, delay: Math.random() * 10, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

export function Hero() {
  const router = useRouter()
  const [titleNumber, setTitleNumber] = useState(0)
  const [query, setQuery] = useState('')
  const titles = useMemo(() => ["cheaper", "smarter", "faster", "better", "globally"], [])

  useEffect(() => {
    const id = setTimeout(() => setTitleNumber(n => n === titles.length - 1 ? 0 : n + 1), 2200)
    return () => clearTimeout(id)
  }, [titleNumber, titles])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col overflow-hidden">
      <DepthBackground />
      <div className="relative z-10 container mx-auto flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-16">

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium tracking-widest uppercase backdrop-blur-sm">
            <motion.span className="w-1.5 h-1.5 rounded-full bg-green-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            Live · 4 platforms · Best price guaranteed
          </div>
        </motion.div>

        {/* Title */}
        <motion.div className="text-center mb-6" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <h1 className="text-7xl md:text-[7rem] xl:text-[8rem] font-black tracking-tight leading-none drop-shadow-2xl mb-3">
            <span className="gradient-text">Cavoser</span>
          </h1>
          <div className="flex items-center justify-center gap-3 text-xl md:text-2xl">
            <span className="text-zinc-500 font-light">Shop</span>
            <div className="relative h-8 w-36 md:w-44 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={titleNumber}
                  className="absolute inset-0 flex items-center justify-start font-bold text-indigo-400"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -40, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  {titles[titleNumber]}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="text-zinc-500 font-light">— instantly.</span>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p className="text-zinc-400 text-base md:text-lg max-w-lg text-center leading-relaxed mb-10"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}>
          One search across Amazon, eBay, AliExpress &amp; Etsy.{' '}
          <span className="text-zinc-600">Compare prices, trust scores and reviews — all in one place.</span>
        </motion.p>

        {/* Search bar */}
        <motion.form onSubmit={handleSearch} className="w-full max-w-2xl mb-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <div className="search-glow flex items-center bg-zinc-900/70 backdrop-blur-xl border border-zinc-700/50 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.15)]">
            <Search className="ml-5 shrink-0 text-zinc-500" size={18} />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search any product…"
              className="flex-1 bg-transparent px-4 py-4 text-base text-white placeholder-zinc-600 outline-none" autoFocus />
            <motion.button type="submit"
              className="m-2 px-7 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl shadow-lg shrink-0 text-sm flex items-center gap-2 relative overflow-hidden"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }} />
              Search <ArrowRight size={14} />
            </motion.button>
          </div>
        </motion.form>

        {/* Trending */}
        <motion.div className="flex flex-wrap gap-2 justify-center mb-12"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <span className="text-zinc-700 text-xs self-center uppercase tracking-widest">Trending</span>
          {TRENDING.map((term, i) => (
            <motion.button key={term} onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
              className="text-xs px-3 py-1.5 rounded-full bg-zinc-900/70 backdrop-blur text-zinc-400 hover:bg-indigo-600 hover:text-white border border-zinc-800/80 hover:border-indigo-500 transition-all"
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 + i * 0.04 }}>
              {term}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
