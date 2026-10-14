import { lazy, Suspense } from 'react'
import Bio from '../academic/Bio'
import ResearchInterests from '../academic/ResearchInterests'
import Timeline from '../academic/Timeline'
import PublicationList from '../academic/PublicationList'
import ProjectList from '../academic/ProjectList'
import AwardList from '../academic/AwardList'
import Contact from '../academic/Contact'
import Hero from '../academic/Hero'
import SectionNav from '../academic/SectionNav'
import { Spinner } from '../components/ui'

// 文章内容单独异步加载，不进首屏
const LatestPosts = lazy(() => import('../components/LatestPosts'))

export default function AcademicHome() {
  return (
    <div className="home">
      <Hero />
      <SectionNav />

      <section className="section" id="blog-preview">
        <h2 className="section-title">最新文章</h2>
        <Suspense fallback={<Spinner text="正在加载文章…" />}>
          <LatestPosts limit={3} />
        </Suspense>
      </section>

      <Bio />
      <ResearchInterests />
      <Timeline />
      <PublicationList />
      <ProjectList />
      <AwardList />
      <Contact />
    </div>
  )
}
