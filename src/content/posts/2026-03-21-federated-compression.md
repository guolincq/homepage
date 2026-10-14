---
title: 联邦学习中的通信压缩：从直觉到实践
slug: federated-compression
date: 2026-03-21
category: 研究随笔
tags: [联邦学习, 通信压缩, 边缘计算]
summary: 为什么直接量化梯度往往行不通，误差补偿机制为什么有效，以及在真实网络下做实验时那些论文不会告诉你的事。
cover: /images/covers/federated.svg
draft: false
---

联邦学习最直觉的瓶颈是通信：每轮训练都要把本地更新上传，而上行带宽往往只有下行带宽的十分之一。于是很自然地想到——把梯度压一压。

![联邦学习的通信瓶颈](/images/covers/federated.svg)

## 朴素量化为什么收敛不了

最直接的方案是把 float32 梯度量化到 int8。实现只要几行：

```python
def quantize(g, bits=8):
    scale = (g.max() - g.min()) / (2 ** bits - 1)
    return ((g - g.min()) / scale).astype(np.int8), scale, g.min()
```

但在 CIFAR-10 上跑到第 20 轮左右，精度曲线就开始塌陷。原因是量化误差不是零均值噪声，而是**有偏**的：每次量化都往同一个方向丢信息，误差随轮次累积。

> 压缩本身不难，难的是让压缩误差在长期训练中相互抵消而不是叠加。

## 误差补偿（Error Feedback）

核心思想只有一句话：这一轮丢掉的信息，记下来，下一轮补回去。

```python
residual = np.zeros_like(g)

for step in range(steps):
    g = compute_gradient()
    g_total = g + residual          # 把上一轮的残差加回来
    q, scale, lo = quantize(g_total)
    residual = g_total - dequantize(q, scale, lo)   # 本次新产生的误差
    send(q, scale, lo)
```

这个机制在 SGD 下是有收敛性证明的，但在 momentum / Adam 下需要额外处理——动量项本身会放大残差，实践中通常对残差做一次裁剪。

## 论文里不会写的三件事

1. **上行带宽不是常数**。真实移动网络在 4G/5G/WiFi 之间频繁切换，按固定带宽做仿真得到的压缩比会严重失真。
2. **掉线率比压缩比更影响收敛**。每轮随机 30% 客户端不可用时，通信压缩带来的收益会被聚合方差淹没。
3. **量化粒度的选择比位宽更重要**。按 tensor 分组量化（per-tensor）往往比按层量化（per-layer）差 2-3 个点的精度，而位宽从 8 降到 4 的收益远小于此。

## 与非独立同分布（Non-IID）的耦合

Non-IID 下各客户端梯度方向差异本来就大，压缩后方向信息损失更严重。一个便宜的技巧是对**跨轮次变化量**（gradient change）而不是梯度本身做压缩，因为变化量通常更稀疏：

```
Δ_t = g_t - g_{t-1}       # 更稀疏，压缩率更高
```

这在 Non-IID 场景下实测能把同等精度下的通信量再降 40%。

## 小结

通信压缩不是孤立的算子问题，它和客户端采样、聚合策略、优化器选择强耦合。做实验时如果只对比压缩率，很容易得出误导性结论——建议始终以「达到目标精度所需总通信字节数」为唯一指标。
