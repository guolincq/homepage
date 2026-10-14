# 个人博客 · 项目说明

一个基于 React + Vite 的个人博客系统，文章、标签、关于页内容存于云数据库，图片/附件存于云端对象存储，博主通过邮箱密码 / 邮箱验证码 / 微信扫码登录后台撰写文章。

- 线上地址：https://personal-blog-91222.app.workbuddy.host/
- 应用 ID：`wbapp_uDOwiIXjOH2UKaG5u6MefY`

---

## 一、功能清单

| 模块 | 说明 |
| --- | --- |
| 文章列表页 | 分页（每页 8 篇）、按标签/分类筛选、最新/最早排序、标题与摘要关键字搜索 |
| 文章详情页 | Markdown 渲染，支持代码高亮（15 种语言）、图片、表格、引用、外链新窗口打开、代码块一键复制 |
| 标签 / 分类 | 一篇文章可挂多个标签；`/tags` 聚合展示标签云与分类，按文章数排序；`/tag/:tag`、`/category/:cat` 查看聚合列表 |
| 关于页面 | Markdown 编辑，支持头像、签名、联系方式（外链） |
| 后台管理 | 文章新建 / 编辑 / 删除 / 发布-草稿切换，Markdown 编辑器含实时预览与图片上传 |
| 用户认证 | 邮箱密码登录、邮箱验证码登录与注册、找回密码、微信扫码登录；未登录访问 `/admin` 自动跳转登录页 |
| 响应式 | 桌面双栏编辑器，移动端单列 + 汉堡菜单 |

## 二、技术栈

- 前端：React 18 + React Router 6（HashRouter，适配静态托管无 history 回退）+ Vite 5
- Markdown：`marked` + `highlight.js`（按需注册语言）+ `DOMPurify`（XSS 过滤）
- 后端：WorkBuddy 云服务（云数据库 PostgreSQL / 对象存储 / 用户认证），SDK `@tencent-ai/workbuddy-cloud-sdk`
- 部署：单端口 HTTP 服务（`server.mjs` 用 Vite preview API 监听 `$PORT`）

## 三、目录结构

```
.
├── index.html              # 入口
├── server.mjs              # 生产启动脚本（读取 PORT 环境变量）
├── vite.config.js
├── src/
│   ├── main.jsx            # 路由表
│   ├── cloud.js            # 云服务客户端初始化（publicConfig）
│   ├── api.js              # 数据访问层：文章 CRUD、标签聚合、资料、资源上传
│   ├── markdown.js         # Markdown 渲染、代码高亮、资源引用解析
│   ├── auth.jsx            # 登录态 Context（含微信回调处理）
│   ├── components.jsx      # 布局、卡片、分页、Toast、路由守卫
│   ├── siteConfig.js       # 站点名称 / 标语 / 导航 / 每页条数
│   ├── styles.css
│   └── pages/              # Home / PostDetail / TagsPage / About / Login / Admin / PostEditor / ProfileEditor
└── README.md
```

## 四、数据库结构

云服务数据库为托管 PostgreSQL，三张表均已开启行级安全（RLS）。

### 1. posts —— 文章

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | bigint identity | 主键 |
| owner_id | text，默认 `auth.uid()` | 作者，服务端填充，前端不传 |
| title | text | 标题 |
| slug | text unique | 友好链接别名（可选） |
| summary | text | 摘要，留空自动截取正文 |
| content_md | text | Markdown 正文，图片以 `asset:<id>` 引用 |
| cover | text | 封面图地址，留空用渐变占位 |
| category | text | 分类，默认「未分类」 |
| tags | text[] | 标签数组，GIN 索引 |
| status | text | `published` / `draft` |
| views | int | 阅读量 |
| published_at / updated_at | timestamptz | 发布时间 / 更新时间 |

RLS：`SELECT` 允许「已发布 或 本人」；`INSERT/UPDATE/DELETE` 仅限本人（`owner_id = auth.uid()`）。

### 2. site_profile —— 关于页资料

`id / owner_id / display_name / tagline / avatar / content_md / links(jsonb) / updated_at`
RLS：所有人可读；写入仅限本人。

### 3. assets —— 图片与附件

`id / owner_id / name / mime / size / storage_path / data / created_at`
- `storage_path`：对象存储路径（`shared/<uid>/posts/...`），登录用户可读
- `data`：压缩后的内容副本，用于匿名访客直接渲染
RLS：所有人可读；写入仅限本人。

> 说明：对象存储不提供公开 URL，且签名链接最长 1 小时。为保证访客不登录也能看到文章配图，上传时同时写入对象存储（原件）与 `assets.data`（压缩后的 WebP 副本，最长边 1600px）。正文引用 `asset:<id>`，渲染时替换为可显示内容。

### 建表与策略

建表 SQL 与 RLS 已执行完成，如需在其它环境重建，可使用 `README` 中的结构定义；当前环境通过 `启用行级安全 + GRANT 给 authenticated/anon + 四条策略` 完成授权。

## 五、本地开发

```bash
npm install
npm run dev        # http://127.0.0.1:5173
npm run build      # 产物在 dist/
npm start          # 生产预览，监听 $PORT（默认 4173）
```

注意：`src/cloud.js` 中的 `endpoint` / `publishableKey` 必须与当前应用的 `publicConfig` 一致，且服务端校验 Origin 精确匹配——本地 `localhost` 访问时云数据库请求会被拒绝，需在已发布域名下验证。

## 六、部署

项目以单端口 HTTP 服务部署：

- 安装命令：`npm install && npm run build`
- 启动命令：`npm start`（`server.mjs` 读取 `PORT` 环境变量，绑定 `0.0.0.0`）
- 应用 ID 与云服务为同一应用，发布域名与云服务 `endpoint` 同源，登录与数据请求才不会被 Origin 校验拦截

重新发布：在 WorkBuddy 中执行「发布为应用」，目录指向本项目根目录即可覆盖更新线上内容。

## 七、使用指南

1. 访问 `/#/login`，用邮箱验证码完成注册（新用户需设置密码），之后即可用邮箱 + 密码登录。
2. 登录后进「后台」→「写新文章」：填写标题、分类、标签（逗号分隔），正文支持 Markdown；工具栏可插入粗体、标题、引用、代码块、链接，图片通过「插入图片」上传后自动写入 `![名称](asset:id)`。
3. 文章默认「已发布」；选「草稿」则只有自己在后台能看到。
4. 「站点资料」页可编辑头像、昵称、签名、关于页正文与联系方式（JSON 数组格式：`[{"label":"GitHub","url":"https://..."}]`）。
5. 站点名称、标语、导航、每页条数在 `src/siteConfig.js` 中修改，改完重新构建发布即可。

## 八、已知边界

- 微信扫码登录依赖站点 HTTPS 正式域名，本地预览不可用；若后台未开启微信登录，会提示「未打开微信登录」。
- 文章图片在上传时压缩为最长边 1600px 的 WebP，单文件上限 5MB。
- 标签与分类由已发布文章实时聚合，无需单独维护。
