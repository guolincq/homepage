import { StrictMode, Suspense, lazy, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import './styles.css'
import Layout from './components/Layout'
import AcademicHome from './pages/AcademicHome'
import NotFound from './pages/NotFound'
import { Spinner } from './components/ui'

const BlogList = lazy(() => import('./pages/BlogList'))
const PostDetail = lazy(() => import('./pages/PostDetail'))
const TagsPage = lazy(() => import('./pages/TagsPage'))

function ScrollToTop() {
  const { pathname, search } = useLocation()
  useEffect(() => {
    if (!search.includes('page=')) window.scrollTo({ top: 0 })
  }, [pathname, search])
  return null
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<AcademicHome />} />
          <Route
            path="/blog"
            element={
              <Suspense fallback={<Spinner />}>
                <BlogList />
              </Suspense>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <Suspense fallback={<Spinner />}>
                <PostDetail />
              </Suspense>
            }
          />
          <Route
            path="/tags"
            element={
              <Suspense fallback={<Spinner />}>
                <TagsPage />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
)
