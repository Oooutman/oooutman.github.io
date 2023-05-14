---
title: WebDAV 挂载磁盘到本地电脑
banner_position: center 50%
date: 2023-05-14 23:02:44
permalink:
index_img:
banner_img:
tags:
categories:
published: false
---

挂载本地磁盘为的是像访问本地硬盘一样方便，但还是有所限制，最大的限制就是本地与 VPS 直连速度，速度不好本地直接播放视频会很卡。拿我自己的机子举例，我 IDM 多线程从服务器上下载大概在 20MB/s，但是本地播放好的时候也才 4MB/s，有时甚至不足 1MB/s，单集动画 1GB 左右的动画本地播放还好，体积大点的还是会选择下载到本地。如果你打算挂载本地，现在可以去宝塔面板的“软件商店”菜单，选择应用分类的“运行环境”找到 `Nginx` 点击安装，默认极速安装即可，可不要装成 Nginx 防火墙之类。

至于为什么选择 WebDAV，而不用更简单的 FTP 或 sFTP，主要是 WebDAV 更适合视频这种






 以下配置文件需要 Nginx 支持 `http_dav_module ` 和 `nginx-dav-ext-modul` 这两个模块，使用我上面宝塔
 可以使用 `nginx -V` 命令查询是否有安装这两个模块，把输出内容复制到本地文本文档使用 Ctrl+F 查找这样比较方便。


```
# webdav 配置
    location / {
    root /root/downloads; #注意修改成自己的目录
    #client_max_body_size 102400M; # 大文件支持
    autoindex on; # 启用目录索引
    dav_methods PUT DELETE MKCOL COPY MOVE; # 支持客户端管理文件，如上传、删除等
    dav_ext_methods PROPFIND OPTIONS LOCK UNLOCK; # 检索资源信息以及协同编辑
    create_full_put_path  on; # 允许上传文件时自动创建不存在的目录
    }
```

WebDAV协议不支持查询服务器的磁盘容量，这里显示的 7.99EB 是 Windows 支持的最大卷大小，然而由于硬件和文件系统的限制，目前远远无法达到这个最大值。