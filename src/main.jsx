import React from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Link, Route, Routes } from 'react-router-dom'

import 'highlight.js/styles/github.css'
import './styles.css'

import { AuthProvider } from './auth'
import { Layout, RequireAuth, ToastProvider } from './components'
import Home from './pages/Home'
import PostDetail from './pages/PostDetail'
import TagsPage from './pages/TagsPage'
import About from './pages/About'
import Login from './pages/Login'
import Admin from './pages/Admin'
import PostEditor from './pages/PostEditor'
import ProfileEditor from './pages/ProfileEditor'

function NotFound() {
  return (
    <div className="empty">
      <div style={{ fontSize: 15 }}>页面不存在</div>
      <div style={{ marginTop: 12 }}>
        <Link to="/" className="btn primary">
          回到首页
        </Link>
      </div>
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tag/:tag" element={<Home />} />
          <Route path="/category/:category" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/tags" element={<TagsPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <Admin />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/new"
            element={
              <RequireAuth>
                <PostEditor />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <RequireAuth>
                <PostEditor />
              </RequireAuth>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <RequireAuth>
                <ProfileEditor />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>,
)
