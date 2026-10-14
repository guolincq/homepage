---
title: Zotero + LaTeX 科研写作流水
slug: research-toolchain
date: 2026-02-09
category: 研究方法
tags: [LaTeX, Zotero, 工具链]
summary: 文献管理与论文写作这两件事打通之后，改引用不再需要手动同步，专注力能省下来给内容本身。
cover: /images/covers/pipeline.svg
draft: false
---

<!-- 示例占位文章：内容为本站点演示 Markdown 渲染能力而写，发布前请替换为你自己的文章 -->

科研写作里最消耗注意力的杂事之一，是**引用的同步**：改了一句论述要换文献，就得去 .bib 里找、改 key、再编译一遍。这套流水把这件事自动化掉。

## 一、Zotero 侧：Better BibTeX

装 [Better BibTeX](https://retorque.re/zotero-better-bibtex/) 插件，做两件事：

1. 给每个条目设**稳定的 citation key**，格式建议 `第一作者姓 + 年份 + 标题首词`，例如 `liu2022water`
2. 开启**自动导出**到项目目录的 `refs.bib`，保存即更新

稳定 key 很重要——默认的随机 key 在条目重新导入时会变，导致正文里的 `\cite{}` 全部失效。

```json
{
  "citekeyFormat": "[auth:lower][year][title:fold:skipwords:select=1,1]",
  "autoExport": "immediately",
  "bibtexURL": "file:///absolute/path/to/paper/refs.bib"
}
```

## 二、LaTeX 侧：biblatex + biber

```latex
\usepackage[backend=biber, style=numeric-comp, sorting=none]{biblatex}
\addbibresource{refs.bib}

...

\printbibliography
```

`sorting=none` 让引用按**出现顺序**编号，改文献时编号整体重排由 biber 负责，不用手动维护。

编译链：

```bash
pdflatex main
biber main
pdflatex main
pdflatex main
```

嫌麻烦就用 `latexmk -pdf -pdflatex="pdflatex -interaction=nonstopmode" main`，它会自动判断需要跑几遍。

## 三、目录结构

```
paper/
├── main.tex
├── refs.bib          ← Zotero 自动导出，不要手动改
├── sections/
│   ├── intro.tex
│   ├── method.tex
│   └── result.tex
└── figures/
```

**`refs.bib` 是生成物，不要手工编辑**——下一次 Zotero 导出就会覆盖掉。要补充的字段（如备注、自定义标签）写在 Zotero 的 Extra 里，BibTeX 插件支持把特定字段带出来。

## 四、与 Git 配合

`.gitignore` 里忽略编译中间产物，但**要提交 `refs.bib`**（否则换台机器就编译不过）：

```
*.aux  *.bbl  *.blg  *.log  *.out  *.toc  *.bcf  *.run.xml
main.pdf
```

> 把文献库和写作工程分开管理：Zotero 管"读什么"，Git 管"写了什么"。两者只通过 `refs.bib` 这一个文件耦合。

## 五、常见故障

| 现象 | 原因 | 解决 |
| --- | --- | --- |
| 引用显示为 `[?]` | 只跑了 pdflatex 没跑 biber | 补跑 biber，再编译两遍 |
| citation key 全部变了 | key 格式未固定 | 在 BBT 里重设格式并锁定已有 key |
| 中文文献乱码 | 编码或引擎问题 | 用 `xelatex` + UTF-8，字体设 `ctex` |
| 编译报 `I found no \citation commands` | biber 没找到 aux | 确认先跑过一次 pdflatex |

## 小结

这套流水的核心价值不在于省下几分钟编译时间，而在于**把"改引用"这个动作的心理成本降到接近零**。成本低了，你才会真的去反复打磨论证与文献的对应关系。
