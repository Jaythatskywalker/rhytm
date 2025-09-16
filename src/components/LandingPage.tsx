import React from 'react'
import Image from 'next/image'

// VerticalStepCard component for the How it Works section
function VerticalStepCard({theme,n,title,text,icon}:{theme:'dark'|'light'; n:number; title:string; text:string; icon:string}){
  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'link':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        )
      case 'music':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18V5l12-2v13"/>
            <circle cx="6" cy="18" r="3"/>
            <circle cx="18" cy="16" r="3"/>
          </svg>
        )
      case 'sparkles':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
            <path d="M20 3v4"/>
            <path d="M22 5h-4"/>
            <path d="M4 17v2"/>
            <path d="M5 18H3"/>
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex items-start gap-6 group">
      {/* Step Number & Icon */}
      <div className="flex-shrink-0">
        <div className="relative">
          <div className={(theme==='dark'?'bg-gradient-to-r from-emerald-500 to-teal-500':'bg-gradient-to-r from-emerald-600 to-teal-600')+" w-16 h-16 rounded-2xl flex items-center justify-center text-black font-bold text-xl shadow-lg"}>
            {n}
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
            <div className="text-emerald-400">
              {getIcon(icon)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 pt-2">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className={(theme==='dark'?'text-white/70':'text-[#1a1a17]/70')+" text-sm leading-relaxed"}>{text}</p>
      </div>
    </div>
  )
}

// Landing page with enhanced interactive hero section
export default function LandingPage(){
  const [theme, setTheme] = React.useState<'dark'|'light'>('dark')
  const [email, setEmail] = React.useState('')
  const [submitted, setSubmitted] = React.useState(false)
  const [error, setError] = React.useState<string|null>(null)
  const [offset, setOffset] = React.useState({x:0, y:0}) // parallax offset (-0.5..0.5)
  
  // New state for enhanced effects
  const [scrollY, setScrollY] = React.useState(0)
  // const [isGlitching, setIsGlitching] = React.useState(false) // Unused
  const [crackles, setCrackles] = React.useState<Array<{id: number, x: number, y: number}>>([])
  const [mousePos, setMousePos] = React.useState({x: 0, y: 0})

  // Scroll effect
  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Enhanced hero mouse move for parallax and gradients
  function onHeroMove(e: React.MouseEvent){
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setOffset({x, y})
    setMousePos({x: e.clientX - rect.left, y: e.clientY - rect.top})
  }

  // Crackle effect on click/touch
  function onHeroClick(e: React.MouseEvent | React.TouchEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    const x = clientX - rect.left
    const y = clientY - rect.top
    
    // Add crackle effect
    const newCrackle = { id: Date.now(), x, y }
    setCrackles(prev => [...prev, newCrackle])
    
    // Remove crackle after animation
    setTimeout(() => {
      setCrackles(prev => prev.filter(c => c.id !== newCrackle.id))
    }, 800)
  }

  function submit(e: React.FormEvent){
    e.preventDefault()
    setError(null)
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if(!ok){ setError('Please enter a valid email.'); return; }
    setSubmitted(true)
  }

  return (
    <div className={theme==='dark' ? 'min-h-screen bg-[#0a0a0d] text-white' : 'min-h-screen bg-[#f0e7d8] text-[#1a1a17]'}>
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        
        @keyframes crackle {
          0% { 
            transform: scale(0) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: scale(1.2) rotate(180deg);
            opacity: 0.8;
          }
          100% { 
            transform: scale(2) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes wave {
          0% { transform: translateX(-100%) scaleY(1); }
          50% { transform: translateX(0%) scaleY(1.2); }
          100% { transform: translateX(100%) scaleY(1); }
        }
        
        .glitch-effect {
          animation: glitch 0.15s ease-in-out;
        }
        
        .crackle-particle {
          animation: crackle 0.8s ease-out forwards;
        }
        
        .wave-gradient {
          animation: wave 8s ease-in-out infinite;
        }
        
        .scroll-reveal {
          transform: translateY(${scrollY * 0.5}px);
          opacity: ${Math.max(0, 1 - scrollY / 600)};
        }
      `}</style>

      {/* Header */}
      <header className={(theme==='dark'?'bg-white/5 text-white':'bg-[#1a1a17]/5 text-[#1a1a17]')+ ' sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-opacity-60 relative'}>
        <HeaderBackdrop theme={theme} />
        <div className="mx-auto max-w-6xl px-4 py-0.5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <Image 
              src={theme === 'dark' ? '/rhytm-logo-dark.png' : '/rhytm-logo-light.png'}
              alt="RHYTM Logo"
              width={200}
              height={112}
              className="h-28 w-auto"
            />
          </div>
          <nav className="hidden md:flex items-center gap-6 text-base font-bold opacity-90">
            <a href="#how" className="transition hover:opacity-100 hover:-translate-y-0.5 inline-flex items-center gap-1">How it works<span className="opacity-50">↗</span></a>
            <a href="#features" className="transition hover:opacity-100 hover:-translate-y-0.5 inline-flex items-center gap-1">Features<span className="opacity-50">↗</span></a>
            <a href="#waitlist" className="transition hover:opacity-100 hover:-translate-y-0.5 inline-flex items-center gap-1">Waiting list<span className="opacity-50">↗</span></a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <a href="#waitlist" className={(theme==='dark'?'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-400/40 text-emerald-200':'bg-emerald-600/10 hover:bg-emerald-600/20 border-emerald-600/30 text-emerald-700')+" hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition shadow hover:shadow-md"}>Join Beta</a>
          </div>
        </div>
      </header>

      {/* Enhanced Hero with all effects */}
      <section 
        className="relative overflow-hidden flex items-center"
        style={{ height: '80vh' }}
        onMouseMove={onHeroMove}
        onClick={onHeroClick}
        onTouchStart={onHeroClick}
      >
        {/* Enhanced backdrop with wavy gradients */}
        <EnhancedClubBackdrop theme={theme} offset={offset} mousePos={mousePos} />
        
        {/* Crackle effects */}
        {crackles.map(crackle => (
          <div
            key={crackle.id}
            className="absolute pointer-events-none z-30"
            style={{ left: crackle.x, top: crackle.y }}
          >
            <div className="crackle-particle">
              <div className={`w-4 h-4 rounded-full ${theme === 'dark' ? 'bg-white' : 'bg-black'} opacity-80`} />
              <div className={`absolute inset-0 w-8 h-8 -m-2 rounded-full border-2 ${theme === 'dark' ? 'border-white' : 'border-black'} opacity-40`} />
              <div className={`absolute inset-0 w-12 h-12 -m-4 rounded-full border ${theme === 'dark' ? 'border-white' : 'border-black'} opacity-20`} />
            </div>
          </div>
        ))}

        <div className="scroll-reveal relative mx-auto max-w-6xl px-4 py-8 md:py-12 z-20">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
            <div className="max-w-2xl">
              <h1 className="text-2xl md:text-4xl font-bold leading-tight tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-teal-400 bg-clip-text text-transparent">
                Stop wasting time. <span className="whitespace-nowrap">Find the perfect tracks.</span>
              </h1>
              <p className={(theme==='dark'? 'text-white/70':'text-[#1a1a17]/70')+" mt-3 md:text-base"}>
                AI-powered curation for aspiring and veteran DJs. Tell us your vibe, and we&apos;ll surface tracks that fit your style — fast.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <a href="#waitlist" className={(theme==='dark'?'bg-emerald-500 text-black':'bg-emerald-600 text-white')+" px-5 py-3 rounded-xl text-sm font-semibold transition-transform hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"}>Join the waiting list</a>
                <a href="#demo" className={(theme==='dark'?'bg-white/10 text-white hover:bg-white/20':'bg-[#1a1a17]/5 text-[#1a1a17] hover:bg-[#1a1a17]/10')+" px-5 py-3 rounded-xl text-sm font-semibold transition hover:shadow"}>Watch demo</a>
              </div>
              <ul className={(theme==='dark'? 'text-white/70':'text-[#1a1a17]/70')+" mt-5 text-sm grid gap-1.5"}>
                <li className="transition hover:translate-x-0.5">• Cut through thousands of tracks with AI that understands your play style.</li>
                <li className="transition hover:translate-x-0.5">• Get recommendations that match your BPM, key, genre and vibe.</li>
                <li className="transition hover:translate-x-0.5">• Auto-sync to Beatport DJ — exporting is just the fallback.</li>
              </ul>
            </div>
            
            {/* Enhanced Hero Image with more effects */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div 
                  className="transform transition-all duration-300 hover:scale-105"
                  style={{
                    transform: `translate(${offset.x * 15}px, ${offset.y * 15}px) scale(1)`
                  }}
                >
                  <Image 
                    src="/hero-headphones.png" 
                    alt="DJ Headphones with vibrant colors and music elements"
                    width={553}
                    height={553}
                    className="w-[460px] h-[460px] md:w-[553px] md:h-[553px] object-contain drop-shadow-2xl"
                  />
                </div>
                
                {/* Enhanced floating elements with glitch effects */}
                <div className="absolute inset-0 pointer-events-none">
                  {[
                    { pos: 'top-8 right-8', size: 'text-2xl', color: theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600', delay: '0s', symbol: '♪' },
                    { pos: 'top-20 left-8', size: 'text-lg', color: theme === 'dark' ? 'text-blue-400' : 'text-blue-600', delay: '1s', symbol: '♪' },
                    { pos: 'top-4 left-1/2', size: 'text-xl', color: theme === 'dark' ? 'text-purple-400' : 'text-purple-600', delay: '0.3s', symbol: '♫' },
                    { pos: 'top-1/2 -left-4', size: 'text-lg', color: theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600', delay: '0.8s', symbol: '♪' },
                    { pos: 'top-1/2 -right-6', size: 'text-2xl', color: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600', delay: '1.2s', symbol: '♫' },
                    { pos: 'bottom-12 left-4', size: 'text-xl', color: theme === 'dark' ? 'text-pink-400' : 'text-pink-600', delay: '0.5s', symbol: '♫' },
                    { pos: 'bottom-8 right-12', size: 'text-lg', color: theme === 'dark' ? 'text-rose-400' : 'text-rose-600', delay: '1.5s', symbol: '♪' },
                    { pos: 'bottom-16 left-1/2', size: 'text-xl', color: theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600', delay: '0.7s', symbol: '♫' }
                  ].map((note, i) => (
                    <div 
                      key={i}
                      className={`${note.color} ${note.pos} ${note.size} absolute animate-bounce`}
                      style={{ animationDelay: note.delay }}
                    >
                      {note.symbol}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain → Solution */}
      <section className="relative" id="pain">
        <div className="mx-auto max-w-6xl px-4 py-14 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-teal-400 bg-clip-text text-transparent">Too many tracks. Too little time.</h2>
            <p className={(theme==='dark'? 'text-white/70':'text-[#1a1a17]/70')+" mt-3"}>
              Sifting through endless lists wastes creative energy. Most tracks aren&apos;t right for your style — or your next set.
            </p>
            <ul className={(theme==='dark'? 'text-white/80':'text-[#1a1a17]/80')+" mt-6 grid gap-3 text-sm"}>
              <li className="flex items-start gap-2 hover:translate-x-0.5 transition"><span className="mt-1">⏱</span><span>Hours lost scrolling and sampling.</span></li>
              <li className="flex items-start gap-2 hover:translate-x-0.5 transition"><span className="mt-1">🔎</span><span>Good music buried under noise.</span></li>
              <li className="flex items-start gap-2 hover:translate-x-0.5 transition"><span className="mt-1">🎛️</span><span>Hard to explore new directions that still fit your personality.</span></li>
            </ul>
          </div>
          <div>
            <div className={(theme==='dark'?'bg-white/5 border-white/10':'bg-[#1a1a17]/5 border-[#1a1a17]/10')+" rounded-2xl p-4 border transition hover:shadow-md"}>
              <h3 className="font-semibold">Beatport Curator solves this.</h3>
              <p className={(theme==='dark'? 'text-white/70':'text-[#1a1a17]/70')+" mt-2 text-sm"}>
                Our AI learns your DJ profile and vibe instructions, filters out the noise, and puts the right tracks front and center.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <DataTile theme={theme} label="Time saved / wk" value="5–10h"/>
                <DataTile theme={theme} label="Irrelevant tracks" value="−80%"/>
                <DataTile theme={theme} label="Fresh finds" value="+3×"/>
                <DataTile theme={theme} label="Set readiness" value="Faster"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className={(theme==='dark'?'bg-white/5':'bg-[#1a1a17]/5')+" border-y border-white/10 md:border-[#1a1a17]/10 relative overflow-hidden"}>
        <SectionBackdrop theme={theme} />
        <div className="relative mx-auto max-w-4xl px-4 py-16">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                {/* Vector-style icon with brand colors */}
                <svg 
                  width="48" 
                  height="48" 
                  viewBox="0 0 48 48" 
                  className="drop-shadow-lg"
                >
                  <defs>
                    <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#9D4EDD" />
                      <stop offset="50%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#38BDF8" />
                    </linearGradient>
                  </defs>
                  {/* DJ Turntable Icon */}
                  <circle cx="24" cy="24" r="20" fill="url(#iconGradient)" opacity="0.2"/>
                  <circle cx="24" cy="24" r="16" fill="none" stroke="url(#iconGradient)" strokeWidth="2"/>
                  <circle cx="24" cy="24" r="8" fill="url(#iconGradient)" opacity="0.8"/>
                  <circle cx="24" cy="24" r="3" fill="white"/>
                  {/* Sound waves */}
                  <path d="M8 24 Q12 20, 16 24 Q20 28, 24 24" stroke="url(#iconGradient)" strokeWidth="2" fill="none" opacity="0.6"/>
                  <path d="M24 24 Q28 20, 32 24 Q36 28, 40 24" stroke="url(#iconGradient)" strokeWidth="2" fill="none" opacity="0.6"/>
                </svg>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-teal-400 bg-clip-text text-transparent mb-4">
              How it Works
            </h2>
            <p className={(theme==='dark'?'text-white/70':'text-[#1a1a17]/70')+" text-lg max-w-2xl mx-auto"}>
              Get started in three simple steps and transform your music discovery process
            </p>
          </div>

          {/* Vertical Steps */}
          <div className="space-y-8">
            <VerticalStepCard 
              theme={theme} 
              n={1} 
              title="Connect" 
              text="Secure OAuth to Beatport. Sync your library & playlists."
              icon="link"
            />
            <VerticalStepCard 
              theme={theme} 
              n={2} 
              title="Tell your vibe" 
              text="Genres, BPM range, keys, artists you like — or just type it in natural language."
              icon="music"
            />
            <VerticalStepCard 
              theme={theme} 
              n={3} 
              title="Get the good stuff" 
              text="Curated tracks matched to your style. Add to Collections and auto-sync to Beatport DJ."
              icon="sparkles"
            />
          </div>

          {/* Clear CTA */}
          <div className="text-center mt-12">
            <a 
              href="#waitlist" 
              className={(theme==='dark'?'bg-gradient-to-r from-emerald-500 to-teal-500 text-black':'bg-gradient-to-r from-emerald-600 to-teal-600 text-white')+" inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] shadow-lg"}
            >
              <span>Start Your Journey</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <p className={(theme==='dark'?'text-white/60':'text-[#1a1a17]/60')+" mt-3 text-sm"}>
              Join thousands of DJs already using RHYTM
            </p>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section id="features" className="relative overflow-hidden">
        <SectionBackdrop theme={theme} subtle />
        <div className="relative mx-auto max-w-6xl px-4 py-14">
          <h2 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-teal-400 bg-clip-text text-transparent">Everything you need to curate faster</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard theme={theme} title="AI Recommendations" text="Learns your style from likes, skips, collections and vibe prompts."/>
            <FeatureCard theme={theme} title="Natural Language Search" text="Ask for &apos;peak-time melodic techno 126–128 BPM, 8A&apos; and get spot-on results."/>
            <FeatureCard theme={theme} title="Auto Sync to Beatport DJ" text="Primary workflow: one click, your collection becomes a Beatport DJ playlist."/>
            <FeatureCard theme={theme} title="Compact Discover Table" text="# · ▶ · Title · Artists · Genre · BPM · Key · Actions. Sticky top menus & filters."/>
            <FeatureCard theme={theme} title="Offline & Queue" text="Work on the go. Changes sync when you&apos;re back online."/>
            <FeatureCard theme={theme} title="Export Fallbacks" text="CSV, M3U, JSON when you need manual workflows."/>
          </div>
        </div>
      </section>

      {/* Testimonials / Social Proof */}
      <section id="proof" className={(theme==='dark'?'bg-white/5':'bg-[#1a1a17]/5')+" border-y border-white/10 md:border-[#1a1a17]/10 relative overflow-hidden"}>
        <SectionBackdrop theme={theme} subtle />
        <div className="relative mx-auto max-w-6xl px-4 py-14">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-purple-400 via-pink-500 to-teal-400 bg-clip-text text-transparent mb-2">
              Trusted by DJs Worldwide
            </h2>
            <p className={(theme==='dark'? 'text-white/70':'text-[#1a1a17]/70')}>
              Join thousands of DJs who&apos;ve transformed their music discovery
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Quote 
              theme={theme} 
              who="Resident DJ" 
              text="I save hours every week and still push my sound in the direction I want."
              image="/dj-portrait-1.jpg"
            />
            <Quote 
              theme={theme} 
              who="Aspiring DJ" 
              text="It finally surfaces tracks that actually fit my style, not just what's trending."
              image="/dj-portrait-2.jpg"
            />
            <Quote 
              theme={theme} 
              who="Newcomer DJ" 
              text="Consistent quality selections, faster — this shortens prep for every set."
              image="/dj-portrait-3.jpg"
            />
          </div>
        </div>
      </section>

      {/* Enhanced Waiting List */}
      <section id="waitlist" className="relative overflow-hidden min-h-[80vh] flex items-center">
        <SectionBackdrop theme={theme} subtle />
        <div className="relative mx-auto max-w-5xl px-4 py-20">
          <div className="text-center mb-12">
            {/* Beta Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 mb-6">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                LIMITED BETA ACCESS
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-teal-400 bg-clip-text text-transparent mb-6">
              Be the First to Experience
              <br />
              <span className="text-3xl md:text-5xl">The Future of DJ Curation</span>
            </h2>
            
            <p className={(theme==='dark'? 'text-white/80':'text-[#1a1a17]/80')+" text-xl max-w-3xl mx-auto mb-8"}>
              Join the exclusive beta and get <strong className="text-emerald-400">50% off</strong> when we launch. 
              Only <span className="font-bold text-pink-400">500 spots</span> available for early access.
            </p>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <div className={(theme==='dark'?'bg-white/5 border-white/10':'bg-[#1a1a17]/5 border-[#1a1a17]/10')+" rounded-2xl p-6 border text-center"}>
                <div className="flex justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={(theme==='dark'?'text-emerald-400':'text-emerald-600')}>
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M8 12l2 2 4-4"/>
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Early Access</h3>
                <p className={(theme==='dark'?'text-white/70':'text-[#1a1a17]/70')+" text-sm"}>Be among the first 500 to try RHYTM before public launch</p>
              </div>
              <div className={(theme==='dark'?'bg-white/5 border-white/10':'bg-[#1a1a17]/5 border-[#1a1a17]/10')+" rounded-2xl p-6 border text-center"}>
                <div className="flex justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={(theme==='dark'?'text-emerald-400':'text-emerald-600')}>
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">50% Discount</h3>
                <p className={(theme==='dark'?'text-white/70':'text-[#1a1a17]/70')+" text-sm"}>Lifetime discount on your subscription when we launch</p>
              </div>
              <div className={(theme==='dark'?'bg-white/5 border-white/10':'bg-[#1a1a17]/5 border-[#1a1a17]/10')+" rounded-2xl p-6 border text-center"}>
                <div className="flex justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={(theme==='dark'?'text-emerald-400':'text-emerald-600')}>
                    <path d="M9 12l2 2 4-4"/>
                    <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                    <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                    <path d="M12 3c0 1-1 3-3 3s-3-2-3-3 1-3 3-3 3 2 3 3"/>
                    <path d="M12 21c0-1 1-3 3-3s3 2 3 3-1 3-3 3-3-2-3-3"/>
                  </svg>
                </div>
                <h3 className="font-semibold mb-2">Shape the Product</h3>
                <p className={(theme==='dark'?'text-white/70':'text-[#1a1a17]/70')+" text-sm"}>Your feedback directly influences our development roadmap</p>
              </div>
            </div>
          </div>

          {/* Enhanced Form */}
          <div className="max-w-2xl mx-auto">
            <form onSubmit={submit} className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={e=>setEmail(e.target.value)}
                  placeholder="Enter your email to secure your spot"
                  className={(theme==='dark'?'bg-white/10 placeholder-white/50 text-white border-white/20':'bg-[#1a1a17]/5 placeholder-[#1a1a17]/50 text-[#1a1a17] border-[#1a1a17]/10')+" w-full px-6 py-4 rounded-2xl border-2 outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all text-lg"}
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              
              <button 
                type="submit" 
                className={(theme==='dark'?'bg-gradient-to-r from-emerald-500 to-teal-500 text-black':'bg-gradient-to-r from-emerald-600 to-teal-600 text-white')+" w-full px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:scale-[0.98] shadow-lg"}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>Secure My Beta Spot</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </button>
            </form>

            {/* Status Messages */}
            {error && (
              <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-400/30 text-rose-400 text-center">
                {error}
              </div>
            )}
            
            {submitted && (
              <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-emerald-500/15 to-teal-500/15 border border-emerald-400/30 text-center">
                <div className="flex justify-center mb-4">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <path d="M22 4L12 14.01l-3-3"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-emerald-400 mb-2">Welcome to the Beta!</h3>
                <p className={(theme==='dark'?'text-white/80':'text-[#1a1a17]/80')}>
                  You're now on the list! We'll send you exclusive updates and your early access invitation soon.
                </p>
              </div>
            )}

            {/* Trust Indicators */}
            <div className="mt-8 text-center">
              <p className={(theme==='dark'?'text-white/60':'text-[#1a1a17]/60')+" text-sm mb-4 flex items-center justify-center gap-2"}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Your email is safe with us. No spam, ever.
              </p>
              <div className="flex items-center justify-center gap-6 text-sm opacity-70">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  <span>2,847 DJs already joined</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                  <span>Only 500 spots left</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with the same grid + gradient */}
      <footer className={(theme==='dark'?'bg-white/5':'bg-[#1a1a17]/5')+" border-t border-white/10 md:border-[#1a1a17]/10 relative overflow-hidden"}>
        <HeaderBackdrop theme={theme} />
        <div className="relative mx-auto max-w-6xl px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6 z-10">
          <div className="text-center md:text-left">
            <div className="text-base font-bold opacity-90">© {new Date().getFullYear()} RHYTM</div>
            <div className="text-sm opacity-70 mt-1">A brand owned by Sky Walker Enterprise</div>
          </div>
          <div className="flex items-center gap-6 text-base font-bold opacity-90">
            <a href="#" className="hover:opacity-100 hover:-translate-y-0.5 transition-all duration-200">About</a>
            <a href="/privacy" className="hover:opacity-100 hover:-translate-y-0.5 transition-all duration-200">Privacy</a>
            <a href="/terms" className="hover:opacity-100 hover:-translate-y-0.5 transition-all duration-200">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function ThemeToggle({theme, setTheme}:{theme:'dark'|'light'; setTheme:(t:'dark'|'light')=>void}){
  const isDark = theme==='dark'
  return (
    <button onClick={()=>setTheme(isDark?'light':'dark')} aria-label="Toggle theme" className={(isDark?'bg-white/10 hover:bg-white/20':'bg-[#1a1a17]/10 hover:bg-[#1a1a17]/20')+" px-3 py-1.5 rounded-lg text-sm transition"}>
      {isDark? 'Dark • On' : 'Light • On'}
    </button>
  )
}

function HeaderBackdrop({theme}:{theme:'dark'|'light'}){
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className={(theme==='dark'
        ? 'bg-[linear-gradient(transparent_95%,rgba(255,255,255,0.08)_95%),linear-gradient(90deg,transparent_95%,rgba(255,255,255,0.08)_95%)]'
        : 'bg-[linear-gradient(transparent_95%,rgba(26,26,23,0.08)_95%),linear-gradient(90deg,transparent_95%,rgba(26,26,23,0.08)_95%)]')+" absolute inset-0 bg-[size:20px_20px] opacity-40"}></div>
      <div className={(theme==='dark'
        ? 'bg-[radial-gradient(circle_at_20%_10%,rgba(157,78,221,0.25),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.25),transparent_35%),radial-gradient(circle_at_60%_80%,rgba(56,189,248,0.2),transparent_35%)]'
        : 'bg-[radial-gradient(circle_at_20%_10%,rgba(255,196,124,0.45),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,137,137,0.42),transparent_35%),radial-gradient(circle_at_60%_80%,rgba(176,220,255,0.38),transparent_35%)]')+" absolute -inset-[20%] blur-3xl opacity-70"}></div>
    </div>
  )
}

// function ClubBackdrop({theme, offset}:{theme:'dark'|'light'; offset:{x:number,y:number}}){ // Unused
  // const t1 = { transform: `translate3d(${offset.x*30}px, ${offset.y*30}px, 0)` }
  // const t2 = { transform: `translate3d(${offset.x*-20}px, ${offset.y*-20}px, 0)` }
  // return (
  //   <div aria-hidden className="absolute inset-0 overflow-hidden">
  //     {/* gradient wash (stronger in light theme) */}
  //     <div style={t1} className={"absolute -inset-[20%] blur-3xl "+(theme==='dark'
  //       ? 'opacity-60 bg-[radial-gradient(circle_at_20%_10%,rgba(157,78,221,0.35),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.35),transparent_35%),radial-gradient(circle_at_60%_80%,rgba(56,189,248,0.25),transparent_35%)]'
  //       : 'opacity-80 bg-[radial-gradient(circle_at_20%_10%,rgba(255,196,124,0.55),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,137,137,0.5),transparent_35%),radial-gradient(circle_at_60%_80%,rgba(176,220,255,0.45),transparent_35%)]')}></div>
  //     {/* subtle grid with parallax */}
  //     <div style={t2} className={(theme==='dark'
  //       ? 'bg-[linear-gradient(transparent_95%,rgba(255,255,255,0.08)_95%),linear-gradient(90deg,transparent_95%,rgba(255,255,255,0.08)_95%)]'
  //       : 'bg-[linear-gradient(transparent_95%,rgba(26,26,23,0.07)_95%),linear-gradient(90deg,transparent_95%,rgba(26,26,23,0.07)_95%)]')+" absolute inset-0 bg-[size:20px_20px] opacity-40"}></div>
  //   </div>
  // )
// }

function SectionBackdrop({theme, subtle}:{theme:'dark'|'light'; subtle?:boolean}){
  return (
    <div aria-hidden className="absolute inset-0">
      <div className={(theme==='dark'
        ? `bg-[linear-gradient(transparent_95%,rgba(255,255,255,0.08)_95%),linear-gradient(90deg,transparent_95%,rgba(255,255,255,0.08)_95%)]`
        : `bg-[linear-gradient(transparent_95%,rgba(26,26,23,0.07)_95%),linear-gradient(90deg,transparent_95%,rgba(26,26,23,0.07)_95%)]`)+" absolute inset-0 bg-[size:20px_20px] "+(subtle?'opacity-25':'opacity-40')}></div>
      <div className={(theme==='dark'
        ? 'bg-[radial-gradient(circle_at_20%_10%,rgba(157,78,221,0.22),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.22),transparent_35%),radial-gradient(circle_at_60%_80%,rgba(56,189,248,0.18),transparent_35%)]'
        : 'bg-[radial-gradient(circle_at_20%_10%,rgba(255,196,124,0.45),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,137,137,0.42),transparent_35%),radial-gradient(circle_at_60%_80%,rgba(176,220,255,0.38),transparent_35%)]')+" absolute -inset-[20%] blur-3xl "+(subtle?'opacity-50':'opacity-70')}></div>
    </div>
  )
}

function DataTile({theme,label,value}:{theme:'dark'|'light'; label:string; value:string}){
  return (
    <div className={(theme==='dark'?'bg-white/5 border-white/10':'bg-[#1a1a17]/5 border-[#1a1a17]/10')+" rounded-xl p-3 border transition hover:shadow"}>
      <div className="text-xs opacity-70">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  )
}

function StepCard({theme,n,title,text}:{theme:'dark'|'light'; n:number; title:string; text:string}){
  return (
    <div className={(theme==='dark'?'bg-white/5 border-white/10':'bg-[#1a1a17]/5 border-[#1a1a17]/10')+" rounded-2xl p-4 border transition hover:-translate-y-0.5 hover:shadow-md"}>
      <div className={(theme==='dark'?'text-emerald-300':'text-emerald-700')+" text-sm font-semibold"}>Step {n}</div>
      <div className="mt-1 text-lg font-semibold">{title}</div>
      <p className={(theme==='dark'? 'text-white/70':'text-[#1a1a17]/70')+" mt-2 text-sm"}>{text}</p>
    </div>
  )
}


function FeatureCard({theme,title,text}:{theme:'dark'|'light'; title:string; text:string}){
  return (
    <div className={(theme==='dark'?'bg-white/5 border-white/10':'bg-[#1a1a17]/5 border-[#1a1a17]/10')+" rounded-2xl p-4 border transition hover:-translate-y-0.5 hover:shadow-md"}>
      <div className="text-base font-semibold">{title}</div>
      <p className={(theme==='dark'? 'text-white/70':'text-[#1a1a17]/70')+" mt-2 text-sm"}>{text}</p>
    </div>
  )
}

function Quote({theme, who, text, image}:{theme:'dark'|'light'; who:string; text:string; image:string}){
  return (
    <figure className={(theme==='dark'?'bg-white/5 border-white/10':'bg-[#1a1a17]/5 border-[#1a1a17]/10')+" rounded-2xl p-6 border transition hover:-translate-y-0.5 hover:shadow-lg"}>
      <div className="flex flex-col items-center text-center">
        <div className="group mb-6">
          <div className={`w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-2 transition-all duration-300 group-hover:scale-105 ${theme === 'dark' ? 'border-white/20' : 'border-[#1a1a17]/20'}`}>
            <Image 
              src={image} 
              alt={`${who} Portrait`}
              width={160}
              height={160}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
        </div>
        <blockquote className={(theme==='dark'? 'text-white':'text-[#1a1a17]')+" text-sm mb-3"}>&quot;{text}&quot;</blockquote>
        <figcaption className={(theme==='dark'?'text-white/70':'text-[#1a1a17]/70')+" text-xs font-medium"}>— {who}</figcaption>
      </div>
    </figure>
  )
}

// Enhanced backdrop component with wavy gradients
function EnhancedClubBackdrop({theme, offset, mousePos}: {
  theme: 'dark'|'light'; 
  offset: {x:number,y:number}; 
  mousePos: {x:number,y:number};
}) {
  const t1 = { 
    transform: `translate3d(${offset.x*40}px, ${offset.y*40}px, 0) scale(1)` 
  }
  const t2 = { 
    transform: `translate3d(${offset.x*-25}px, ${offset.y*-25}px, 0)` 
  }
  
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {/* Animated wavy gradient layers */}
      <div 
        style={t1} 
        className={`absolute -inset-[30%] blur-3xl transition-all duration-150 opacity-70 ${
          theme==='dark'
            ? 'bg-[radial-gradient(circle_at_20%_10%,rgba(157,78,221,0.4),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.4),transparent_35%),radial-gradient(circle_at_60%_80%,rgba(56,189,248,0.3),transparent_35%)]'
            : 'bg-[radial-gradient(circle_at_20%_10%,rgba(255,196,124,0.6),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(255,137,137,0.55),transparent_35%),radial-gradient(circle_at_60%_80%,rgba(176,220,255,0.5),transparent_35%)]'
        }`}
      />
      
      {/* Interactive wave layer that follows mouse */}
      <div 
        className="absolute inset-0 wave-gradient opacity-30"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, ${
            theme === 'dark' 
              ? 'rgba(255,255,255,0.1) 0%, transparent 50%'
              : 'rgba(0,0,0,0.1) 0%, transparent 50%'
          })`,
          transform: 'scale(1)',
          transition: 'transform 0.15s ease-out'
        }}
      />
      
      {/* Grid with parallax */}
      <div style={t2} className={`${theme==='dark'
        ? 'bg-[linear-gradient(transparent_95%,rgba(255,255,255,0.08)_95%),linear-gradient(90deg,transparent_95%,rgba(255,255,255,0.08)_95%)]'
        : 'bg-[linear-gradient(transparent_95%,rgba(26,26,23,0.07)_95%),linear-gradient(90deg,transparent_95%,rgba(26,26,23,0.07)_95%)]'
      } absolute inset-0 bg-[size:20px_20px] transition-opacity duration-150 opacity-40`} />
    </div>
  )
}
