'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Hero } from '@/components/ui/animated-hero'
import {
  ShieldCheck, BarChart2, Globe, Zap,
  Search, ArrowRight, Star, TrendingDown,
  Smartphone, Shirt, Home, Gamepad2, Dumbbell, Camera
} from 'lucide-react'

/* ── Stats ── */
const STATS = [
  { value: '4',    label: 'Platforms',       suffix: '' },
  { value: '50',   label: 'Million products', suffix: 'M+' },
  { value: '100',  label: 'Free to use',      suffix: '%' },
  { value: '2.3',  label: 'Avg. savings',     suffix: 'x' },
]

/* ── How it works ── */
const STEPS = [
  { step: '01', icon: Search,     title: 'Search anything', desc: 'Type any product — we scan Amazon, eBay, AliExpress and Etsy simultaneously.' },
  { step: '02', icon: BarChart2,  title: 'Compare instantly', desc: 'See all offers ranked by our Quality/Price score, trust rating and reviews.' },
  { step: '03', icon: ShieldCheck, title: 'Buy with confidence', desc: 'Each listing shows a trust score and reliability badge so you never overpay.' },
]

/* ── Categories ── */
const CATEGORIES = [
  { icon: Smartphone, label: 'Electronics',   query: 'electronics',   color: 'from-blue-600/20 to-blue-500/5',   border: 'border-blue-500/20',   text: 'text-blue-400' },
  { icon: Shirt,      label: 'Fashion',        query: 'fashion',       color: 'from-pink-600/20 to-pink-500/5',   border: 'border-pink-500/20',   text: 'text-pink-400' },
  { icon: Home,       label: 'Home & Garden',  query: 'home garden',   color: 'from-amber-600/20 to-amber-500/5', border: 'border-amber-500/20',  text: 'text-amber-400' },
  { icon: Gamepad2,   label: 'Gaming',         query: 'gaming',        color: 'from-violet-600/20 to-violet-500/5', border: 'border-violet-500/20', text: 'text-violet-400' },
  { icon: Dumbbell,   label: 'Sports',         query: 'sports fitness', color: 'from-green-600/20 to-green-500/5', border: 'border-green-500/20',  text: 'text-green-400' },
  { icon: Camera,     label: 'Photography',    query: 'camera',        color: 'from-red-600/20 to-red-500/5',     border: 'border-red-500/20',    text: 'text-red-400' },
]

/* ── Why Cavoser ── */
const WHY = [
  { icon: Zap,         title: 'Instant results',   desc: 'All 4 platforms searched in under a second — no switching between tabs.' },
  { icon: ShieldCheck, title: 'Trust scores',       desc: 'Every listing gets a reliability score based on seller reputation and reviews.' },
  { icon: BarChart2,   title: 'Q/P comparator',     desc: 'Our algorithm ranks offers by quality-to-price ratio, not just the cheapest.' },
  { icon: Globe,       title: 'International',      desc: 'Global platforms, worldwide shipping options — find deals anywhere.' },
  { icon: TrendingDown,title: 'Best price alerts',  desc: 'We surface current discounts and price drops automatically.' },
  { icon: Star,        title: 'Review aggregation', desc: 'Thousands of verified reviews synthesized into a single score.' },
]

function fadeUp(delay = 0) {
  return { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55, delay, ease: 'easeOut' } }
}

export default function Home() {
  const router = useRouter()

  return (
    <div className="bg-[#07070f] text-white overflow-x-hidden">

      {/* ── Hero ── */}
      <Hero />

      {/* ── Stats bar ── */}
      <section className="border-y border-zinc-800/60 bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div key={s.label} {...fadeUp(i * 0.08)} className="text-center">
              <p className="text-3xl font-black gradient-text">{s.value}<span className="text-xl">{s.suffix}</span></p>
              <p className="text-xs text-zinc-500 mt-0.5 uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="max-w-5xl mx-auto px-4 py-24">
        <motion.div {...fadeUp()} className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-3">How it works</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Three steps. Best price.</h2>
          <p className="text-zinc-500 mt-3 max-w-md mx-auto">No account required. No ads. Just the best deal across every major platform.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <motion.div key={s.step} {...fadeUp(i * 0.12)}
              className="relative bg-zinc-900/60 border border-zinc-800 hover:border-indigo-500/40 rounded-2xl p-6 transition-all hover:shadow-[0_8px_30px_rgba(99,102,241,0.1)] group">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-10 -right-3 w-6 h-px bg-gradient-to-r from-zinc-700 to-transparent z-10" />
              )}
              <span className="text-5xl font-black text-zinc-800 group-hover:text-zinc-700 transition-colors select-none">{s.step}</span>
              <div className="mt-3 mb-3 w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <s.icon size={18} className="text-indigo-400" />
              </div>
              <h3 className="font-bold text-white mb-2">{s.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <motion.div {...fadeUp()} className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-3">Browse by category</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Find what you need</h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.button key={cat.label} {...fadeUp(i * 0.07)}
              onClick={() => router.push(`/search?q=${encodeURIComponent(cat.query)}`)}
              className={`bg-gradient-to-br ${cat.color} border ${cat.border} rounded-2xl p-5 text-left hover:scale-[1.03] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] group`}
              whileHover={{ y: -3 }}>
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4`}>
                <cat.icon size={20} className={cat.text} />
              </div>
              <p className="font-bold text-white text-sm">{cat.label}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs ${cat.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                Search <ArrowRight size={10} />
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ── Why Cavoser ── */}
      <section className="border-t border-zinc-800/60 bg-zinc-950/50">
        <div className="max-w-5xl mx-auto px-4 py-24">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-3">Why Cavoser</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Built for smart shoppers</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY.map((w, i) => (
              <motion.div key={w.title} {...fadeUp(i * 0.08)}
                className="bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 rounded-2xl p-5 transition-all">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                  <w.icon size={16} className="text-indigo-400" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1.5">{w.title}</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden border-t border-zinc-800/60">
        {/* bg glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-[#07070f] to-violet-950/30 pointer-events-none" />
        <motion.div className="absolute rounded-full pointer-events-none"
          style={{ width: 600, height: 600, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }}
          animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 max-w-2xl mx-auto px-4 py-28 text-center">
          <motion.div {...fadeUp()}>
            <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-4">Start now — it's free</p>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4">
              Stop overpaying.<br />
              <span className="gradient-text">Start Cavoser.</span>
            </h2>
            <p className="text-zinc-500 mb-10 max-w-md mx-auto leading-relaxed">
              No account. No subscription. Just type what you want and find the best deal across 4 platforms in seconds.
            </p>
            <motion.button
              onClick={() => { const el = document.querySelector('input[type="text"]'); if (el) (el as HTMLElement).focus(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 transition-all relative overflow-hidden"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}>
              <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
              />
              <Search size={18} />
              Search for free
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-zinc-800/60 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xl font-black gradient-text">Cavoser</p>
          <p className="text-xs text-zinc-600 text-center">
            © 2025 Cavoser · Comparing Amazon, eBay, AliExpress & Etsy · Affiliate links
          </p>
          <div className="flex gap-4 text-xs text-zinc-600">
            <span className="hover:text-zinc-400 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-zinc-400 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-zinc-400 cursor-pointer transition-colors">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
