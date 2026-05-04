// Admin Gallery
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiPlus, FiTrash2, FiArrowLeft, FiSave, FiUploadCloud } from 'react-icons/fi'
import AdminLayout from '../../components/layout/AdminLayout'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export function AdminGalleryList() {
  const { t } = useTranslation()
  const [galleries, setGalleries] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get('/gallery/admin/all').then(({ data }) => {
      if (data.success) setGalleries(data.data)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id, title) => {
    if (!window.confirm(`${t('admin.deleteAlbumConfirm')} "${title}"? ${t('admin.allPhotosDeleted')}`)) return
    await api.delete(`/gallery/${id}`)
    toast.success(t('admin.albumDeleted')); load()
  }

  const handleToggle = async (g) => {
    await api.put(`/gallery/${g._id}`, { isPublished: !g.isPublished })
    toast.success(g.isPublished ? t('admin.contentDrafted') : t('admin.contentPublished')); load()
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-navy-700">{t('admin.photoGallery')}</h1>
        <Link to="/admin/gallery/new" className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold">
          <FiPlus size={16} /> {t('admin.createAlbum')}
        </Link>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />)}</div>
      ) : galleries.length === 0 ? (
        <div className="text-center py-20"><p className="text-gray-400 font-serif text-xl mb-4">{t('admin.noAlbums')}</p><Link to="/admin/gallery/new" className="inline-flex items-center gap-2 bg-gold-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"><FiPlus size={14} /> {t('admin.createAlbum')}</Link></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {galleries.map((g) => (
            <div key={g._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all">
              <div className="h-40 bg-gray-100 relative">
                {g.coverImage ? <img src={g.coverImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-3xl">📷</div>}
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <button onClick={() => handleToggle(g)} className={`text-xs font-semibold px-2 py-1 rounded-full ${g.isPublished ? 'bg-emerald-500 text-white' : 'bg-white/90 text-gray-600'}`}>{g.isPublished ? t('admin.published') : t('admin.draft')}</button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-navy-700 text-sm mb-3 truncate">{g.title_id}</h3>
                <div className="flex gap-2">
                  <Link to={`/admin/gallery/edit/${g._id}`} className="flex-1 text-center py-2 bg-navy-50 text-navy-700 hover:bg-navy-100 rounded-lg text-xs font-semibold transition-all">{t('admin.editAndUpload')}</Link>
                  <button onClick={() => handleDelete(g._id, g.title_id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"><FiTrash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}

export function AdminGalleryForm() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [gallery, setGallery] = useState(null)
  const [form, setForm] = useState({ title_id: '', title_en: '', description_id: '', category: 'lainnya', isPublished: false })

  const load = async () => {
    if (!isEdit) return
    const { data } = await api.get(`/gallery/${id}`)
    if (data.success) { setGallery(data.data); setForm({ ...data.data }) }
  }
  useEffect(() => { load() }, [id])

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (isEdit) { await api.put(`/gallery/${id}`, form); toast.success(t('admin.albumUpdated')); load() }
      else { const { data } = await api.post('/gallery', form); toast.success(t('admin.albumCreated')); navigate(`/admin/gallery/edit/${data.data._id}`) }
    } catch (err) { toast.error(err.response?.data?.message || t('admin.failed')) } finally { setSaving(false) }
  }

  const handlePhotos = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    const oversized = files.filter(f => f.size > 10 * 1024 * 1024)
    if (oversized.length) {
      toast.error(`${oversized.length} file(s) exceed 10 MB limit`)
      return
    }

    setUploading(true)
    try {
      // Step 1: get signed upload credential
      const { data: sign } = await api.get('/gallery/admin/sign-upload')
      console.log('[upload] sign response:', sign)

      // Step 2: upload directly to Cloudinary in parallel
      const results = await Promise.all(files.map(async file => {
        const fd = new FormData()
        fd.append('file', file)
        fd.append('api_key', sign.apiKey)
        fd.append('timestamp', String(sign.timestamp))
        fd.append('signature', sign.signature)
        fd.append('folder', sign.folder)
        const res = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`, {
          method: 'POST', body: fd,
        })
        const json = await res.json()
        console.log('[upload] cloudinary result:', json)
        return json
      }))

      const failed = results.filter(r => r.error)
      if (failed.length) throw new Error('Cloudinary: ' + failed[0].error.message)

      // Step 3: save URLs to backend
      const photos = results.map(r => ({ url: r.secure_url, publicId: r.public_id }))
      await api.post(`/gallery/${id}/photos/batch`, { photos })
      toast.success(`${files.length} ${t('admin.photosUploaded')}`)
      load()
    } catch (err) {
      console.error('[upload] error:', err)
      toast.error(err.message || t('admin.uploadFailedShort'))
    } finally { setUploading(false) }
  }

  const handleDeletePhoto = async (photoId) => {
    await api.delete(`/gallery/${id}/photos/${photoId}`)
    toast.success(t('admin.photoDeleted')); load()
  }

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-400 transition-all"
  const lbl = "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5"

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/gallery" className="p-2 hover:bg-gray-100 rounded-lg"><FiArrowLeft size={18} className="text-gray-500" /></Link>
        <h1 className="font-serif text-2xl font-bold text-navy-700">{isEdit ? t('admin.editAlbum') : t('admin.newAlbum')}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <div><label className={lbl}>{t('admin.albumTitle')} *</label><input className={inp} required value={form.title_id} onChange={e => setForm({...form, title_id: e.target.value})} /></div>
            <div><label className={lbl}>{t('admin.albumTitleEn')}</label><input className={inp} value={form.title_en} onChange={e => setForm({...form, title_en: e.target.value})} /></div>
            <div><label className={lbl}>{t('admin.description')}</label><textarea className={inp} rows={3} value={form.description_id} onChange={e => setForm({...form, description_id: e.target.value})} /></div>
            <div>
              <label className={lbl}>{t('admin.categoryLabel')}</label>
              <select className={inp} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                {['ibadah','kegiatan','pelatihan','sosial','lainnya'].map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 accent-gold-500" checked={form.isPublished} onChange={e => setForm({...form, isPublished: e.target.checked})} />
              <span className="text-sm text-gray-600">{t('admin.publish')}</span>
            </label>
            <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm">
              <FiSave size={15} /> {saving ? t('admin.saving') : t('common.save')}
            </button>
          </form>
        </div>

        {isEdit && (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-navy-700">{t('admin.photos')} ({gallery?.photos?.length || 0})</h3>
                <label className={`flex items-center gap-2 cursor-pointer px-4 py-2 text-sm font-semibold rounded-xl transition-all ${uploading ? 'bg-gray-100 text-gray-400' : 'bg-navy-50 text-navy-700 hover:bg-navy-100'}`}>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotos} disabled={uploading} />
                  <FiUploadCloud size={15} /> {uploading ? t('admin.uploading') : t('admin.uploadPhotos')}
                </label>
              </div>
              {gallery?.photos?.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {gallery.photos.map((photo) => (
                    <div key={photo._id} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
                      <img src={photo.url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => handleDeletePhoto(photo._id)} className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <FiUploadCloud size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">{t('admin.uploadPhotosHere')}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

// Admin Verses
export function AdminVersesList() {
  const { t } = useTranslation()
  const [verses, setVerses] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ text_id: '', text_en: '', reference_id: '', reference_en: '', date: '', theme_id: '' })
  const [saving, setSaving] = useState(false)

  const load = () => api.get('/verses').then(({ data }) => { if (data.success) setVerses(data.data) }).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try { await api.post('/verses', form); toast.success(t('admin.verseAdded')); load(); setForm({ text_id: '', text_en: '', reference_id: '', reference_en: '', date: '', theme_id: '' }) }
    catch (err) { toast.error(err.response?.data?.message || t('admin.failed')) } finally { setSaving(false) }
  }
  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.deleteVerseConfirm'))) return
    await api.delete(`/verses/${id}`); toast.success(t('admin.verseDeleted')); load()
  }

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-400 transition-all"
  const lbl = "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5"

  return (
    <AdminLayout>
      <h1 className="font-serif text-2xl font-bold text-navy-700 mb-6">{t('admin.dailyVerse')}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-navy-700 mb-4">{t('admin.addVerse')}</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div><label className={lbl}>{t('admin.date')} *</label><input className={inp} placeholder="01-01" required pattern="\d{2}-\d{2}" value={form.date} onChange={e => setForm({...form, date: e.target.value})} /></div>
            <div><label className={lbl}>{t('admin.verseTextId')} *</label><textarea className={inp} rows={3} required value={form.text_id} onChange={e => setForm({...form, text_id: e.target.value})} /></div>
            <div><label className={lbl}>{t('admin.verseTextEn')} *</label><textarea className={inp} rows={3} required value={form.text_en} onChange={e => setForm({...form, text_en: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={lbl}>{t('admin.referenceId')}</label><input className={inp} placeholder="Yohanes 3:16" value={form.reference_id} onChange={e => setForm({...form, reference_id: e.target.value})} required /></div>
              <div><label className={lbl}>{t('admin.referenceEn')}</label><input className={inp} placeholder="John 3:16" value={form.reference_en} onChange={e => setForm({...form, reference_en: e.target.value})} required /></div>
            </div>
            <div><label className={lbl}>{t('admin.theme')}</label><input className={inp} value={form.theme_id} onChange={e => setForm({...form, theme_id: e.target.value})} /></div>
            <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm">
              <FiSave size={15} /> {saving ? t('admin.saving') : t('admin.saveVerse')}
            </button>
          </form>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 font-semibold text-navy-700">{t('admin.verseList')} ({verses.length}/366)</div>
          <div className="overflow-y-auto max-h-96 divide-y divide-gray-50">
            {verses.map(v => (
              <div key={v._id} className="flex items-start gap-3 p-3 hover:bg-gray-50">
                <span className="text-xs bg-gold-100 text-gold-700 font-mono px-2 py-1 rounded-lg shrink-0">{v.date}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-navy-700 truncate">{v.text_id}</p>
                  <p className="text-xs text-gold-500">{v.reference_id}</p>
                </div>
                <button onClick={() => handleDelete(v._id)} className="p-1 text-gray-300 hover:text-red-400 shrink-0"><FiTrash2 size={13} /></button>
              </div>
            ))}
            {loading && <div className="p-8 text-center text-gray-400 text-sm">{t('common.loading')}</div>}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

// Admin About
export function AdminAboutPage() {
  const { t } = useTranslation()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    churchName_id: '', churchName_en: '', tagline_id: '', tagline_en: '',
    history_id: '', vision_id: '', vision_en: '',
    mission_id: '', mission_en: '',
    address: '', googleMapsUrl: '', phone: '', email: '',
    serviceSchedule_id: '', serviceSchedule_en: '',
    socialMedia: { youtube: '', instagram: '', facebook: '' },
    logoUrl: '',
  })

  useEffect(() => {
    api.get('/about').then(({ data }) => {
      if (data.success) setForm({
        ...data.data,
        mission_id: data.data.mission_id?.join('\n') || '',
        mission_en: data.data.mission_en?.join('\n') || '',
        socialMedia: data.data.socialMedia || { youtube: '', instagram: '', facebook: '' },
      })
    })
  }, [])

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    const fd = new FormData(); fd.append('logo', file)
    setUploading(true)
    try {
      const { data } = await api.upload('/about/upload-logo', fd)
      if (data.success) { setForm(p => ({ ...p, logoUrl: data.url })); toast.success(t('admin.logoUploaded')) }
    } catch { toast.error(t('admin.uploadFailedShort')) } finally { setUploading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    const payload = {
      ...form,
      mission_id: form.mission_id.split('\n').map(m => m.trim()).filter(Boolean),
      mission_en: form.mission_en.split('\n').map(m => m.trim()).filter(Boolean),
    }
    try { await api.put('/about', payload); toast.success(t('admin.dataSaved')) }
    catch (err) { toast.error(err.response?.data?.message || t('admin.failed')) } finally { setSaving(false) }
  }

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-400 transition-all"
  const lbl = "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5"

  return (
    <AdminLayout>
      <h1 className="font-serif text-2xl font-bold text-navy-700 mb-6">{t('admin.churchInfo')}</h1>
      <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={lbl}>{t('admin.churchNameId')}</label><input className={inp} value={form.churchName_id} onChange={e => setForm({...form, churchName_id: e.target.value})} /></div>
          <div><label className={lbl}>{t('admin.churchNameEn')}</label><input className={inp} value={form.churchName_en} onChange={e => setForm({...form, churchName_en: e.target.value})} /></div>
          <div><label className={lbl}>Tagline (ID)</label><input className={inp} value={form.tagline_id} onChange={e => setForm({...form, tagline_id: e.target.value})} /></div>
          <div><label className={lbl}>Tagline (EN)</label><input className={inp} value={form.tagline_en} onChange={e => setForm({...form, tagline_en: e.target.value})} /></div>
          <div><label className={lbl}>{t('admin.visionId')}</label><textarea className={inp} rows={3} value={form.vision_id} onChange={e => setForm({...form, vision_id: e.target.value})} /></div>
          <div><label className={lbl}>{t('admin.visionEn')}</label><textarea className={inp} rows={3} value={form.vision_en} onChange={e => setForm({...form, vision_en: e.target.value})} /></div>
          <div><label className={lbl}>{t('admin.missionId')}</label><textarea className={inp} rows={5} value={form.mission_id} onChange={e => setForm({...form, mission_id: e.target.value})} /></div>
          <div><label className={lbl}>{t('admin.missionEn')}</label><textarea className={inp} rows={5} value={form.mission_en} onChange={e => setForm({...form, mission_en: e.target.value})} /></div>
          <div className="sm:col-span-2"><label className={lbl}>{t('admin.historyId')}</label><textarea className={inp} rows={6} value={form.history_id} onChange={e => setForm({...form, history_id: e.target.value})} /></div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><label className={lbl}>{t('admin.address')}</label><textarea className={inp} rows={2} value={form.address} onChange={e => setForm({...form, address: e.target.value})} /></div>
          <div><label className={lbl}>Google Maps URL</label><input className={inp} type="url" value={form.googleMapsUrl} onChange={e => setForm({...form, googleMapsUrl: e.target.value})} /></div>
          <div><label className={lbl}>{t('admin.phone')}</label><input className={inp} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
          <div><label className={lbl}>Email</label><input className={inp} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
          <div><label className={lbl}>{t('admin.serviceScheduleId')}</label><input className={inp} value={form.serviceSchedule_id} onChange={e => setForm({...form, serviceSchedule_id: e.target.value})} placeholder="Sabtu, 09.00 - 12.00 WIB" /></div>
          <div><label className={lbl}>YouTube</label><input className={inp} type="url" value={form.socialMedia?.youtube} onChange={e => setForm({...form, socialMedia: {...form.socialMedia, youtube: e.target.value}})} /></div>
          <div><label className={lbl}>Instagram</label><input className={inp} type="url" value={form.socialMedia?.instagram} onChange={e => setForm({...form, socialMedia: {...form.socialMedia, instagram: e.target.value}})} /></div>
          <div><label className={lbl}>Facebook</label><input className={inp} type="url" value={form.socialMedia?.facebook} onChange={e => setForm({...form, socialMedia: {...form.socialMedia, facebook: e.target.value}})} /></div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <label className={lbl}>{t('admin.churchLogo')}</label>
          {form.logoUrl && <img src={form.logoUrl} alt="logo" className="w-20 h-20 rounded-full object-cover mb-3 border-4 border-cream" />}
          <label className="flex items-center gap-2 border-2 border-dashed border-gray-200 hover:border-gold-400 rounded-xl p-3 cursor-pointer transition-colors w-fit">
            <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            <span className="text-sm text-gray-500">{uploading ? 'Uploading...' : t('admin.uploadLogo')}</span>
          </label>
        </div>

        <button type="submit" disabled={saving} className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-xl transition-all">
          <FiSave size={16} /> {saving ? t('admin.saving') : t('admin.saveAll')}
        </button>
      </form>
    </AdminLayout>
  )
}
