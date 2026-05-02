import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  resources: {
    id: { translation: {
      nav: { home: 'Beranda', bacaan: 'Bacaan', struktur: 'Struktur Organisasi', activity: 'Kegiatan', about: 'Tentang Kami' },
      bacaan: { beritaMisi: 'Berita Misi', sekolahSabat: 'Sekolah Sabat', pelayananPerorangan: 'Pelayanan Perorangan', bacaanPersembahan: 'Bacaan Persembahan', ceritaAnak: 'Cerita Anak', perpustakaan: 'Perpustakaan', liturgiSabat: 'Liturgi Sabat' },
      home: { heroTitle: 'Selamat Datang di', heroSub: 'Bertumbuh dalam Iman, Melayani dengan Kasih', verseDay: 'Ayat Hari Ini', readMore: 'Baca Selengkapnya', latestArticles: 'Artikel Terbaru', gallery: 'Galeri', viewAll: 'Lihat Semua', serviceTime: 'Jadwal Ibadah' },
      common: { loading: 'Memuat...', noData: 'Tidak ada data', back: 'Kembali', save: 'Simpan', cancel: 'Batal', delete: 'Hapus', edit: 'Edit', add: 'Tambah', search: 'Cari' },
      about: { title: 'Tentang Kami', vision: 'Visi', mission: 'Misi', history: 'Sejarah', contact: 'Kontak' },
      admin: { dashboard: 'Dashboard', login: 'Masuk', logout: 'Keluar' },
    }},
    en: { translation: {
      nav: { home: 'Home', bacaan: 'Reading', struktur: 'Org Structure', activity: 'Activity', about: 'About' },
      bacaan: { beritaMisi: 'Mission News', sekolahSabat: 'Sabbath School', pelayananPerorangan: 'Personal Ministry', bacaanPersembahan: 'Offering Reading', ceritaAnak: "Children's Story", perpustakaan: 'Library', liturgiSabat: 'Sabbath Liturgy' },
      home: { heroTitle: 'Welcome to', heroSub: 'Growing in Faith, Serving with Love', verseDay: 'Verse of the Day', readMore: 'Read More', latestArticles: 'Latest Articles', gallery: 'Gallery', viewAll: 'View All', serviceTime: 'Service Schedule' },
      common: { loading: 'Loading...', noData: 'No data', back: 'Back', save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', add: 'Add', search: 'Search' },
      about: { title: 'About Us', vision: 'Vision', mission: 'Mission', history: 'History', contact: 'Contact' },
      admin: { dashboard: 'Dashboard', login: 'Login', logout: 'Logout' },
    }},
  },
  lng: typeof window !== 'undefined' ? (localStorage.getItem('lang') || 'id') : 'id',
  fallbackLng: 'id',
  interpolation: { escapeValue: false },
})

export default i18n
