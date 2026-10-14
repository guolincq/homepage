---
title: 把静态博客首屏压到 60KB
slug: static-blog-perf
date: 2026-05-02
category: 工程实践
tags: [性能优化, Vite, 前端]
summary: 一个 React 静态站从 425KB 首屏降到约 60KB（gzip 后）的全过程记录，核心是三件事：依赖隔离、路由懒加载、语言包裁剪。
cover: /images/covers/perf.svg
draft: false
---

起因很简单：一个纯展示型博客，首屏 JS 居然有 425KB。检查下来，`highlight.js` 注册了 15 种语言，加上 `marked` 和整个后台编辑器，全部被打进了同一个 chunk。

![优化前后体积对比](/images/covers/perf.svg)

## 第一步：确认瓶颈

用 `rollup-plugin-visualizer` 或直接看构建输出都能定位。这里是构建命令：

```bash
npx vite build --mode production
ls -lh dist/assets
```

输出里只有一个 JS 文件，说明没有任何代码分割生效。

## 第二步：切断隐式依赖

最容易踩的坑是这个——文章索引只需要 `plainText` 和 `readingTime` 两个纯函数，但它们当时写在 `markdown.js` 里，而 `markdown.js` 顶部 `import hljs from 'highlight.js/lib/core'`。

```js
// ❌ 这样写会把 highlight.js 拖回首屏
import { plainText } from './markdown'

// ✅ 拆出纯字符串工具，只依赖它
import { plainText } from './utils/text'
```

把纯字符串工具单独成一个文件后，Rollup 才能把 `markdown.js` 整体归到异步 chunk。

## 第三步：裁剪语言包

`highlight.js` 支持按需注册。15 种语言原始体积约 140KB，砍到 8 种后降到约 72KB：

```js
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import yaml from 'highlight.js/lib/languages/yaml'
import xml from 'highlight.js/lib/languages/xml'
import sql from 'highlight.js/lib/languages/sql'
import plaintext from 'highlight.js/lib/languages/plaintext'
```

未注册的语言会走 `escapeHtml` 降级成纯文本，**不会报错**，这点很关键——可以先激进裁剪，再按需补。

## 第四步：路由懒加载

```jsx
const BlogList = React.lazy(() => import('./pages/BlogList'))
const PostDetail = React.lazy(() => import('./pages/PostDetail'))

<Route path="/blog" element={
  <Suspense fallback={<Spinner />}>
    <BlogList />
  </Suspense>
} />
```

再配上 `manualChunks` 把 react 全家桶单独成 vendor chunk，利于长期缓存：

```json
{
  "build": {
    "rollupOptions": {
      "output": {
        "manualChunks": { "react": ["react", "react-dom", "react-router-dom"] }
      }
    }
  }
}
```

## 结果

首屏 JS 从 425KB 降到约 185KB（未压缩），gzip 后约 60KB。剩下的 130KB 基本是 react-dom 本身，属于纯 React 站的下限。

## 待办

- [x] 依赖隔离
- [x] 语言包裁剪
- [x] 路由懒加载
- [ ] 首屏关键 CSS 内联（收益约 200ms）
- [ ] 字体子集化（收益视字体而定）
