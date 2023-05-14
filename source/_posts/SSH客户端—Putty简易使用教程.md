---
title: SSH客户端—Putty简易使用教程
date: 2023-03-31 21:51:36
permalink: ssh-putty/
banner_position: center 100%
index_img: //mdzz.cf/images/2023/03/31/wallhaven-28vkox.jpg
banner_img: //mdzz.cf/images/2023/03/31/wallhaven-28vkox.jpg
tags:
- Linux
- Putty
categories: 杂记
---

SSH 简单理解就是本地跟远程 VPS 服务器通信的一种协议，我们要登录购买的 VPS 就需要借助 SSH 客户端。

SSH 客户端有很多，其他人推荐最多的是 Xshell 和 FinalShell 。这里要介绍的是 Putty 这个客户端，Putty 是个免费免安装的开源软件，仅1M多点的一个 exe 文件，十分小巧。新手自己不会写代码，只是复制粘贴搭建一些简单工具，Putty 虽然简陋，但也够用了。

Putty 官网传送门： https://www.putty.org/

## 下载Putty

进入官网后如下图，点击 `here` 进入下载页面

![Putty_01.jpg](https://mdzz.cf/images/2023/03/31/Putty_01.jpg)

然后找到 Putty SSH 的客户端，选择32位或64位程序下载，要是不知道选哪个就选32位

![Putty_02.jpg](https://mdzz.cf/images/2023/03/31/Putty_02.jpg)

## Putty的两种登录方法

推荐使用第二种快捷登录

### 第一种方法

双击已经下好的 putty.exe 程序打开配置界面，可以看到默认界面如下图，已经默认 22 的服务器端口和 SSH 协议，这两个不用改，除非你自己更改过服务器SSH端口。

![Putty_03.jpg](https://mdzz.cf/images/2023/03/31/Putty_03.jpg)

你购买VPS服务器后都会给你提供服务器 IP 和服务器登录密码，这里我们先填入 `服务器IP` ，密码连接后才要求输入，这里也没有输密码的地方。填入 IP 地址后可以在下方保存你已经输入的 IP 配置（以后只要读取配置就行了），然后点击 Open 就可以连接服务器了。

![Putty_04.jpg](https://mdzz.cf/images/2023/03/31/Putty_04.jpg)

第一次连接需要在注册表生成服务器的密钥指纹，点击 `Accept` 接受即可。

![Putty_05.jpg](https://mdzz.cf/images/2023/03/31/Putty_05.jpg)

然后会让你输入登录名，默认是 `root` ，填入回车。接着要求你输入密码，<font color=#c7254e>**密码输入过程是不显示的**</font>。如果你要直接粘贴进去，快捷键不是ctrl+v，而是在 putty 窗口下直接 `单击鼠标右键` 或者按 `shift+Ins` 快捷键来将剪贴板内容粘贴进去；如果你要从 putty 里复制内容，快捷键也不是 ctrl+c，而是 `alt+Ins`，实际上复制不用快捷键，只要把内容选中就会自动复制下来了。

![Putty_06.jpg](https://mdzz.cf/images/2023/03/31/Putty_06.jpg)

<font color=#c7254e>**注意：**</font>putty 与服务器的连接如果一段时间内你没有操作可能会自动断开连接，提示如下图。

![Putty_07.jpg](https://mdzz.cf/images/2023/03/31/Putty_07.jpg)

如果你出现这种情况，可以在窗口栏区域右键（也可以在登录前界面设置），点击 `Change Settings` 去更改设置，再选择 `connection` 连接选项，右边填入 `20` ，这样每隔 20 秒会向服务器发送空数据包以保持会话处于活动状态，这个值你可以根据情况自行设定。

![Putty_08.jpg](https://mdzz.cf/images/2023/03/31/Putty_08.jpg)

### 第二种方法

每次登录还要手动填用户名和密码是不是挺烦的，putty 还有更快捷的登录方式。

首先把 putty.exe 程序移到随便哪个文件夹都行，不要直接放在桌面，然后在桌面创建个快捷方式（不会创建自行百度）。右键单击快捷方式，打开属性，在目标后面加上 `root@IP -P 22 -pw 密码` ，注意这里的 `IP` 和 `密码` 改成你自己的，注意空格，root 前面也有一个空格，想指定端口号可以加上 `-P 22` ，如果更改过服务器 SSH 端口，则把 `22` 替换成改过的端口，最后再确定即可。

完事直接双击这个快捷方式就可以自动登录服务器了，就是有多个服务器需要多创建几个快捷方式。

![Putty_09.jpg](https://mdzz.cf/images/2023/03/31/Putty_09.jpg)