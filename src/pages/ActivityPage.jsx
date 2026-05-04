import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiCalendar, FiEye, FiX } from 'react-icons/fi'
import Layout from '../components/layout/Layout'
import SectionReveal from '../components/ui/SectionReveal'
import api from '../utils/api'
import { format } from 'date-fns'
import { id as idLocale, enUS } from 'date-fns/locale'

function Lightbox({ photo, onClose }) {
  const lang = localStorage.getItem('lang') || 'id'
  const caption = lang === 'en' && photo.caption_en ? photo.caption_en : photo.caption_id

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.85 }}
          className="relative max-w-4xl max-h-[85vh] w-full"
          onClick={e => e.stopPropagation()}
        >
          <img src={photo.url} alt="" className="w-full h-full object-contain rounded-xl" />
          <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
            <FiX size={18} />
          </button>
          {caption && <p className="text-white/80 text-center text-sm mt-3">{caption}</p>}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function ActivityPage() {
  const { t } = useTranslation()
  const lang = localStorage.getItem('lang') || 'id'
  const [tab, setTab] = useState('artikel')
  const [articles, setArticles] = useState([])
  const [galleries, setGalleries] = useState([])
  const [activeGallery, setActiveGallery] = useState(null)
  const [lightbox, setLightbox] = useState(null)
  const [loading, setLoading] = useState(true)
  const dateLocale = lang === 'en' ? enUS : idLocale

  const tabs = [
    { key: 'artikel', label: t('activity.articles') },
    { key: 'galeri', label: t('activity.galleryTab') },
  ]

  useEffect(() => {
    Promise.all([
      api.get('/articles?limit=12'),
      api.get('/gallery?limit=12'),
    ]).then(([artRes, galRes]) => {
      if (artRes.data.success) setArticles(artRes.data.data)
      if (galRes.data.success) setGalleries(galRes.data.data)
    }).finally(() => setLoading(false))
  }, [])

  const openGallery = async (gallery) => {
    const { data } = await api.get(`/gallery/${gallery._id}`)
    if (data.success) setActiveGallery(data.data)
  }

  return (
    <Layout>
      {lightbox && <Lightbox photo={lightbox} onClose={() => setLightbox(null)} />}

      {/* Album modal */}
      <AnimatePresence>
        {activeGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-40 flex items-end sm:items-center justify-center p-4"
            onClick={() => setActiveGallery(null)}
          >
            <motion.div
              initial={{ y: 60 }}
              animate={{ y: 0 }}
              exit={{ y: 60 }}
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[80vh] overflow-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b flex items-center justify-between">
                <h3 className="font-serif text-xl font-semibold text-navy-700">{lang === 'en' && activeGallery.title_en ? activeGallery.title_en : activeGallery.title_id}</h3>
                <button onClick={() => setActiveGallery(null)} className="w-8 h-8 rounded-full border flex items-center justify-center text-gray-400 hover:bg-gray-100">
                  <FiX size={16} />
                </button>
              </div>
              <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {activeGallery.photos?.map((photo, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="aspect-square rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => setLightbox(photo)}
                  >
                    <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-navy-700 pt-28 pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }} />
        <div className="relative">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            {t('nav.activity')}
          </motion.h1>
          <div className="gold-divider mx-auto" />

          {/* Tabs */}
          <div className="flex justify-center gap-2 mt-6">
            {tabs.map(tabItem => (
              <button
                key={tabItem.key}
                onClick={() => setTab(tabItem.key)}
                className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all ${
                  tab === tabItem.key ? 'bg-gold-500 text-white shadow-lg' : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {tabItem.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="py-16 bg-white min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />)}
            </div>
          ) : tab === 'artikel' ? (
            articles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, i) => (
                  <SectionReveal key={article._id} delay={i * 0.07}>
                    <Link to={`/activity/artikel/${article.slug}`}>
                      <motion.div whileHover={{ y: -4 }} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all h-full">
                        {article.coverImage ? (
                          <div className="h-48 overflow-hidden">
                            <img src={article.coverImage} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                          </div>
                        ) : (
                          <div className="h-48 bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center">
                            <span className="font-serif text-4xl text-gold-400">E</span>
                          </div>
                        )}
                        <div className="p-5">
                          <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                            <span className="flex items-center gap-1"><FiCalendar size={11} />{article.publishedAt ? format(new Date(article.publishedAt), 'd MMM yyyy', { locale: dateLocale }) : ''}</span>
                            <span className="flex items-center gap-1"><FiEye size={11} /> {article.views}</span>
                          </div>
                          <h3 className="font-serif font-semibold text-navy-700 leading-snug mb-2 hover:text-gold-600 transition-colors line-clamp-2">
                            {lang === 'en' && article.title_en ? article.title_en : article.title_id}
                          </h3>
                        </div>
                      </motion.div>
                    </Link>
                  </SectionReveal>
                ))}
              </div>
            ) : <p className="text-center text-gray-400 py-20 font-serif text-xl">{t('activity.noArticles')}</p>
          ) : (
            galleries.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleries.map((gallery, i) => (
                  <SectionReveal key={gallery._id} delay={i * 0.07}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      onClick={() => openGallery(gallery)}
                      className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="h-52 overflow-hidden relative">
                        {gallery.coverImage ? (
                          <img src={gallery.coverImage} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-navy-700 to-navy-900 flex items-center justify-center">
                            <span className="font-serif text-4xl text-gold-400">📷</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-serif font-semibold text-navy-700">{lang === 'en' && gallery.title_en ? gallery.title_en : gallery.title_id}</h3>
                        {gallery.eventDate && (
                          <p className="text-gray-400 text-xs mt-1 flex items-center gap-1">
                            <FiCalendar size={11} /> {format(new Date(gallery.eventDate), 'd MMMM yyyy', { locale: dateLocale })}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  </SectionReveal>
                ))}
              </div>
            ) : <p className="text-center text-gray-400 py-20 font-serif text-xl">{t('activity.noGallery')}</p>
          )}
        </div>
      </section>
    </Layout>
  )
}
