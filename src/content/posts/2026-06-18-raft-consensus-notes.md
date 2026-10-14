---
title: Raft 共识协议研读笔记
slug: raft-consensus-notes
date: 2026-06-18
category: 论文阅读
tags: [分布式系统, 共识算法, 论文笔记]
summary: 重读 Raft 论文时整理的一份笔记，重点在于它如何用「强领导者」换取可理解性，以及日志压缩在工程里的取舍。
cover: /images/covers/raft.svg
draft: false
---

Raft 的设计目标写得非常直白：**可理解性**（understandability）。它并不是在性能上超越 Paxos，而是把共识问题拆成三个相对独立的子问题，让工程师能真正把它实现出来。

## 三个子问题

1. **领导者选举**（Leader election）—— 旧 leader 失效时选出新 leader
2. **日志复制**（Log replication）—— leader 接收客户端请求并复制到多数派
3. **安全性**（Safety）—— 保证已提交的日志不会被回滚

> 一个系统如果难以理解，就难以正确实现；难以正确实现，所有理论上的正确性保证都落不了地。

##任期（Term）是一切的基础

Raft 把时间切分成连续的任期，每个任期最多一个 leader。任期号单调递增，充当逻辑时钟：节点收到更大的任期号就立即退位为 follower。这个设计把「谁说了算」的判断简化为一次整数比较。

```go
// 节点收到 RPC 时的通用处理
func (rf *Raft) stepDown(term int) {
    if term > rf.currentTerm {
        rf.currentTerm = term
        rf.state  = Follower
        rf.votedFor = -1
    }
}
```

## 选举的安全性从哪来

Raft 的关键约束是：**只有日志足够新的候选者才能当选**。投票者在 `RequestVote` 中比较候选者的 `(lastLogTerm, lastLogIndex)`，若不如自己新则拒绝投票。这保证已提交的日志条目一定出现在新 leader 的日志里，从而避免了 Paxos 中需要额外同步历史的复杂度。

| 机制 | Paxos | Raft |
| --- | --- | --- |
| 角色 | 提案者/接受者/学习者可并存 | 强 leader，其余为 follower |
| 日志 | 允许空洞，需额外补洞 | 强制连续，靠一致性检查修复 |
| 成员变更 | 无标准做法 | Joint consensus 单阶段变更 |

## 日志压缩的工程取舍

论文给了 Snapshot 方案，但实现上有个容易被忽略的点：**快照与日志复制的并发**。若 follower 在 installSnapshot 期间仍在接收 AppendEntries，需要按任期与索引做幂等判断，否则会出现日志回退。实践中更稳妥的做法是让快照安装走独立的 RPC，并在期间暂停该 follower 的日志追加。

```python
def install_snapshot(self, term, last_included_index, last_included_term, data):
    self.step_down(term)
    if last_included_index <= self.commit_index:
        return  # 已有更新状态，丢弃过期快照
    self.log.compact_to(last_included_index, last_included_term)
    self.apply_snapshot(data)
    self.commit_index = max(self.commit_index, last_included_index)
```

## 一点批评

Raft 论文的争议点在于它把正确性论证建立在**状态机安全性**的非形式化说明上，完整的形式化证明直到后来的 [Raft 博士论文](https://raft.github.io/raft.pdf) 才补齐。另外强 leader 意味着 leader 成为性能瓶颈，这也是后续 EPaxos、Flexible Raft 一类工作想解决的。

## 小结

- 用任期 + 强 leader 换取可实现性，是工程上极成功的取舍
- 选举限制（日志新旧比较）是安全性的核心，比选举超时参数重要得多
- 真正难的是工程细节：快照并发、成员变更的边界条件、持久化时机
