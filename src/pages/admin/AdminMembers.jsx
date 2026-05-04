// Admin Members Page
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiSave } from 'react-icons/fi'
import AdminLayout from '../../components/layout/AdminLayout'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export function AdminMembersList() {
  const { t } = useTranslation()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    api.get('/members/all').then(({ data }) => {
      if (data.success) setMembers(data.data)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`${t('admin.deleteConfirm')} "${name}"?`)) return
    await api.delete(`/members/${id}`)
    toast.success(t('admin.memberDeleted'))
    load()
  }

  const handleToggle = async (m) => {
    await api.put(`/members/${m._id}`, { isActive: !m.isActive })
    toast.success(m.isActive ? t('admin.memberDeactivated') : t('admin.memberActivated'))
    load()
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-navy-700">{t('admin.orgStructure')}</h1>
        <Link to="/admin/members/new" className="flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold">
          <FiPlus size={16} /> {t('admin.addMember')}
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}</div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 font-serif text-xl mb-4">{t('admin.noMembers')}</p>
            <Link to="/admin/members/new" className="inline-flex items-center gap-2 bg-gold-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold"><FiPlus size={14} /> {t('admin.addMember')}</Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">{t('admin.name')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">{t('admin.position')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">{t('admin.level')}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">{t('admin.status')}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.map((m) => (
                <tr key={m._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 flex items-center gap-3">
                    {m.photo ? <img src={m.photo} className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center"><span className="text-navy-600 text-sm font-bold">{m.name[0]}</span></div>}
                    <span className="font-medium text-navy-700 text-sm">{m.name}</span>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-sm text-gray-500">{m.position_id}</td>
                  <td className="px-4 py-3 hidden md:table-cell"><span className="text-xs bg-navy-50 text-navy-600 px-2 py-1 rounded-full">Level {m.level}</span></td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <button onClick={() => handleToggle(m)} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${m.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                      {m.isActive ? t('admin.active') : t('admin.inactive')}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Link to={`/admin/members/edit/${m._id}`} className="p-2 text-gray-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-all"><FiEdit2 size={15} /></Link>
                      <button onClick={() => handleDelete(m._id, m.name)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><FiTrash2 size={15} /></button>
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

export function AdminMembersForm() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !!id
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [allMembers, setAllMembers] = useState([])
  const [form, setForm] = useState({
    name: '', position_id: '', position_en: '', department_id: '', department_en: '',
    photo: '', email: '', phone: '', level: 1, order: 0, parentId: '', period: '', isActive: true,
  })

  useEffect(() => {
    api.get('/members/all').then(({ data }) => {
      if (data.success) {
        setAllMembers(data.data)
        if (isEdit) {
          const member = data.data.find(m => m._id === id)
          if (member) setForm({ ...member, parentId: member.parentId?._id || member.parentId || '' })
        }
      }
    })
  }, [id])

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return
    const fd = new FormData(); fd.append('photo', file)
    setUploading(true)
    try {
      const { data } = await api.upload('/members/upload-photo', fd)
      if (data.success) { setForm(p => ({ ...p, photo: data.url })); toast.success(t('admin.photoUploaded')) }
    } catch { toast.error(t('admin.uploadFailedShort')) } finally { setUploading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    const payload = { ...form, parentId: form.parentId || null }
    try {
      if (isEdit) { await api.put(`/members/${id}`, payload); toast.success(t('admin.memberUpdated')) }
      else { await api.post('/members', payload); toast.success(t('admin.memberAdded')) }
      navigate('/admin/members')
    } catch (err) { toast.error(err.response?.data?.message || t('admin.failed')) } finally { setSaving(false) }
  }

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-400 transition-all"
  const lbl = "block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5"

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/members" className="p-2 hover:bg-gray-100 rounded-lg"><FiArrowLeft size={18} className="text-gray-500" /></Link>
        <h1 className="font-serif text-2xl font-bold text-navy-700">{isEdit ? t('admin.editMember') : t('admin.newMember')}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>{t('admin.name')} *</label><input className={inp} required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div><label className={lbl}>{t('admin.period')}</label><input className={inp} value={form.period} onChange={e => setForm({...form, period: e.target.value})} placeholder="2023-2026" /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>{t('admin.positionId')} *</label><input className={inp} required value={form.position_id} onChange={e => setForm({...form, position_id: e.target.value})} /></div>
              <div><label className={lbl}>{t('admin.positionEn')}</label><input className={inp} value={form.position_en} onChange={e => setForm({...form, position_en: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>{t('admin.departmentId')}</label><input className={inp} value={form.department_id} onChange={e => setForm({...form, department_id: e.target.value})} /></div>
              <div><label className={lbl}>{t('admin.departmentEn')}</label><input className={inp} value={form.department_en} onChange={e => setForm({...form, department_en: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>Email</label><input className={inp} type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
              <div><label className={lbl}>{t('admin.phone')}</label><input className={inp} value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={lbl}>{t('admin.hierarchyLevel')}</label>
                <select className={inp} value={form.level} onChange={e => setForm({...form, level: parseInt(e.target.value)})}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>Level {n}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>{t('admin.order')}</label>
                <input className={inp} type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})} />
              </div>
              <div>
                <label className={lbl}>{t('admin.superior')}</label>
                <select className={inp} value={form.parentId} onChange={e => setForm({...form, parentId: e.target.value})}>
                  <option value="">{t('admin.noSuperior')}</option>
                  {allMembers.filter(m => m._id !== id).map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <label className="flex items-center gap-3 cursor-pointer mb-4">
                <input type="checkbox" className="w-4 h-4 accent-gold-500" checked={form.isActive} onChange={e => setForm({...form, isActive: e.target.checked})} />
                <span className="text-sm text-gray-600">{t('admin.active')}</span>
              </label>
              <button type="submit" disabled={saving} className="w-full flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm">
                <FiSave size={15} /> {saving ? t('admin.saving') : t('common.save')}
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <label className={lbl}>{t('admin.photos')}</label>
              {form.photo && <img src={form.photo} className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-cream" />}
              <label className="flex items-center justify-center border-2 border-dashed border-gray-200 hover:border-gold-400 rounded-xl p-3 cursor-pointer transition-colors">
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                <span className="text-sm text-gray-500">{uploading ? 'Uploading...' : t('admin.uploadPhoto')}</span>
              </label>
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
