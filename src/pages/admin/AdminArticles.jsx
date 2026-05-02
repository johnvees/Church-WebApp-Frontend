import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiArrowLeft, FiSave } from 'react-icons/fi'
import AdminLayout from '../../components/layout/AdminLayout'
import api from '../../utils/api'
import toast from 'react-hot-toast'

// ── List ──────────────────────────────────────────────────────
export function AdminArticlesList() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get('/articles/admin').then(({ data }) => {
      if (data.success) setArticles(data.data)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus artikel "${title}"?`)) return
    await api.delete(`/articles/${id}`)
    toast.success('Artikel dihapus')
    load()
  }

  const handleTogglePublish = async (article) => {
    await api.put(`/articles/${article._id}`, { isPublished: !article.isPublished })
    toast.success(article.isPublished ? 'Artikel dijadikan draft' : 'Artikel diterbitkan')
    load()
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-navy-700">Artikel</h1>
        <Link to="/admin/articles/new" className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all">
          <FiPlus size={16} /> Tambah Artikel
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 font-serif text-xl mb-4">Belum ada artikel</p>
            <Link to="/admin/articles/new" className="inline-flex items-center gap-2 bg-gold-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
              <FiPlus size={14} /> Buat Artikel Pertama
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Judul</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Dibaca</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {articles.map((a) => (
                <tr key={a._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy-700 text-sm truncate max-w-xs">{a.title_id}</p>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <button
                      onClick={() => handleTogglePublish(a)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-all ${
                        a.isPublished ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    >
                      {a.isPublished ? 'Terbit' : 'Draft'}
                    </button>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-400">{a.views}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      {a.isPublished && (
                        <a href={`/activity/artikel/${a.slug}`} target="_blank" rel="noopener noreferrer"
                          className="p-2 text-gray-400 hover:text-navy-700 hover:bg-navy-50 rounded-lg transition-all">
                          <FiEye size={15} />
                        </a>
                      )}
                      <Link to={`/admin/articles/edit/${a._id}`}
                        className="p-2 text-gray-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-all">
                        <FiEdit2 size={15} />
                      </Link>
                      <button onClick={() => handleDelete(a._id, a.title_id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
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

// ── Form (Create / Edit) ─────────────────────────────────────
export function AdminArticleForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title_id: '', title_en: '', content_id: '', content_en: '',
    excerpt_id: '', excerpt_en: '', coverImage: '', tags: '', isPublished: false, isFeatured: false,
  })

  useEffect(() => {
    if (!isEdit) return
    api.get(`/articles/admin`).then(({ data }) => {
      const article = data.data?.find(a => a._id === id)
      if (article) setForm({
        ...article,
        tags: article.tags?.join(', ') || '',
      })
    })
  }, [id])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)
    try {
      const { data } = await api.post('/articles/upload-image', formData)
      if (data.success) {
        setForm(prev => ({ ...prev, coverImage: data.url }))
        toast.success('Gambar berhasil diupload')
      }
    } catch {
      toast.error('Gagal upload gambar')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    }
    try {
      if (isEdit) {
        await api.put(`/articles/${id}`, payload)
        toast.success('Artikel berhasil diperbarui')
      } else {
        await api.post('/articles', payload)
        toast.success('Artikel berhasil dibuat')
      }
      navigate('/admin/articles')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan')
    } finally {
      setSaving(false)
    }
  }

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-200 transition-all"
  const lbl = "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5"

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/articles" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <FiArrowLeft size={18} className="text-gray-500" />
        </Link>
        <h1 className="font-serif text-2xl font-bold text-navy-700">
          {isEdit ? 'Edit Artikel' : 'Artikel Baru'}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Judul (Indonesia) *</label>
                  <input className={inp} required value={form.title_id} onChange={e => setForm({...form, title_id: e.target.value})} placeholder="Judul artikel..." />
                </div>
                <div>
                  <label className={lbl}>Title (English)</label>
                  <input className={inp} value={form.title_en} onChange={e => setForm({...form, title_en: e.target.value})} placeholder="Article title..." />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Ringkasan (ID)</label>
                  <textarea className={inp} rows={3} value={form.excerpt_id} onChange={e => setForm({...form, excerpt_id: e.target.value})} placeholder="Ringkasan singkat..." />
                </div>
                <div>
                  <label className={lbl}>Excerpt (EN)</label>
                  <textarea className={inp} rows={3} value={form.excerpt_en} onChange={e => setForm({...form, excerpt_en: e.target.value})} placeholder="Short excerpt..." />
                </div>
              </div>
              <div>
                <label className={lbl}>Konten (Bahasa Indonesia) *</label>
                <textarea className={inp} rows={10} required value={form.content_id} onChange={e => setForm({...form, content_id: e.target.value})} placeholder="Tulis konten artikel di sini... (mendukung HTML dasar)" />
                <p className="text-xs text-gray-400 mt-1">Mendukung tag HTML seperti &lt;b&gt;, &lt;i&gt;, &lt;p&gt;, &lt;h2&gt;, dll.</p>
              </div>
              <div>
                <label className={lbl}>Content (English)</label>
                <textarea className={inp} rows={10} value={form.content_en} onChange={e => setForm({...form, content_en: e.target.value})} placeholder="Write article content here..." />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Publish */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-sm text-navy-700 mb-4">Pengaturan</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-gold-500" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} />
                  <span className="text-sm text-gray-600">Terbitkan artikel</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-gold-500" checked={form.isFeatured} onChange={e => setForm({...form, isFeatured: e.target.checked})} />
                  <span className="text-sm text-gray-600">Tampilkan di featured</span>
                </label>
              </div>
              <button type="submit" disabled={saving}
                className="w-full mt-5 flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-all text-sm">
                <FiSave size={15} /> {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>

            {/* Cover image */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h3 className="font-semibold text-sm text-navy-700 mb-3">Foto Cover</h3>
              {form.coverImage && (
                <img src={form.coverImage} alt="cover" className="w-full rounded-xl object-cover aspect-video mb-3" />
              )}
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-gold-400 rounded-xl p-4 cursor-pointer transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                <span className="text-sm text-gray-500">{uploading ? 'Mengupload...' : 'Pilih gambar'}</span>
              </label>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <label className={lbl}>Tags</label>
              <input className={inp} value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="ibadah, kegiatan, rohani" />
              <p className="text-xs text-gray-400 mt-1">Pisahkan dengan koma</p>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
