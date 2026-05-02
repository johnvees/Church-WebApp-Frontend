import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiSave } from 'react-icons/fi'
import AdminLayout from '../../components/layout/AdminLayout'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'

const CATEGORIES = [
  { value: 'berita-misi', label: 'Berita Misi' },
  { value: 'sekolah-sabat', label: 'Sekolah Sabat' },
  { value: 'pelayanan-perorangan', label: 'Pelayanan Perorangan' },
  { value: 'bacaan-persembahan', label: 'Bacaan Persembahan' },
  { value: 'cerita-anak', label: 'Cerita Anak' },
  { value: 'perpustakaan', label: 'Perpustakaan' },
  { value: 'liturgi-sabat', label: 'Liturgi Sabat' },
]

export function AdminBacaanList() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('')
  const { user } = useAuth()

  const load = () => {
    const url = cat ? `/bacaan/admin?category=${cat}` : '/bacaan/admin'
    api.get(url).then(({ data }) => {
      if (data.success) setItems(data.data)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [cat])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus "${title}"?`)) return
    await api.delete(`/bacaan/${id}`)
    toast.success('Konten dihapus')
    load()
  }

  const handleToggle = async (item) => {
    await api.put(`/bacaan/${item._id}`, { isPublished: !item.isPublished })
    toast.success(item.isPublished ? 'Dijadikan draft' : 'Diterbitkan')
    load()
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-serif text-2xl font-bold text-navy-700">Konten Bacaan</h1>
        <Link to="/admin/bacaan/new" className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all">
          <FiPlus size={16} /> Tambah Konten
        </Link>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto mb-5 pb-1">
        <button onClick={() => setCat('')} className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${!cat ? 'bg-navy-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-navy-300'}`}>
          Semua
        </button>
        {CATEGORIES.map(c => (
          <button key={c.value} onClick={() => setCat(c.value)} className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${cat === c.value ? 'bg-navy-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-navy-300'}`}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 font-serif text-xl mb-4">Belum ada konten</p>
            <Link to="/admin/bacaan/new" className="inline-flex items-center gap-2 bg-gold-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
              <FiPlus size={14} /> Buat Konten Pertama
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Judul</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Kategori</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy-700 text-sm truncate max-w-xs">{item.title_id}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-xs bg-navy-50 text-navy-600 px-2 py-1 rounded-full font-medium">
                      {CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <button onClick={() => handleToggle(item)} className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${item.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {item.isPublished ? 'Terbit' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link to={`/admin/bacaan/edit/${item._id}`} className="p-2 text-gray-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-all">
                        <FiEdit2 size={15} />
                      </Link>
                      <button onClick={() => handleDelete(item._id, item.title_id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}

export function AdminBacaanForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isEdit = !!id
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title_id: '', title_en: '', category: user?.assignedSections?.[0] || 'berita-misi',
    content_id: '', content_en: '', excerpt_id: '', excerpt_en: '',
    coverImage: '', fileUrl: '', externalLink: '', isPublished: false,
  })

  useEffect(() => {
    if (!isEdit) return
    api.get('/bacaan/admin').then(({ data }) => {
      const item = data.data?.find(a => a._id === id)
      if (item) setForm({ ...item })
    })
  }, [id])

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    const fd = new FormData(); fd.append('image', file)
    setUploading(true)
    try {
      const { data } = await api.post('/bacaan/upload-image', fd)
      if (data.success) { setForm(p => ({ ...p, coverImage: data.url })); toast.success('Gambar diupload') }
    } catch { toast.error('Gagal upload') } finally { setUploading(false) }
  }

  const handleDocUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    const fd = new FormData(); fd.append('document', file)
    setUploading(true)
    try {
      const { data } = await api.post('/bacaan/upload-document', fd)
      if (data.success) { setForm(p => ({ ...p, fileUrl: data.url })); toast.success('Dokumen diupload') }
    } catch { toast.error('Gagal upload') } finally { setUploading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (isEdit) { await api.put(`/bacaan/${id}`, form); toast.success('Konten diperbarui') }
      else { await api.post('/bacaan', form); toast.success('Konten dibuat') }
      navigate('/admin/bacaan')
    } catch (err) { toast.error(err.response?.data?.message || 'Gagal menyimpan') } finally { setSaving(false) }
  }

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-400 transition-all"
  const lbl = "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5"
  const allowedCats = user?.role === 'admin' ? CATEGORIES : CATEGORIES.filter(c => user?.assignedSections?.includes(c.value))

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/bacaan" className="p-2 hover:bg-gray-100 rounded-lg"><FiArrowLeft size={18} className="text-gray-500" /></Link>
        <h1 className="font-serif text-2xl font-bold text-navy-700">{isEdit ? 'Edit Konten' : 'Konten Baru'}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <div>
                <label className={lbl}>Kategori *</label>
                <select className={inp} value={form.category} onChange={e => setForm({...form, category: e.target.value})} required>
                  {allowedCats.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>Judul (ID) *</label><input className={inp} required value={form.title_id} onChange={e => setForm({...form, title_id: e.target.value})} placeholder="Judul..." /></div>
                <div><label className={lbl}>Title (EN)</label><input className={inp} value={form.title_en} onChange={e => setForm({...form, title_en: e.target.value})} placeholder="Title..." /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className={lbl}>Ringkasan (ID)</label><textarea className={inp} rows={3} value={form.excerpt_id} onChange={e => setForm({...form, excerpt_id: e.target.value})} /></div>
                <div><label className={lbl}>Excerpt (EN)</label><textarea className={inp} rows={3} value={form.excerpt_en} onChange={e => setForm({...form, excerpt_en: e.target.value})} /></div>
              </div>
              <div><label className={lbl}>Konten (ID)</label><textarea className={inp} rows={10} value={form.content_id} onChange={e => setForm({...form, content_id: e.target.value})} placeholder="Konten artikel..." /></div>
              <div><label className={lbl}>Content (EN)</label><textarea className={inp} rows={10} value={form.content_en} onChange={e => setForm({...form, content_en: e.target.value})} /></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-sm text-navy-700 mb-4">Pengaturan</h3>
              <label className="flex items-center gap-3 cursor-pointer mb-4">
                <input type="checkbox" className="w-4 h-4 accent-gold-500" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} />
                <span className="text-sm text-gray-600">Terbitkan</span>
              </label>
              <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm">
                <FiSave size={15} /> {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <label className={lbl}>Foto Cover</label>
              {form.coverImage && <img src={form.coverImage} className="w-full rounded-xl aspect-video object-cover mb-3" />}
              <label className="flex items-center justify-center border-2 border-dashed border-gray-200 hover:border-gold-400 rounded-xl p-3 cursor-pointer transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <span className="text-sm text-gray-500">{uploading ? 'Uploading...' : 'Upload gambar'}</span>
              </label>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <div>
                <label className={lbl}>Dokumen PDF</label>
                {form.fileUrl && <a href={form.fileUrl} target="_blank" className="block text-xs text-gold-600 hover:underline mb-2 truncate">File tersedia ↗</a>}
                <label className="flex items-center justify-center border-2 border-dashed border-gray-200 hover:border-gold-400 rounded-xl p-3 cursor-pointer transition-colors">
                  <input type="file" accept=".pdf" className="hidden" onChange={handleDocUpload} />
                  <span className="text-sm text-gray-500">{uploading ? 'Uploading...' : 'Upload PDF'}</span>
                </label>
              </div>
              <div>
                <label className={lbl}>Tautan Eksternal</label>
                <input className={inp} type="url" value={form.externalLink} onChange={e => setForm({...form, externalLink: e.target.value})} placeholder="https://..." />
              </div>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
