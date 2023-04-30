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

### 更新系统并安装 wget 工具
复制下面命令粘贴到 SSH 客户端回车即可运行，系统更新快慢要看你 VPS 服务商的机子情况，通常几分钟内就能完事，Vultr 家的机子可以不用更新，购买机子时就给你升级到最新的了。

等界面停止能看到 `命令提示符和光标` 就表示执行完毕，一般最后几行会有命令执行的通知，告诉你成功了还是失败了，看不懂英语的可以复制出来翻译下。

```
apt update && apt upgrade && apt install wget -y
```

### 开启 BBR
BBR 是一种拥塞控制算法，简单说就是可以让你的网络连接更快更稳定。
复制下面三个命令运行，一次一行。前两个运行不会有提示，这种没报错也没提示基本都算好结果。

```
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
sysctl -p
```
上面的前两个命令的意思是在 `/etc/sysctl.conf` 配置文件内写入 `net.core.default_qdisc=fq` 和 `net.ipv4.tcp_congestion_control=bbr`，最后一个 `sysctl -p` 是应用更改，运行后输出前面输入的两行内容就是成功了。

![REALITY_01.jpg](https://mdzz.cf/images/2023/04/30/REALITY_01.jpg)

### 放行 443 端口
后面配置要使用到 443 端口，脚本只有设置端口，不会给你放行端口，所以先提前放行。

```
iptables -I INPUT -p tcp --dport 443 -j ACCEPT
```
>REALITY 使用其它端口貌似也具有相同伪装性（不打保证），对于自己服务器上已经有站点的，也不用为了共存另外设置反向代理或分流之类的。

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
出现让你设置目标网站的选项，也可以看情况输入 `0` 自填网站地址。
填写的网站建议跟你 VPS 所在地差不多，IP 长的像当然最好，不过不好找，但是所在地比较简单。比如我的 IP 是大版的，我可以找家日本动画公司官网填写。不过这里选项里有几个 .jp 域名后缀的日本网站，我就直接填 `5` 回车。 
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
这里问你要选哪个 UUID 的配置，只有一个选项自然填 `1` ，也可以不填，使用“默认全选”直接回车。

```
1) 422939fd-f699-4a26-a6d7-61e17ee3dd88
请选择生成分享链接的 UUID ，用英文逗号分隔， 默认全选:
```
让你选网址，虽然之前只设置了一个网址，不过这里拆分成带和不带 `www` 两种，也不填直接回车默认全选。

```
1) lovelive-anime.jp
2) www.lovelive-anime.jp
请选择生成分享链接的 serverName ，用英文逗号分隔， 默认全选:
```
让选 shortId，这个脚本默认生成了 5 个 shortId，还是不填直接回车。

```
1) ""
2) "6d"
3) "85dd"
4) "e04cccd5"
5) "5042dcec226b1621"
请选择生成分享链接的 shortId ，用英文逗号分隔， 默认全选:
```
{% note info %}
如果想自己设定 shortId 要遵循规则，可以使用十六进制：也就是这些数字和字母 `0123456789abcdef`，长度要求是 2 的倍数，不能写 3 位、5 位这种数字字母组合，长度最长到 16 位。
{% endnote %}

🎉大功告成！出现如下共 10 个分享链接。随便复制一个到本地 v2rayN 客户端上粘贴就可以用了，注意分享链接开头是 `Vless://`，结尾是 `VLESS-XTLS-uTLS-REALITY`。SSH 窗口如果开的小，可能看起来比较乱别把下一行给复制进去了。

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

为什么会有 10 个分享链接，主要是 2 个网址共用 5 个 shortId 就成 10 个了。有点像是多用户配置，一个 shortId 就是一个配置。不过你可以回去看下这 5 个 shortId 第一个 `""` 这个双引号里没内容，也就是客户端这个配置不填也能用，所以要跟外人合用，建议删了这个值。以后不让他用就把他使用的值改了，不用担心他 shortId 留空还能用。删除空值不能用脚本管理界面的 `修改 shortIds` 一项，它会删除原来所有值替换成你修改的，而且默认还是会生成空值。要想删除空值可以手动修改配置文件，路径是 `/usr/local/etc/xray/config.json`，改完在脚本管理界面重启下就可以了，具体操作这里不废话了，可以问 NewBing。

# 客户端配置
{% note info %}
**REALITY 这个新协议对客户端和内核是有要求的**
* Windows 端 v2rayN 至少要 v6.21 以上版本
* 安卓端 v2rayNG要 1.8.0 及以上版本
* iPhone 端不清楚，自行查阅。
{% endnote %}

### PC 端 v2rayN 配置
[点我进入 v2rayN 下载页面](https://github.com/2dust/v2rayN/releases) ，写文章当下 v6.21 以上版本全是先行版本，最新版本是 v6.23，就选它好了。点开 Assets 下载下方的 `v2rayN-With-Core.zip`，解压出来即可使用无需安装，可以先将解压后的文件夹找个地方放好。

![REALITY_02.jpg](https://mdzz.cf/images/2023/04/30/REALITY_02.jpg)

打开文件夹，双击里面的 `v2rayN.exe` 即可运行，运行后窗口闪一下就消失了，去右下角托盘图标里找到它。先右键图标在菜单 `自动配置系统代理` 打上勾，并确保路由是 `绕过大陆`。

![REALITY_03.jpg](https://mdzz.cf/images/2023/04/30/REALITY_03.jpg)

再双击图标打开界面，开始里面是空白没有配置的，将你上面生成的分享链接复制，然后直接在这个界面 `Cltr+V` 粘贴就可以添加配置了，如果没有复制进来要检查下是否漏了或多复制了内容。然后可以打开浏览器访问被墙网站看能不能上，也可以在配置文件上右键使用 `测试服务器速度` 看看能不能跑起来。如果没用且之前杀毒软件有拦截提示之类，可以尝试将 v2rayNG 所在目录加入白名单。

![REALITY_04.jpg](https://mdzz.cf/images/2023/04/30/REALITY_04.jpg)

### 安卓端 v2rayNG 配置
[点我进入 v2rayNG 下载页面](https://github.com/2dust/v2rayNG/releases)，当前最新版本为 1.8.4，点开 Assets 下载下方的 `v2rayNG_1.8.4.apk`。

![REALITY_05.jpg](https://mdzz.cf/images/2023/04/30/REALITY_05.jpg)

手机上安装后打开应用，点击右上角 `+` 图标， 虽然也有 `从剪贴板导入` 选项，不过无论是服务器上的分享链接还是从 v2rayN 复制分享链接都不行，估计是格式不兼容。只能手动或者扫码添加，要生成二维码，可以在 v2rayN 配置上右键点击 `分享服务器(Ctrl+F)` 。

{% gi 2 2 %}
  ![REALITY_06.jpg](https://mdzz.cf/images/2023/04/30/REALITY_06.jpg)
  ![REALITY_07.jpg](https://mdzz.cf/images/2023/04/30/REALITY_07.jpg)
{% endgi %}

{% note info %}
本文章目的主要目的是讲解一键脚本安装和使用，其它零零散散的功能这里就不说了，也很难一篇说清楚，东扯西拉只会让文章变的更混乱，感兴趣请自行网上查阅。
{% endnote %}

> **其它教辅资料**
> * [XTLS 官方 GitHub 项目](https://github.com/XTLS)
> * [本教程使用的 Xray-REALITY 一键脚本项目](https://github.com/zxcvos/Xray-script)
> * [官方小小白白话文](https://xtls.github.io/document/level-0)：这是XTLS 官方最基础的手搓教程，有很多 Linux 系统基础的说明，初次使用 VPS 的小白有空可以试试这个教程，相信一定对你帮助很大。
