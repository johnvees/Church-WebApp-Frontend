import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiBook, FiImage, FiUsers, FiFileText, FiArrowRight, FiFeather } from 'react-icons/fi'
import AdminLayout from '../../components/layout/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'

function StatCard({ icon: Icon, label, value, color, path, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link to={path}>
        <div className={`bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all group`}>
          <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={18} className="text-white" />
            </div>
            <FiArrowRight className="text-gray-300 group-hover:text-gray-500 transition-colors" size={16} />
          </div>
          <p className="text-3xl font-serif font-bold text-navy-700 mb-1">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </Link>
    </motion.div>
  )
}

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth()
  const [stats, setStats] = useState({ articles: 0, bacaan: 0, members: 0, gallery: 0 })
  const [recentArticles, setRecentArticles] = useState([])

  useEffect(() => {
    Promise.all([
      api.get('/articles/admin').catch(() => ({ data: { data: [] } })),
      api.get('/bacaan/admin').catch(() => ({ data: { data: [] } })),
      api.get('/members/all').catch(() => ({ data: { data: [] } })),
      api.get('/gallery/admin/all').catch(() => ({ data: { data: [] } })),
    ]).then(([art, bac, mem, gal]) => {
      setStats({
        articles: art.data.data?.length || 0,
        bacaan: bac.data.data?.length || 0,
        members: mem.data.data?.length || 0,
        gallery: gal.data.data?.length || 0,
      })
      setRecentArticles(art.data.data?.slice(0, 5) || [])
    })
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Selamat Pagi'
    if (h < 17) return 'Selamat Siang'
    return 'Selamat Malam'
  }

  return (
    <AdminLayout>
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <p className="text-gray-400 text-sm mb-1">{greeting()},</p>
        <h1 className="font-serif text-2xl font-bold text-navy-700">{user?.name} 👋</h1>
        <p className="text-gray-400 text-sm mt-1 capitalize">Role: {user?.role}</p>
      </motion.div>

      {/* Stats */}
      {isAdmin && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={FiFeather} label="Total Artikel" value={stats.articles} color="bg-blue-500" path="/admin/articles" delay={0.1} />
          <StatCard icon={FiBook} label="Konten Bacaan" value={stats.bacaan} color="bg-emerald-500" path="/admin/bacaan" delay={0.2} />
          <StatCard icon={FiUsers} label="Anggota Org." value={stats.members} color="bg-purple-500" path="/admin/members" delay={0.3} />
          <StatCard icon={FiImage} label="Album Galeri" value={stats.gallery} color="bg-orange-500" path="/admin/gallery" delay={0.4} />
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-serif font-semibold text-navy-700">Artikel Terbaru</h2>
            <Link to="/admin/articles/new" className="text-xs font-semibold text-gold-600 hover:text-gold-700 bg-gold-50 hover:bg-gold-100 px-3 py-1.5 rounded-full transition-all">
              + Tambah
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentArticles.length > 0 ? recentArticles.map((a, i) => (
              <Link key={a._id} to={`/admin/articles/edit/${a._id}`} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                <div className={`w-2 h-2 rounded-full shrink-0 ${a.isPublished ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-navy-700 truncate">{a.title_id}</p>
                  <p className="text-xs text-gray-400 capitalize">{a.isPublished ? 'Diterbitkan' : 'Draft'}</p>
                </div>
                <FiArrowRight className="text-gray-300 shrink-0 ml-auto" size={14} />
              </Link>
            )) : (
              <div className="p-8 text-center text-gray-400 text-sm">Belum ada artikel</div>
            )}
          </div>
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl border border-gray-100 p-5"
        >
          <h2 className="font-serif font-semibold text-navy-700 mb-4">Aksi Cepat</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Tulis Artikel', icon: FiFeather, path: '/admin/articles/new', color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
              { label: 'Upload Galeri', icon: FiImage, path: '/admin/gallery/new', color: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
              { label: 'Tambah Konten', icon: FiBook, path: '/admin/bacaan/new', color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
              { label: 'Kelola Anggota', icon: FiUsers, path: '/admin/members', color: 'bg-purple-50 text-purple-600 hover:bg-purple-100' },
            ].map((item) => (
              <Link key={item.path} to={item.path}>
                <div className={`flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all ${item.color}`}>
                  <item.icon size={20} />
                  <span className="text-xs font-semibold">{item.label}</span>
                </div>
              </Link>
            ))}
          </div>

          {isAdmin && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <Link to="/admin/verses" className="flex items-center justify-between p-3 rounded-xl bg-gold-50 hover:bg-gold-100 transition-colors">
                <div className="flex items-center gap-3">
                  <FiFileText className="text-gold-600" size={16} />
                  <span className="text-sm font-semibold text-gold-700">Kelola Ayat Harian</span>
                </div>
                <FiArrowRight className="text-gold-400" size={14} />
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  )
}
