import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FiMail, FiPhone } from 'react-icons/fi'
import Layout from '../components/layout/Layout'
import SectionReveal from '../components/ui/SectionReveal'
import api from '../utils/api'

function MemberCard({ member, delay = 0 }) {
  return (
    <SectionReveal delay={delay}>
      <motion.div
        whileHover={{ y: -4 }}
        className="bg-white rounded-2xl p-5 text-center shadow-sm hover:shadow-lg border border-gray-100 transition-all duration-300"
      >
        {member.photo ? (
          <img src={member.photo} alt={member.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-4 border-cream shadow" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-navy-600 to-navy-800 flex items-center justify-center mx-auto mb-3 border-4 border-cream shadow">
            <span className="font-serif text-2xl text-gold-400">{member.name[0]}</span>
          </div>
        )}
        <h3 className="font-serif font-semibold text-navy-700 text-base">{member.name}</h3>
        <p className="text-gold-500 text-xs font-semibold mt-1 mb-1">{member.position_id}</p>
        {member.department_id && <p className="text-gray-400 text-xs mb-2">{member.department_id}</p>}
        {member.period && <p className="text-gray-300 text-xs">{member.period}</p>}
        <div className="flex justify-center gap-2 mt-3">
          {member.email && (
            <a href={`mailto:${member.email}`} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gold-400 hover:text-gold-500 transition-colors">
              <FiMail size={12} />
            </a>
          )}
          {member.phone && (
            <a href={`tel:${member.phone}`} className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-gold-400 hover:text-gold-500 transition-colors">
              <FiPhone size={12} />
            </a>
          )}
        </div>
      </motion.div>
    </SectionReveal>
  )
}

export default function StrukturPage() {
  const { t } = useTranslation()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/members').then(({ data }) => {
      if (data.success) setMembers(data.data)
    }).finally(() => setLoading(false))
  }, [])

  // Group by level
  const level1 = members.filter(m => m.level === 1)
  const level2 = members.filter(m => m.level === 2)
  const level3 = members.filter(m => m.level === 3)
  const otherLevels = members.filter(m => m.level > 3)

  return (
    <Layout>
      {/* Header */}
      <div className="bg-navy-700 pt-28 pb-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '30px 30px'
        }} />
        <div className="relative">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-3">
            Kepemimpinan Jemaat
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            {t('nav.struktur')}
          </motion.h1>
          <div className="gold-divider mx-auto" />
        </div>
      </div>

      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl h-52 animate-pulse" />
              ))}
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-serif text-3xl text-gray-300 mb-3">Belum ada data</p>
              <p className="text-gray-400 text-sm">Struktur organisasi akan ditampilkan di sini</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Level 1 - Leader */}
              {level1.length > 0 && (
                <div>
                  <SectionReveal className="text-center mb-6">
                    <span className="inline-block bg-gold-100 text-gold-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Pimpinan</span>
                  </SectionReveal>
                  <div className="flex flex-wrap justify-center gap-5 max-w-lg mx-auto">
                    {level1.map((m, i) => <MemberCard key={m._id} member={m} delay={i * 0.1} />)}
                  </div>
                </div>
              )}

              {/* Connector line */}
              {level1.length > 0 && level2.length > 0 && (
                <div className="flex justify-center">
                  <div className="w-px h-8 bg-gold-300" />
                </div>
              )}

              {/* Level 2 */}
              {level2.length > 0 && (
                <div>
                  <SectionReveal className="text-center mb-6">
                    <span className="inline-block bg-navy-100 text-navy-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Majelis</span>
                  </SectionReveal>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                    {level2.map((m, i) => <MemberCard key={m._id} member={m} delay={i * 0.07} />)}
                  </div>
                </div>
              )}

              {/* Level 3+ */}
              {level3.length > 0 && (
                <div>
                  <SectionReveal className="text-center mb-6">
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Departemen</span>
                  </SectionReveal>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {level3.map((m, i) => <MemberCard key={m._id} member={m} delay={i * 0.05} />)}
                  </div>
                </div>
              )}

              {otherLevels.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {otherLevels.map((m, i) => <MemberCard key={m._id} member={m} delay={i * 0.04} />)}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
