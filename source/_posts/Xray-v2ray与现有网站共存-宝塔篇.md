---
title: Xray/v2ray与现有网站共存-宝塔篇
date: 2023-04-10 01:27:03
permalink: Xray_v2ray_website/
banner_position: center 10%
index_img: //mdzz.cf/images/2023/04/10/wallhaven-x8979v_1080.jpg
banner_img: //mdzz.cf/images/2023/04/10/wallhaven-x8979v_1080.jpg
tags:
- Xray
- v2ray
categories: 
- 科学上网
---

# 前言
使用 Xray 或 v2ray 的各种一键安装脚本基本都自带创建伪装网站，会导致和自己搭建好的网站产生冲突，该教程主要解决这个问题。来看这个教程的我就默认你已经搭建好了站点，就不说怎么建站了。
1. 官方脚本安装 Xray/v2ray（教程以 Xray 为例，V2ray 除了一开始的安装脚本外其它基本一样）
2. 编辑 config.json
3. 修改网站 Web 服务配置文件（教程以 Nginx 为例）
4. 重启 Web 服务和 Xray/v2ray

# 思路
本人也是个小白，我最初的思路就是抄这些一键脚本的配置。刚开始我只知道要抄 `config.json` 配置文件，关键的网站与代理流量的分配调用完全没有头绪，后来网上找了下相关教程，知道了可以修改 Nginx 这类 Web 服务配置文件来反向代理流量给 Xray。不过我这样说对没有配置过 Nginx 的初学者也难以理解，想深入理解最好的方法就是自己手搓代码不借助宝塔这类面板搭建一次网站，现在有 NewBing 只要懂得提问，可以让它一步步教你，ChatGPT 免费版很难连续性提问，经常断开就不推荐了。也可以参考 Xray 官方的手搓教程 [小小白白话文](https://xtls.github.io/document/level-0)
{% note info %}
**实现共存大概有三种方式**

1. Nginx 前置：也就是让网站来接受 443 端口流量，再把流量反向代理给 Xray 监听的其它端口。
2. Xray 前置：Xray 监听 443，接收流量后通过 Xray 设置的回落规则至 80 端口，网站只监听 80 端口，删除监听 443，这样就共存了，不过这个方法我还没用过，也懒得设置回落。
3. Nginx 分流：网站和 Xray 都不监听 443 端口，还有把网站的 Nginx 配置文件独立出来（宝塔的站点配置一开始就是独立的），在 Nginx 主配置里将 443 端口流量根据流量特征分发给网站和 Xray。
{% endnote %}
>相对来说第一种 Nginx 前置配置最简单，教程也是采用这种方式。因为真实网站的质量比起那种随便搞的站点肯定要高，用它来伪装我觉得效果更好。以上思路都是一个小白的理解，不一定准确，有误还望指教。

# 详细流程
### 1. 手动安装 Xray 主程序
看到手动别怕，你下拉看看主要就 3 步，复制粘贴超简单，下面使用官方脚本开始安装。
[查看 GitHub Xray 项目🚀](https://github.com/XTLS/Xray-install)
```
bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install
```
### 2. 修改 Xray 配置文件
配置文件我是参考这个一键脚本的：[wulabing/Xray_onekey](https://github.com/wulabing/Xray_onekey)
宝塔面板点击左侧菜单 `文件`，进入这个目录 `/usr/local/etc/v2ray`，里面的 `config.json` 文件就是 Xray 的配置文件，双击打开，里面默认只有一对 `{}`，删了然后把下面配置复制进去，并修改以下三处。
* `第 9 行` 的端口（示例为 `10000`，不懂的你就 `10000-60000` 这个范围随便写个）；
* `第 16 行` 的 UUID（示例为 `05c225a5-8b11-4bad-a53a-2a5439a00d5f`，用 v2rayN 生成或网上找 UUID 在线生成）；
* `第 25 行` 的路径（示例为 `/a1fih5` 这个字母数字随便写，长度不一定和这里一样 6 位）

```
{
  "log": {
    "access": "/var/log/xray/access.log",
    "error": "/var/log/xray/error.log",
    "loglevel": "warning"
  },
  "inbounds": [
    {
      "port": 10000,
      "listen": "127.0.0.1",
      "tag": "VLESS-in",
      "protocol": "VLESS",
      "settings": {
        "clients": [
          {
            "id": "05c225a5-8b11-4bad-a53a-2a5439a00d5f",
            "alterId": 0
          }
        ],
        "decryption": "none"
      },
      "streamSettings": {
        "network": "ws",
        "wsSettings": {
          "path": "/a1fih5"
        }
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom",
      "settings": {},
      "tag": "direct"
    },
    {
      "protocol": "blackhole",
      "settings": {},
      "tag": "blocked"
    }
  ],
  "dns": {
    "servers": [
      "https+local://1.1.1.1/dns-query",
      "1.1.1.1",
      "1.0.0.1",
      "8.8.8.8",
      "8.8.4.4",
      "localhost"
    ]
  },
  "routing": {
    "domainStrategy": "AsIs",
    "rules": [
      {
        "type": "field",
        "inboundTag": [
          "VLESS-in"
        ],
        "outboundTag": "direct"
      }
    ]
  }
}

```

保存退出后，回到 SSH 输入 `systemctl restart xray` 重启下 Xray，再输入 `systemctl status xray` 查看下状态是否为绿色，要是红的就检查下配置文件有没有多余或多删了，重新配置后再重启并检查状态。

### 3. Nginx 设置反向代理
宝塔进入网站设置的配置文件，拉到最后面在最后一个 `}` 前面插入以下部分，把下面的 `/a1fih5` 和 `10000` 需要修改成和上面配置一样的路径和端口，宝塔的这个站点配置改完保存即可生效，手搓可能要重载配置才能生效。

```
location /a1fih5
    {
    proxy_redirect off;
    proxy_pass http://127.0.0.1:10000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $http_host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
```    
如图所示👇
![Xray._01.jpg](https://mdzz.cf/images/2023/04/29/Xray._02.jpg)

### 4. 客户端配置
客户端以 v2rayN 为例，参照下图配置即可，主要也就域名、UUID、路径这3个注意下。

![Xray._02.jpg](https://mdzz.cf/images/2023/04/29/Xray._01.jpg)

[**v2rayN 下载地址**](https://github.com/2dust/v2rayN/releases) 如果你还在用 4.x的版本建议还是升级下吧，推荐下载版本号后面有绿色<font color=#3fb950> Latest </font>标签的正式版，现在最新正式版是 6.21，上面截图的界面就是 6.21。

>吐槽：不论功能，单说界面设计我还是喜欢 6.x 之前的，现在的界面把选框改成了下划线，整个设计碎片化、割裂感太严重了，画面整体性很差，还有莫名奇妙的阴影，深紫色与黑字体的搭配真的让人抓狂😣