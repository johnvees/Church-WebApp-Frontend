import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiCalendar, FiEye, FiImage } from 'react-icons/fi'
import Layout from '../components/layout/Layout'
import SectionReveal from '../components/ui/SectionReveal'
import api from '../utils/api'
import { format } from 'date-fns'
import { id as idLocale, enUS } from 'date-fns/locale'

function AlbumCollage({ photos, coverImage }) {
  const imgs = photos?.length ? photos : (coverImage ? [{ url: coverImage }] : [])

  if (imgs.length === 0) {
    return (
      <div className="w-full h-full bg-navy-800 flex items-center justify-center">
        <FiImage size={32} className="text-white/20" />
      </div>
    )
  }

  if (imgs.length === 1) {
    return <img src={imgs[0].url} alt="" className="w-full h-full object-cover" />
  }

  if (imgs.length === 2) {
    return (
      <div className="grid grid-cols-2 h-full gap-px">
        {imgs.slice(0, 2).map((p, i) => (
          <img key={i} src={p.url} alt="" className="w-full h-full object-cover" />
        ))}
      </div>
    )
  }

  if (imgs.length === 3) {
    return (
      <div className="grid grid-cols-2 h-full gap-px">
        <img src={imgs[0].url} alt="" className="w-full h-full object-cover" />
        <div className="grid grid-rows-2 gap-px">
          <img src={imgs[1].url} alt="" className="w-full h-full object-cover" />
          <img src={imgs[2].url} alt="" className="w-full h-full object-cover" />
        </div>
      </div>
    )
  }

  // 4+: 2×2 grid
  return (
    <div className="grid grid-cols-2 grid-rows-2 h-full gap-px">
      {imgs.slice(0, 4).map((p, i) => (
        <img key={i} src={p.url} alt="" className="w-full h-full object-cover" />
      ))}
    </div>
  )
}

const LIMIT = 12

export default function ActivityPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [tab, setTab] = useState('artikel')
  const [articles, setArticles] = useState([])
  const [galleries, setGalleries] = useState([])
  const [loading, setLoading] = useState(true)
  const [artTotal, setArtTotal] = useState(0)
  const [galTotal, setGalTotal] = useState(0)
  const [artPage, setArtPage] = useState(1)
  const [galPage, setGalPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const dateLocale = lang === 'en' ? enUS : idLocale

  const tabs = [
    { key: 'artikel', label: t('activity.articles') },
    { key: 'galeri', label: t('activity.galleryTab') },
  ]

  useEffect(() => {
    Promise.all([
      api.get(`/articles?limit=${LIMIT}`),
      api.get(`/gallery?limit=${LIMIT}`),
    ]).then(([artRes, galRes]) => {
      if (artRes.data.success) { setArticles(artRes.data.data); setArtTotal(artRes.data.total || 0) }
      if (galRes.data.success) { setGalleries(galRes.data.data); setGalTotal(galRes.data.total || 0) }
    }).finally(() => setLoading(false))
  }, [])

  const loadMoreArticles = async () => {
    setLoadingMore(true)
    const next = artPage + 1
    const { data } = await api.get(`/articles?limit=${LIMIT}&page=${next}`)
    if (data.success) { setArticles(prev => [...prev, ...data.data]); setArtPage(next) }
    setLoadingMore(false)
  }

  const loadMoreGalleries = async () => {
    setLoadingMore(true)
    const next = galPage + 1
    const { data } = await api.get(`/gallery?limit=${LIMIT}&page=${next}`)
    if (data.success) { setGalleries(prev => [...prev, ...data.data]); setGalPage(next) }
    setLoadingMore(false)
  }

  return (
    <Layout>
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
              <>
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
              {articles.length < artTotal && (
                <div className="text-center mt-10">
                  <button onClick={loadMoreArticles} disabled={loadingMore}
                    className="px-8 py-3 border-2 border-navy-700 text-navy-700 hover:bg-navy-700 hover:text-white rounded-full font-semibold text-sm transition-all disabled:opacity-50">
                    {loadingMore ? t('common.loading') : t('bacaanPage.loadMore')}
                  </button>
                </div>
              )}
              </>
            ) : <p className="text-center text-gray-400 py-20 font-serif text-xl">{t('activity.noArticles')}</p>
          ) : (
            galleries.length > 0 ? (
              <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {galleries.map((gallery, i) => {
                  const title = lang === 'en' && gallery.title_en ? gallery.title_en : gallery.title_id
                  return (
                    <SectionReveal key={gallery._id} delay={i * 0.07}>
                      <Link to={`/activity/galeri/${gallery._id}`}>
                        <motion.div
                          whileHover={{ y: -4 }}
                          className="group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-navy-800"
                        >
                          {/* Photo collage */}
                          <div className="aspect-[4/3] overflow-hidden relative">
                            <div className="w-full h-full group-hover:scale-[1.02] transition-transform duration-500">
                              <AlbumCollage photos={gallery.photos} coverImage={gallery.coverImage} />
                            </div>
                            {/* Dark gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                            {/* Photo count badge */}
                            {gallery.photos?.length > 0 && (
                              <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                                <FiImage size={11} /> {gallery.photos.length}
                              </div>
                            )}
                          </div>

                          {/* Info row */}
                          <div className="bg-white px-4 py-3.5 border-t border-gray-100">
                            <h3 className="font-serif font-semibold text-navy-700 leading-snug line-clamp-1 group-hover:text-gold-600 transition-colors">
                              {title}
                            </h3>
                            {gallery.eventDate && (
                              <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
                                <FiCalendar size={11} />
                                {format(new Date(gallery.eventDate), 'd MMMM yyyy', { locale: dateLocale })}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      </Link>
                    </SectionReveal>
                  )
                })}
              </div>
              {galleries.length < galTotal && (
                <div className="text-center mt-10">
                  <button onClick={loadMoreGalleries} disabled={loadingMore}
                    className="px-8 py-3 border-2 border-navy-700 text-navy-700 hover:bg-navy-700 hover:text-white rounded-full font-semibold text-sm transition-all disabled:opacity-50">
                    {loadingMore ? t('common.loading') : t('bacaanPage.loadMore')}
                  </button>
                </div>
              )}
              </>
            ) : <p className="text-center text-gray-400 py-20 font-serif text-xl">{t('activity.noGallery')}</p>
          )}
        </div>
      </section>
    </Layout>
  )
}
