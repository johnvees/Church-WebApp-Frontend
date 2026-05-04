import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const { t } = useTranslation()
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(form.email, form.password)
    if (result.success) {
      toast.success(t('admin.welcome'))
      navigate('/admin/dashboard')
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-gold-500/20">
            <span className="font-serif text-2xl text-white font-bold">E</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-white mb-1">Ekklesia</h1>
          <p className="text-white/40 text-sm">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white/8 backdrop-blur-md border border-white/15 rounded-3xl p-8">
          <h2 className="font-serif text-xl font-semibold text-white mb-6">{t('admin.loginTitle')}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-white/60 text-xs font-semibold uppercase tracking-wider block mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@ekklesia.id"
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold-400 transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-white/60 text-xs font-semibold uppercase tracking-wider block mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-11 pr-11 py-3 text-white placeholder-white/30 focus:outline-none focus:border-gold-400 transition-colors text-sm"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3.5 rounded-xl transition-all mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? t('admin.processing') : t('admin.login')}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">© {t('common.churchCopyright')}</p>
      </motion.div>
    </div>
  )
}
