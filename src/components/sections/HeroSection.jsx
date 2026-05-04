import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiChevronDown } from 'react-icons/fi'
import api from '../../utils/api'

// Floating cross/light orb element
const FloatingOrb = ({ style, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, duration: 1.2, ease: 'easeOut' }}
    className="absolute rounded-full pointer-events-none"
    style={style}
  />
)

export default function HeroSection() {
  const { t } = useTranslation()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const [verse, setVerse] = useState(null)
  const lang = localStorage.getItem('lang') || 'id'

  useEffect(() => {
    api.get('/verses/today').then(({ data }) => {
      if (data.success) setVerse(data.data)
    }).catch(() => {})
  }, [])

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-navy-900">
      {/* Parallax background */}
      <motion.div style={{ y }} className="absolute inset-0">
        {/* Deep gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-[#0d1f45]" />

        {/* Gold radial glow */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(201,168,76,0.12) 0%, transparent 70%)'
        }} />

        {/* Floating orbs */}
        <FloatingOrb delay={0.3} style={{ width: 300, height: 300, top: '5%', right: '10%', background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />
        <FloatingOrb delay={0.6} style={{ width: 200, height: 200, bottom: '20%', left: '5%', background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)' }} />
        <FloatingOrb delay={0.9} style={{ width: 150, height: 150, top: '40%', left: '15%', background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </motion.div>

      {/* Content */}
      <motion.div style={{ opacity }} className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Church badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
          <span className="text-white/80 text-xs font-medium tracking-widest uppercase">{t('hero.badge')}</span>
        </motion.div>

        {/* Main title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: 'easeOut' }}
        >
          <p className="text-white/60 text-lg font-sans mb-2">{t('home.heroTitle')}</p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-tight mb-2">
            Ekklesia
          </h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-gold-500" />
            <span className="text-gold-400 text-xl">✦</span>
            <span className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-gold-500" />
          </div>
          <p className="text-white/70 text-lg sm:text-xl font-sans max-w-lg mx-auto leading-relaxed">
            {t('home.heroSub')}
          </p>
        </motion.div>

        {/* Daily verse card */}
        {verse && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-10 mx-auto max-w-lg bg-white/8 backdrop-blur-md border border-white/15 rounded-3xl p-6 text-left"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-px bg-gold-500" />
              <p className="text-gold-400 text-xs font-semibold uppercase tracking-widest">{t('home.verseDay')}</p>
            </div>
            <p className="text-white/90 font-serif italic text-base leading-relaxed mb-2">
              "{lang === 'en' && verse.text_en ? verse.text_en : verse.text_id}"
            </p>
            <p className="text-gold-400 text-sm font-medium text-right">
              — {lang === 'en' && verse.reference_en ? verse.reference_en : verse.reference_id}
            </p>
          </motion.div>
        )}

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <Link
            to="/about"
            className="px-8 py-3.5 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50 hover:scale-105 text-sm"
          >
            {t('hero.knowUs')}
          </Link>
          <Link
            to="/activity"
            className="px-8 py-3.5 border border-white/30 hover:border-white/60 text-white hover:bg-white/10 font-semibold rounded-full transition-all duration-300 text-sm"
          >
            {t('hero.activities')}
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-xs tracking-widest uppercase">{t('hero.scroll')}</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <FiChevronDown className="text-white/40" size={20} />
        </motion.div>
      </motion.div>
    </section>
  )
}
