'use client'

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { MoveRight, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const SOURCES = [
  { name: 'Amazon', color: 'text-orange-400' },
  { name: 'eBay', color: 'text-blue-400' },
  { name: 'AliExpress', color: 'text-red-400' },
  { name: 'Etsy', color: 'text-amber-400' },
]

const TRENDING = ['iPhone 15', 'Nike Air Max', 'Mechanical keyboard', 'AirPods Pro']

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
    <div className="w-full min-h-screen bg-[#07070f] flex flex-col">
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 60%), ' +
            'linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), ' +
            'linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)',
          backgroundSize: 'auto, 60px 60px, 60px 60px',
        }}
      />

      <div className="relative z-10 container mx-auto flex-1 flex flex-col items-center justify-center px-4 py-24">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="secondary"
            size="sm"
            className="gap-2 mb-8 bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 rounded-full text-xs tracking-widest uppercase"
            onClick={() => router.push('/search?q=trending')}
          >
            4 platforms · Best price guaranteed <MoveRight className="w-3 h-3" />
          </Button>
        </motion.div>

        {/* Headline */}
        <motion.div
          className="flex flex-col items-center gap-2 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-center leading-none">
            <span className="gradient-text">Cavoser</span>
          </h1>

          <div className="flex items-center gap-3 text-3xl md:text-5xl font-semibold text-white mt-2">
            <span className="text-zinc-400 font-normal text-2xl md:text-4xl">Shop</span>
            <span className="relative inline-flex overflow-hidden h-[1.2em] w-[200px] md:w-[280px] justify-center">
              {titles.map((title, index) => (
                <motion.span
                  key={index}
                  className="absolute text-indigo-400"
                  initial={{ opacity: 0, y: 80 }}
                  transition={{ type: "spring", stiffness: 60, damping: 14 }}
                  animate={
                    titleNumber === index
                      ? { y: 0, opacity: 1 }
                      : { y: titleNumber > index ? -80 : 80, opacity: 0 }
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
          className="text-zinc-400 text-lg md:text-xl max-w-lg text-center leading-relaxed mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Search once. Compare everywhere.{' '}
          <span className="text-zinc-600">Amazon, eBay, AliExpress &amp; Etsy in one place.</span>
        </motion.p>

        {/* Search bar */}
        <motion.form
          onSubmit={handleSearch}
          className="w-full max-w-2xl mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
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
          transition={{ duration: 0.5, delay: 0.4 }}
        >
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
        </motion.div>

        {/* Platform badges */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {SOURCES.map((src, i) => (
            <motion.div
              key={src.name}
              className="bg-zinc-900/70 backdrop-blur-sm border border-zinc-800/80 hover:border-zinc-600 rounded-xl p-3 text-center transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
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
