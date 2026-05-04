import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiCalendar, FiEye, FiBookOpen, FiArrowRight, FiGlobe, FiUsers, FiHeart, FiStar, FiBook, FiSun, FiSearch, FiX } from 'react-icons/fi'
import Layout from '../components/layout/Layout'
import SectionReveal from '../components/ui/SectionReveal'
import api from '../utils/api'
import { format } from 'date-fns'
import { id as idLocale, enUS } from 'date-fns/locale'

const CATEGORY_META = {
  'berita-misi': { Icon: FiGlobe, color: 'bg-cream border-gold-200', badge: 'bg-navy-50 text-navy-700' },
  'sekolah-sabat': { Icon: FiBookOpen, color: 'bg-cream border-gold-200', badge: 'bg-navy-50 text-navy-700' },
  'pelayanan-perorangan': { Icon: FiUsers, color: 'bg-cream border-gold-200', badge: 'bg-navy-50 text-navy-700' },
  'bacaan-persembahan': { Icon: FiHeart, color: 'bg-cream border-gold-200', badge: 'bg-navy-50 text-navy-700' },
  'cerita-anak': { Icon: FiStar, color: 'bg-cream border-gold-200', badge: 'bg-navy-50 text-navy-700' },
  'perpustakaan': { Icon: FiBook, color: 'bg-cream border-gold-200', badge: 'bg-navy-50 text-navy-700' },
  'liturgi-sabat': { Icon: FiSun, color: 'bg-cream border-gold-200', badge: 'bg-navy-50 text-navy-700' },
}

const BACAAN_KEYS = {
  'berita-misi': 'beritaMisi', 'sekolah-sabat': 'sekolahSabat',
  'pelayanan-perorangan': 'pelayananPerorangan', 'bacaan-persembahan': 'bacaanPersembahan',
  'cerita-anak': 'ceritaAnak', 'perpustakaan': 'perpustakaan', 'liturgi-sabat': 'liturgiSabat',
}

function BacaanCard({ item, category }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const meta = CATEGORY_META[category] || {}
  const title = lang === 'en' && item.title_en ? item.title_en : item.title_id
  const excerpt = lang === 'en' && item.excerpt_en ? item.excerpt_en : item.excerpt_id
  const dateLocale = lang === 'en' ? enUS : idLocale

  return (
    <Link to={`/bacaan/${category}/${item.slug}`}>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 h-full"
      >
        {item.coverImage ? (
          <div className="h-44 overflow-hidden">
            <img src={item.coverImage} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        ) : (
          <div className={`h-44 flex items-center justify-center ${meta.color} border-b`}>
            {meta.Icon && <meta.Icon size={40} className="text-navy-700 opacity-40" />}
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            {item.publishedAt && (
              <span className="flex items-center gap-1">
                <FiCalendar size={11} />
                {format(new Date(item.publishedAt), 'd MMM yyyy', { locale: dateLocale })}
              </span>
            )}
            <span className="flex items-center gap-1">
              <FiEye size={11} /> {item.views || 0}
            </span>
          </div>
          <h3 className="font-serif font-semibold text-navy-700 leading-snug mb-2 hover:text-gold-600 transition-colors line-clamp-2">
            {title}
          </h3>
          {excerpt && <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{excerpt}</p>}
          {item.fileUrl && (
            <div className="mt-3 flex items-center gap-1.5 text-gold-600 text-xs font-semibold">
              <FiBookOpen size={12} /> {t('bacaanPage.documentAvailable')}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  )
}

export default function BacaanPage() {
  const { category } = useParams()
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const LIMIT = 9

  const categoryKey = BACAAN_KEYS[category] || 'beritaMisi'
  const meta = CATEGORY_META[category] || {}

  useEffect(() => {
    setLoading(true)
    setPage(1)
    setSearch('')
    api.get(`/bacaan?category=${category}&page=1&limit=${LIMIT}`)
      .then(({ data }) => {
        if (data.success) {
          setItems(data.data)
          setTotal(data.total)
        }
      })
      .finally(() => setLoading(false))
  }, [category])

  const loadMore = async () => {
    const nextPage = page + 1
    const { data } = await api.get(`/bacaan?category=${category}&page=${nextPage}&limit=${LIMIT}`)
    if (data.success) {
      setItems(prev => [...prev, ...data.data])
      setPage(nextPage)
    }
  }

  return (
    <Layout>
      {/* Header */}
      <div className="bg-navy-700 pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }} />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex justify-center mb-4">
            {meta.Icon && <meta.Icon size={48} className="text-gold-400" />}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl sm:text-5xl font-bold text-white mb-3"
          >
            {t(`bacaan.${categoryKey}`)}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="gold-divider mx-auto"
          />
        </div>
      </div>

      {/* Submenu sidebar nav */}
      <div className="bg-cream border-b border-gray-200 sticky top-16 lg:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 flex overflow-x-auto gap-1 py-2 scrollbar-hide">
          {Object.entries(BACAAN_KEYS).map(([path, key]) => (
            <Link
              key={path}
              to={`/bacaan/${path}`}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                category === path
                  ? 'bg-navy-700 text-white'
                  : 'text-navy-600 hover:bg-navy-100'
              }`}
            >
              {t(`bacaan.${key}`)}
            </Link>
          ))}
        </div>
      </div>

      {/* Content */}
      <section className="py-16 bg-white min-h-[50vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="mb-8 max-w-sm">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`${t('common.search')}...`}
                className="w-full pl-9 pr-9 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-100 transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  <FiX size={14} />
                </button>
              )}
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
              ))}
            </div>
          ) : items.length > 0 ? (
            (() => {
              const filtered = search
                ? items.filter(item => {
                    const title = lang === 'en' && item.title_en ? item.title_en : item.title_id
                    return title.toLowerCase().includes(search.toLowerCase())
                  })
                : items
              return (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.length > 0 ? filtered.map((item, i) => (
                      <SectionReveal key={item._id} delay={i * 0.05}>
                        <BacaanCard item={item} category={category} />
                      </SectionReveal>
                    )) : (
                      <div className="col-span-3 text-center py-16 text-gray-400 font-serif">{t('bacaanPage.noContent')}</div>
                    )}
                  </div>
                  {!search && items.length < total && (
                    <div className="text-center mt-10">
                      <button
                        onClick={loadMore}
                        className="px-8 py-3 border-2 border-navy-700 text-navy-700 hover:bg-navy-700 hover:text-white rounded-full font-semibold text-sm transition-all"
                      >
                        {t('bacaanPage.loadMore')}
                      </button>
                    </div>
                  )}
                </>
              )
            })()
          ) : (
            <div className="text-center py-24">
              <span className="flex justify-center mb-4">{meta.Icon && <meta.Icon size={56} className="text-gray-300" />}</span>
              <p className="font-serif text-2xl text-gray-400 mb-2">{t('bacaanPage.noContent')}</p>
              <p className="text-gray-400 text-sm">{t('bacaanPage.contentComingSoon')}</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
