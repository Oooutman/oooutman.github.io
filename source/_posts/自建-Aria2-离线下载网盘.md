---
title: 自建 Aria2 离线下载网盘
date: 2023-05-01 00:31:29
permalink: aria2-rclone/
banner_position: center 50%
index_img: https://www.mdzz.cf/images/2023/04/15/wallhaven-gjyoq7.jpg
banner_img: https://www.mdzz.cf/images/2023/04/15/wallhaven-gjyoq7.jpg
tags:
- Aria2
- 离线下载
categories: 玩转 VPS
---

# 你需要要自建离线下载吗？

开始之前问问自己是不是真的有这个需求，如果你平时也不怎么用 BT 磁力的，没多大必要搞。至于平时常用 BT 磁力的要不要从本地换到服务器上自行考虑，服务器的优点无非是可以不间断下载和做种，随时随地打开网页就能下载。并且得益于国外良好的 BT 环境，下载速度也会比国内家用带宽好点，不过遇到断种的文件该下不动还是下不动。还有如果你经常因为本地下载影响打游戏，换到服务器上下载也是不错的方案。

{% note info %}
<font size=3>**准备环境**</font>
* 一台 VPS 主机（硬盘要够大，没有的推荐 FranTech 家，介绍文章：[G口无限流量的大盘鸡 FranTech(BuyVM) 购买教程](https://www.twoha.tk/buyvm-frantech/)）
* SSH 远程登录工具（不会看看这篇教程：[SSH 客户端 Putty 简易使用教程](https://www.twoha.tk/ssh-putty/)）
* 教程使用 Debian 11 x64 系统搭建
{% endnote %}

# 更新系统安装一些工具

SSH 客户端登录连接服务器后，复制下面命令粘贴后回车即可运行，系统更新快慢看你服务器品质了，通常几分钟内就能完事。

```
apt update && apt upgrade && apt install wget curl -y
```
>等界面停止能看到 `命令提示符和光标` 就表示执行完毕，一般最后几行会有命令执行的通知，告诉你成功了还是失败了，看不懂英语的可以复制出来翻译下。有些命令执行不会有通知，通常也算好结果，小白只要关注有执行通知的，确保没有报错，遇到报错可以网上查下，也可以问 NewBing。

# 安装 Aria2 一键安装脚本
下载脚本
```
wget -N git.io/aria2.sh && chmod +x aria2.sh
```

运行脚本（以后要进入脚本管理界面也是使用这个命令）
```
./aria2.sh
```
运行后出现如下脚本的管理界面，包含了脚本的一些功能，这里输入 `1` 回车来安装 Aria2。
```
 Aria2 一键安装管理脚本 增强版 [v2.7.4] by P3TERX.COM

  0. 升级脚本
 ———————————————————————
  1. 安装 Aria2
  2. 更新 Aria2
  3. 卸载 Aria2
 ———————————————————————
  4. 启动 Aria2
  5. 停止 Aria2
  6. 重启 Aria2
 ———————————————————————
  7. 修改 配置
  8. 查看 配置
  9. 查看 日志
 10. 清空 日志
 ———————————————————————
 11. 手动更新 BT-Tracker
 12. 自动更新 BT-Tracker
 ———————————————————————

 Aria2 状态: 未安装

 请输入数字 [0-12]: 1
```

安装过程很快，完成后看到如下信息，我的服务器没有启用 IPv6，所以显示检测失败，不用管它问题不大。可以看到脚本还生成了 `AriaNg 链接`，省去了自己安装 AriaNg 的功夫，复制链接浏览器打开就可以使用用了。

```
Aria2 简单配置信息：

 IPv4 地址      : 35.197.113.2
 IPv6 地址      : IPv6 地址检测失败
 RPC 端口       : 6800
 RPC 密钥       : 44ae05e0ed2a166d089b
 下载目录       : /root/downloads
 AriaNg 链接    : http://ariang.js.org/#!/settings/rpc/set/ws/35.197.113.2/6800/jsonrpc/NDRhZTA1ZTBlZDJhMTY2ZDA4OWI=

[信息] Aria2 启动成功 !
```

不过使用前还是推荐修改下下载目录，不要放在 root 目录下，推荐改到 mnt 目录，如果你的服务器是挂载的块存储，下载目录要设在块存储上，别到时候说怎么我的系统盘满了。可以使用 `./aria2.sh` 命令重新打开脚本管理界面，选择第 7 项“修改配置”，再选选择“修改 Aria2 下载目录”，比如改为 `/mnt/downloads/`，如果没有这个目录会自动给你创建，无需提前创建，改完会自动重启生效。

{% note info %}
Aria2 本身是个命令行程序（背地里干活的后端），得输入命令才能使用；而 AriaNg 是一个 Aria2 的图形化界面（与人交互的前端），使用直观便利。上面配置信息里的 AriaNg 并没有在你服务器上安装，这个 ariang.js.org 是别人使用这个域名搭建公开分享的面板。不过也不用担心数据泄露，AriaNg 只是一个静态网页，负责发送指令给 Aria2 服务端，填写的 RPC 地址和 RPC 密钥等设置数据只会储存在本地浏览器中。除此之外还有一些公开的 AriaNg 面板，比如 [AriaNg 项目](https://github.com/mayswind/AriaNg) 开发者提供的 Demo 页面：http://ariang.mayswind.net/latest
{% endnote %}

# 文件管理
可以下载后你还需要能管理文件，如果你用宝塔面板的话也可以直接在宝塔的 `文件` 菜单来管理。或者你可以安装 FileBrowser 来管理文件，像使用各种网盘那样查看下载文件，自行选择是否安装。

具体教程查看这篇文章：http://www.twoha.tk/FileBrowser/

