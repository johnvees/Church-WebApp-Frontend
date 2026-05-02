import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useInView } from 'react-intersection-observer'
import { FiArrowRight, FiCalendar, FiEye } from 'react-icons/fi'
import Layout from '../components/layout/Layout'
import HeroSection from '../components/sections/HeroSection'
import SectionReveal from '../components/ui/SectionReveal'
import api from '../utils/api'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const BACAAN_CARDS = [
  { key: 'beritaMisi', path: '/bacaan/berita-misi', icon: '📰', color: 'from-blue-500 to-blue-700' },
  { key: 'sekolahSabat', path: '/bacaan/sekolah-sabat', icon: '📖', color: 'from-emerald-500 to-emerald-700' },
  { key: 'pelayananPerorangan', path: '/bacaan/pelayanan-perorangan', icon: '🤝', color: 'from-purple-500 to-purple-700' },
  { key: 'bacaanPersembahan', path: '/bacaan/bacaan-persembahan', icon: '🙏', color: 'from-rose-500 to-rose-700' },
  { key: 'ceritaAnak', path: '/bacaan/cerita-anak', icon: '👧', color: 'from-orange-400 to-orange-600' },
  { key: 'perpustakaan', path: '/bacaan/perpustakaan', icon: '📚', color: 'from-teal-500 to-teal-700' },
  { key: 'liturgiSabat', path: '/bacaan/liturgi-sabat', icon: '✝️', color: 'from-indigo-500 to-indigo-700' },
]

function ArticleCard({ article }) {
  const lang = localStorage.getItem('lang') || 'id'
  const title = lang === 'en' && article.title_en ? article.title_en : article.title_id
  const excerpt = lang === 'en' && article.excerpt_en ? article.excerpt_en : article.excerpt_id

  return (
    <Link to={`/activity/artikel/${article.slug}`} className="group block">
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full"
      >
        {article.coverImage ? (
          <div className="h-48 overflow-hidden">
            <img src={article.coverImage} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center">
            <span className="font-serif text-4xl text-gold-400">E</span>
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
            <span className="flex items-center gap-1">
              <FiCalendar size={11} />
              {article.publishedAt ? format(new Date(article.publishedAt), 'd MMM yyyy', { locale: id }) : ''}
            </span>
            <span className="flex items-center gap-1">
              <FiEye size={11} /> {article.views || 0}
            </span>
          </div>
          <h3 className="font-serif font-semibold text-navy-700 text-base leading-snug mb-2 group-hover:text-gold-600 transition-colors line-clamp-2">
            {title}
          </h3>
          {excerpt && <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{excerpt}</p>}
        </div>
      </motion.div>
    </Link>
  )
}

export default function HomePage() {
  const { t } = useTranslation()
  const [articles, setArticles] = useState([])
  const [gallery, setGallery] = useState([])

  useEffect(() => {
    api.get('/articles?limit=3').then(({ data }) => {
      if (data.success) setArticles(data.data)
    }).catch(() => {})
    api.get('/gallery?limit=4').then(({ data }) => {
      if (data.success) setGallery(data.data)
    }).catch(() => {})
  }, [])

  return (
    <Layout>
      <HeroSection />

      {/* Bacaan Categories */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal className="text-center mb-12">
            <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-3">Sumber Kerohanian</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-navy-700 font-bold">{t('nav.bacaan')}</h2>
            <div className="gold-divider mx-auto mt-4" />
          </SectionReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {BACAAN_CARDS.map((item, i) => (
              <SectionReveal key={item.key} delay={i * 0.07}>
                <Link to={item.path} className="group block">
                  <motion.div
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300 cursor-pointer h-full"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-md`}>
                      <span className="text-xl">{item.icon}</span>
                    </div>
                    <p className="text-navy-700 font-medium text-sm leading-snug group-hover:text-gold-600 transition-colors">
                      {t(`bacaan.${item.key}`)}
                    </p>
                  </motion.div>
                </Link>
              </SectionReveal>
            ))}

            {/* View all */}
            <SectionReveal delay={0.6}>
              <Link to="/bacaan/berita-misi" className="group block h-full">
                <motion.div
                  whileHover={{ scale: 1.04, y: -4 }}
                  className="rounded-2xl p-5 text-center border-2 border-dashed border-gold-300 hover:border-gold-500 flex flex-col items-center justify-center min-h-[120px] transition-all duration-300"
                >
                  <FiArrowRight className="text-gold-400 group-hover:text-gold-600 mb-2 transition-colors" size={22} />
                  <p className="text-gold-500 font-medium text-sm">{t('home.viewAll')}</p>
                </motion.div>
              </Link>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* Service schedule banner */}
      <section className="py-16 bg-navy-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }} />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <SectionReveal>
            <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-3">{t('home.serviceTime')}</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-bold mb-2">Setiap Hari Sabtu</h2>
            <p className="text-white/70 text-xl font-light">09.00 – 12.00 WIB</p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-full font-semibold text-sm transition-all hover:scale-105"
            >
              Lihat Lokasi <FiArrowRight size={15} />
            </Link>
          </SectionReveal>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal className="flex items-end justify-between mb-10">
            <div>
              <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-2">Blog</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-navy-700 font-bold">{t('home.latestArticles')}</h2>
            </div>
            <Link to="/activity" className="flex items-center gap-2 text-sm text-gold-600 hover:text-gold-700 font-semibold transition-colors">
              {t('home.viewAll')} <FiArrowRight size={14} />
            </Link>
          </SectionReveal>

          {articles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, i) => (
                <SectionReveal key={article._id} delay={i * 0.1}>
                  <ArticleCard article={article} />
                </SectionReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <p className="font-serif text-2xl mb-2">Belum ada artikel</p>
              <p className="text-sm">Artikel akan muncul di sini setelah dipublikasikan</p>
            </div>
          )}
        </div>
      </section>

      {/* Gallery preview */}
      {gallery.length > 0 && (
        <section className="py-20 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionReveal className="text-center mb-10">
              <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-2">Momen Bersama</p>
              <h2 className="font-serif text-3xl sm:text-4xl text-navy-700 font-bold">{t('home.gallery')}</h2>
              <div className="gold-divider mx-auto mt-4" />
            </SectionReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {gallery.map((item, i) => (
                <SectionReveal key={item._id} delay={i * 0.08}>
                  <Link to="/activity#gallery">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="relative aspect-square rounded-2xl overflow-hidden bg-navy-800"
                    >
                      {item.coverImage ? (
                        <img src={item.coverImage} alt={item.title_id} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-700 to-navy-900">
                          <span className="font-serif text-4xl text-gold-400">E</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-3">
                        <p className="text-white text-xs font-medium truncate">{item.title_id}</p>
                      </div>
                    </motion.div>
                  </Link>
                </SectionReveal>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                to="/activity"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-navy-700 text-navy-700 hover:bg-navy-700 hover:text-white rounded-full font-semibold text-sm transition-all"
              >
                {t('home.viewAll')} Galeri <FiArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}
    </Layout>
  )
}
