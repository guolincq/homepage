---
title: Numpy/Pandas 处理光谱数据的常用模式
slug: numpy-pandas-spectra
date: 2026-03-21
category: 工程实践
tags: [Python, Numpy, Pandas, 光谱]
summary: 光谱数据是典型的"二维矩阵 + 一维波长轴"，几个固定的操作模式能覆盖大部分处理需求。
cover: /images/covers/matrix.svg
draft: false
---

<!-- 示例占位文章：内容为本站点演示 Markdown 渲染能力而写，发布前请替换为你自己的文章 -->

光谱数据立方体的结构很规整：一根波长轴，加一堆空间/时间采样点。这让 Numpy 的广播和 Pandas 的分组聚合特别好用。下面是我反复在用的几个模式。

## 数据布局约定

统一约定为：

- `wl`：形状 `(n_wave,)` 的波长轴
- `cube`：形状 `(n_wave, n_col, n_row)`，或压平成 `(n_wave, n_pixel)`

**把波长放在第 0 轴**，这样 `cube[i]` 就是单波段图像，`cube[:, j]` 就是单像元光谱，两种切片都直观。

```python
import numpy as np

n_wave, n_col, n_row = 400, 64, 64
cube = np.random.default_rng(0).normal(size=(n_wave, n_col, n_row))
wl = np.linspace(0.45, 3.0, n_wave)

spec = cube[:, 10, 20]   # 单个像元的光谱
band = cube[100]         # 第 100 个波段的图像
```

## 模式一：沿轴做归一化

 continuum removal（去连续统）需要每个像元独立处理，用广播一次搞定：

```python
def continuum_remove(cube):
    lo = cube[:20].mean(axis=0)          # 短波端基线
    hi = cube[-20:].mean(axis=0)         # 长波端基线
    baseline = (lo + hi) / 2
    return cube / (baseline[None, ...] + 1e-9)
```

关键是 `baseline[None, ...]` 把 `(n_col, n_row)` 变成 `(1, n_col, n_row)`，才能和 `(n_wave, n_col, n_row)` 广播。忘了这一步会得到形状不匹配的错误，或者更糟——静默地按最后一维对齐。

## 模式二：坏像元与坏波段的掩码

用 `np.errstate` 包住除法，避免一堆 RuntimeWarning：

```python
def safe_ratio(a, b):
    with np.errstate(divide='ignore', invalid='ignore'):
        out = np.where(np.abs(b) > 1e-9, a / b, np.nan)
    return out
```

统计有效像元数时用 `np.isfinite(..., axis=...).sum()`，比先填 0 再数准。

## 模式三：用 Pandas 管元数据

光谱本体留在 Numpy，元数据（观测时间、探测器温度、几何角、质量标记）交给 DataFrame。两者用**位置索引**对齐，简单可靠：

```python
import pandas as pd

meta = pd.DataFrame({
    'obs_time': pd.to_datetime(times),
    'det_temp': temps,
    'incidence': inc_angles,
    'flag': quality_flags,
})

good = meta.query('det_temp < 273 and incidence < 60 and flag == 0')
selected = cube[:, good.index.to_numpy()]   # 按位置取列
```

`good.index.to_numpy()` 这一步很关键：Pandas 的 index 经过筛选后不再是 0..n-1，直接 `cube[:, good.index]` 在 Numpy 里会被当**标签**而不是位置，容易取错。

## 模式四：分组聚合出平均光谱

```python
meta['bin'] = pd.cut(meta['incidence'], bins=[0, 30, 45, 60, 90])
for label, group in meta.groupby('bin', observed=True):
    idx = group.index.to_numpy()
    mean_spec = np.nanmean(cube[:, idx], axis=1)
    print(f'{label}: n={len(idx)}, mean@1.5um={mean_spec[np.argmin(abs(wl - 1.5))]:.4f}')
```

## 检查清单

处理完回头核验这几项，能挡掉大部分低级错误：

- [ ] 波长轴与数据第 0 轴长度一致
- [ ] 归一化用的是同一批像元的基线，没有跨像元串扰
- [ ] 除法的分母有下限保护，NaN 显式传播而非被 0 填充
- [ ] 从 DataFrame 取位置索引时用了 `.to_numpy()`
- [ ] 聚合前已剔除饱和与低信噪波段

## 小结

光谱处理里最贵的不是计算，是**排错**。把布局约定固定下来、把掩码和索引转换写成小函数，后面所有分析都会顺很多。
