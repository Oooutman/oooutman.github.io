---
title: 科学上网一键脚本 VLESS-XTLS-uTLS-REALITY
banner_position: center 90%
date: 2023-04-30 02:16:39
permalink: centos7-v2ray/
index_img: https://mdzz.cf/images/2023/04/16/wallhaven-jx1ex5_1080.jpg
banner_img: https://mdzz.cf/images/2023/04/16/wallhaven-jx1ex5_1080.jpg
tags: 
- Xray
- REALITY
categories: 科学上网
---

# 准备工作
这个教程使用目前最新的 REALITY 协议，各协议间的区别我就不说，自己也是一知半解，有兴趣自行查阅资料。

官方说法是 REALITY 可以消除服务端 TLS 指纹特征，同时保留前向保密性等功能，证书链攻击也无效，安全性超越了常规的 TLS。还有个优点是 REALITY 可以指向别人的网站，无需自己购买域名和配置 TLS 服务端，省事很多，毕竟现在免费域名越来越难搞了，Freenom 上个月吃了官司也关闭了域名注册通道。

{% note info %}
* **一台 VPS** (教程使用 Debian 11 x64 系统，没有机子的新人推荐看看：[Vultr 新人免费250美金试用教程](https://www.twoha.tk/Vultr_free_250/))
* **SSH 远程登录工具**（不懂的小白可以看看这篇教程：[SSH 客户端 Putty 简易使用教程](https://www.twoha.tk/ssh-putty/)）
{% endnote %}

# SSH 登录 VPS 操作

### 更新系统并安装 curl 工具
复制下面命令粘贴到 SSH 客户端回车即可运行，系统更新时间根据你 VPS 服务商的机子情况有快有慢，通常几分钟内就能完事，等界面停止能看到让你输入命令的 `命令提示符` 就表示执行完毕，一般最后几行会有命令执行的通知，告诉你成功了还是失败了，看不懂英语的可以复制出来翻译下。

```
apt update && apt upgrade && apt install wget -y
```

### 开启 BBR
BBR 是一种拥塞控制算法，简单说就是可以让你的网络连接更快更稳定。
复制下面三个命令运行，一次一行。前两个运行不会有提示，总之只要没报错没提示基本都算好结果。

```
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
sysctl -p
```
上面的前两个命令的意思是在 `/etc/sysctl.conf` 配置文件内写入 `net.core.default_qdisc=fq` 和 `net.ipv4.tcp_congestion_control=bbr`，最后一个 `sysctl -p` 是应用更改，运行后会输出前面输入的两行内容就是成功了。

### 放行 443 端口
后面配置要使用到 443 端口，脚本只有设置端口，不会给你放行端口，所以先提前放行。
```
iptables -I INPUT -p tcp --dport 443 -j ACCEPT
```


# 一键脚本安装

```
wget --no-check-certificate -O ${HOME}/Xray-script.sh https://raw.githubusercontent.com/zxcvos/Xray-script/main/reality.sh && bash ${HOME}/Xray-script.sh
```
复制上面👆一整行命令运行后会出现如下👇安装向导，有各种选项设置，这里我们当然是选 1 安装了，在最后的 `Choose:` 输入 `1` 回车即可安装。
以后要进入这个管理脚本界面输入 `bash Xray-script.sh` 这个命令就可以进入了，现在别管。
```
--------------- Xray-script ---------------
 Version      : v2023-03-15(beta)
 Description  : Xray 管理脚本
----------------- 装载管理 ----------------
1. 安装
2. 更新
3. 卸载
----------------- 操作管理 ----------------
4. 启动
5. 停止
6. 重启
----------------- 配置管理 ----------------
101. 查看配置
102. 信息统计
103. 修改 id
104. 修改 dest
105. 修改 x25519 key
106. 修改 shortIds
107. 修改 xray 监听端口
108. 刷新已有的 shortIds
109. 追加自定义的 shortIds
110. 使用 WARP 分流，开启 OpenAI
----------------- 其他选项 ----------------
201. 更新至最新稳定版内核
202. 卸载多余内核
203. 修改 ssh 端口
204. 网络连接优化
-------------------------------------------
0. 退出
Choose:
```
安装过程进行一会儿会提示你输入自定义端口，这里直接回车不填就会使用默认 `443` 端口了。

```
请输入自定义的端口(1-65535), 默认不修改:
```
接着提示输入 UUID，也可以直接回车让它自动生成
```
请输入自定义 UUID, 默认则自动生成:
```
接着出现以下选项让你设置目标网站，虽然有备选项，不过还是要看情况输入 `0` 自填网站地址。
填写的网站建议跟你服务器 IP 地区差不多的，IP 更像当然最好。长得像不好找，但是所在地比较简单，比如我的 IP 是大版的，我可以找家日本动画公司官网填写。不过这里选项里有几个 .jp 域名后缀的日本网站，我就直接填 `5` 回车。 
```
---------------- dest 列表 -----------------
1) learn.microsoft.com
2) www.apple.com
3) music.apple.com
4) www.fandom.com
5) www.lovelive-anime.jp
6) tidal.com
7) zoro.to
8) www.pixiv.co.jp
9) mxj.myanimelist.net
10) mora.jp
11) www.j-wave.co.jp
12) www.dmm.com
13) booth.pm
14) www.ivi.tv
15) fmovies.to/home
16) www.leercapitulo.com
17) www.sky.it
18) www.sky.com
19) www.smdyy.cc
20) www.telecinco.es
请选择你的 dest, 当前默认使用 "learn.microsoft.com", 自填选 0:
```
>选择站点其实还有一些讲究，可以去看[官方项目说明](https://github.com/XTLS/REALITY)，这里就不细说了。

接着问我是否确认用这个网址，输入 `y` 回车，就是 yes 同意确认的意思。

```
是否使用 dest: "www.lovelive-anime.jp" [y/n]
```
程序继续安装出现下面界面就完成了，里面是你的配置信息，最后一行问你是否生成分享链接，当然是 `y` 要生成，手动填写配置多累。

```
[信息] 已重启 xray 服务
-------------- client config --------------
address     : "45.32.50.85"
port        : 443
protocol    : "vless"
id          : "422939fd-f699-4a26-a6d7-61e17ee3dd88"
flow        : "xtls-rprx-vision"
network     : "tcp"
TLS         : "reality"
SNI         : "lovelive-anime.jp","www.lovelive-anime.jp"
Fingerprint : "chrome"
PublicKey   : "LRrsQXaa2O2LWICHuZ9rY3vq9mC7m2iHxjLEikS3xBA"
ShortId     : "","6d","85dd","e04cccd5","5042dcec226b1621"
SpiderX     : "/"
------------------------------------------
是否生成分享链接[y/n]:
```
这里问你要选哪个 UUID 的配置，因为我们才装了一个就只有选项 1 一个了，输入序号回车或者不填，使用“默认全选”直接回车都行。

```
1) 422939fd-f699-4a26-a6d7-61e17ee3dd88
请选择生成分享链接的 UUID ，用英文逗号分隔， 默认全选:
```
出现选网址，虽然之前只设置了一个网址，不过这里拆分成带和不带 `www` 两种，我不填默认全选回车。

```
1) lovelive-anime.jp
2) www.lovelive-anime.jp
请选择生成分享链接的 serverName ，用英文逗号分隔， 默认全选:
```
出现选 shortId，这个脚本默认生成了 5 个 shortId，这里我也不填直接默认全选回车。

```
1) ""
2) "6d"
3) "85dd"
4) "e04cccd5"
5) "5042dcec226b1621"
请选择生成分享链接的 shortId ，用英文逗号分隔， 默认全选:
```

大功告成！出现如下共 10 个分享链接。随便复制一个到本地 v2rayN 客户端上粘贴就可以用了，注意分享链接开头是 `Vless://`，结尾是 `VLESS-XTLS-uTLS-REALITY`。SSH 窗口如果开的小，可能看起来比较乱别把下一行给复制进去了。

{% note info %}
**REALITY 这个新协议对客户端和内核有要求**
[PC 端 v2rayN](https://github.com/2dust/v2rayN/releases) 至少要 v6.21 版本，还得手动将 Xray 内核替换 v1.8.0 及以上版本
[安卓端 v2rayNG](https://github.com/2dust/v2rayNG/releases) 同样要 1.8.0 及以上版本
iPhone 端不清楚，自行查阅。
{% endnote %}

```
--------------- share link ---------------
---------- serverName sni=www.lovelive-anime.jp ----------
vless://422939fd-f699-4a26-a6d7-61e17ee3dd88@45.32.50.85:443?security=reality&flow=xtls-rprx-vision&fp=chrome&pbk=LRrsQXaa2O2LWICHuZ9rY3vq9mC7m2iHxjLEikS3xBA&sni=www.lovelive-anime.jp&spx=%2F&sid=85dd#VLESS-XTLS-uTLS-REALITY
vless://422939fd-f699-4a26-a6d7-61e17ee3dd88@45.32.50.85:443?security=reality&flow=xtls-rprx-vision&fp=chrome&pbk=LRrsQXaa2O2LWICHuZ9rY3vq9mC7m2iHxjLEikS3xBA&sni=www.lovelive-anime.jp&spx=%2F&sid=5042dcec226b1621#VLESS-XTLS-uTLS-REALITY
vless://422939fd-f699-4a26-a6d7-61e17ee3dd88@45.32.50.85:443?security=reality&flow=xtls-rprx-vision&fp=chrome&pbk=LRrsQXaa2O2LWICHuZ9rY3vq9mC7m2iHxjLEikS3xBA&sni=www.lovelive-anime.jp&spx=%2F&sid=6d#VLESS-XTLS-uTLS-REALITY
vless://422939fd-f699-4a26-a6d7-61e17ee3dd88@45.32.50.85:443?security=reality&flow=xtls-rprx-vision&fp=chrome&pbk=LRrsQXaa2O2LWICHuZ9rY3vq9mC7m2iHxjLEikS3xBA&sni=www.lovelive-anime.jp&spx=%2F#VLESS-XTLS-uTLS-REALITY
vless://422939fd-f699-4a26-a6d7-61e17ee3dd88@45.32.50.85:443?security=reality&flow=xtls-rprx-vision&fp=chrome&pbk=LRrsQXaa2O2LWICHuZ9rY3vq9mC7m2iHxjLEikS3xBA&sni=www.lovelive-anime.jp&spx=%2F&sid=e04cccd5#VLESS-XTLS-uTLS-REALITY
------------------------------------------------
---------- serverName sni=lovelive-anime.jp ----------
vless://422939fd-f699-4a26-a6d7-61e17ee3dd88@45.32.50.85:443?security=reality&flow=xtls-rprx-vision&fp=chrome&pbk=LRrsQXaa2O2LWICHuZ9rY3vq9mC7m2iHxjLEikS3xBA&sni=lovelive-anime.jp&spx=%2F&sid=85dd#VLESS-XTLS-uTLS-REALITY
vless://422939fd-f699-4a26-a6d7-61e17ee3dd88@45.32.50.85:443?security=reality&flow=xtls-rprx-vision&fp=chrome&pbk=LRrsQXaa2O2LWICHuZ9rY3vq9mC7m2iHxjLEikS3xBA&sni=lovelive-anime.jp&spx=%2F&sid=5042dcec226b1621#VLESS-XTLS-uTLS-REALITY
vless://422939fd-f699-4a26-a6d7-61e17ee3dd88@45.32.50.85:443?security=reality&flow=xtls-rprx-vision&fp=chrome&pbk=LRrsQXaa2O2LWICHuZ9rY3vq9mC7m2iHxjLEikS3xBA&sni=lovelive-anime.jp&spx=%2F&sid=6d#VLESS-XTLS-uTLS-REALITY
vless://422939fd-f699-4a26-a6d7-61e17ee3dd88@45.32.50.85:443?security=reality&flow=xtls-rprx-vision&fp=chrome&pbk=LRrsQXaa2O2LWICHuZ9rY3vq9mC7m2iHxjLEikS3xBA&sni=lovelive-anime.jp&spx=%2F#VLESS-XTLS-uTLS-REALITY
vless://422939fd-f699-4a26-a6d7-61e17ee3dd88@45.32.50.85:443?security=reality&flow=xtls-rprx-vision&fp=chrome&pbk=LRrsQXaa2O2LWICHuZ9rY3vq9mC7m2iHxjLEikS3xBA&sni=lovelive-anime.jp&spx=%2F&sid=e04cccd5#VLESS-XTLS-uTLS-REALITY
```
为什么会有 10 个分享链接，主要是 2 个网址共用 5 个 shortId 就成 10 个了。有点像是多用户配置，一个 shortId 就是一个配置。不过你可以回去看下这 5 个 shortId 第一个 `""` 这个双引号里没内容，也就是客户端这个配置可以不填，所以要跟人合用，建议删了这个值，虽然脚本管理界面有修改 shortIds 一项，但是默认还是会生成空值，真想删了它可以手动修改配置文件，这是路径 `/usr/local/etc/xray/config.json`，改完在脚本管理界面重启下就可以了，具体操作这里不废话了，让 NewBing 教你。

{% note info %}
shortId 的设置有规则的，可以使用十六进制就是这些数字字母 `0123456789abcdef`，长度是 2 的倍数，也就是不要写 3 位、5 位这种数字字母组合，长度最长到 16 位。
{% endnote %}

# PC 端 v2rayN 配置
睡了改天写


> **推荐教辅资料**
> * [XTLS 官方 GitHub 项目](https://github.com/XTLS)
> * [本教程使用的 Xray-REALITY 一键脚本项目](https://github.com/zxcvos/Xray-script)
> * [官方小小白白话文](https://xtls.github.io/document/level-0)：这是XTLS 官方最基础的手搓教程，有很多 Linux 系统基础的说明，初次使用 VPS 的小白有空可以试试这个教程，相信一定对你帮助很大。
