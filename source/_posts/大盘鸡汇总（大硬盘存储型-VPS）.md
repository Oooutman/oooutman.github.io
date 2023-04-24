---
title: 大盘鸡汇总（大硬盘存储型 VPS）
date: 2023-04-14 01:40:49
permalink: storagevps/
banner_position: center 20%
index_img: //www.mdzz.cf/images/2023/04/14/wallhaven-jx91d5_1080.jpg
banner_img: //www.mdzz.cf/images/2023/04/14/wallhaven-jx91d5_1080.jpg
tags:
- vps
- 大盘鸡
categories: VPS 推荐
---

大盘鸡顾名思义就是大硬盘的 vps 主机，对于个人用户来说主要用途就是 BT 下载、自建网盘和图床。优点就是硬盘大，缺点就是不太适合搭建科学上网，网络延迟不太行。
***

* **配置更新于2023-04-14，商家可能随时更改套餐**

|      服务商      |           硬盘          |  内存 |   cpu<br>(vCore)   | 带宽<br>(Gbps) | 流量 | IPv4 | IPv6 |  类型  |      价格     |
|:----------------:|:-----------------------:|:-----:|:-------:|:---------------:|:----:|:----:|:----:|:------:|:-------------:|
|     [FranTech](https://my.frantech.ca/aff.php?aff=2940)   | 20GB+256GB<br>(kvm+块存储) | 1GB |  1 |        1        | 无限 |   1  |  有  |   KVM  | 3.5+1.25<br>(加元) |
|      [LetBox](https://my.letbox.com/aff.php?aff=443)      |          250GB          |  1GB  |  1 |        1        |  3TB |   1  |  有  |   KVM  |   3<br>(美元)  |
|    [SpartanHost](https://billing.spartanhost.net/aff.php?aff=936)  |        1TB        | 1GB |  1 |        10        |  3TB |   1  |  有  |   KVM  |    6<br>(美元)   |
|     [HostHatch](https://hosthatch.com/a?id=1456)    |          1TB          | 1GB |  1 |        1        |  2.5TB |   1  |  ？  |   KVM  |    5<br>(美元)   |
|     [ServerHub](https://my.serverhub.com/aff.php?aff=970)    |          500GB          | 512MB |  2 |        1        |  1TB |   1  |  有  | OpenVZ |    5<br>(美元)   |
|   [VirMach](https://billing.virmach.com/aff.php?aff=7514) |          500GB          | 512MB |  1 |        10       |  5TB |   1  |  无  |   KVM  |   3<br>(美元)  |
|[HudsonValleyHost](https://billing.hudsonvalleyhost.com/aff.php?aff=1153)|          250GB          | 512MB |  2 |        1        |  3TB |   1  |  无  | OpenVZ |    8<br>(美元)   |
|    [LiteServer](https://clients.liteserver.nl/aff.php?aff=168)    |       512GB       | 1GB |  1 |        1        |  15TB |   1  |  有  |   KVM  |    6<br>(欧元)   |
|     [SmartHost](https://www.smarthost.net/aff.php?aff=71)    |        1TB        |  1GB  |  1 |        1        |  5TB |   1  |  有  |   KVM  |  6.95<br>(美元)  |
|      [Time4VPS](https://www.time4vps.com/?affid=4214)      |          256GB          | 512MB |  1 |       0.1       |  2TB |   1  |  有  | OpenVZ |  5.19<br>(欧元)  |
|     [VaporNode](https://portal.vapornode.com/?affid=105)    |         1TB         |  1GB  |  2 |        1        |  5TB |   1  |  有  |   KVM  |    6.95<br>(美元)   |

上述商家只罗列了内存512MB起步的机子，如需更高的配置请自行查看。
***
FranTech 是加拿大老牌服务商，成立于 2010 年的，它还有个名字是 BuyVM ，BuyVM 这个站点负责宣传介绍，购买则在 FranTech 。他家无限流量香的很，就是 KVM 切片和硬盘分开买有点麻烦，而且切片还经常性缺货，现在也涨价了，以前有 512MB+10GB 的切片是 2 加元/月，标价虽然显示美元，实际支付宝付款是加元，汇率差不多 1:5，比美元划算。[**点我查看 FranTech 购买流程介绍**](https://www.twoha.tk/buyvm-frantech/)

我这个 FranTech 512MB 的 KVM 切片也算是个绝版了，半年 10 加元，当时买就很奇怪，贵的没折扣，最便宜这个有折扣，每月算下来 1.67 加元，19 年入手现在还在用，主力下 BT，还搭了个 Cheverto 图床。

![FT512.jpg](https://www.mdzz.cf/images/2023/04/14/FT512.jpg)

FranTech 的机子个体差异很大，最早买的 512MB 的小鸡稳的一批，搭建了 LNMP + Aria2 + Xray 科学上网 + FileBrowser 网盘 + Chevereto图床，内存和 CPU 占用就一半左右。后面追加了个 1GB 的机子，建了两个 WordPress ，经常掉数据库，看了后台监控 CPU 和内存波动很大，高负载时间一长就崩了。

{% note info %}
对哪家感兴趣的建议先去**全球主机论坛**看看别人怎么说的，可以 Google 搜索 `site://hostloc.com 搜索内容` ，比如想查看 LetBox 的评价，可以 Google 搜索输入 `site://hostloc.com LetBox` 就可以搜到论坛内关于 LetBox 的讨论了，再诚实的个人写推荐很多时候能反映的情况也比较片面。
{% endnote %}
