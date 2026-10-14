/**
 * ============================================================================
 *  站点全部内容 —— 要换成你自己的信息，只需要改这一个文件。
 * ============================================================================
 *
 *  1. 改 SITE      ：站名、标语、导航、每页文章数
 *  2. 改 PROFILE   ：姓名、职称、机构、邮箱、头像、简介、社交链接
 *  3. 改 INTERESTS ：研究兴趣卡片
 *  4. 改 EDUCATION ：教育/工作经历（时间线）
 *  5. 改 PUBLICATIONS：论文列表（按年份倒序，本人名字会加粗）
 *  6. 改 PROJECTS  ：科研项目
 *  7. 改 AWARDS    ：荣誉奖项
 *
 *  说明：
 *  - 论文 PDF 链接写 '/papers/xxx.pdf'，把 PDF 放到 public/papers/ 下即可生效。
 *    链接留空字符串时，对应按钮不会渲染（避免死链）。
 *  - avatar 留空时用渐变色块 + 姓名首字占位。
 *  - cvUrl 设为 null 时不显示「简历」按钮；填 '/files/cv.pdf' 并把文件放进 public/files/。
 */

/* --------------------------------- 站点 --------------------------------- */

export const SITE = {
  name: '林行远 · 学术主页',
  shortName: '林行远',
  brandMark: '林',
  tagline: '分布式系统 · 机器学习系统',
  description: '林行远的个人学术主页：研究兴趣、论文发表、科研项目与博客笔记。',
  author: '林行远',
  footerNote: '本站为纯静态页面，内容仅代表个人观点。',
  pageSize: 8,
  /** 置 true 会在右上角显示亮/暗切换按钮 */
  enableDarkMode: false,
  nav: [
    { to: '/', label: '主页' },
    { to: '/blog', label: '博客' },
    { to: '/tags', label: '标签' },
  ],
}

/* -------------------------------- 个人信息 -------------------------------- */

export const PROFILE = {
  name: { cn: '林行远', en: 'Xingyuan Lin' },
  role: '副教授 · 博士生导师',
  affiliation: { cn: '示例大学 计算机科学与技术学院', en: 'Example University' },
  lab: { cn: '智能系统与网络实验室', en: 'Intelligent Systems & Networking Lab' },
  office: '信息科学楼 A-512',
  location: '中国 · 示例市',
  email: 'lin@example.edu',
  /** 留空 → 渐变色块 + 姓名首字；也可填 '/images/avatar.jpg'（文件放 public/images/） */
  avatar: '',
  /** null → 不显示简历按钮；填 '/files/cv.pdf' 并把文件放进 public/files/ */
  cvUrl: null,

  bio: [
    '我是示例大学计算机科学与技术学院的副教授，主要研究分布式系统与机器学习系统的交叉问题，关注如何在真实的异构环境中让大规模模型训练与推理既快又稳。',
    '近年工作集中在两条主线：一是面向广域与边缘场景的一致性协议与容错机制，二是大模型推理系统的显存调度与请求编排。相关成果发表于 OSDI、EuroSys、MLSys 等会议。',
  ],

  social: [
    { label: 'Google Scholar', icon: '🎓', url: 'https://scholar.google.com/citations?user=EXAMPLE' },
    { label: 'GitHub', icon: '🐙', url: 'https://github.com/example-lin' },
    { label: 'ORCID', icon: '🆔', url: 'https://orcid.org/0000-0000-0000-0000' },
    { label: 'DBLP', icon: '📚', url: 'https://dblp.org/pid/000/000' },
    { label: '知乎', icon: '💬', url: 'https://www.zhihu.com/people/example' },
  ],
}

/* ------------------------------- 研究兴趣 ------------------------------- */

export const INTERESTS = [
  {
    icon: '🧩',
    title: '分布式系统与共识协议',
    desc: '研究广域与异构环境下的状态机复制、BFT/Raft 类协议的可扩展性，以及一致性与延迟之间的权衡机制。',
    keywords: ['共识算法', '状态机复制', '一致性模型', '容错'],
  },
  {
    icon: '⚙️',
    title: '机器学习系统',
    desc: '面向大模型训练与推理的系统优化：显存调度、算子融合、请求批处理与多租户场景下的资源隔离。',
    keywords: ['推理加速', '显存优化', '调度', 'GPU 共享'],
  },
  {
    icon: '📡',
    title: '边缘计算与联邦学习',
    desc: '在算力与带宽受限的终端设备上完成协同训练，关注通信压缩、异构聚合与隐私保护的联合设计。',
    keywords: ['联邦学习', '通信压缩', '异构设备', '差分隐私'],
  },
  {
    icon: '🛡️',
    title: '可信与高效 AI',
    desc: '构建可复现的评测基准与方法论，研究模型在分布偏移与对抗扰动下的鲁棒性及推理阶段的安全问题。',
    keywords: ['鲁棒性', '评测基准', '可复现性', '推理安全'],
  },
]

/* ---------------------------- 教育 / 工作经历 ---------------------------- */

export const EDUCATION = [
  {
    period: '2023 — 至今',
    title: '副教授',
    org: '示例大学 计算机科学与技术学院',
    note: '主讲《分布式系统》《机器学习系统导论》；指导硕士生 6 名、博士生 2 名。',
  },
  {
    period: '2018 — 2023',
    title: '工学博士 · 计算机科学与技术',
    org: '示例大学',
    note: '导师：示例教授。博士论文获校优秀博士学位论文。',
  },
  {
    period: '2014 — 2018',
    title: '工学学士 · 计算机科学与技术',
    org: '示例大学',
    note: '校优秀毕业生，本科期间参与分布式存储课题组的早期原型开发。',
  },
]

/* -------------------------------- 论文发表 -------------------------------- */

/**
 * type: 'conference' | 'journal' | 'preprint'
 * authors: 字符串数组，与 PROFILE.name.en 或 PROFILE.name.cn 相同的项会自动加粗
 * links: 值为空字符串时不渲染对应按钮
 */
export const PUBLICATIONS = [
  {
    id: 'wiggle-2026',
    year: 2026,
    type: 'conference',
    title: 'Wiggle: 面向广域部署的自适应共识协议',
    authors: ['林行远', '示例合作者', '另一位合作者'],
    venue: '第 20 届 USENIX 操作系统设计与实现研讨会（OSDI \'26）',
    venueShort: 'OSDI 2026',
    award: '最佳论文',
    links: { pdf: '', code: 'https://github.com/example-lin/wiggle', bib: '', doi: '' },
    note: '提出根据网络往返时延动态调整法定人数的机制，在跨地域部署下将提交延迟降低约 41%。',
  },
  {
    id: 'orchestra-2025',
    year: 2025,
    type: 'conference',
    title: 'Orchestra: 大模型推理服务的请求编排与显存协同调度',
    authors: ['林行远', '合作者 A', '合作者 B', '合作者 C'],
    venue: '第 39 届神经信息处理系统大会（NeurIPS \'25）',
    venueShort: 'NeurIPS 2025',
    award: '',
    links: { pdf: '', code: 'https://github.com/example-lin/orchestra', bib: '', doi: '' },
    note: '通过联合优化请求批处理与 KV Cache 换入换出，在同等 SLO 下提升吞吐 1.8 倍。',
  },
  {
    id: 'tocs-2025',
    year: 2025,
    type: 'journal',
    title: '异构集群中状态机复制的一致性代价分析',
    authors: ['林行远', '合作者 D'],
    venue: 'ACM Transactions on Computer Systems, 43(2), 1-34',
    venueShort: 'ACM TOCS 2025',
    award: '',
    links: { pdf: '', code: '', bib: '', doi: '' },
    note: '',
  },
  {
    id: 'fedsketch-2024',
    year: 2024,
    type: 'conference',
    title: 'FedSketch: 联邦学习中的梯度草图压缩与误差补偿',
    authors: ['合作者 E', '林行远', '合作者 F'],
    venue: '第 19 届欧洲计算机系统会议（EuroSys \'24）',
    venueShort: 'EuroSys 2024',
    award: '',
    links: { pdf: '', code: 'https://github.com/example-lin/fedsketch', bib: '', doi: '' },
    note: '在低带宽链路上把上行通信量压缩两个数量级，同时保持收敛速度。',
  },
  {
    id: 'vmm-2024',
    year: 2024,
    type: 'conference',
    title: '面向多租户 GPU 的细粒度显存虚拟化',
    authors: ['林行远', '合作者 G', '合作者 H'],
    venue: '第七届机器学习与系统会议（MLSys \'24）',
    venueShort: 'MLSys 2024',
    award: '',
    links: { pdf: '', code: '', bib: '', doi: '' },
    note: '',
  },
  {
    id: 'edgecache-2023',
    year: 2023,
    type: 'conference',
    title: '边缘缓存的一致性感知副本放置',
    authors: ['林行远', '合作者 I'],
    venue: 'ACM SIGCOMM 2023 边缘计算 workshop',
    venueShort: 'SIGCOMM 2023 (Workshop)',
    award: '',
    links: { pdf: '', code: '', bib: '', doi: '' },
    note: '',
  },
  {
    id: 'survey-2023',
    year: 2023,
    type: 'preprint',
    title: '机器学习系统的可复现性：问题、成因与实践建议',
    authors: ['林行远', '合作者 J'],
    venue: 'arXiv:2308.00001 [cs.DC]',
    venueShort: 'arXiv 2023',
    award: '',
    links: { pdf: '', code: '', bib: '', doi: '' },
    note: '',
  },
]

/* -------------------------------- 科研项目 -------------------------------- */

export const PROJECTS = [
  {
    name: '面向大模型推理的显存调度理论与系统实现',
    role: '主持',
    funder: '国家自然科学基金青年科学基金项目',
    grantNo: '62xxxx01',
    period: '2025 — 2027',
    desc: '研究多租户推理场景下的显存分配下界，并构建可落地的调度原型系统。',
  },
  {
    name: '分布式智能计算平台',
    role: '参与',
    funder: '国家重点研发计划（子课题）',
    grantNo: '2024YFBxxxxxx',
    period: '2024 — 2027',
    desc: '负责跨地域算力调度与一致性保障模块的设计与实现。',
  },
  {
    name: '边缘端联邦学习通信优化',
    role: '主持',
    funder: '校企合作项目',
    grantNo: '—',
    period: '2023 — 2025',
    desc: '面向真实移动网络的梯度压缩方案，已在合作方测试环境中部署验证。',
  },
]

/* -------------------------------- 荣誉奖项 -------------------------------- */

export const AWARDS = [
  { year: '2026', name: '优秀青年科学基金', org: '国家自然科学基金委员会' },
  { year: '2025', name: '最佳论文奖', org: 'USENIX OSDI 2026' },
  { year: '2022', name: '博士研究生国家奖学金', org: '教育部' },
]

/* -------------------------------- 学术服务 -------------------------------- */

export const SERVICES = [
  'OSDI / EuroSys / MLSys / ACM TOCS 审稿人',
  'CCF 分布式计算与系统专委会 委员',
  'EuroSys 2026 Poster & Demo 分委会成员',
]

/* -------------------------------- 教学工作 -------------------------------- */

export const TEACHING = [
  { term: '2026 春', course: '分布式系统（本科生）', note: '选课 92 人' },
  { term: '2025 秋', course: '机器学习系统导论（研究生）', note: '选课 45 人' },
]
