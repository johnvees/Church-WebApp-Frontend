import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiMapPin, FiPhone, FiMail, FiYoutube, FiInstagram, FiFacebook, FiEye, FiCompass, FiClock } from 'react-icons/fi'
import Layout from '../components/layout/Layout'
import SectionReveal from '../components/ui/SectionReveal'
import api from '../utils/api'

export default function AboutPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [about, setAbout] = useState(null)

  useEffect(() => {
    api.get('/about').then(({ data }) => { if (data.success) setAbout(data.data) }).catch(() => {})
  }, [])

  const churchName = lang === 'en' && about?.churchName_en ? about.churchName_en : (about?.churchName_id || t('common.churchCopyright'))
  const tagline = lang === 'en' && about?.tagline_en ? about.tagline_en : (about?.tagline_id || '')
  const vision = lang === 'en' && about?.vision_en ? about.vision_en : (about?.vision_id || '')
  const mission = lang === 'en' ? (about?.mission_en || []) : (about?.mission_id || [])
  const history = lang === 'en' && about?.history_en ? about.history_en : (about?.history_id || '')
  const schedule = lang === 'en' && about?.serviceSchedule_en ? about.serviceSchedule_en : (about?.serviceSchedule_id || t('footer.serviceScheduleValue'))

  return (
    <Layout>
      {/* Hero */}
      <div className="bg-navy-700 pt-28 pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }} />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative">
          {about?.logoUrl ? (
            <img src={about.logoUrl} alt="Logo" className="w-20 h-20 mx-auto mb-6 rounded-full border-4 border-gold-400 object-cover shadow-xl" />
          ) : (
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-xl border-4 border-gold-300">
              <span className="font-serif text-3xl text-white font-bold">E</span>
            </div>
          )}
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-3">{churchName}</h1>
          {tagline && <p className="text-gold-300 text-lg font-light">{tagline}</p>}
          <div className="gold-divider mx-auto mt-5" />
        </motion.div>
      </div>

      {/* Vision & Mission */}
      <section className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Vision */}
            <SectionReveal direction="left">
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full">
                <div className="w-12 h-12 bg-gold-100 rounded-2xl flex items-center justify-center mb-5">
                  <FiEye className="text-gold-600" size={22} />
                </div>
                <h2 className="font-serif text-2xl font-bold text-navy-700 mb-4">{t('about.vision')}</h2>
                <div className="w-10 h-0.5 bg-gold-400 mb-4" />
                <p className="text-gray-600 leading-relaxed">{vision || t('aboutPage.visionPlaceholder')}</p>
              </div>
            </SectionReveal>

            {/* Mission */}
            <SectionReveal direction="right" delay={0.1}>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full">
                <div className="w-12 h-12 bg-navy-100 rounded-2xl flex items-center justify-center mb-5">
                  <FiCompass className="text-navy-600" size={22} />
                </div>
                <h2 className="font-serif text-2xl font-bold text-navy-700 mb-4">{t('about.mission')}</h2>
                <div className="w-10 h-0.5 bg-navy-400 mb-4" />
                {mission.length > 0 ? (
                  <ul className="space-y-3">
                    {mission.map((m, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-600">
                        <span className="w-6 h-6 rounded-full bg-gold-100 text-gold-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                        {m}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400">{t('aboutPage.missionPlaceholder')}</p>
                )}
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>

      {/* History */}
      {history && (
        <section className="py-20 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <SectionReveal className="text-center mb-10">
              <p className="text-gold-500 text-sm font-semibold uppercase tracking-widest mb-3">{t('aboutPage.ourJourney')}</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-700">{t('about.history')}</h2>
              <div className="gold-divider mx-auto mt-4" />
            </SectionReveal>
            <SectionReveal>
              <div
                className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-navy-700 prose-a:text-gold-600 text-gray-600"
                dangerouslySetInnerHTML={{ __html: history }}
              />
            </SectionReveal>
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="py-20 bg-navy-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">{t('about.contact')}</h2>
            <div className="gold-divider mx-auto" />
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Address */}
            <SectionReveal>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/15">
                <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center mb-4">
                  <FiMapPin className="text-gold-400" size={18} />
                </div>
                <p className="text-gold-400 text-xs font-semibold uppercase tracking-widest mb-2">{t('aboutPage.addressLabel')}</p>
                <p className="text-white/80 text-sm leading-relaxed">{about?.address || t('aboutPage.addressPlaceholder')}</p>
                {about?.googleMapsUrl && (
                  <a href={about.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-gold-400 text-xs mt-3 hover:text-gold-300 transition-colors">
                    {t('aboutPage.openInMaps')}
                  </a>
                )}
              </div>
            </SectionReveal>

            {/* Contact info */}
            <SectionReveal delay={0.1}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/15">
                <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center mb-4">
                  <FiPhone className="text-gold-400" size={18} />
                </div>
                <p className="text-gold-400 text-xs font-semibold uppercase tracking-widest mb-3">{t('aboutPage.contactLabel')}</p>
                <div className="space-y-2">
                  {about?.phone && (
                    <a href={`tel:${about.phone}`} className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
                      <FiPhone size={13} className="text-gold-400" /> {about.phone}
                    </a>
                  )}
                  {about?.email && (
                    <a href={`mailto:${about.email}`} className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
                      <FiMail size={13} className="text-gold-400" /> {about.email}
                    </a>
                  )}
                </div>
              </div>
            </SectionReveal>

            {/* Schedule & Social */}
            <SectionReveal delay={0.2}>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/15">
                <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center mb-4">
                  <FiClock className="text-gold-400" size={18} />
                </div>
                <p className="text-gold-400 text-xs font-semibold uppercase tracking-widest mb-2">{t('aboutPage.serviceSchedule')}</p>
                <p className="text-white/80 text-sm mb-5">{schedule}</p>
                <p className="text-gold-400 text-xs font-semibold uppercase tracking-widest mb-3">{t('aboutPage.socialMedia')}</p>
                <div className="flex gap-3">
                  {about?.socialMedia?.youtube && (
                    <a href={about.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-gold-400 hover:text-gold-400 transition-colors">
                      <FiYoutube size={15} />
                    </a>
                  )}
                  {about?.socialMedia?.instagram && (
                    <a href={about.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-gold-400 hover:text-gold-400 transition-colors">
                      <FiInstagram size={15} />
                    </a>
                  )}
                  {about?.socialMedia?.facebook && (
                    <a href={about.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-gold-400 hover:text-gold-400 transition-colors">
                      <FiFacebook size={15} />
                    </a>
                  )}
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </section>
    </Layout>
  )
}
