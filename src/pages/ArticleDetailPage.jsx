import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiArrowLeft, FiCalendar, FiEye, FiUser } from 'react-icons/fi'
import Layout from '../components/layout/Layout'
import api from '../utils/api'
import { format } from 'date-fns'
import { id as idLocale, enUS } from 'date-fns/locale'

export default function ArticleDetailPage() {
  const { slug } = useParams()
  const { t } = useTranslation()
  const lang = localStorage.getItem('lang') || 'id'
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const dateLocale = lang === 'en' ? enUS : idLocale

  useEffect(() => {
    api.get(`/articles/${slug}`)
      .then(({ data }) => { if (data.success) setArticle(data.data) })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-gold-400 border-t-transparent animate-spin" />
      </div>
    </Layout>
  )

  if (!article) return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <p className="font-serif text-3xl text-gray-300 mb-4">{t('articleDetail.notFound')}</p>
          <Link to="/activity" className="text-gold-600 hover:underline">← {t('articleDetail.backToActivity')}</Link>
        </div>
      </div>
    </Layout>
  )

  const title = lang === 'en' && article.title_en ? article.title_en : article.title_id
  const content = lang === 'en' && article.content_en ? article.content_en : article.content_id

  return (
    <Layout>
      {/* Cover image */}
      {article.coverImage && (
        <div className="relative h-[50vh] overflow-hidden">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2 }}
            src={article.coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 max-w-3xl mx-auto">
            <Link to="/activity" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors">
              <FiArrowLeft size={14} /> {t('nav.activity')}
            </Link>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">{title}</h1>
          </div>
        </div>
      )}

      <article className={`py-12 bg-white ${!article.coverImage ? 'pt-28' : ''}`}>
        <div className="max-w-3xl mx-auto px-4">
          {!article.coverImage && (
            <>
              <Link to="/activity" className="inline-flex items-center gap-2 text-gray-400 hover:text-gold-600 text-sm mb-6 transition-colors">
                <FiArrowLeft size={14} /> {t('nav.activity')}
              </Link>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-serif text-3xl sm:text-4xl font-bold text-navy-700 leading-tight mb-6"
              >
                {title}
              </motion.h1>
            </>
          )}

          {/* Meta */}
          <div className={`flex flex-wrap items-center gap-4 text-sm text-gray-400 border-b border-gray-100 pb-6 mb-8 ${article.coverImage ? 'mt-0' : ''}`}>
            {article.author?.name && (
              <span className="flex items-center gap-1.5">
                <FiUser size={13} className="text-gold-500" /> {article.author.name}
              </span>
            )}
            {article.publishedAt && (
              <span className="flex items-center gap-1.5">
                <FiCalendar size={13} className="text-gold-500" />
                {format(new Date(article.publishedAt), 'd MMMM yyyy', { locale: dateLocale })}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <FiEye size={13} className="text-gold-500" /> {article.views} {t('articleDetail.timesRead')}
            </span>
          </div>

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-navy-50 text-navy-600 text-xs rounded-full font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          {content ? (
            <div
              className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-navy-700 prose-a:text-gold-600 prose-blockquote:border-l-4 prose-blockquote:border-gold-400 prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className="text-gray-400 text-center py-12 font-serif text-xl">{t('articleDetail.contentNotAvailable')}</p>
          )}

          {/* Back */}
          <div className="mt-12 pt-6 border-t border-gray-100">
            <Link
              to="/activity"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-navy-200 text-navy-700 hover:bg-navy-700 hover:text-white rounded-full font-medium text-sm transition-all"
            >
              <FiArrowLeft size={14} /> {t('articleDetail.backToActivity')}
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  )
}
