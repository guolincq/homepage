---
title: 用 Python 做光谱反射率计算的几个坑
slug: spectral-reflectance-python
date: 2026-06-18
category: 数据处理
tags: [光谱, Python, 定标]
summary: 从辐亮度到反射率，中间每一步都有会静默污染结果的细节。整理几个实践中最容易踩的坑。
cover: /images/covers/spectrum.svg
draft: false
---

<!-- 示例占位文章：内容为本站点演示 Markdown 渲染能力而写，发布前请替换为你自己的文章 -->

就位探测光谱仪拿到的是数字量化值（DN），要变成可与实验室光谱比较的反射率，中间要过好几道。每一步看着都只有几行代码，但写错了**不会报错，只会让结果悄悄偏离**。

## 一、DN → 辐亮度：别忘暗电流

暗电流（dark current）是探测器在无光照下的本底输出，随温度漂移。很多流程里它是单独测的一帧或一组帧，容易被漏掉。

```python
import numpy as np


def dn_to_radiance(dn, gain, offset, dark=None, exposure=1.0):
    """DN → 辐亮度。dark 为同温度下的暗电流帧（可为标量或同 shape 数组）。"""
    dn = np.asarray(dn, dtype=np.float64)
    if dark is not None:
        dn = dn - np.asarray(dark, dtype=np.float64)
    return (dn - offset) / (gain * exposure)
```

坑点在于**暗电流的温度依赖**：如果暗帧是任务早期测的、而科学数据是一年后测的，两者探测器温度可能差十几度，直接相减会引入系统性偏差。稳妥做法是建立暗电流随温度的标定的关系，按数据帧的实际温度插值。

## 二、辐亮度 → 反射率：参考板不是常量

反射率的常规定义是目标辐亮度与同期观测的标准板辐亮度之比：

```
R(λ) = L_target(λ) / L_panel(λ) × R_panel(λ) × k_geo
```

其中 `R_panel` 是标准板的已知反射率。三个常见错误：

| 错误 | 后果 | 正确做法 |
| --- | --- | --- |
| 用标称反射率代替实测 | 标准板在轨会老化、沾尘，反射率逐年下降 | 用地面标定值 + 在轨退化模型，或双板交叉比对 |
| 忽略观测几何差异 | 目标与参考板入射/出射角不同时引入光度偏差 | 做光度校正，或选几何条件接近的配对观测 |
| 逐波段独立除 | 波段间噪声被放大，光谱出现锯齿 | 必要时对参考板光谱做平滑，再逐波段相除 |

## 三、除零与饱和

分母接近零时反射率会飙到无穷大。加一个掩码比后面再清洗省事得多。

```python
def reflectance(target, panel, panel_ref, min_panel=1e-6):
    target = np.asarray(target, dtype=np.float64)
    panel = np.asarray(panel, dtype=np.float64)
    valid = panel > min_panel
    out = np.full_like(target, np.nan)
    out[valid] = target[valid] / panel[valid] * np.asarray(panel_ref)[valid]
    return out, valid
```

同时要检查 **饱和**：DN 接近满量程的波段，响应已非线性，必须剔除。判断条件一般是 `dn > 0.95 * saturation_level`。

> 结论先行：数据质量检查（饱和、暗电流温度、参考板退化）应该做成**独立的检查函数并输出报告**，而不是散落在计算流程里的几个 if。出问题时你会非常感谢自己这么做过。

## 四、单位与波长对齐

最后一点很朴素但真的会出事：参考板光谱与目标光谱的**波长网格必须对齐**。两个数组长度一样不代表它们对应同一组波长。显式地插值一次，比默认对齐安全：

```python
panel_on_target_grid = np.interp(wl_target, wl_panel, panel_spectrum)
```

## 小结

- 暗电流要看温度，不是减一帧就完事
- 标准板反射率是在轨变化的量，不是常量
- 除零、饱和、波长网格这三件事，显式处理一次，后面省无数事
