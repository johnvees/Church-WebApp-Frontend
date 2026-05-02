import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiYoutube, FiInstagram, FiFacebook, FiMapPin, FiPhone, FiMail } from 'react-icons/fi'

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy-900 text-white">
      {/* Top wave */}
      <div className="h-16 bg-gradient-to-b from-[var(--offwhite)] to-navy-900" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                <span className="font-serif font-bold text-white">E</span>
              </div>
              <div>
                <p className="font-serif font-bold text-lg">Ekklesia</p>
                <p className="text-gold-400 text-xs">GMAHK</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Gereja Masehi Advent Hari Ketujuh — Jemaat Ekklesia. Bertumbuh dalam iman, melayani dengan kasih.
            </p>
            <div className="flex gap-3">
              {[FiYoutube, FiInstagram, FiFacebook].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-gray-400 hover:border-gold-500 hover:text-gold-400 transition-colors">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="font-serif text-gold-400 mb-4 text-sm font-semibold uppercase tracking-wider">Navigasi</p>
            <ul className="space-y-2">
              {[
                [t('nav.home'), '/'],
                [t('nav.bacaan'), '/bacaan/berita-misi'],
                [t('nav.struktur'), '/struktur'],
                [t('nav.activity'), '/activity'],
                [t('nav.about'), '/about'],
              ].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-gray-400 hover:text-gold-400 text-sm transition-colors flex items-center gap-2">
                    <span className="w-4 h-px bg-gold-500/40" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-serif text-gold-400 mb-4 text-sm font-semibold uppercase tracking-wider">Kontak</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <FiMapPin size={15} className="mt-0.5 text-gold-500 shrink-0" />
                <span>Jl. Contoh No. 1, Surabaya, Jawa Timur</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FiPhone size={15} className="text-gold-500 shrink-0" />
                <span>+62 xxx-xxxx-xxxx</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <FiMail size={15} className="text-gold-500 shrink-0" />
                <span>info@ekklesia.id</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-gray-400">
                <span className="text-gold-400 font-semibold">Jadwal Ibadah:</span><br />
                Sabtu, 09.00 – 12.00 WIB
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">© {year} GMAHK Ekklesia. Hak cipta dilindungi.</p>
          <Link to="/admin/login" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
