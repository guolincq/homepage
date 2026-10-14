/**
 * ============================================================================
 *  站点全部内容 —— 要换成你自己的信息，只需要改这一个文件。
 * ============================================================================
 *
 *  1. 改 SITE      ：站名、标语、导航、每页文章数
 *  2. 改 PROFILE   ：姓名、职称、机构、邮箱、头像、简介、社交链接
 *  3. 改 INTERESTS ：研究兴趣卡片
 *  4. 改 SKILLS    ：专业技能
 *  5. 改 EDUCATION ：教育/工作经历（时间线）
 *  6. 改 PUBLICATIONS：论文与专利（自动按年份倒序分组）
 *  7. 改 PROJECTS  ：科研项目
 *  8. 改 AWARDS    ：荣誉奖项（为空时该区块自动隐藏）
 *
 *  说明：
 *  - 论文 PDF 链接写 '/papers/xxx.pdf'，把 PDF 放到 public/papers/ 下即可生效。
 *    链接留空字符串时，对应按钮不会渲染（避免死链）。
 *  - avatar 留空时用渐变色块 + 姓名首字占位。
 *  - cvUrl 设为 null 时不显示「简历」按钮；填 '/files/cv.pdf' 并把文件放进 public/files/。
 *  - 本文件末尾有「不公开信息」注释区：单位、电话、微信等，取消注释才会上线展示。
 */

/* --------------------------------- 站点 --------------------------------- */

export const SITE = {
  name: '郭林 · 学术主页',
  shortName: '郭林',
  brandMark: '郭',
  tagline: '行星光谱数据处理 · 天文图像目标检测',
  description:
    '郭林的个人学术主页：行星光谱数据定标与反射率反演、天文图像目标检测方向的研究经历、论文发表与科研项目。',
  author: '郭林',
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
  name: { cn: '郭林', en: 'Lin Guo' },
  role: '助理研究员',
  /** 以下四项留空则不渲染（隐私考虑，真实值见文件末尾注释区） */
  affiliation: { cn: '', en: '' },
  lab: { cn: '', en: '' },
  office: '',
  location: '',

  email: 'guolin_cq@163.com',
  /** 留空 → 渐变色块 + 姓名首字；也可填 '/images/avatar.jpg'（文件放 public/images/） */
  avatar: '',
  /** null → 不显示简历按钮；填 '/files/cv.pdf' 并把文件放进 public/files/ */
  cvUrl: null,

  bio: [
    '博士期间参与月球与深空探测相关光谱载荷数据的数据处理与方法优化，涉及嫦娥四号可见与近红外成像光谱仪、嫦娥五号矿物光谱仪、祝融号短波红外光谱仪与天问一号中分辨率相机。工作集中在反射率反演、热校正与地形校正等数据校正方法的建立，以及基于校正数据的月壤水含量、光度特性与火星表面物质成分分析。',
    '目前主要研究方向为天文图像目标检测，关注自适应分割阈值确定方法。相关成果发表于 Journal of Geophysical Research: Planets、The Astronomical Journal、Nature Communications、Science Advances 等期刊，并已形成发明专利两项（其中一项实审中）。',
  ],

  social: [
    { label: 'GitHub', icon: '🐙', url: 'https://github.com/guolincq' },
    // 简历里未提供，拿到后取消注释即可显示
    // { label: 'Google Scholar', icon: '🎓', url: 'https://scholar.google.com/citations?user=XXXX' },
    // { label: 'ORCID', icon: '🆔', url: 'https://orcid.org/0000-0000-0000-0000' },
  ],
}

/** 作者列表里代表本人的写法，命中即加粗 */
export const SELF_ALIASES = ['郭林', 'Guo L', 'Guo Lin', 'Lin Guo']

/* ------------------------------- 研究兴趣 ------------------------------- */

export const INTERESTS = [
  {
    icon: '🪐',
    title: '行星光谱数据处理与在轨定标',
    desc: '建立就位探测光谱的反射率反演、热校正、地形校正与波长漂移校正方法，把原始辐亮度数据转换为可比较的物质成分信息。',
    keywords: ['反射率反演', '热校正', '地形校正', '波长漂移'],
  },
  {
    icon: '🔭',
    title: '天文与行星图像目标检测',
    desc: '研究天文图像中目标的自适应分割阈值确定方法，并结合深度学习处理复杂背景下的检测与分割问题。',
    keywords: ['自适应阈值', '目标检测', '图像分割', '深度学习'],
  },
  {
    icon: '🚀',
    title: '月球与深空探测载荷数据方法优化',
    desc: '面向嫦娥四号、嫦娥五号、祝融号、天问一号等任务的光谱与成像载荷，开展数据处理流程设计与方法优化。',
    keywords: ['嫦娥四号', '嫦娥五号', '祝融号', '天问一号'],
  },
  {
    icon: '🧮',
    title: '科学计算与科研工具链',
    desc: '以 Python 科学计算栈支撑数据处理流水线，并用版本控制、Markdown/LaTeX 与文献管理工具保证结果可复现。',
    keywords: ['Python', 'Numpy/Pandas', 'LaTeX', 'Zotero'],
  },
]

/* -------------------------------- 专业技能 -------------------------------- */

export const SKILLS = [
  'CET-6 / 博士学位英语',
  'Python 编程',
  'Numpy / Pandas / Scipy / Matplotlib',
  'Git / JupyterLab / VSCode',
  'Markdown / LaTeX',
  'Zotero / EndNote',
  '深度学习（了解）',
]

/* ---------------------------- 教育 / 工作经历 ---------------------------- */

export const EDUCATION = [
  {
    period: '2020.09 — 2024.07',
    title: '理学博士 · 天文技术与方法',
    org: '中国科学院大学 / 国家天文台',
    note: '博士期间参与月球与深空探测相关光谱载荷数据的数据处理与方法优化。',
  },
  {
    period: '2018.09 — 2020.07',
    title: '硕博连读（硕士段）· 天体物理',
    org: '中国科学院大学 / 国家天文台',
    note: '',
  },
  {
    period: '2014.09 — 2018.07',
    title: '理学学士 · 核物理',
    org: '北京航空航天大学',
    note: '',
  },
]

/* -------------------------------- 论文与专利 -------------------------------- */

/**
 * type:   'journal' | 'conference' | 'preprint' | 'patent'
 * authors: 字符串数组，命中 SELF_ALIASES 的项自动加粗
 * position: 作者位次，形如 '1/8'；共同一作在 note 里说明
 * zone:   中科院分区，形如 '中科院1区'
 * links:  值为空字符串时不渲染对应按钮
 */
export const PUBLICATIONS = [
  {
    id: 'patent-2026-astronomy-detection',
    year: 2026,
    type: 'patent',
    title: '一种自适应天文图像目标检测分割阈值确定方法和装置',
    authors: ['郭林', '薛武'],
    position: '1/2',
    zone: '',
    venue: '发明专利（实审中）',
    venueShort: '发明专利',
    award: '',
    links: { pdf: '', code: '', bib: '', doi: '' },
    note: '',
  },
  {
    id: 'isp2025-color',
    year: 2025,
    type: 'journal',
    title:
      'A new approach to color correction and equalization for generating mars global color image mosaics from Tianwen-1 MoRIC images',
    authors: ['Ren X', 'et al.'],
    position: '9/16',
    zone: '中科院1区',
    venue: 'ISPRS Journal of Photogrammetry and Remote Sensing, 2025',
    venueShort: 'ISPRS J P&RS 2025',
    award: '',
    links: { pdf: '', code: '', bib: '', doi: 'https://doi.org/10.1016/j.isprsjprs.2025.04.024' },
    note: '',
  },
  {
    id: 'na2025-ce6-water',
    year: 2025,
    type: 'journal',
    title: 'Lunar surface and subsurface water revealed by Chang’e-6',
    authors: ['Liu B', 'Zeng X', 'et al.'],
    position: '6/13',
    zone: '中科院1区',
    venue: 'Nature Astronomy, 2025',
    venueShort: 'Nature Astronomy 2025',
    award: '',
    links: { pdf: '', code: '', bib: '', doi: 'https://doi.org/10.1038/s41550-025-02668-7' },
    note: '',
  },
  {
    id: 'jgr2025-weathering',
    year: 2025,
    type: 'journal',
    title: 'In Situ Observation of Weathering Rinds at the Zhurong Landing Site, Mars',
    authors: ['Zhang Q', 'Carter J', 'et al.'],
    position: '6/13',
    zone: '中科院1区',
    venue: 'Journal of Geophysical Research: Planets, 2025, 130(9)',
    venueShort: 'JGR-Planets 2025',
    award: '',
    links: { pdf: '', code: '', bib: '', doi: 'https://doi.org/10.1029/2025JE009196' },
    note: '',
  },
  {
    id: 'grl2025-hydrous',
    year: 2025,
    type: 'journal',
    title: 'Hydrous Components of Dusty Surfaces Inferred From Zhurong In Situ Observations',
    authors: ['Zhang Q', 'Vincendon M', 'et al.'],
    position: '6/13',
    zone: '中科院1区',
    venue: 'Geophysical Research Letters, 2025, 52(18)',
    venueShort: 'GRL 2025',
    award: '',
    links: { pdf: '', code: '', bib: '', doi: 'https://doi.org/10.1029/2025GL115266' },
    note: '',
  },
  {
    id: 'jgr2024-ce5-photometric',
    year: 2024,
    type: 'journal',
    title: 'Chang’E-5 In Situ Spectra Reveal Photometric Properties of the Lunar Surface',
    authors: ['Guo L', 'et al.'],
    position: '1/8',
    zone: '中科院1区',
    venue: 'Journal of Geophysical Research: Planets, 2024, 129(2)',
    venueShort: 'JGR-Planets 2024',
    award: '第一作者',
    links: { pdf: '', code: '', bib: '', doi: 'https://doi.org/10.1029/2023JE007847' },
    note: '利用校正后的就位光谱数据开展月面采样区光度特性研究。',
  },
  {
    id: 'aj2024-ce5-thermal',
    year: 2024,
    type: 'journal',
    title:
      'Chang’E-5 In Situ Spectra Revealing Meter-scale Surface Temperature Distribution Characteristic of the Moon',
    authors: ['Ren X', 'Guo L', 'et al.'],
    position: '1/12',
    zone: '中科院2区',
    venue: 'The Astronomical Journal, 2024, 168(3)',
    venueShort: 'Astron. J. 2024',
    award: '共同第一作者',
    links: { pdf: '', code: '', bib: '', doi: 'https://doi.org/10.3847/1538-3881/ad566f' },
    note: '建立就位光谱数据的热校正方法。',
  },
  {
    id: 'grsl2024-mars-frame',
    year: 2024,
    type: 'journal',
    title: 'A New Global Reference Frame for Mars From Tianwen-1 Moderate Resolution Images',
    authors: ['Yan W', 'et al.'],
    position: '8/13',
    zone: '中科院3区',
    venue: 'IEEE Geoscience and Remote Sensing Letters, 2024',
    venueShort: 'IEEE GRSL 2024',
    award: '',
    links: { pdf: '', code: '', bib: '', doi: 'https://doi.org/10.1109/LGRS.2024.3448616' },
    note: '',
  },
  {
    id: 'scib2024-mars-map',
    year: 2024,
    type: 'journal',
    title: 'A 76-m per pixel global color image dataset and map of Mars by Tianwen-1',
    authors: ['Liu J', 'Ren X', 'et al.'],
    position: '11/18',
    zone: '中科院1区',
    venue: 'Science Bulletin, 2024',
    venueShort: 'Science Bulletin 2024',
    award: '',
    links: { pdf: '', code: '', bib: '', doi: 'https://doi.org/10.1016/j.scib.2024.04.045' },
    note: '',
  },
  {
    id: 'lpsc2024',
    year: 2024,
    type: 'conference',
    title: '（标题待补）',
    authors: ['Chen Z', 'Caravaca G', 'et al.'],
    position: '9/22',
    zone: '',
    venue: '55th Lunar and Planetary Science Conference, 2024, 1308',
    venueShort: 'LPSC 2024',
    award: '',
    links: { pdf: '', code: '', bib: '', doi: '' },
    note: '简历未提供 DOI，标题待手动补齐。',
  },
  {
    id: 'patent-2023-mars-calibration',
    year: 2023,
    type: 'patent',
    title: '适用于火星就位探测光谱在轨定标和反射率确定方法',
    authors: ['郭林', '任鑫', '等'],
    position: '1/8',
    zone: '',
    venue: '发明专利',
    venueShort: '发明专利',
    award: '',
    links: { pdf: '', code: '', bib: '', doi: '' },
    note: '建立祝融号短波红外光谱仪的波长漂移校正与反射率计算方法。',
  },
  {
    id: 'sciadv2023-mars-water',
    year: 2023,
    type: 'journal',
    title: 'Modern water at low latitudes on Mars: Potential evidence from dune surfaces',
    authors: ['Qin X', 'Ren X', 'et al.'],
    position: '14/21',
    zone: '中科院1区',
    venue: 'Science Advances, 2023',
    venueShort: 'Science Advances 2023',
    award: '',
    links: { pdf: '', code: '', bib: '', doi: 'https://doi.org/10.1126/sciadv.add8868' },
    note: '为该项研究提供祝融号在轨探测数据处理支持。',
  },
  {
    id: 'grl2023-dust',
    year: 2023,
    type: 'journal',
    title: 'Dust Deposition at Zhurong Landing Site From Multispectral Camera Observations',
    authors: ['Zhang Q', 'Liu D', 'et al.'],
    position: '5/10',
    zone: '中科院1区',
    venue: 'Geophysical Research Letters, 2023',
    venueShort: 'GRL 2023',
    award: '',
    links: { pdf: '', code: '', bib: '', doi: 'https://doi.org/10.1029/2023GL104676' },
    note: '',
  },
  {
    id: 'natcomm2022-ce5-water',
    year: 2022,
    type: 'journal',
    title:
      'Evidence of water on the lunar surface from Chang’E-5 in-situ spectra and returned samples',
    authors: ['Liu J', 'Liu B', 'et al.'],
    position: '6/25',
    zone: '中科院1区',
    venue: 'Nature Communications, 2022',
    venueShort: 'Nat. Commun. 2022',
    award: '',
    links: { pdf: '', code: '', bib: '', doi: 'https://doi.org/10.1038/s41467-022-30807-5' },
    note: '利用校正后的数据计算 CE-5 着陆区月壤水含量。',
  },
  {
    id: 'grl2022-ce4-mafic',
    year: 2022,
    type: 'journal',
    title:
      'Dusty Mafic Rocks Along the Path of Chang’E-4 Rover: Initial Analysis of the Image Cubes of the Onboard Visible and Near-Infrared Imaging Spectrometer',
    authors: ['Wang X', 'Liu J', 'et al.'],
    position: '5/11',
    zone: '中科院1区',
    venue: 'Geophysical Research Letters, 2022',
    venueShort: 'GRL 2022',
    award: '',
    links: { pdf: '', code: '', bib: '', doi: 'https://doi.org/10.1029/2021gl095033' },
    note: '',
  },
  {
    id: 'icarus2022-mscam',
    year: 2022,
    type: 'journal',
    title:
      'A reflectance calibration method for Multispectral Camera (MSCam) on the Zhurong rover',
    authors: ['Zhang Q', 'Liu D', 'et al.'],
    position: '4/12',
    zone: '中科院2区',
    venue: 'Icarus, 2022',
    venueShort: 'Icarus 2022',
    award: '',
    links: { pdf: '', code: '', bib: '', doi: 'https://doi.org/10.1016/j.icarus.2022.115208' },
    note: '',
  },
  {
    id: 'prc2020-pairing',
    year: 2020,
    type: 'journal',
    title: 'Isospin-density-dependent pairing from infinite nuclear matter to finite nuclei',
    authors: ['Meng X', 'Zhang S', 'et al.'],
    position: '3/5',
    zone: '中科院2区',
    venue: 'Physical Review C, 2020',
    venueShort: 'Phys. Rev. C 2020',
    award: '',
    links: { pdf: '', code: '', bib: '', doi: 'https://doi.org/10.1103/PhysRevC.102.064322' },
    note: '本科阶段工作。',
  },
]

/* -------------------------------- 科研项目 -------------------------------- */

export const PROJECTS = [
  {
    name: '天文图像目标检测与自适应分割阈值方法',
    role: '负责',
    funder: '—',
    grantNo: '—',
    period: '2024.12 — 至今',
    desc: '研究自适应天文图像目标检测分割阈值确定方法，相关成果已形成发明专利（实审中）。',
  },
  {
    name: '嫦娥五号 矿物光谱仪数据校正与月壤水含量反演',
    role: '参与',
    funder: '博士期间课题',
    grantNo: '—',
    period: '博士期间（2020 — 2024）',
    desc: '利用原始就位光谱数据建立反射率计算、热校正、地形校正方法；热校正成果发表于 The Astronomical Journal（共同一作），光度特性研究发表于 JGR-Planets（一作），月壤水含量成果发表于 Nature Communications。',
  },
  {
    name: '祝融号 短波红外光谱仪在轨定标',
    role: '参与',
    funder: '博士期间课题',
    grantNo: '—',
    period: '博士期间（2020 — 2024）',
    desc: '建立波长漂移校正与反射率计算方法，形成发明专利一项，为课题组 Science Advances 成果提供数据支持。',
  },
  {
    name: '天问一号 中分辨率相机全球影像图',
    role: '参与',
    funder: '博士期间课题',
    grantNo: '—',
    period: '博士期间（2020 — 2024）',
    desc: '参与「中国首次火星探测火星全球影像图」制作，承担其中光度校正工作，影像由国家航天局于 2023 年 4 月 24 日发布。',
  },
  {
    name: '嫦娥四号 可见与近红外成像光谱仪数据处理',
    role: '参与',
    funder: '博士期间课题',
    grantNo: '—',
    period: '博士期间（2020 — 2024）',
    desc: '编写光谱仪辐亮度数据反射率计算程序，进行光谱仪图像与避障相机图像配准，开展巡视路径上光谱数据综合分析。',
  },
]

/* -------------------------------- 荣誉奖项 -------------------------------- */
/* 简历未提供，留空时该区块自动隐藏 */

export const AWARDS = []

/* -------------------------------- 学术服务 -------------------------------- */

export const SERVICES = []

/* -------------------------------- 教学工作 -------------------------------- */

export const TEACHING = []

/* ============================================================================
 *  以下为「不公开信息」——取消注释并同步到上方 PROFILE 相应字段才会上线展示。
 *  当前站点按你的要求只公开邮箱与学术链接。
 * ============================================================================
 *
 *  PROFILE.affiliation = { cn: '航天工程大学', en: 'Space Engineering University' }
 *  PROFILE.lab         = { cn: '（实验室/教研室名称）', en: '' }
 *  PROFILE.office      = '（办公室门牌）'
 *  PROFILE.location    = '中国 · （城市）'
 *  PROFILE.phone       = '19908374862'      // 组件目前不渲染电话，需自行加字段
 *  PROFILE.wechat      = 'guolin_cq'        // 组件目前不渲染微信，需自行加字段
 *  出生年月：1996.05
 *  籍贯：重庆市
 *  政治面貌：中共党员
 *
 *  注意：以上信息一旦取消注释即会出现在公开站点上，可被搜索引擎抓取。
 * ============================================================================
 */
