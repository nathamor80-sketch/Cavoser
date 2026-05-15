'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Hero } from '@/components/ui/animated-hero'
import {
  ShieldCheck, BarChart2, Globe, Zap, Search, ArrowRight,
  Star, TrendingDown, Smartphone, Shirt, Home, Gamepad2,
  Dumbbell, Camera, Trophy, Truck, CheckCircle
} from 'lucide-react'

/* ─── Animated counter ─── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1400
    const step = 16
    const increment = target / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, step)
    return () => clearInterval(timer)
  }, [inView, target])
  return <span ref={ref}>{count}{suffix}</span>
}

/* ─── Marquee ─── */
const PLATFORMS = [
  { name: 'Amazon',     color: '#f97316' },
  { name: 'eBay',       color: '#60a5fa' },
  { name: 'AliExpress', color: '#f87171' },
  { name: 'Etsy',       color: '#fbbf24' },
]
function PlatformMarquee() {
  const items = [...PLATFORMS, ...PLATFORMS, ...PLATFORMS, ...PLATFORMS]
  return (
    <div className="overflow-hidden border-y border-zinc-800/60 bg-zinc-950/60 backdrop-blur-sm py-3 select-none">
      <motion.div className="flex gap-12 w-max"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}>
        {items.map((p, i) => (
          <div key={i} className="flex items-center gap-2.5 text-sm font-bold whitespace-nowrap" style={{ color: p.color }}>
            <span className="w-1.5 h-1.5 rounded-full opacity-60" style={{ background: p.color }} />
            {p.name}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Fake product preview card ─── */
const PREVIEW_PRODUCTS = [
  { name: 'iPhone 15 128GB', platform: 'Amazon',     color: 'text-orange-400', price: '$799', trust: 94, best: true  },
  { name: 'iPhone 15 128GB', platform: 'eBay',       color: 'text-blue-400',   price: '$743', trust: 81, best: false },
  { name: 'iPhone 15 128GB', platform: 'AliExpress', color: 'text-red-400',    price: '$689', trust: 71, best: false },
]
function ComparePreview() {
  return (
    <motion.div
      className="relative w-full max-w-md mx-auto rounded-2xl overflow-hidden border border-zinc-700/60 bg-zinc-900/80 backdrop-blur-xl shadow-2xl shadow-indigo-500/10"
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ duration: 0.6 }}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart2 size={14} className="text-indigo-400" />
          <span className="text-xs font-semibold text-zinc-300">Price comparison</span>
        </div>
        <span className="text-xs text-zinc-600">3 results</span>
      </div>
      {/* Rows */}
      {PREVIEW_PRODUCTS.map((p, i) => (
        <motion.div key={i}
          className={`flex items-center gap-3 px-4 py-3 border-b border-zinc-800/50 last:border-0 ${p.best ? 'bg-emerald-500/5' : ''}`}
          initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }}>
          {p.best && <Trophy size={12} className="text-emerald-400 shrink-0" />}
          {!p.best && <div className="w-3 shrink-0" />}
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold ${p.color}`}>{p.platform}</p>
            <p className="text-xs text-zinc-400 truncate">{p.name}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-white font-black text-sm">{p.price}</p>
            <p className="text-xs text-zinc-600">Trust {p.trust}</p>
          </div>
          {p.best && (
            <span className="shrink-0 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full px-2 py-0.5">Best</span>
          )}
        </motion.div>
      ))}
      {/* Bottom */}
      <div className="px-4 py-3 bg-indigo-600/10 flex items-center justify-between">
        <span className="text-xs text-zinc-500">Save up to <span className="text-emerald-400 font-bold">$110</span> vs highest price</span>
        <ArrowRight size={12} className="text-indigo-400" />
      </div>
    </motion.div>
  )
}

/* ─── How it works ─── */
const STEPS = [
  { step: '01', icon: Search,      title: 'Search once',       desc: 'Type any product name. We scan 4 platforms at the same time.' },
  { step: '02', icon: BarChart2,   title: 'Compare all offers', desc: 'Every listing ranked by Quality/Price score — not just price.' },
  { step: '03', icon: ShieldCheck, title: 'Buy with confidence', desc: 'Trust scores, review counts, delivery info — all visible upfront.' },
]

/* ─── Categories ─── */
const CATEGORIES = [
  { icon: Smartphone, label: 'Electronics',  query: 'electronics',   grad: 'from-blue-600/25 to-blue-900/10',    border: 'border-blue-500/25',    text: 'text-blue-400',    glow: 'shadow-blue-500/10'   },
  { icon: Shirt,      label: 'Fashion',       query: 'fashion',       grad: 'from-pink-600/25 to-pink-900/10',    border: 'border-pink-500/25',    text: 'text-pink-400',    glow: 'shadow-pink-500/10'   },
  { icon: Home,       label: 'Home & Garden', query: 'home garden',   grad: 'from-amber-600/25 to-amber-900/10',  border: 'border-amber-500/25',   text: 'text-amber-400',   glow: 'shadow-amber-500/10'  },
  { icon: Gamepad2,   label: 'Gaming',        query: 'gaming',        grad: 'from-violet-600/25 to-violet-900/10',border: 'border-violet-500/25',  text: 'text-violet-400',  glow: 'shadow-violet-500/10' },
  { icon: Dumbbell,   label: 'Sports',        query: 'sports fitness',grad: 'from-green-600/25 to-green-900/10',  border: 'border-green-500/25',   text: 'text-green-400',   glow: 'shadow-green-500/10'  },
  { icon: Camera,     label: 'Photography',   query: 'camera',        grad: 'from-red-600/25 to-red-900/10',      border: 'border-red-500/25',     text: 'text-red-400',     glow: 'shadow-red-500/10'    },
]

/* ─── Why ─── */
const WHY = [
  { icon: Zap,          title: 'Instant results',      desc: '4 platforms searched in under a second.' },
  { icon: ShieldCheck,  title: 'Trust score on every listing', desc: 'Seller reputation + reviews combined.' },
  { icon: BarChart2,    title: 'Q/P comparator',       desc: 'Best ratio quality/price, not just cheapest.' },
  { icon: Globe,        title: 'Worldwide',            desc: 'International shipping options surfaced automatically.' },
  { icon: TrendingDown, title: 'Real-time discounts',  desc: 'Price drops and deals highlighted automatically.' },
  { icon: Star,         title: 'Aggregated reviews',   desc: 'Thousands of reviews distilled into one score.' },
]

/* ─── Testimonials ─── */
const TESTIMONIALS = [
  { text: "Saved $140 on a pair of headphones in 30 seconds. Checked Amazon, eBay and AliExpress at once.", name: "Marc T.", country: "🇫🇷" },
  { text: "The trust score is a game changer — finally know which sellers to actually trust.", name: "Sarah K.", country: "🇬🇧" },
  { text: "Found a $80 price difference for the same product. This site pays for itself instantly.", name: "Diego R.", country: "🇪🇸" },
]

function fadeUp(delay = 0) {
  return { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.55, delay, ease: 'easeOut' } }
}

export default function Home() {
  const router = useRouter()

  return (
    <div className="bg-[#07070f] text-white overflow-x-hidden">

      {/* Hero */}
      <Hero />

      {/* Marquee */}
      <PlatformMarquee />

      {/* Stats */}
      <section className="border-b border-zinc-800/60 bg-zinc-950/60">
        <div className="max-w-4xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {[
            { target: 4,    suffix: '',    label: 'Platforms'       },
            { target: 50,   suffix: 'M+',  label: 'Products indexed' },
            { target: 100,  suffix: '%',   label: 'Free to use'      },
            { target: 23,   suffix: '%',   label: 'Avg. savings'     },
          ].map((s, i) => (
            <motion.div key={s.label} {...fadeUp(i * 0.1)} className="text-center">
              <p className="text-4xl font-black gradient-text tabular-nums">
                <Counter target={s.target} suffix={s.suffix} />
              </p>
              <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works + preview side by side */}
      <section className="max-w-6xl mx-auto px-4 py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: steps */}
          <div>
            <motion.div {...fadeUp()}>
              <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-3">How it works</p>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Three steps.<br />Best price.</h2>
              <p className="text-zinc-500 mb-10 leading-relaxed">No account needed. No ads. Just results.</p>
            </motion.div>
            <div className="space-y-6">
              {STEPS.map((s, i) => (
                <motion.div key={s.step} {...fadeUp(i * 0.12)} className="flex gap-5 group">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/20 transition-colors">
                    <s.icon size={20} className="text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-zinc-700 tabular-nums">{s.step}</span>
                      <h3 className="font-bold text-white">{s.title}</h3>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          {/* Right: compare preview */}
          <div className="relative">
            <div className="absolute -inset-8 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 rounded-3xl blur-2xl" />
            <ComparePreview />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-zinc-800/60 bg-zinc-950/40">
        <div className="max-w-5xl mx-auto px-4 py-24">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-3">Browse by category</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Find what you need</h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.button key={cat.label} {...fadeUp(i * 0.06)}
                onClick={() => router.push(`/search?q=${encodeURIComponent(cat.query)}`)}
                className={`bg-gradient-to-br ${cat.grad} border ${cat.border} rounded-2xl p-6 text-left hover:shadow-lg ${cat.glow} transition-all group`}
                whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.98 }}>
                <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <cat.icon size={20} className={cat.text} />
                </div>
                <p className="font-bold text-white text-sm mb-1">{cat.label}</p>
                <div className={`flex items-center gap-1 text-xs ${cat.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Explore <ArrowRight size={10} />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Why Cavoser */}
      <section className="max-w-5xl mx-auto px-4 py-24">
        <motion.div {...fadeUp()} className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-3">Why Cavoser</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight">Built for smart shoppers</h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {WHY.map((w, i) => (
            <motion.div key={w.title} {...fadeUp(i * 0.07)}
              className="bg-zinc-900/50 border border-zinc-800/80 hover:border-indigo-500/30 rounded-2xl p-5 transition-all hover:shadow-[0_4px_20px_rgba(99,102,241,0.08)] group">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:bg-indigo-500/20 transition-colors">
                <w.icon size={16} className="text-indigo-400" />
              </div>
              <h3 className="font-bold text-white text-sm mb-1.5">{w.title}</h3>
              <p className="text-zinc-500 text-xs leading-relaxed">{w.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-zinc-800/60 bg-zinc-950/50">
        <div className="max-w-5xl mx-auto px-4 py-24">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-3">What users say</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Real savings, real people</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}
                className="bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 transition-all">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} size={12} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-5">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs">
                    {t.country}
                  </div>
                  <span className="text-zinc-500 text-xs font-medium">{t.name}</span>
                  <CheckCircle size={12} className="text-emerald-400 ml-auto" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden border-t border-zinc-800/60">
        <div className="absolute inset-0 bg-gradient-to-b from-[#07070f] via-indigo-950/20 to-[#07070f] pointer-events-none" />
        <motion.div className="absolute rounded-full pointer-events-none"
          style={{ width: 700, height: 700, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }}
          animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative z-10 max-w-2xl mx-auto px-4 py-32 text-center">
          <motion.div {...fadeUp()}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-6">
              <Truck size={11} /> Free · No account · No subscription
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-4 leading-tight">
              Stop overpaying.<br />
              <span className="gradient-text">Start Cavoser.</span>
            </h2>
            <p className="text-zinc-500 mb-10 leading-relaxed max-w-md mx-auto">
              Type what you want. Get the best deal across 4 platforms in seconds. It costs nothing.
            </p>
            <motion.button
              onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setTimeout(() => { const el = document.querySelector('input[type="text"]') as HTMLInputElement; el?.focus() }, 600) }}
              className="inline-flex items-center gap-3 px-9 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 relative overflow-hidden text-base"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent"
                animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }} />
              <Search size={18} />
              Search for free
              <ArrowRight size={16} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 bg-zinc-950">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xl font-black gradient-text tracking-tight">Cavoser</p>
          <p className="text-xs text-zinc-600 text-center">
            © 2025 Cavoser · Amazon · eBay · AliExpress · Etsy · Affiliate links
          </p>
          <div className="flex gap-5 text-xs text-zinc-600">
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <span key={l} className="hover:text-zinc-400 cursor-pointer transition-colors">{l}</span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
