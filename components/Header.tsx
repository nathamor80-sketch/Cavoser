'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'

export default function Header() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="text-xl font-black gradient-text shrink-0 tracking-tight">
          Cavoser
        </Link>
        <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
          <div className="search-glow flex items-center bg-zinc-900 border border-zinc-700/80 rounded-xl overflow-hidden">
            <Search className="ml-4 shrink-0 text-zinc-500" size={16} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white placeholder-zinc-500 outline-none"
            />
            <button
              type="submit"
              className="m-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors shrink-0"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </header>
  )
}
