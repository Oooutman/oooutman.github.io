---
title: G口无限流量的大盘鸡 FranTech(BuyVM) 购买教程
date: 2023-04-14 21:21:03
permalink: buyvm-frantech/
banner_position: center 80%
index_img: https://www.mdzz.cf/images/2023/04/15/wallhaven-391ql6_1080.jpg
banner_img: https://www.mdzz.cf/images/2023/04/15/wallhaven-391ql6_1080.jpg
tags:
- vps
- 大盘鸡
categories: VPS 推荐
---

{% note info %}
**新手建言：**如果你是完全的小白，从没接触过 VPS，个人建议你可以先去白嫖 Vultr 的机子，有新人 250 美金一个月的试用，可参考这篇[**Vultr 新人免费250美金试用教程**](https://www.twoha.tk/Vultr_free_250)，不过 Vultr 的教程没写硬盘挂载，只说了实例部署，就相当于这里的切片购买， Vultr 也有块存储，1 美元/40G，太贵了，只有白嫖才能玩玩，练完手再换 FranTech 就行。
{% endnote %}

FranTech 是加拿大老牌服务商，成立于 2010 年的，它还有个名字是 BuyVM ，都是同一家，BuyVM 负责宣传介绍，购买则在 FranTech 。他家最大优点就是无限流量，缺点也和多数大盘鸡差不多，延迟不好看，ping 值好点也有 300+，不太适合科学上网（科学上网推荐 Vultr，要是有外币信用卡可以白嫖亚马逊、GCP、甲骨文这些），不过 FranTech 能上 NewBing 和 ChatGPT ，做个备用梯也不错。最适合还得是搞私有云离线下载，国外良好的 BT 环境和服务器 24 小时不间断下载，追剧看番美滋滋。

FranTech 的机子个体差异较大，最早买的 512MB 的小鸡，搭建了 LNMP + Aria2 + Xray 科学上网 + FileBrowser 网盘 + Chevereto 图床，稳的一批。后面加了个 1GB 的机子，建了两个 WordPress，会掉数据库，看了后台监控 CPU 和内存波动很大，高负载时间一长就崩了，后面优化了下数据库才不崩了。

{% note warning %}
<font size=3 color=#f0ad4e>**由于订单人工审核，有时不能及时开通服务器属于正常现象，看下他们上班时间，下单会有邮件提醒**</font>
* 周一至周五，GMT-7 的早上 8 点至下午 5 点，相当于我们的晚上 11 点至次日上午 8 点
* 周六，GMT-7 的早上 9 点至下午 1 点，相当于我们的晚上 12 点至次日凌晨 4 点
* 周日和美国节假日休息
{% endnote %}

# 注册
点击注册，能直连就直连，不要走代理访问：[https://my.frantech.ca](https://my.frantech.ca/aff.php?aff=2940)

![frantech_01.jpg](https://www.mdzz.cf/images/2023/04/15/frantech_01.jpg)

这家服务商欺诈审查较严（不过不像 VirMach 感觉鄙视中国用户），FranTech 以前推出过中国优化 IP 服务，可以看出还是蛮注重中国客户的。`只要注意三点基本没事：1.不要走代理；2.地址填写不要离你的 IP 所在地太远，建议不要出省；3.邮箱要真实，不要用临时邮箱。`姓名随便整个拼音中文名，电话选中国 +86 的，不会给你发短信号码可以不用真，以后会不会就不清楚了，自己判断；国家省份城市要跟你的 IP 所在地不要偏离太远，街道住址随便写个你 IP 所在城市某个街道或小区就行。如果真的要用梯子也因为用了梯子导致被判定欺诈，可以给客服发个工单说下原因，比如你不用梯子打不开网站之类的客服会帮你处理的。

其它信息填完点注册即可。注册完好像有邮箱验证，记不清了，注意看提示。

![frantech_02.jpg](https://www.mdzz.cf/images/2023/04/15/frantech_02.jpg)

# 选购

![frantech_03.jpg](https://www.mdzz.cf/images/2023/04/15/frantech_03.jpg)

商店页面如下图，虽然是显示 USD 美元，实际支付宝付款时是 CAD 加元，汇率 1:5 左右，比美元划算。
买前先看下 KVM 切片和块存储是否都有货，因为经常缺货。现在总共四个地区，以前只有一个拉斯维加斯，必须位于同个地区切片才能挂载块存储硬盘。现在切片最低是 3.5 加元/月，以前有 2 加元，不知道是不是停售了。

![frantech_04.jpg](https://www.mdzz.cf/images/2023/04/15/frantech_04.jpg)

块存储最低 1.25加元/256G/月，加上 3.5 的切片，合计 4.75 加元/月（人民币25块左右）。

![frantech_05.jpg](https://www.mdzz.cf/images/2023/04/15/frantech_05.jpg)

建议单月购买，防止意外下车，就是频繁续费有点烦，按季付费也可以。不要公开做盗版影视站点，自己下下 BT 问题不大。
{% note info %}
以前是自然月计费，现在好像不是了，自然月计费是在每月 20 号前购买单月，会在下个月 1 号到期，时间不足一月结算价会低于 3.5；如果是 20 号后购买单月，则是到下下个月 1 号到期，结算价会超过 3.5 的价格。这种计费方式有个缺点，会导致当月到期的都聚集在月初，短时间空出一批机子，缺货的时候没货，有货又要卖好几天，资源利用效率偏低。
{% endnote %}
选好购买时长、系统、填写服务器名称（名称随意），然后右侧点击继续就可以提交到购物车了。

![frantech_06.jpg](https://www.mdzz.cf/images/2023/04/15/frantech_06.jpg)

进购物车再核对下信息，无误选择支付方式付款即可。付款后注意查看邮件，现在跟以前有点不同（以前系统是要另外安装的，而且在上一步填写服务器名称边上有个 root 密码填写框），现在 root 密码应该是发邮件给你。

![frantech_07.jpg](https://www.mdzz.cf/images/2023/04/15/frantech_07.jpg)

# 后台

块存储的购买过程差不多我就不复述了。付款后可以在我的服务里面查看你购买的VPS，但是这里只能查看简单的状态，管理后台要从主菜单 `Stallion` 进入，Stallion 翻译过来是种马，意思是很能干吗🤔

![frantech_08.jpg](https://www.mdzz.cf/images/2023/04/15/frantech_08.jpg)

`Stallion`登录界面

![frantech_09.jpg](https://www.mdzz.cf/images/2023/04/15/frantech_09.jpg)

登录进来默认是在虚拟服务器界面，我这里是有两个机子，点击 `manage` 可以进入服务器管理页面。

![frantech_10.jpg](https://www.mdzz.cf/images/2023/04/15/frantech_10.jpg)

其它设置我就不说了，不懂别动，常用的也就 `Reinstall` 这个重新安装菜单，这里重装系统可以重新设定 root 密码。还有备份和快照里面的快照可以免费创建 5 个，也实用，其它请自行摸索。  

![frantech_11.jpg](https://www.mdzz.cf/images/2023/04/15/frantech_11.jpg)

# 挂载块存储

购买块存储后得先把存储卷附加到切片上，最上面菜单栏点击 `Storage Volumes` 进入存储卷，点块存储的设置按钮，再点击第二个选项 `附加到虚拟服务器`，然后会有个弹窗让你选择要附加的服务器。
这步操作就好比你买了个新硬盘接上了主机，还需要创建格式化硬盘分区才能完成挂载。

![frantech_12.jpg](https://www.mdzz.cf/images/2023/04/15/frantech_12.jpg)


挂载块存储会有封邮件，里面提到一句话摘录在下面。关键点是 `/dev/sd*`，这个*号是通配符，好比 D 盘、E 盘这种盘符，自行更改，教程后面使用 sda。
{% note info %}
All Volumes are attached via hotplug meaning that, at least on Linux, the drive will automatically show up as `/dev/sd*`. Windows users may need to install Virtio-SCSI drivers to use their volumes.

机翻：所有卷都通过热插拔连接这意味着，至少在Linux上，驱动器会自动显示为 `/dev/sd*`。 Windows用户可能需要安装为 Virtio-SCSI 驱动器使用它们的体积。
{% endnote %}

SSH 登录服务器，不会的可看这篇教程：[SSH客户端—Putty简易使用教程](https://www.twoha.tk/ssh-putty/)
一行一个使用下面命令挂载硬盘（注释不用复制）。挂载目录使用的是 `/mnt/file`，也可以挂载其它已存在目录。
```
# 使用 parted 命令创建 GPT 分区表
parted -s /dev/sda mklabel gpt

# 使用 parted 命令创建一个占用整个磁盘的主分区
parted -s /dev/sda unit mib mkpart primary 0% 100%

# 使用 mkfs.ext4 命令在新分区上创建 EXT4 文件系统
mkfs.ext4 /dev/sda1

# 创建挂载点目录
mkdir /mnt/file

# 将新分区添加到 /etc/fstab 文件中以便开机自动挂载
echo >> /etc/fstab
echo /dev/sda1 /mnt/file ext4 defaults,noatime,nofail 0 0 >> /etc/fstab

# 挂载新分区
mount /mnt/file
```
{% note warning %}
**注意：**如果你要换机子挂载块存储，并要保留块存储内的数据，先去后台分离块存储，再附加到新机子上。上面的挂载命令只需要从 `创建挂载点目录` 开始执行，前面几行命令就不用了，否则会把硬盘重新格式化一遍，务必注意。
{% endnote %}

最后使用 `df -h` 命令查看当前磁盘挂载情况，看到其中有 `/dev/sda1` 这行就大功告成了

```
Filesystem      Size  Used Avail Use% Mounted on
/dev/sda1       252G  177G   63G  74% /mnt/file
```

晒一下我这个 10 加元半年付的切片，应该是绝版了

[![FT512.jpg](https://www.mdzz.cf/images/2023/04/14/FT512.jpg)](https://www.mdzz.cf/image/OHP5)