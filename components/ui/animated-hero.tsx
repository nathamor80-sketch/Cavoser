'use client'

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { MoveRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const SOURCES = [
  { name: 'Amazon',     color: 'text-orange-400' },
  { name: 'eBay',       color: 'text-blue-400'   },
  { name: 'AliExpress', color: 'text-red-400'    },
  { name: 'Etsy',       color: 'text-amber-400'  },
]

const TRENDING = ['iPhone 15', 'Nike Air Max', 'Mechanical keyboard', 'AirPods Pro']

/* ---------- background layers ---------- */
function DepthBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">

      {/* Deep base */}
      <div className="absolute inset-0 bg-[#07070f]" />

      {/* Large blurred orbs — depth illusion */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 700, height: 700,
          top: '-15%', left: '-10%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 600, height: 600,
          top: '10%', right: '-10%',
          background: 'radial-gradient(circle, rgba(217,70,239,0.14) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{ x: [0, -25, 0], y: [0, 35, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 400, height: 400,
          bottom: '5%', left: '30%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        animate={{ x: [0, 20, -10, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Perspective grid floor */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '55%',
          background: 'transparent',
          backgroundImage:
            'linear-gradient(rgba(99,102,241,0.12) 1px, transparent 1px), ' +
            'linear-gradient(90deg, rgba(99,102,241,0.12) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.9) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.9) 100%)',
          transform: 'perspective(600px) rotateX(55deg)',
          transformOrigin: 'top center',
        }}
      />

      {/* Vignette edges */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(7,7,15,0.85) 100%)',
        }}
      />

      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#07070f] to-transparent" />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#07070f] to-transparent" />

      {/* Floating micro-particles */}
      {Array.from({ length: 22 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-indigo-400/30"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -(Math.random() * 60 + 30)],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: Math.random() * 6 + 5,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

/* ---------- main Hero ---------- */
function Hero() {
  const router = useRouter()
  const [titleNumber, setTitleNumber] = useState(0)
  const [query, setQuery] = useState('')

  const titles = useMemo(
    () => ["cheaper", "smarter", "faster", "globally", "better"],
    []
  )

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1))
    }, 2000)
    return () => clearTimeout(timeoutId)
  }, [titleNumber, titles])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="relative w-full min-h-screen flex flex-col overflow-hidden">
      <DepthBackground />

      <div className="relative z-10 container mx-auto flex-1 flex flex-col items-center justify-center px-4 py-24">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            variant="secondary"
            size="sm"
            className="gap-2 mb-10 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 rounded-full text-xs tracking-widest uppercase backdrop-blur-sm"
            onClick={() => router.push('/search?q=trending')}
          >
            4 platforms · Best price guaranteed <MoveRight className="w-3 h-3" />
          </Button>
        </motion.div>

        {/* Headline */}
        <motion.div
          className="flex flex-col items-center gap-3 mb-6"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="text-7xl md:text-9xl font-black tracking-tight text-center leading-none drop-shadow-2xl">
            <span className="gradient-text">Cavoser</span>
          </h1>

          <div className="flex items-center gap-4 mt-1">
            <span className="text-zinc-500 font-normal text-2xl md:text-3xl">Shop</span>
            <span className="relative inline-flex overflow-hidden h-[1.3em] w-[190px] md:w-[260px] justify-center items-center">
              {titles.map((title, index) => (
                <motion.span
                  key={index}
                  className="absolute text-2xl md:text-3xl font-bold text-indigo-400"
                  initial={{ opacity: 0, y: 60 }}
                  transition={{ type: "spring", stiffness: 55, damping: 13 }}
                  animate={
                    titleNumber === index
                      ? { y: 0, opacity: 1 }
                      : { y: titleNumber > index ? -60 : 60, opacity: 0 }
                  }
                >
                  {title}
                </motion.span>
              ))}
            </span>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-zinc-400 text-base md:text-lg max-w-md text-center leading-relaxed mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Search once. Compare everywhere.{' '}
          <span className="text-zinc-600">Amazon, eBay, AliExpress &amp; Etsy — all in one place.</span>
        </motion.p>

        {/* Search bar */}
        <motion.form
          onSubmit={handleSearch}
          className="w-full max-w-2xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="search-glow flex items-center bg-zinc-900/60 backdrop-blur-md border border-zinc-700/60 rounded-2xl overflow-hidden shadow-[0_8px_40px_rgba(99,102,241,0.15)]">
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
              className="m-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl transition-all shadow-lg shrink-0 text-sm"
            >
              Search
            </button>
          </div>
        </motion.form>

        {/* Trending */}
        <motion.div
          className="flex flex-wrap gap-2 justify-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className="text-zinc-600 text-sm self-center">Trending</span>
          {TRENDING.map((term) => (
            <button
              key={term}
              onClick={() => router.push(`/search?q=${encodeURIComponent(term)}`)}
              className="text-sm px-3 py-1.5 rounded-full bg-zinc-900/60 backdrop-blur text-zinc-400 hover:bg-indigo-600 hover:text-white border border-zinc-800 hover:border-indigo-500 transition-all"
            >
              {term}
            </button>
          ))}
        </motion.div>

        {/* Platform badges */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {SOURCES.map((src, i) => (
            <motion.div
              key={src.name}
              className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 hover:border-zinc-600 rounded-xl p-3 text-center transition-all"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.55 + i * 0.07 }}
              whileHover={{ scale: 1.04 }}
            >
              <p className={`font-bold text-sm ${src.color}`}>{src.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

export { Hero }
