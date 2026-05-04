import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHome, FiBook, FiUsers, FiImage, FiFileText, FiInfo, FiLogOut, FiMenu, FiX, FiUser, FiFeather } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminLayout({ children }) {
  const { t } = useTranslation()
  const { user, logout, isAdmin } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const NAV = [
    { label: t('admin.dashboard'), icon: FiHome, path: '/admin/dashboard' },
    { label: t('nav.bacaan'), icon: FiBook, path: '/admin/bacaan' },
    { label: t('activity.articles'), icon: FiFeather, path: '/admin/articles' },
    { label: t('home.gallery'), icon: FiImage, path: '/admin/gallery' },
    { label: t('nav.struktur'), icon: FiUsers, path: '/admin/members' },
    { label: t('admin.dailyVerse'), icon: FiFileText, path: '/admin/verses' },
    { label: t('nav.about'), icon: FiInfo, path: '/admin/about' },
  ]

  const ADMIN_ONLY = ['/admin/verses', '/admin/about']

  const handleLogout = () => {
    logout()
    toast.success(t('admin.loggedOut'))
    navigate('/admin/login')
  }

  const filteredNav = NAV.filter(item => {
    if (ADMIN_ONLY.includes(item.path) && !isAdmin) return false
    return true
  })

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow">
            <span className="font-serif font-bold text-white text-sm">E</span>
          </div>
          <div>
            <p className="font-serif font-bold text-white text-sm">Ekklesia</p>
            <p className="text-gold-400 text-xs">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => {
          const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-gold-500 text-white shadow-md shadow-gold-500/30'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 mb-2">
          <div className="w-8 h-8 rounded-full bg-gold-500/20 flex items-center justify-center">
            {user?.photo ? <img src={user.photo} className="w-full h-full rounded-full object-cover" /> : <FiUser className="text-gold-400" size={14} />}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-white/40 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-4 py-2 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-xl text-sm transition-all"
        >
          <FiLogOut size={14} /> {t('admin.logout')}
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 bg-navy-900 flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setSidebarOpen(false)} />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 25 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-56 bg-navy-900 z-50 flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 h-14 flex items-center justify-between shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:text-gray-700">
            <FiMenu size={20} />
          </button>
          <div className="hidden lg:block text-sm font-medium text-gray-600 capitalize">
            {filteredNav.find(n => location.pathname.startsWith(n.path))?.label || t('admin.dashboard')}
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" target="_blank" className="text-xs text-gray-400 hover:text-navy-700 transition-colors">
              {t('admin.viewWebsite')}
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
