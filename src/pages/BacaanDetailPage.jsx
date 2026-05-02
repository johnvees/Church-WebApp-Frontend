import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiArrowLeft, FiCalendar, FiEye, FiDownload, FiExternalLink } from 'react-icons/fi'
import Layout from '../components/layout/Layout'
import api from '../utils/api'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const BACAAN_KEYS = {
  'berita-misi': 'beritaMisi', 'sekolah-sabat': 'sekolahSabat',
  'pelayanan-perorangan': 'pelayananPerorangan', 'bacaan-persembahan': 'bacaanPersembahan',
  'cerita-anak': 'ceritaAnak', 'perpustakaan': 'perpustakaan', 'liturgi-sabat': 'liturgiSabat',
}

export default function BacaanDetailPage() {
  const { category, slug } = useParams()
  const { t } = useTranslation()
  const lang = localStorage.getItem('lang') || 'id'
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/bacaan/${slug}`)
      .then(({ data }) => { if (data.success) setItem(data.data) })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-gold-400 border-t-transparent animate-spin" />
      </div>
    </Layout>
  )

  if (!item) return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="font-serif text-3xl text-gray-300 mb-4">Konten tidak ditemukan</p>
          <Link to={`/bacaan/${category}`} className="text-gold-600 hover:underline">← Kembali</Link>
        </div>
      </div>
    </Layout>
  )

  const title = lang === 'en' && item.title_en ? item.title_en : item.title_id
  const content = lang === 'en' && item.content_en ? item.content_en : item.content_id

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-navy-700 pt-28 pb-12">
        <div className="max-w-3xl mx-auto px-4">
          <Link to={`/bacaan/${category}`} className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <FiArrowLeft size={14} /> {t(`bacaan.${BACAAN_KEYS[category] || 'beritaMisi'}`)}
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight mb-4"
          >
            {title}
          </motion.h1>
          <div className="flex items-center gap-4 text-white/50 text-sm">
            {item.publishedAt && (
              <span className="flex items-center gap-1.5">
                <FiCalendar size={13} />
                {format(new Date(item.publishedAt), 'd MMMM yyyy', { locale: id })}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <FiEye size={13} /> {item.views} kali dibaca
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          {item.coverImage && (
            <motion.img
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              src={item.coverImage}
              alt={title}
              className="w-full rounded-2xl mb-10 shadow-lg"
            />
          )}

          {/* File download */}
          {item.fileUrl && (
            <a
              href={item.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 mb-8 p-4 bg-cream rounded-xl border border-gold-200 hover:border-gold-400 transition-colors group"
            >
              <div className="w-10 h-10 bg-gold-500 rounded-lg flex items-center justify-center shrink-0">
                <FiDownload className="text-white" size={18} />
              </div>
              <div>
                <p className="font-semibold text-navy-700 text-sm group-hover:text-gold-600 transition-colors">Unduh Dokumen</p>
                <p className="text-gray-400 text-xs">Klik untuk membuka atau mengunduh file</p>
              </div>
            </a>
          )}

          {/* External link */}
          {item.externalLink && (
            <a
              href={item.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 mb-8 p-4 bg-blue-50 rounded-xl border border-blue-200 hover:border-blue-400 transition-colors group"
            >
              <FiExternalLink className="text-blue-500" size={20} />
              <span className="text-blue-700 font-semibold text-sm group-hover:underline">Buka Tautan Eksternal</span>
            </a>
          )}

          {/* Article body */}
          {content ? (
            <div
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-navy-700 prose-a:text-gold-600 prose-blockquote:border-gold-400 prose-blockquote:bg-cream prose-blockquote:rounded-lg prose-blockquote:p-4"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className="text-gray-400 text-center py-12 font-serif text-xl">Konten belum tersedia.</p>
          )}
        </div>
      </article>
    </Layout>
  )
}
