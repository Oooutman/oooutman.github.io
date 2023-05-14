---
title: FileBrowser 私人网盘安装配置教程
date: 2023-04-02 22:10:31
permalink: FileBrowser/
banner_position: center 30%
index_img: //mdzz.cf/images/2023/04/01/wallhaven-2yeydm-1080.jpg
banner_img: //mdzz.cf/images/2023/04/01/wallhaven-2yeydm-1080.jpg
tags:
- 网盘
- 私有云
categories: 玩转 VPS
---

# 安装 FileBrowser
```
curl -fsSL https://raw.githubusercontent.com/filebrowser/get/master/get.sh | bash
```
出现 `curl: command not found` 报错就是系统没有安装 curl，请先安装再来执行命令。
Debian 系安装命令 `apt install curl -y`
CentOS 系安装命令 `yum install curl -y`

# 自定义配置 FileBrowser

开始前先放行 FileBrowser 要用的监听端口，假设放行 `9000` 端口

Debian系使用命令 `iptables -I INPUT -p tcp --dport 9000 -j ACCEPT`
CentOS系使用命令（两条） `firewall-cmd --zone=public --add-port=9000/tcp --permanent` 接着需要重载生效 `firewall-cmd --reload`

### 配置分三步，初始化、设置、添加用户
1. **初始化：**首先在 `/data/filebrowser.db` 路径下（路径可以自行更改）创建数据库文件，并初始化 filebrowser 的配置，如果设定了和我不同的路径就要注意修改后面教程的路径。
```
filebrowser -d /data/filebrowser.db config init
```

2. **设置：**设置监听地址为 `0.0.0.0` ；监听端口为 `9000` ，默认8080；语言为中文
```
filebrowser -d /data/filebrowser.db config set --address 0.0.0.0 --port 9000 --locale zh-cn
```

3. **添加用户：**添加一个用户名为 `yonghuming` ，密码为 `mima` 的用户，并赋予该用户 `admin权限`。用户名密码自行设定，这步也可以放弃，使用默认admin的用户名和密码，搞完后登陆网页在后台修改。
```
filebrowser -d /data/filebrowser.db users add yonghuming mima --perm.admin
```

### 启动调试模式
启动后通过浏览器打开 `http://IP:端口` (改为你的 IP 和端口)，出现以下界面表示 FileBrowser 安装成功。
```
filebrowser -d /data/filebrowser.db
```
[![filebrowser_01.jpg](https://mdzz.cf/images/2023/04/05/filebrowser_01.jpg)](https://mdzz.cf/image/8kW)

不管成功还是无法访问，先回到 SSH 中，`Ctrl+C` 退出调试模式。无法访问的从头检查数据库路径、IP和端口有没有出错，端口放行过了没。

# 创建 service 管理 FileBrowser

复制下面全部内容粘贴然后回车

```
cat > /etc/systemd/system/filebrowser.service <<EOF
[Unit]
Description=FileBrowser
After=network.target
[Service]
ExecStart=/usr/local/bin/filebrowser -d /data/filebrowser.db
[Install]
WantedBy=multi-user.target
EOF
```
重载 systemd 管理器配置，使 filebrowser.service 生效
```
systemctl daemon-reload
```
### 下面提供了 FileBrowser 的管理命令
这里使用下 `运行` 和 `开机启动` 两条命令，其它的供你参考，中文注释不用复制。
```
# 运行
systemctl start filebrowser
# 重启
systemctl restart filebrowser
# 停止运行
systemctl stop filebrowser
# 开机启动
systemctl enable filebrowser
# 取消开机启动
systemctl disable filebrowser
# 查看运行状态
systemctl status filebrowser
```
# 大功告成
登录 FileBrowser 后默认位于根目录范围，你可以在设置→用户管理→🖊修改目录范围，也可以在这里修改用户名和密码，保存下就好了，其它设置请自行研究。

[![filebrowser_02.jpg](https://mdzz.cf/images/2023/04/05/filebrowser_02.jpg)](https://mdzz.cf/image/8kW)
[![filebrowser_03.jpg](https://mdzz.cf/images/2023/04/05/filebrowser_03.jpg)](https://mdzz.cf/image/8kW)
[![filebrowser_04.jpg](https://mdzz.cf/images/2023/04/05/filebrowser_04.jpg)](https://mdzz.cf/image/8kW)

### 后记

如果你的 IP 已经绑定了域名，且已经申请了 SSL 证书，想开启 Https 访问，步骤如下。
运行状态的 filebrowser 先停止，再输入以下命令，注意修改证书文件和私钥文件的路径，完事再运行就可以 Https 访问了。
```
filebrowser -d /data/filebrowser.db config set --cert /path/to/cert.pem --key /path/to/key.pem
```