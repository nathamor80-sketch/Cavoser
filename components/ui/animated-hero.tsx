'use client'

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

const SOURCES = [
  { name: 'Amazon',     color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
  { name: 'eBay',       color: 'text-blue-400',   bg: 'bg-blue-500/10 border-blue-500/20'     },
  { name: 'AliExpress', color: 'text-red-400',    bg: 'bg-red-500/10 border-red-500/20'       },
  { name: 'Etsy',       color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20'   },
]

const TRENDING = ['iPhone 15', 'Nike Air Max', 'Mechanical keyboard', 'AirPods Pro', 'Coffee maker', 'Lego']

function DepthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-[#07070f]" />

      <motion.div className="absolute rounded-full"
        style={{ width: 800, height: 800, top: '-20%', left: '-15%', background: 'radial-gradient(circle, rgba(99,102,241,0.16) 0%, transparent 70%)', filter: 'blur(50px)' }}
        animate={{ x: [0, 40, 0], y: [0, 25, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div className="absolute rounded-full"
        style={{ width: 650, height: 650, top: '5%', right: '-12%', background: 'radial-gradient(circle, rgba(217,70,239,0.13) 0%, transparent 70%)', filter: 'blur(55px)' }}
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div className="absolute rounded-full"
        style={{ width: 450, height: 450, bottom: '0%', left: '35%', background: 'radial-gradient(circle, rgba(139,92,246,0.11) 0%, transparent 70%)', filter: 'blur(65px)' }}
        animate={{ x: [0, 25, -15, 0], y: [0, -30, 15, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Perspective grid */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: '52%',
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)',
        backgroundSize: '55px 55px',
        maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.85) 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 35%, rgba(0,0,0,0.85) 100%)',
        transform: 'perspective(550px) rotateX(58deg)',
        transformOrigin: 'top center',
      }} />

      {/* Vignette */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 38%, rgba(7,7,15,0.88) 100%)' }} />
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#07070f] to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#07070f] to-transparent" />

      {/* Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-indigo-400/25"
          style={{ width: Math.random() * 2.5 + 1, height: Math.random() * 2.5 + 1, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          animate={{ y: [0, -(Math.random() * 70 + 30)], opacity: [0, 0.6, 0] }}
          transition={{ duration: Math.random() * 7 + 5, repeat: Infinity, delay: Math.random() * 9, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

export function Hero() {
  const router = useRouter()
  const [titleNumber, setTitleNumber] = useState(0)
  const [query, setQuery] = useState('')

  const titles = useMemo(() => ["cheaper", "smarter", "faster", "globally", "better"], [])

  useEffect(() => {
    const id = setTimeout(() => setTitleNumber(n => n === titles.length - 1 ? 0 : n + 1), 2000)
    return () => clearTimeout(id)
  }, [titleNumber, titles])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col overflow-hidden">
      <DepthBackground />

      <div className="relative z-10 container mx-auto flex-1 flex flex-col items-center justify-center px-4 py-28">

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium tracking-widest uppercase backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            4 platforms · Best price guaranteed
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div className="flex flex-col items-center gap-2 mb-5" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
          <h1 className="text-7xl md:text-9xl font-black tracking-tight text-center leading-none drop-shadow-2xl">
            <span className="gradient-text">Cavoser</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-zinc-500 font-light text-xl md:text-2xl">Shop</span>
            <span className="relative inline-flex overflow-hidden h-[1.4em] w-[180px] md:w-[240px] justify-center items-center">
              {titles.map((title, index) => (
                <motion.span key={index} className="absolute text-xl md:text-2xl font-bold text-indigo-400"
                  initial={{ opacity: 0, y: 60 }}
                  transition={{ type: "spring", stiffness: 55, damping: 13 }}
                  animate={titleNumber === index ? { y: 0, opacity: 1 } : { y: titleNumber > index ? -60 : 60, opacity: 0 }}
                >{title}</motion.span>
              ))}
            </span>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p className="text-zinc-400 text-base md:text-lg max-w-md text-center leading-relaxed mb-10"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          One search across Amazon, eBay, AliExpress &amp; Etsy.
          <br /><span className="text-zinc-600 text-sm">Compare prices, trust scores and reviews — instantly.</span>
        </motion.p>

        {/* Search */}
        <motion.form onSubmit={handleSearch} className="w-full max-w-2xl mb-5"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
          <div className="search-glow flex items-center bg-zinc-900/60 backdrop-blur-md border border-zinc-700/60 rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(99,102,241,0.18)]">
            <Search className="ml-5 shrink-0 text-zinc-500" size={18} />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="flex-1 bg-transparent px-4 py-4 text-base text-white placeholder-zinc-500 outline-none" autoFocus />
            <button type="submit"
              className="m-2 px-7 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl transition-all shadow-lg shrink-0 text-sm">
              Search
            </button>
          </div>
        </motion.form>

        {/* Trending */}
        <motion.div className="flex flex-wrap gap-2 justify-center mb-12"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
          <span className="text-zinc-600 text-xs self-center uppercase tracking-wider">Trending</span>
          {TRENDING.map(term => (
            <button key={term} onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
              className="text-xs px-3 py-1.5 rounded-full bg-zinc-900/60 backdrop-blur text-zinc-400 hover:bg-indigo-600 hover:text-white border border-zinc-800 hover:border-indigo-500 transition-all">
              {term}
            </button>
          ))}
        </motion.div>

        {/* Platform badges */}
        <motion.div className="grid grid-cols-4 gap-3 w-full max-w-lg"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
          {SOURCES.map((src, i) => (
            <motion.button key={src.name}
              onClick={() => router.push(`/search?q=trending`)}
              className={`${src.bg} backdrop-blur-md border rounded-xl p-3 text-center transition-all hover:scale-105`}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.55 + i * 0.07 }}
              whileHover={{ scale: 1.06 }}>
              <p className={`font-bold text-sm ${src.color}`}>{src.name}</p>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
