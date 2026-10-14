# 个人学术主页 + 博客

一个**纯静态**的个人网站：单页学术主页 + Markdown 驱动的博客。
React 18 + Vite 5 + React Router，无后端、无数据库、无登录。

## 快速上手

```bash
npm run dev      # 本地开发，http://localhost:5173
npm run build    # 构建到 dist/
npm start        # 起静态服务（默认 4173，读 $PORT 环境变量）
```

依赖已安装，无需重新 `npm install`。

---

## 一、换成你自己的信息：**只需要改一个文件**

> **`src/content/profile.js`**

这个文件集中了站点的全部内容。改完刷新即可生效，无需动组件代码。

| 区块 | 常量 | 说明 |
|---|---|---|
| 站名、标语、导航 | `SITE` | `nav` 数组控制顶部导航项 |
| 姓名、职称、机构、邮箱、简介、社交链接 | `PROFILE` | 详见下方字段说明 |
| 研究兴趣卡片 | `INTERESTS` | `icon / title / desc / keywords` |
| 教育 / 工作经历 | `EDUCATION` | 时间线，按数组顺序从上到下 |
| 论文发表 | `PUBLICATIONS` | 自动按年份倒序分组 |
| 科研项目 | `PROJECTS` | 名称 / 角色 / 资助方 / 编号 / 起止 |
| 荣誉奖项 | `AWARDS` | 另有 `SERVICES`、`TEACHING` |

### PROFILE 字段说明

```js
export const PROFILE = {
  name: { cn: '林行远', en: 'Xingyuan Lin' },   // 中英文名
  role: '副教授 · 博士生导师',
  affiliation: { cn: '示例大学 …', en: 'Example University' },
  lab: { cn: '实验室名', en: 'Lab Name' },
  office: '信息科学楼 A-512',
  location: '中国 · 示例市',
  email: 'lin@example.edu',
  avatar: '',        // 留空 → 渐变块 + 姓名首字；也可填 '/images/avatar.jpg'
  cvUrl: null,       // null → 不显示简历按钮；填 '/files/cv.pdf'
  bio: ['第一段简介…', '第二段简介…'],
  social: [{ label: 'Google Scholar', icon: '🎓', url: 'https://…' }],
}
```

**头像 / 简历 / 论文 PDF** 都放在 `public/` 下：

```
public/images/avatar.jpg     →  PROFILE.avatar = '/images/avatar.jpg'
public/files/cv.pdf          →  PROFILE.cvUrl  = '/files/cv.pdf'
public/papers/xxx.pdf        →  该论文 links.pdf = '/papers/xxx.pdf'
```

> 链接留空字符串时，对应按钮不会渲染 —— 不会出现死链。

`PUBLICATIONS` 里作者名与 `PROFILE.name.cn` 或 `.en` 相同的项会自动加粗。

---

## 二、写博客：丢一个 `.md` 进 `src/content/posts/`

文件名建议 `YYYY-MM-DD-title.md`。构建时自动索引，无需注册。

```markdown
---
title: 文章标题
slug: my-post-url            # 可选；缺省取文件名去掉日期前缀
date: 2026-06-18              # YYYY-MM-DD
category: 论文阅读
tags: [分布式系统, 共识算法]
summary: 一句话摘要           # 可选；缺省自动截取正文前 110 字
cover: /images/covers/x.svg   # 可选；缺省用渐变占位色
draft: false                  # true 则不发布
---

正文从这里开始……
```

支持 GFM：多级标题、表格、任务清单、代码块（带语言标签 + 一键复制）、图片+图注、引用。
代码高亮注册了 8 种语言：`javascript` `typescript` `python` `bash` `json` `yaml` `xml` `sql`
（含 `js/jsx/ts/tsx/py/sh/html/yml` 等别名）。未注册的语言自动降级为纯文本，不会报错。

封面图放 `public/images/covers/`，仓库里已有 4 个现成的 SVG 占位封面。

---

## 三、目录结构

```
index.html                  # 站点标题、描述、favicon
vite.config.js              # 构建配置（含 manualChunks 分包）
server.mjs                  # 生产静态服务（vite preview，读 $PORT）
public/                     # 静态资源：封面图、头像、PDF
src/
├── main.jsx                # 入口 + 路由表（HashRouter + 路由懒加载）
├── styles.css              # 全部样式（CSS 变量 + 学术版式 + 代码高亮）
├── markdown.js             # marked + highlight.js + DOMPurify
├── utils/
│   ├── text.js             # 纯字符串工具（plainText / readingTime / formatDate）
│   └── gradient.js         # 封面渐变占位
├── content/
│   ├── profile.js          # ★ 全部站点内容
│   ├── frontmatter.js      # 手写 front-matter 解析（不依赖 gray-matter）
│   ├── index.js            # 文章索引（import.meta.glob）+ 筛选
│   └── posts/*.md          # 博客文章
├── components/             # Layout / ui / PostCard / MarkdownView / LatestPosts
├── academic/               # 学术主页各区块（Hero / 论文 / 时间线 / …）
└── pages/                  # AcademicHome / BlogList / PostDetail / TagsPage / NotFound
```

### 路由

| 路径 | 页面 |
|---|---|
| `/` | 学术主页（单页，含「最新文章」预览） |
| `/blog` | 文章列表，支持 `?tag=`、`?category=`、`?q=`、`?page=`、`?sort=` |
| `/blog/:slug` | 文章详情 |
| `/tags` | 标签云 + 分类 |

用的是 `HashRouter`（URL 带 `#`），好处是**任意静态托管 / 子目录都能直接跑，不需要服务端配置 history fallback**。
若部署环境支持 rewrite（Vercel、Netlify、nginx `try_files`），把 `src/main.jsx` 里的
`HashRouter` 改成 `BrowserRouter` 即可去掉 `#`，只需改这一处。

---

## 四、性能

构建后首屏 JS ≈ 187 KB（gzip ≈ 63 KB），其中 164 KB 是 react 全家桶本身。

优化手段：
- **highlight.js / marked / DOMPurify 全部隔离在文章详情的异步 chunk**，首屏不加载
- 路由级 `React.lazy` + `Suspense`（博客列表 / 详情 / 标签页 / 首页文章预览）
- `manualChunks` 把 react 单独成 vendor chunk，利于长期缓存
- 自写 ~40 行 hljs token 样式，替代 `github.css`

> ⚠️ 维护注意：`src/content/index.js` **不要** import `src/markdown.js`。
> `markdown.js` 依赖 marked + hljs，一旦被文章索引引用，highlight.js 会被打回首屏，
> 代码分割就失效了。纯字符串工具请统一放 `src/utils/text.js`。

---

## 五、部署（GitHub Pages）

线上地址：**https://guolincq.github.io/homepage/**

### 工作机制

推到 `main` 分支即触发 `.github/workflows/deploy.yml`：安装依赖 → `npm run build` →
上传 `dist/` → 部署到 Pages。约 1–2 分钟生效。

### ⚠️ `base` 是硬编码的，改部署路径必须同步

`vite.config.js` 里 `base: '/homepage/'` 与仓库名绑定。三个后果：

1. 本地 `npm run dev` / `npm run preview` 会自动 302 到 `/homepage/` 前缀 —— **这是预期行为**，
   想临时用根路径：`npm run dev -- --base=/`
2. 换仓库名 / 换域名时，必须同步改这一行，否则**资源 404 → 页面白屏**
   （HashRouter 下子页面不会 404，白屏是 base 配错的唯一症状）
3. 文章 front-matter 的 `cover` 与正文图片 `![](/images/...)` 是普通字符串，
   Vite 不会自动加前缀 —— 已由 `src/utils/asset.js` 的 `resolveAsset()` 统一处理。
   **新增图片资源时保持 `/images/xxx` 写法即可，不要手写 `/homepage/images/xxx`。**

### 首次部署需要在 GitHub 网页端做两件事

1. 新建空仓库 `homepage`（Public，**不要**勾选 README/.gitignore/license）
2. Settings → Pages → Source → 选 **GitHub Actions**

> Source 没改就 push，`configure-pages` 步骤会报 `Get Pages site failed`。
> 改对后不用重新 push，到 Actions 页 **Re-run failed jobs** 即可。

### 关联远端并推送（SSH）

```bash
git remote add origin git@github.com:guolincq/homepage.git
git push -u origin main
```

建库时不小心带了 README 导致 push 被拒 → `git pull --rebase origin main` 后重推。
**不要**用裸 `git push -f`。

### 验证

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://guolincq.github.io/homepage/
curl -sS https://guolincq.github.io/homepage/ | grep -o 'src="[^"]*assets[^"]*"'
# 期望：src="/homepage/assets/index-xxxx.js"（带 /homepage/ 前缀），且该 URL 返回 200
```

### 回滚

1. **紧急止血**：Actions → 选上一次成功的 run → **Re-run jobs**（成本最低，不动 git 历史）
2. **正式回滚**：`git revert <commit>` → `git push`（保留历史，推荐）

### 其他托管方式

构建产物在 `dist/`，是纯静态文件，也可以丢到任何静态托管：

- **任意对象存储 / nginx**：直接上传 `dist/`
- **本机或容器**：`npm install && npm run build && npm start`（注意 `server.mjs` 依赖 vite，
  部署命令必须装完整依赖，不能只装 `--production`）

---

## 六、可选功能

- **暗色模式**：CSS 变量已写好，但默认关闭。把 `src/content/profile.js` 里
  `SITE.enableDarkMode` 改为 `true`，右上角会出现切换按钮，选择记在 localStorage。
- **文章数量很多时**：目前用 `import.meta.glob(..., eager: true)`，文章正文会进入博客的
  异步 chunk。文章超过约 30 篇后，建议改为 `eager: false` 懒加载正文 +
  手写 `src/content/meta.json` 只存索引，避免列表页体积膨胀。

---

## 七、内容与隐私

站点内容全部来自 `src/content/profile.js`。按当前配置：

- **公开**：姓名、职称、研究方向、教育经历、论文与专利、科研项目、邮箱、GitHub
- **不公开**：单位、办公室、所在地、手机、微信、出生年月、政治面貌、籍贯
  —— 这些值写在 `profile.js` 末尾的**注释区**，取消注释并同步到 `PROFILE` 相应字段才会展示

`src/content/posts/` 里的 4 篇文章是**示例占位**（顶部有 HTML 注释标明），
用于展示 Markdown 渲染能力，发布前请替换为你自己的文章。

## 八、已知边界

- 纯静态站点的 SEO 依赖外部抓取；学术主页的可见度主要来自 Google Scholar / DBLP 外链。
- 简历未提供 Google Scholar / ORCID 链接 → 目前只显示 GitHub，拿到后取消 `profile.js` 里的注释即可。
- 简历未提供奖项 / 教学 / 学术服务 → 对应区块为空时自动隐藏。
- LPSC 2024 会议论文无 DOI，标题显示「标题待补」，需手动补齐。
- 项目根目录的 `.wbapp_*.genie` 与 `.workbuddy/` 是 WorkBuddy 本地标识，已在 `.gitignore` 中排除，
  不会进公开仓库。
- 本仓库有 git 版本控制，重建前的旧版本（云端博客版）在首个 commit 里可查。
