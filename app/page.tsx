import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Background grain */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")'}}/>
      
      {/* Hero */}
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none"/>
        
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-6">Good New Guys</p>
        <h1 className="text-[clamp(4rem,12vw,9rem)] font-black leading-none tracking-tighter mb-6">GNG</h1>
        <p className="text-lg text-gray-400 max-w-sm mb-4 leading-relaxed">
          One AI-matched friend per day.<br/>No photos. No swiping. Just guys worth knowing.
        </p>
        <p className="text-sm text-gray-600 mb-10">Built for men who've outgrown their old circles.</p>
        
        <Link href="/match-of-the-day" className="group relative inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-semibold text-base hover:bg-gray-100 transition-all">
          Find your guys
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </Link>

        {/* Stats */}
        <div className="flex gap-12 mt-20 text-center">
          <div>
            <p className="text-2xl font-bold">1</p>
            <p className="text-xs text-gray-600 mt-1">match per day</p>
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-xs text-gray-600 mt-1">photos required</p>
          </div>
          <div>
            <p className="text-2xl font-bold">AI</p>
            <p className="text-xs text-gray-600 mt-1">powered matching</p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-2xl mx-auto px-6 pb-32">
        <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-12 text-center">How it works</p>
        <div className="space-y-8">
          {[
            ['01', 'Build your profile', 'Tell us your age, city, life stage and what you\'re into.'],
            ['02', 'Get your daily match', 'Every day, AI picks the one guy you\'d most click with.'],
            ['03', 'Say yes or no', 'If you both say yes, you\'re connected. Simple.'],
          ].map(([num, title, desc]) => (
            <div key={num} className="flex gap-6 items-start">
              <span className="text-xs text-gray-600 font-mono mt-1 w-6 shrink-0">{num}</span>
              <div>
                <p className="font-semibold mb-1">{title}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}