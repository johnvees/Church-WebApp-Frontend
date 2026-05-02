import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiCalendar, FiEye, FiBookOpen, FiArrowRight } from 'react-icons/fi'
import Layout from '../components/layout/Layout'
import SectionReveal from '../components/ui/SectionReveal'
import api from '../utils/api'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const CATEGORY_META = {
  'berita-misi': { icon: '📰', color: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-700' },
  'sekolah-sabat': { icon: '📖', color: 'bg-emerald-50 border-emerald-200', badge: 'bg-emerald-100 text-emerald-700' },
  'pelayanan-perorangan': { icon: '🤝', color: 'bg-purple-50 border-purple-200', badge: 'bg-purple-100 text-purple-700' },
  'bacaan-persembahan': { icon: '🙏', color: 'bg-rose-50 border-rose-200', badge: 'bg-rose-100 text-rose-700' },
  'cerita-anak': { icon: '👧', color: 'bg-orange-50 border-orange-200', badge: 'bg-orange-100 text-orange-700' },
  'perpustakaan': { icon: '📚', color: 'bg-teal-50 border-teal-200', badge: 'bg-teal-100 text-teal-700' },
  'liturgi-sabat': { icon: '✝️', color: 'bg-indigo-50 border-indigo-200', badge: 'bg-indigo-100 text-indigo-700' },
}

const BACAAN_KEYS = {
  'berita-misi': 'beritaMisi', 'sekolah-sabat': 'sekolahSabat',
  'pelayanan-perorangan': 'pelayananPerorangan', 'bacaan-persembahan': 'bacaanPersembahan',
  'cerita-anak': 'ceritaAnak', 'perpustakaan': 'perpustakaan', 'liturgi-sabat': 'liturgiSabat',
}

function BacaanCard({ item, category }) {
  const lang = localStorage.getItem('lang') || 'id'
  const meta = CATEGORY_META[category] || {}
  const title = lang === 'en' && item.title_en ? item.title_en : item.title_id
  const excerpt = lang === 'en' && item.excerpt_en ? item.excerpt_en : item.excerpt_id

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
          <div className={`h-44 flex items-center justify-center text-4xl ${meta.color} border-b`}>
            {meta.icon}
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
            {item.publishedAt && (
              <span className="flex items-center gap-1">
                <FiCalendar size={11} />
                {format(new Date(item.publishedAt), 'd MMM yyyy', { locale: id })}
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
              <FiBookOpen size={12} /> Ada dokumen tersedia
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  )
}

export default function BacaanPage() {
  const { category } = useParams()
  const { t } = useTranslation()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const LIMIT = 9

  const categoryKey = BACAAN_KEYS[category] || 'beritaMisi'
  const meta = CATEGORY_META[category] || {}

  useEffect(() => {
    setLoading(true)
    setPage(1)
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
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-5xl block mb-4">
            {meta.icon}
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
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-64 animate-pulse" />
              ))}
            </div>
          ) : items.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, i) => (
                  <SectionReveal key={item._id} delay={i * 0.05}>
                    <BacaanCard item={item} category={category} />
                  </SectionReveal>
                ))}
              </div>
              {items.length < total && (
                <div className="text-center mt-10">
                  <button
                    onClick={loadMore}
                    className="px-8 py-3 border-2 border-navy-700 text-navy-700 hover:bg-navy-700 hover:text-white rounded-full font-semibold text-sm transition-all"
                  >
                    Muat Lebih Banyak
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24">
              <span className="text-6xl block mb-4">{meta.icon}</span>
              <p className="font-serif text-2xl text-gray-400 mb-2">Belum ada konten</p>
              <p className="text-gray-400 text-sm">Konten akan segera hadir</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
