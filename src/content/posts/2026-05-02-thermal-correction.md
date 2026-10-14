---
title: 行星光谱热校正：原理与实现
slug: thermal-correction
date: 2026-05-02
category: 数据处理
tags: [光谱, 热校正, 行星遥感]
summary: 就位光谱里混着热辐射分量，不去掉就谈不了物质成分。记录热校正的基本思路与一个可运行的最小实现。
cover: /images/covers/thermal.svg
draft: false
---

<!-- 示例占位文章：内容为本站点演示 Markdown 渲染能力而写，发布前请替换为你自己的文章 -->

在月面、火星表面这类昼夜温差极大的环境里，光谱仪测到的不只是**反射的太阳光**，还有地表自身发射的热辐射。到了中红外波段，热辐射甚至会压过反射信号。

## 问题长什么样

未做热校正的光谱在中长波处会整体抬升，而且抬升量随**地表温度**变化。同一个地点、不同地方时测的两条光谱对不上，第一反应常常是"仪器飘了"，其实多半是热分量。

![热校正前后的光谱形态对比](/images/covers/thermal.svg)

## 基本思路

把观测辐亮度拆成反射与热发射两部分：

```
L_obs(λ) = R(λ) · F_sun(λ) · cos(i) / π  +  ε(λ) · B(λ, T)
```

其中 `B(λ, T)` 是普朗克函数，`ε` 是发射率。做法通常是：

1. 由反射主导波段（短波）估计 `R(λ)`
2. 由热主导波段（长波）拟合地表温度 `T`
3. 用 `T` 算出全波段热分量 `ε·B(λ,T)`，从 `L_obs` 中减去
4. 剩余部分再换算反射率，迭代收敛

## 最小实现

```python
import numpy as np

H, C, K = 6.626e-34, 2.998e8, 1.381e-23  # 普朗克常数 / 光速 / 玻尔兹曼常数


def planck(wl_um, t_k):
    """普朗克函数，波长 μm、温度 K，返回 W·m^-2·sr^-1·μm^-1"""
    wl_m = np.asarray(wl_um) * 1e-6
    return (2 * H * C**2 / wl_m**5) / (np.exp(H * C / (wl_m * K * t_k)) - 1.0) * 1e-6


def thermal_component(wl_um, t_k, emissivity=0.95):
    return emissivity * planck(wl_um, t_k)


def fit_temperature(wl_um, radiance, wave_range, emissivity=0.95, t_grid=None):
    """在热主导波段网格搜索地表温度"""
    if t_grid is None:
        t_grid = np.arange(180.0, 400.0, 0.5)
    mask = (wl_um >= wave_range[0]) & (wl_um <= wave_range[1])
    obs = radiance[mask]
    wls = wl_um[mask]
    best, best_err = None, np.inf
    for t in t_grid:
        model = thermal_component(wls, t, emissivity)
        err = np.nansum((model - obs) ** 2)
        if err < best_err:
            best, best_err = t, err
    return best, np.sqrt(best_err / mask.sum())
```

网格搜索看着笨，但温度只有一个自由度，几百个候选值毫秒级就能跑完，而且**不会陷入局部最优**——这点比通用优化器省心。

## 发射率不是常数

上面默认 `ε = 0.95`，这是硅酸盐的常用近似。但真实地表的发射率随波长变化，而且与矿物成分相关。更严谨的做法是用 `ε(λ) = 1 − R(λ)`（基尔霍夫定律），把反射率和发射率**联合迭代**：

```python
for _ in range(max_iter):
    t_k, _ = fit_temperature(wl, thermal_part, (long_lo, long_hi), emissivity=eps)
    thermal_part = radiance - reflectance_part
    refl = solve_reflectance(thermal_part)      # 短波部分换算
    eps = np.clip(1.0 - refl, 0.5, 1.0)         # 更新发射率
```

迭代 3–5 次通常就收敛。收敛判据用相邻两次温度的差值，`< 0.5 K` 即可停。

## 什么时候热校正可以不做

- 观测在**短波**（< 2.5 μm）且地表温度不高时，热分量可能低于噪声
- 有**同期同温度的阴影区观测**做参考时，可以直接差分抵消
- 只关心波段间**相对形态**（如吸收深度）而不关心绝对反射率时

判断依据很简单：算一下 `B(λ, T)` 在你最关心波段处的量级，如果它比反射信号低一个数量级以上，就可以先放着。

## 小结

热校正的本质是把"反射"和"发射"两个物理量分开。核心在三件事：选对热主导波段、把发射率当成随波长变化的量、以及用反射率与发射率的约束做联合迭代。
