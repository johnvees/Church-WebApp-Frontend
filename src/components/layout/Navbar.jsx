import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiMenu, FiX, FiGlobe } from 'react-icons/fi'
import i18n from '../../i18n'

const BACAAN_ITEMS = [
  { key: 'beritaMisi', path: '/bacaan/berita-misi' },
  { key: 'sekolahSabat', path: '/bacaan/sekolah-sabat' },
  { key: 'pelayananPerorangan', path: '/bacaan/pelayanan-perorangan' },
  { key: 'bacaanPersembahan', path: '/bacaan/bacaan-persembahan' },
  { key: 'ceritaAnak', path: '/bacaan/cerita-anak' },
  { key: 'perpustakaan', path: '/bacaan/perpustakaan' },
  { key: 'liturgiSabat', path: '/bacaan/liturgi-sabat' },
]

export default function Navbar() {
  const { t } = useTranslation()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [bacaanOpen, setBacaanOpen] = useState(false)
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'id')

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleLang = () => {
    const newLang = lang === 'id' ? 'en' : 'id'
    setLang(newLang)
    i18n.changeLanguage(newLang)
    localStorage.setItem('lang', newLang)
  }

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-navy-700/5'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center shadow-md"
            >
              <span className="text-white font-serif font-bold text-sm">E</span>
            </motion.div>
            <div>
              <p className={`font-serif font-bold text-lg leading-none transition-colors ${scrolled ? 'text-navy-700' : 'text-white'}`}>
                Ekklesia
              </p>
              <p className={`text-xs leading-none transition-colors ${scrolled ? 'text-gold-500' : 'text-gold-300'}`}>
                {t('common.churchAbbr')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {[
              { label: t('nav.home'), path: '/' },
              { label: t('nav.struktur'), path: '/struktur' },
              { label: t('nav.activity'), path: '/activity' },
              { label: t('nav.about'), path: '/about' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-gold-500 text-white'
                    : scrolled
                    ? 'text-navy-700 hover:bg-navy-50'
                    : 'text-white hover:bg-white/15'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Bacaan dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setBacaanOpen(true)}
              onMouseLeave={() => setBacaanOpen(false)}
            >
              <button
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                  isActive('/bacaan')
                    ? 'bg-gold-500 text-white'
                    : scrolled
                    ? 'text-navy-700 hover:bg-navy-50'
                    : 'text-white hover:bg-white/15'
                }`}
              >
                {t('nav.bacaan')}
                <motion.span
                  animate={{ rotate: bacaanOpen ? 180 : 0 }}
                  className="text-xs"
                >▾</motion.span>
              </button>

              <AnimatePresence>
                {bacaanOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl shadow-navy-700/10 border border-gray-100 overflow-hidden"
                  >
                    {BACAAN_ITEMS.map((item, i) => (
                      <motion.div
                        key={item.key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Link
                          to={item.path}
                          className="block px-4 py-3 text-sm text-navy-700 hover:bg-cream hover:text-gold-600 transition-colors border-b border-gray-50 last:border-0 font-medium"
                        >
                          {t(`bacaan.${item.key}`)}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleLang}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                scrolled
                  ? 'border-navy-100 text-navy-700 hover:border-gold-400 hover:text-gold-600'
                  : 'border-white/30 text-white hover:border-white hover:bg-white/10'
              }`}
            >
              <FiGlobe size={13} />
              {lang.toUpperCase()}
            </motion.button>

            {/* Mobile menu */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen
                ? <FiX size={22} className={scrolled ? 'text-navy-700' : 'text-white'} />
                : <FiMenu size={22} className={scrolled ? 'text-navy-700' : 'text-white'} />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {[
                { label: t('nav.home'), path: '/' },
                { label: t('nav.struktur'), path: '/struktur' },
                { label: t('nav.activity'), path: '/activity' },
                { label: t('nav.about'), path: '/about' },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                    isActive(item.path) ? 'bg-gold-500 text-white' : 'text-navy-700 hover:bg-navy-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <div className="pt-1">
                <p className="px-4 py-1 text-xs text-gray-400 font-semibold uppercase tracking-wider">{t('nav.bacaan')}</p>
                {BACAAN_ITEMS.map((item) => (
                  <Link
                    key={item.key}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2.5 rounded-xl text-sm text-navy-600 hover:bg-navy-50 pl-8"
                  >
                    {t(`bacaan.${item.key}`)}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
