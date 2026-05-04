import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiArrowLeft, FiCalendar, FiX, FiChevronLeft, FiChevronRight, FiImage } from 'react-icons/fi'
import Layout from '../components/layout/Layout'
import api from '../utils/api'
import { format } from 'date-fns'
import { id as idLocale, enUS } from 'date-fns/locale'

function Lightbox({ photos, index, onClose, onPrev, onNext }) {
  const photo = photos[index]

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, onPrev, onNext])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 z-10">
        <span className="text-white/50 text-sm font-medium tracking-wide">{index + 1} / {photos.length}</span>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        >
          <FiX size={18} />
        </button>
      </div>

      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.18 }}
        className="relative max-w-5xl max-h-[80vh] w-full px-16"
        onClick={e => e.stopPropagation()}
      >
        <img src={photo.url} alt="" className="w-full max-h-[80vh] object-contain rounded-lg" />
      </motion.div>

      <button
        onClick={e => { e.stopPropagation(); onPrev() }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
      >
        <FiChevronLeft size={22} />
      </button>
      <button
        onClick={e => { e.stopPropagation(); onNext() }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
      >
        <FiChevronRight size={22} />
      </button>
    </motion.div>
  )
}

export default function GalleryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const dateLocale = lang === 'en' ? enUS : idLocale

  const [gallery, setGallery] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    api.get(`/gallery/${id}`)
      .then(({ data }) => { if (data.success) setGallery(data.data) })
      .finally(() => setLoading(false))
  }, [id])

  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevPhoto = useCallback(() => {
    if (!gallery) return
    setLightboxIndex(i => (i - 1 + gallery.photos.length) % gallery.photos.length)
  }, [gallery])
  const nextPhoto = useCallback(() => {
    if (!gallery) return
    setLightboxIndex(i => (i + 1) % gallery.photos.length)
  }, [gallery])

  const title = gallery ? (lang === 'en' && gallery.title_en ? gallery.title_en : gallery.title_id) : ''
  const desc = gallery ? (lang === 'en' && gallery.description_en ? gallery.description_en : gallery.description_id) : ''

  return (
    <Layout>
      <AnimatePresence>
        {lightboxIndex !== null && gallery?.photos && (
          <Lightbox
            photos={gallery.photos}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevPhoto}
            onNext={nextPhoto}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-navy-700 pt-28 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/activity')}
            className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-medium mb-6 transition-colors"
          >
            <FiArrowLeft size={15} /> {t('common.back')}
          </button>

          {loading ? (
            <div className="h-8 w-64 bg-white/10 rounded animate-pulse" />
          ) : (
            <>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-3xl sm:text-4xl font-bold text-white mb-3"
              >
                {title}
              </motion.h1>
              <div className="gold-divider mb-4" />
              {gallery?.eventDate && (
                <p className="text-white/50 text-sm flex items-center gap-1.5">
                  <FiCalendar size={13} />
                  {format(new Date(gallery.eventDate), 'd MMMM yyyy', { locale: dateLocale })}
                </p>
              )}
              {desc && (
                <p className="text-white/60 text-sm mt-3 max-w-2xl font-serif leading-relaxed">{desc}</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Photos */}
      <section className="py-12 bg-white min-h-[40vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="break-inside-avoid mb-3 bg-gray-100 rounded-xl animate-pulse" style={{ height: `${180 + (i % 3) * 60}px` }} />
              ))}
            </div>
          ) : gallery?.photos?.length > 0 ? (
            <>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-6">
                {gallery.photos.length} {lang === 'en' ? 'photos' : 'foto'}
              </p>
              <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
                {gallery.photos.map((photo, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="break-inside-avoid mb-3 cursor-pointer overflow-hidden rounded-xl group"
                    onClick={() => setLightboxIndex(i)}
                  >
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={photo.url}
                        alt=""
                        className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-24 text-gray-300">
              <FiImage size={48} className="mx-auto mb-3" />
              <p className="font-serif text-lg text-gray-400">
                {lang === 'en' ? 'No photos yet' : 'Belum ada foto'}
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
