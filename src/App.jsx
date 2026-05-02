import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Public pages
import HomePage from './pages/HomePage'
import BacaanPage from './pages/BacaanPage'
import BacaanDetailPage from './pages/BacaanDetailPage'
import StrukturPage from './pages/StrukturPage'
import ActivityPage from './pages/ActivityPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import AboutPage from './pages/AboutPage'

// Admin pages
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import { AdminArticlesList, AdminArticleForm } from './pages/admin/AdminArticles'
import { AdminBacaanList, AdminBacaanForm } from './pages/admin/AdminBacaan'
import { AdminMembersList, AdminMembersForm } from './pages/admin/AdminMembers'
import { AdminGalleryList, AdminGalleryForm } from './pages/admin/AdminOthers'
import { AdminVersesList, AdminAboutPage } from './pages/admin/AdminOthers'

// Guard for protected routes
function PrivateRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/admin/login" replace />
  return children
}

function AdminGuard({ children }) {
  const { user, isAdmin } = useAuth()
  if (!user) return <Navigate to="/admin/login" replace />
  if (!isAdmin) return <Navigate to="/admin/dashboard" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/bacaan/:category" element={<BacaanPage />} />
      <Route path="/bacaan/:category/:slug" element={<BacaanDetailPage />} />
      <Route path="/struktur" element={<StrukturPage />} />
      <Route path="/activity" element={<ActivityPage />} />
      <Route path="/activity/artikel/:slug" element={<ArticleDetailPage />} />
      <Route path="/about" element={<AboutPage />} />

      {/* Admin - auth */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Admin - protected */}
      <Route path="/admin/dashboard" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />

      {/* Articles */}
      <Route path="/admin/articles" element={<PrivateRoute><AdminArticlesList /></PrivateRoute>} />
      <Route path="/admin/articles/new" element={<PrivateRoute><AdminArticleForm /></PrivateRoute>} />
      <Route path="/admin/articles/edit/:id" element={<PrivateRoute><AdminArticleForm /></PrivateRoute>} />

      {/* Bacaan */}
      <Route path="/admin/bacaan" element={<PrivateRoute><AdminBacaanList /></PrivateRoute>} />
      <Route path="/admin/bacaan/new" element={<PrivateRoute><AdminBacaanForm /></PrivateRoute>} />
      <Route path="/admin/bacaan/edit/:id" element={<PrivateRoute><AdminBacaanForm /></PrivateRoute>} />

      {/* Members */}
      <Route path="/admin/members" element={<PrivateRoute><AdminMembersList /></PrivateRoute>} />
      <Route path="/admin/members/new" element={<PrivateRoute><AdminMembersForm /></PrivateRoute>} />
      <Route path="/admin/members/edit/:id" element={<PrivateRoute><AdminMembersForm /></PrivateRoute>} />

      {/* Gallery */}
      <Route path="/admin/gallery" element={<PrivateRoute><AdminGalleryList /></PrivateRoute>} />
      <Route path="/admin/gallery/new" element={<PrivateRoute><AdminGalleryForm /></PrivateRoute>} />
      <Route path="/admin/gallery/edit/:id" element={<PrivateRoute><AdminGalleryForm /></PrivateRoute>} />

      {/* Admin only */}
      <Route path="/admin/verses" element={<AdminGuard><AdminVersesList /></AdminGuard>} />
      <Route path="/admin/about" element={<AdminGuard><AdminAboutPage /></AdminGuard>} />

      {/* Redirects */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
