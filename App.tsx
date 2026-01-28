
import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { Terminal, Brain, Shield, Heart, ChevronDown, Menu, X, ExternalLink, Clock, Radio, Facebook, Instagram, Twitter, Linkedin, Phone, Microscope, BookOpen, Home, Castle } from 'lucide-react';
import { NAV_LINKS, TRACKS} from './constants';


// --- Flip Card Component ---
const FlipCard: React.FC<{ 
  frontImage?: string; 
  backTitle?: string; 
  backContent?: string;
  children?: React.ReactNode;
  className?: string;
}> = ({ frontImage, backTitle, backContent, children, className = "" }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      onMouseEnter={() => {
        setIsFlipped(true);
        setIsHovering(true);
      }}
      onMouseLeave={() => {
        setIsFlipped(false);
        setIsHovering(false);
      }}
      className={`relative h-[450px] w-full cursor-pointer perspective ${className}`}
      style={{ perspective: '1200px' }}
      animate={{ 
        boxShadow: isHovering 
          ? '0 0 40px rgba(231, 29, 54, 0.6), 0 0 80px rgba(231, 29, 54, 0.3), inset 0 0 40px rgba(231, 29, 54, 0.1)'
          : '0 0 20px rgba(231, 29, 54, 0.2), 0 0 40px rgba(231, 29, 54, 0.1)'
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
        style={{ 
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
          willChange: 'transform'
        }}
        className="w-full h-full"
      >
        {/* Front Side */}
        <motion.div
          style={{ backfaceVisibility: 'hidden' }}
          className="absolute w-full h-full border border-zinc-800 bg-black/60 backdrop-blur-xl p-0 flex flex-col items-center justify-center text-center overflow-hidden rounded-md"
        >
          {frontImage ? (
            <motion.img 
              src={frontImage} 
              alt="tracker" 
              className="w-full h-full object-cover"
              animate={{ scale: isHovering ? 1.1 : 1 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 100, damping: 20 }}
            />
          ) : (
            children
          )}
        </motion.div>

        {/* Back Side */}
        <motion.div
          initial={{ rotateY: 180 }}
          style={{ backfaceVisibility: 'hidden', rotateY: 180 }}
          className="absolute w-full h-full border border-stranger-red bg-black/80 backdrop-blur-xl p-8 flex flex-col items-center justify-center text-center rounded-md"
        >
          {backTitle && <h3 className="title-effect text-2xl mb-4" data-text={backTitle}>{backTitle}</h3>}
          {backContent && <p className="text-zinc-300 text-sm leading-relaxed font-mono">{backContent}</p>}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// --- Shared Components ---

const SectionTitle: React.FC<{ children: React.ReactNode; subtitle?: boolean; upsideDown?: boolean }> = ({ children, subtitle, upsideDown }) => (
  <div className="text-center mb-16">
    <motion.h2 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className={`title-effect text-4xl md:text-6xl tracking-tighter ${upsideDown ? 'grayscale-[0.3] contrast-[1.1]' : ''}`}
      data-text={children}
    >
      {children}
    </motion.h2>
    {subtitle && (
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: "140px" }}
        transition={{ duration: 1.2 }}
        className={`h-[2px] bg-gradient-to-r from-transparent via-stranger-red to-transparent mx-auto mt-6 shadow-[0_0_20px_#ff0000] ${upsideDown ? 'opacity-30' : ''}`}
      />
    )}
  </div>
);

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [phase, setPhase] = useState<'before' | 'during' | 'after'>('before');

  // Read start/end from central config (editable file)
  // Update imports at top of file
  // We'll parse as local time if no timezone is provided.
  useEffect(() => {
    // lazy import to keep top imports tidy (and avoid failing tests if file missing)
    // but since countdownConfig.ts exists, we can import normally; using dynamic import keeps HMR friendly.
    let mounted = true;
    let interval: number | undefined;

    (async () => {
      const cfg = await import('./countdownConfig');
      const start = new Date(cfg.START_DATE).getTime();
      const end = new Date(cfg.END_DATE).getTime();

      const tick = () => {
        const now = Date.now();
        if (now < start) {
          setPhase('before');
          const distance = start - now;
          setTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
          });
        } else if (now >= start && now < end) {
          setPhase('during');
          const distance = end - now;
          setTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
          });
        } else {
          setPhase('after');
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          // once after, we can clear interval to save cycles
          if (interval) window.clearInterval(interval);
        }
      };

      tick();
      interval = window.setInterval(tick, 1000);
    })();

    return () => {
      mounted = false;
      if (interval) window.clearInterval(interval);
    };
  }, []);

  const TimeUnit: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center mx-3 md:mx-5">
      <div className="bg-black/80 border-2 border-stranger-red/30 rounded-none p-4 md:p-6 min-w-[80px] md:min-w-[110px] backdrop-blur-xl shadow-[inset_0_0_15px_rgba(231,29,54,0.1)]">
        <span className="text-4xl md:text-6xl font-mono text-stranger-red font-black tracking-tighter">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-zinc-500 font-mono text-[10px] md:text-xs mt-3 uppercase tracking-[0.3em] font-bold">{label}</span>
    </div>
  );

  const header = phase === 'before' ? 'Starts In' : phase === 'during' ? 'Ends In' : 'Event Ended';

  return (
    <div className="flex flex-col items-center justify-center my-6">
      <div className="text-center text-xs md:text-sm text-zinc-300 uppercase mb-3 font-mono tracking-widest">{header}</div>
      <div className="flex justify-center flex-wrap">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('#home');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = NAV_LINKS.map(link => link.href.substring(1));
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveLink(`#${current}`);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 w-full z-50 transition-all duration-700 ${scrolled ? 'bg-black/95 backdrop-blur-2xl border-b border-stranger-red/20 py-1' : 'bg-transparent py-4'}`}>
      <motion.div
        className="absolute bottom-0 left-0 h-[3px] bg-stranger-red origin-left z-50 shadow-[0_0_10px_#ff0033]"
        style={{ scaleX }}
      />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-12 relative">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-shrink-0 flex items-center gap-4 group">
            <div className="relative">
              <img src="/logo/devkraft1.png" alt="DevKraft Logo" className="h-10 md:h-12 object-contain" />
              <motion.div animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -inset-2 bg-stranger-red/5 blur-xl pointer-events-none" />
            </div>
          </motion.div>
          
          <div className="hidden md:block">
            <div className="flex items-center space-x-10">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setActiveLink(link.href)}
                  className={`relative font-serif text-[11px] font-bold tracking-[0.3em] uppercase transition-all duration-500 nav-link-glitch group
                    ${activeLink === link.href ? 'text-white' : 'text-zinc-500 hover:text-zinc-200'}
                  `}
                >
                  <span className="relative z-10">{link.name}</span>
                  {activeLink === link.href && (
                    <motion.div layoutId="activeGlow" className="absolute -bottom-2 left-0 right-0 h-[2px] bg-stranger-red shadow-[0_0_10px_#ff0000]" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                  )}
                  <div className="absolute top-1/2 left-0 w-full h-[1px] bg-stranger-red/0 group-hover:bg-stranger-red/40 group-hover:animate-pulse transition-all" />
                </a>
              ))}
              <button className="px-6 py-2 border border-stranger-red text-stranger-red font-mono text-[10px] tracking-widest uppercase hover:bg-stranger-red hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(231,29,54,0.1)]">Register</button>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <Radio size={20} className={`${isOpen ? 'text-stranger-red animate-pulse' : 'text-zinc-600'}`} />
            <button onClick={() => setIsOpen(!isOpen)} className="text-stranger-red p-2 hover:bg-stranger-red/10 transition-colors border border-stranger-red/20">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, clipPath: 'circle(0% at 90% 10%)' }} animate={{ opacity: 1, clipPath: 'circle(150% at 90% 10%)' }} exit={{ opacity: 0, clipPath: 'circle(0% at 90% 10%)' }} transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }} className="md:hidden fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center space-y-12 overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            <button onClick={() => setIsOpen(false)} className="absolute top-10 right-10 text-stranger-red border border-stranger-red/30 p-2"><X size={32}/></button>
            {NAV_LINKS.map((link, idx) => (
              <motion.a key={link.name} href={link.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * idx }} className={`${link.name === 'Problem Statements' ? 'text-3xl' : 'text-4xl'} text-zinc-300 hover:text-stranger-red font-stranger uppercase tracking-[0.15em] relative group`} onClick={() => setIsOpen(false)}>
                <span className="relative z-10">{link.name}</span>
                <div className="absolute -left-8 top-1/2 -translate-y-1/2 w-4 h-4 bg-stranger-red scale-0 group-hover:scale-100 transition-transform rounded-full blur-[2px]" />
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const contentY = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section id="home" className="pt-100 relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* User requested Hero Background - Now FIXED position to stay static */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url("https://static0.polygonimages.com/wordpress/wp-content/uploads/chorus/uploads/chorus_asset/file/23665717/upsidedown.jpg?q=50&fit=crop&w=1184&h=666&dpr=1.5")', }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_80%)]" />
      </div>
      
      <motion.div 
        style={{ y: contentY, opacity, willChange: 'transform, opacity' }}
        className=" z-10 text-center px-4 max-w-6xl pt-200 mx-auto"
      >
        {/* Top date removed as requested */}
        
        <div className="relative mb-14 inline-flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            transition={{ duration: 1.8 }} 
            className="flex flex-col items-center"
          >
            <div className="w-full h-[2px] bg-stranger-red shadow-[0_0_15px_#E71D36] opacity-80 mb-1" />
            <div className="flex items-center justify-center -mb-4 pb-4 md:pb-0">
              <span className="title-effect text-7xl md:text-[9rem] leading-none" data-text="D">D</span>
              <span className="title-effect text-5xl md:text-[7.5rem] leading-none" data-text="EVCLAS">EVCLAS</span>
              <span className="title-effect text-7xl md:text-[9rem] leading-none" data-text="H">H</span>
            </div>
            <div className="flex items-center justify-center gap-4 w-full">
               <div className="flex-1 h-[2px] bg-stranger-red shadow-[0_0_15px_#E71D36] opacity-60" />
               <span className="title-effect text-4l md:text-[2rem] leading-none tracking-widest px-4" data-text="Pune's Biggest Tech Clash">Pune's Biggest Tech Clash</span>
               <div className="flex-1 h-[2px] bg-stranger-red shadow-[0_0_15px_#E71D36] opacity-60" />
            </div>
          </motion.div>
        </div>

        <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }} className="font-serif text-zinc-300 text-lg md:text-2xl max-w-2xl mx-auto mb-12 italic leading-relaxed">
          The signal is weak, but the connection is real. <br/>Join the party to code the mystery.
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <Countdown />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="flex flex-col sm:flex-row gap-8 justify-center items-center mt-12">
          <a href="#register" className="group relative px-12 py-5 bg-black border-2 border-stranger-red text-stranger-red font-black font-mono tracking-[0.4em] hover:bg-stranger-red hover:text-black transition-all duration-500 uppercase overflow-hidden shadow-[0_0_25px_rgba(231,29,54,0.4)]">
            <span className="relative z-10">Enter The Upside Down</span>
            <div className="absolute inset-0 bg-stranger-red transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </a>
        </motion.div>
      </motion.div>
      
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-stranger-red/60">
        <ChevronDown size={40} className="animate-pulse" />
      </motion.div>
    </section>
  );
};

const GroupSectionContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center pointer-events-none opacity-0 transition-opacity duration-1000"
        style={{ 
          backgroundImage: 'url(https://wallpapercave.com/wp/wp3773101.jpg)',
          // @ts-ignore
          '--group-bg-opacity': 'var(--group-bg-opacity, 0)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/30 to-black z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)] z-10" />
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const About = () => (
  <section id="about" className="py-28 relative">
    <div className="max-w-4xl mx-auto px-6">
      <SectionTitle subtitle>About Us</SectionTitle>
      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="bg-black/60 p-8 backdrop-blur-md border border-zinc-800/50 text-center">
        <p className="font-serif text-lg md:text-xl text-zinc-300 leading-relaxed">
          DevKraft is a student-founded club on a mission to transform the engineering experience. We're dedicated to fostering a vibrant coding culture, making learning enjoyable, promoting holistic student development and helping forge lasting connections with seniors and industry mentors who can help guide you through your journey. We also help students gain valuable industry insights in our expert panel events, where technical experts host interactive Q&A sessions. Furthermore, we provide a platform for the students to showcase their tech prowess in our technical challenge-based events.
        </p>
      </motion.div>
    </div>
  </section>
);

const EventCards = () => (
  <section id="event-details" className="py-16 relative">
    <div className="max-w-5xl mx-auto px-6">
      <div className="text-center mb-8">
        <h3 className="title-effect text-3xl md:text-4xl" data-text="Event Details">Event Details</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} whileHover={{ scale: 1.05 }} className="bg-black/60 border border-zinc-800 p-6 rounded-md text-center cursor-pointer">
          <h4 className="title-effect text-xl mb-3" data-text="ABOUT EVENT">ABOUT EVENT</h4>
          <p className="text-zinc-300 text-sm leading-relaxed">Get ready for an exhilarating hackathon experience at DEVCLASH. Our event is a celebration of creativity, coding prowess and teamwork. Join us from 5 Apr to 6 Apr for an unforgettable journey. Explore the world of technology, showcase your skills and vie for incredible prizes. Let's innovate, collaborate and create something extraordinary!</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} whileHover={{ scale: 1.05 }} className="bg-black/60 border border-zinc-800 p-6 rounded-md text-center cursor-pointer">
          <h4 className="title-effect text-xl mb-3" data-text="EVENT TIMING">EVENT TIMING</h4>
          <p className="text-zinc-300 text-sm leading-relaxed">From Feb 2026 - Feb 2026<br/>9:00 AM onwards</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} whileHover={{ scale: 1.05 }} className="bg-black/60 border border-zinc-800 p-6 rounded-md text-center cursor-pointer">
          <h4 className="title-effect text-xl mb-3" data-text="EVENT LOCATION">EVENT LOCATION</h4>
          <a href="https://maps.app.goo.gl/YzoSWiKqfxcuacnEA" target="_blank" rel="noreferrer" className="block mb-3">
            <img src="/map/image.png" alt="Event Location Map" className="mx-auto w-full max-w-sm rounded-md shadow-lg object-cover" />
          </a>
          <a href="https://maps.app.goo.gl/YzoSWiKqfxcuacnEA" target="_blank" rel="noreferrer" className="text-zinc-300 underline hover:text-white">Open in Maps</a>
        </motion.div>
      </div>
    </div>
  </section>
);

const Tracks = () => {
  const trackIcons = [
    <Microscope size={80} className="text-stranger-red" />, // Hawkins Lab
    <BookOpen size={80} className="text-stranger-red" />, // Central Library
    <Home size={80} className="text-stranger-red" />, // Mike's House
    <Castle size={80} className="text-stranger-red" />, // Castle Byers
  ];

  return (
    <section id="tracks" className="py-40 relative">
      <div className="max-w-7xl mx-auto px-6">
        <SectionTitle subtitle>The Missions</SectionTitle>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {TRACKS.map((track, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 40 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.1 }}
              className="w-full"
            >
              <FlipCard
                backTitle={track.trackName}
                backContent={track.description}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  {trackIcons[index]}
                  <h3 className="title-effect text-2xl" data-text={track.title}>{track.title}</h3>
                </div>
              </FlipCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Prizes = () => (
  <section id="prizes" className="py-40 relative">
    <style>{`
      @keyframes neon-glow-cyan {
        0%, 100% {
          text-shadow: 0 0 10px rgba(34, 211, 238, 0.7),
                        0 0 20px rgba(34, 211, 238, 0.4);
        }
        50% {
          text-shadow: 0 0 15px rgba(34, 211, 238, 0.9),
                        0 0 30px rgba(34, 211, 238, 0.6);
        }
      }

      @keyframes neon-glow-red {
        0%, 100% {
          text-shadow: 0 0 10px rgba(239, 68, 68, 0.7),
                        0 0 20px rgba(239, 68, 68, 0.4);
        }
        50% {
          text-shadow: 0 0 15px rgba(239, 68, 68, 0.9),
                        0 0 30px rgba(239, 68, 68, 0.6);
        }
      }

      .neon-cyan {
        animation: neon-glow-cyan 2s ease-in-out infinite;
      }

      .neon-red {
        animation: neon-glow-red 2s ease-in-out infinite;
      }

      .glow-border-cyan {
        box-shadow: 0 0 25px rgba(34, 211, 238, 0.4), inset 0 0 15px rgba(34, 211, 238, 0.1);
      }

      .glow-border-red {
        box-shadow: 0 0 30px rgba(239, 68, 68, 0.5), inset 0 0 20px rgba(239, 68, 68, 0.15);
      }

      .trophy-icon {
        font-size: 3.5rem;
        filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.6));
      }

      .medal-icon {
        font-size: 3.5rem;
        filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.6));
      }
    `}</style>
    
    <div className="max-w-7xl mx-auto px-6">
      <SectionTitle subtitle>The Bounty</SectionTitle>
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} className="text-center text-cyan-300/80 text-xs md:text-sm font-serif italic mb-8 md:mb-16 px-4 max-w-3xl mx-auto uppercase tracking-wider">The gate is open, rewards await those who return from the void with the most powerful artifacts</motion.p>
      
      <div className="relative flex flex-col md:flex-row items-center md:items-flex-end justify-center gap-6 md:gap-4 lg:gap-6 mb-8 py-4 md:py-0">
        {/* First Prize - Champion Card (Top on mobile, Middle on desktop) */}
        <motion.div 
          initial={{ opacity: 0, y: 120, scale: 0.8 }} 
          whileInView={{ opacity: 1, y: 0, scale: 1 }} 
          transition={{ duration: 0.9 }}
          className="flex flex-col items-center z-10 md:pt-12 order-1 md:order-2 w-full md:w-auto"
        >
          <motion.div 
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-56 sm:w-64 md:w-64 md:h-[420px] bg-black/80 border-2 border-red-500/70 backdrop-blur-md p-8 flex flex-col items-center justify-center text-center glow-border-red hover:border-red-400 transition-all duration-500 shadow-2xl"
          >
            <div className="trophy-icon mb-3 text-3xl">🏆</div>
            <p className="text-red-400/60 text-[9px] sm:text-xs uppercase tracking-widest mb-2 font-mono">Base 1st</p>
            <h3 className="title-effect text-lg sm:text-xl md:text-2xl mb-3" data-text="The Champion">The Champion</h3>
            <p className="text-2xl sm:text-3xl md:text-4xl font-black text-red-500 mb-3 sm:mb-4 neon-red">₹5,000</p>
            <p className="text-red-400/50 text-[8px] sm:text-[10px] uppercase tracking-widest font-mono">Grand Prize First</p>
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="text-red-500 text-xs sm:text-sm md:text-base mt-4 font-bold tracking-widest"
          >
            ★ GRAND PRIZE ★
          </motion.div>
        </motion.div>

        {/* Runner Up - Left on Desktop */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.1 }}
          className="flex flex-col items-center order-2 md:order-1 w-full md:w-auto"
        >
          <div className="w-56 sm:w-64 md:w-64 md:h-[420px] bg-black/70 border-2 border-cyan-400/50 backdrop-blur-md p-8 flex flex-col items-center justify-center text-center glow-border-cyan hover:border-cyan-300 transition-all duration-500"
          >
            <div className="medal-icon mb-3 text-3xl">🥈</div>
            <p className="text-cyan-400/60 text-[9px] sm:text-xs uppercase tracking-widest mb-2 font-mono">Base 2nd</p>
            <h3 className="title-effect text-lg sm:text-xl md:text-2xl mb-3" data-text="Runner Up">Runner Up</h3>
            <p className="text-2xl sm:text-3xl md:text-4xl font-black text-cyan-400 mb-3 sm:mb-4 neon-cyan">₹3,000</p>
            <p className="text-cyan-400/50 text-[8px] sm:text-[10px] uppercase tracking-widest font-mono">Grand Prize Second</p>
          </div>
        </motion.div>

        {/* 2nd Runner Up - Right on Desktop */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center order-3 md:order-3 w-full md:w-auto"
        >
          <div className="w-56 sm:w-64 md:w-64 md:h-[420px] bg-black/70 border-2 border-cyan-400/50 backdrop-blur-md p-8 flex flex-col items-center justify-center text-center glow-border-cyan hover:border-cyan-300 transition-all duration-500"
          >
            <div className="medal-icon mb-3 text-3xl">🏅</div>
            <p className="text-cyan-400/60 text-[9px] sm:text-xs uppercase tracking-widest mb-2 font-mono">Base 3rd</p>
            <h3 className="title-effect text-lg sm:text-xl md:text-2xl mb-3" data-text="2nd Runner Up">2nd Runner Up</h3>
            <p className="text-2xl sm:text-3xl md:text-4xl font-black text-cyan-400 mb-3 sm:mb-4 neon-cyan">₹1,000</p>
            <p className="text-cyan-400/50 text-[8px] sm:text-[10px] uppercase tracking-widest font-mono">Grand Prize Third</p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);


const Footer = () => (
  <footer className="bg-black text-white py-12 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 flex flex-col items-center relative z-10 text-center">
      
      {/* DevKraft logo centered above the background images */}
      <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} className="relative z-10 mb-6">
        <img src="/logo/devkraft1.png" alt="DevKraft Logo" className="h-12 md:h-16 mx-auto object-contain" />
        <div className="w-full h-[1px] bg-stranger-red/40 mt-2" />
      </motion.div>
       

      {/* Nav Links */}
      <div className="flex flex-wrap justify-center gap-8 mb-8">
        <a href="mailto:devkraftclub@gmail.com" className="font-serif text-sm md:text-base text-stranger-red uppercase tracking-widest hover:text-white transition-colors duration-300">Contact Us</a>
      </div>

      {/* Social Icons */}
      <div className="flex gap-8 mb-8 text-stranger-red">
        <a href="https://www.instagram.com/devkraft.dpu/?hl=en" className="hover:text-white transition-colors duration-300"><Instagram size={28} /></a>
        <a href="https://www.linkedin.com/company/dev-kraft/posts/?feedView=all" className="hover:text-white transition-colors duration-300"><Linkedin size={28} /></a>
      </div>


      {/* Bottom Text */}
      <div className="text-[10px] font-mono text-white/30 tracking-[0.3em] uppercase">
        Design and Developed by Team Devkraft © 2026
      </div>
    </div>
  </footer>
);

const Timeline = () => (
  <section id="timeline" className="py-20 md:py-40 relative">
    <div className="max-w-7xl mx-auto px-6">                                                                                                                
      <SectionTitle subtitle>The Crawl</SectionTitle>
      
      {/* Mobile Timeline - Vertical */}
      <div className="md:hidden">
        <div className="relative space-y-6">
          {/* Timeline events - Mobile */}
          {[
            { title: "Registrations Open", date: "27 March", desc: "The signal breaks through. Team leaders from our world can finally reach the Upside Down. Register your crew to answer the call and enter the twisted realm of innovation." },
            { title: "Last date to register", date: "4 April", desc: "The gate closes soon. This is your final chance to establish contact. After this date, the portal seals. No more teams can cross between dimensions." },
            { title: "Hackathon Kickoff", date: "5 April", desc: "The veil weakens. The Upside Down awakens. Teams emerge from the darkness to craft impossible solutions. The void provides power. Use it wisely. The hunt begins." },
            { title: "Hackathon Concludes", date: "6 April", desc: "The darkness recedes. The code must be submitted. Your artifacts, forged in the shadows, are needed back in our world. Time is running out. Hurry." },
            { title: "Results Out", date: "Soon", desc: "The truth emerges from static. Champions will be revealed. Those who conquered the Upside Down and returned with the most powerful artifacts will be crowned. The end... or a new beginning?" }
          ].map((event, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: idx * 0.1 }} className="relative">
              <div className="bg-black/70 border-2 border-orange-600/60 backdrop-blur-md p-6 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-2 font-serif uppercase">{event.title}</h3>
                <p className="text-orange-500 font-black text-xl mb-3">{event.date}</p>
                <p className="text-zinc-300 text-sm font-serif leading-relaxed">{event.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Desktop Timeline - Clean Layout */}
      <div className="hidden md:block relative">
        {/* Top row - 3 cards */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {/* Card 1: Registrations Open */}
          <motion.div initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0 }} className="flex justify-center">
            <div className="bg-black/70 border-2 border-orange-600/60 backdrop-blur-md p-8 rounded-xl text-center w-full shadow-[0_0_30px_rgba(234,88,12,0.2)] hover:shadow-[0_0_40px_rgba(234,88,12,0.4)] transition-all duration-500">
              <h3 className="text-xl font-bold text-white mb-3 font-serif uppercase tracking-wider">Registrations Open</h3>
              <p className="text-orange-500 font-black text-2xl mb-4">27 March</p>
              <p className="text-zinc-300 text-sm font-serif leading-relaxed">The signal breaks through. Team leaders from our world can finally reach the Upside Down. Register your crew to answer the call and enter the twisted realm of innovation.</p>
            </div>
          </motion.div>
          
          {/* Card 2: Hackathon Kickoff */}
          <motion.div initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="flex justify-center">
            <div className="bg-black/70 border-2 border-orange-600/60 backdrop-blur-md p-8 rounded-xl text-center w-full shadow-[0_0_30px_rgba(234,88,12,0.2)] hover:shadow-[0_0_40px_rgba(234,88,12,0.4)] transition-all duration-500">
              <h3 className="text-xl font-bold text-white mb-3 font-serif uppercase tracking-wider">Hackathon Kickoff</h3>
              <p className="text-orange-500 font-black text-2xl mb-4">5 April</p>
              <p className="text-zinc-300 text-sm font-serif leading-relaxed">The veil weakens. The Upside Down awakens. Teams emerge from the darkness to craft impossible solutions. The void provides power. Use it wisely. The hunt begins.</p>
            </div>
          </motion.div>
          
          {/* Card 3: Results Out */}
          <motion.div initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex justify-center">
            <div className="bg-black/70 border-2 border-orange-600/60 backdrop-blur-md p-8 rounded-xl text-center w-full shadow-[0_0_30px_rgba(234,88,12,0.2)] hover:shadow-[0_0_40px_rgba(234,88,12,0.4)] transition-all duration-500">
              <h3 className="text-xl font-bold text-white mb-3 font-serif uppercase tracking-wider">Results Out</h3>
              <p className="text-orange-500 font-black text-2xl mb-4">Soon</p>
              <p className="text-zinc-300 text-sm font-serif leading-relaxed">The truth emerges from static. Champions will be revealed. Those who conquered the Upside Down and returned with the most powerful artifacts will be crowned. The end... or a new beginning?</p>
            </div>
          </motion.div>
        </div>
        
        {/* Bottom row - 2 cards */}
        <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* Card 4: Last date to register */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="flex justify-center">
            <div className="bg-black/70 border-2 border-orange-600/60 backdrop-blur-md p-8 rounded-xl text-center w-full shadow-[0_0_30px_rgba(234,88,12,0.2)] hover:shadow-[0_0_40px_rgba(234,88,12,0.4)] transition-all duration-500">
              <h3 className="text-xl font-bold text-white mb-3 font-serif uppercase tracking-wider">Last date to register</h3>
              <p className="text-orange-500 font-black text-2xl mb-4">4 April</p>
              <p className="text-zinc-300 text-sm font-serif leading-relaxed">The gate closes soon. This is your final chance to establish contact. After this date, the portal seals. No more teams can cross between dimensions.</p>
            </div>
          </motion.div>
          
          {/* Card 5: Hackathon Concludes */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="flex justify-center">
            <div className="bg-black/70 border-2 border-orange-600/60 backdrop-blur-md p-8 rounded-xl text-center w-full shadow-[0_0_30px_rgba(234,88,12,0.2)] hover:shadow-[0_0_40px_rgba(234,88,12,0.4)] transition-all duration-500">
              <h3 className="text-xl font-bold text-white mb-3 font-serif uppercase tracking-wider">Hackathon Concludes</h3>
              <p className="text-orange-500 font-black text-2xl mb-4">6 April</p>
              <p className="text-zinc-300 text-sm font-serif leading-relaxed">The darkness recedes. The code must be submitted. Your artifacts, forged in the shadows, are needed back in our world. Time is running out. Hurry.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

export default function App() {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      const heroBottom = windowHeight;
      const tracksBottom = windowHeight * 3;
      
      if (scrollY > heroBottom * 0.5 && scrollY < tracksBottom) {
        document.documentElement.style.setProperty('--group-bg-opacity', '1');
      } else {
        document.documentElement.style.setProperty('--group-bg-opacity', '0');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-100 overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <GroupSectionContainer>
          <About />
          <EventCards />
          <Tracks />
          <Prizes />
          <Timeline />
        </GroupSectionContainer>
        
      </main>
      <Footer />
    </div>
  );
}
