---
title: Aria2服务器端使用技巧和问题整理
date: 2023-04-16 01:47:55
permalink: aria2-faq/
banner_position: center 60%
index_img: https://mdzz.cf/images/2023/04/16/wallhaven-rd6yeq_1080.jpg
banner_img: https://mdzz.cf/images/2023/04/16/wallhaven-rd6yeq_1080.jpg
tags:
- Aria2
- 离线下载
categories: 杂记
---

旧文章待更新
# PT注意事项

PT站有各种考核，所以需要额外的一些设置，编辑你的 `aria2.conf` 配置文件，在 `##BT/PT下载相关##` 这个类别下，部分选项请参考如下设置，最后一项分享率根据你的站点考核自行设置。

```
# 打开DHT功能, PT需要禁用, 默认:true
enable-dht=false
# 打开IPv6 DHT功能, PT需要禁用
enable-dht6=false
# 本地节点查找, PT需要禁用, 默认:false
bt-enable-lpd=false
# 种子交换, PT需要禁用, 默认:true
enable-peer-exchange=false
# 每个种子限速, 对少种的PT很有用, 默认:50K
#bt-request-peer-speed-limit=50K
# 客户端伪装, PT需要
peer-id-prefix=-TR2770-
user-agent=Transmission/2.77
# 当种子的分享率达到这个数时, 自动停止做种, 0为一直做种, 默认:1.0
seed-ratio=2.0
```

设置完记得重启下 aria2 使其生效。

```
/etc/init.d/aria2 restart
```

# 网盘互拷

先来看网盘互拷，跟手动上传操作差不多。如果担心自己撸的 5T OneDrive 或无限 Google Drive 会随时扑街，就搞两个网盘互相对拷，总不能两个一起死吧。
我们可以再次配置 Rclone，比如我给第二个配置命名为 `remote2`，只是想手动上传的不用配置第二个。
还有一个问题就是拷贝一般是手动执行，且时间可能会很长，如果拷贝过程中关闭SSH客户端会导致拷贝中断，所以先安装下`screen`，通过 screen 来进行拷贝，就算关闭 SSH 客户端就不会造成任务中断了。

```
yum install -y screen  #红帽系
apt install -y screen  #Debian系
```

screen 安装好后，也绑定了二个网盘，这时我要将 `**remote** 这个配置关联的 OneDrive 里的 **backup** 目录下的文件拷贝到 **remote2** 配置关联的 OneDrive 里的 **backup** 目录下的文件`， 只需要执行以下命令即可。目录要跟你的对上。

```
screen -L rclone copy -v remote:backup remote2:backup
```

上面代码的大致意思

> * `screen`
> 在新建的screen窗口下运行命令（这样关闭ssh窗口也不会导致任务中断）
> 
> * `-L`
> 在当前目录生成屏幕完整日志文件（如果第二次运行screen产生的日志文件会在以前的日志文件下面延续）
> * `rclone`
> 使用rclone命令
> * `copy`
> 复制，也就是 A 网盘文件复制到B网盘然后两个网盘都保留有这个文件，如果要 A 到 B 后就只有 B 网盘留有这个文件，则将copy 改为 move
> * `-v`
> rclone在拷贝或移动时会显示进度过程，前面 screen -L 是将这个同步进度保存为日志文件，方便同步失败的时候查看原因
> * `remote:backup remote2:backup`
> 将remote网盘配置下的backup文件夹（拷贝或移动到）remote2 网盘配置下的 backup 目录，如果你想更进一步只针对网盘 backup 文件夹内的 2ha.txt 单个文件时，就这样写 remote:backup/2ha.txt
> 
 如果不想手动网盘对拷，可以利用宝塔面板添加 `计划任务` 来定时对拷文件，将上面那条手动对拷的命令复制到计划任务的脚本内容里保存（如下图，`screen -L` 就不用加了，计划任务自己会生成日志），然后到了设定的时间就会自动对拷了。

![aria2_QA_01.jpg](https://mdzz.cf/images/2023/04/16/aria2_QA_01.jpg)

# 手动上传

VPS手动上传网盘跟网盘对拷命令格式一样，只要将第一个网盘目录改为VPS上的文件目录，但是需要精确到你要上传的文件或文件夹。但是有些文件名称很长且复杂，比如这样 `[Kamigami] Kara no Kyoukai Movie 01 [BD x264 1920x1080 DTS-HD(5.1ch,2.0ch) Sub(Chs,Jap)]`，像这种名称带括号空格和逗号的直接复制文件名到 Linux 里是不能识别的，需要在括号空格和逗号前面加入 `\` 转义它们才行，像这样 `\[Kamigami\]\ Kara\ no\ Kyoukai\ Movie\ 01\ \[BD\ x264\ 1920x1080\ DTS-HD\(5.1ch\,2.0ch\)\ Sub\(Chs\,Jap\)\]`，手动加 `\` 麻烦还容易出错。

不过可以利用自动输入，例如还是这个文件名，通过先输入 `\[Ka` 然后按下键盘 `Tab 键` 就会自动补齐后面文件名，如果类似文件名有很多，比如我上面的例子是某动画第一集，如果还有 02、03 集的文件，使用自动补齐只会补到集数的 0 为止，后面手动输入数字后就可以再按 Tab 键自动补齐了。还有一种更简单的方式就是用双引号 `"filename"` 把这种带空格、括号、逗号的文件名包括起来，但是某些字符（如$和`）仍然需要转义。

{% note info %}
<font size=3>**关于 Screen 和 Rclone 更多参数设置请查看官方文档**</font>
* Screen官方文档： https://www.gnu.org/software/screen/manual/screen.html
* Rclone官方文档：https://rclone.org/docs/
{% endnote %}

# 清理日志文件

自动上传和利用 screen 上传产生的日志文件随着下载上传量增加会越来越大，这两个日志的位置分别位于 `/root/.aria2/aria2.log` 和 `/root/screenlog.0` ，过大会无法在线查看，需要下到本地查看，且内容过长不易审阅。

要清理同样可以利用宝塔面板里的计划任务，比如清理 aria2.log 的脚本内容如下，清理 screenlog.0 的话只要改下代码后面文件目录即可。建议周期不要太短，否则下载或同步出错想看日志都没得看。

```
cat /dev/null > /root/.aria2/aria2.log
```

# 下载大于服务器硬盘容量的文件合集

注意是文件合集，如果单个文件超过剩余硬盘容量是没法下载的。假如你要下一个 110G 的视频合集，合集包含 2 个视频，每个视频 55G，但是你 VPS 硬盘容量只剩 60G 了。这种我们可以先添加任务，然后暂停这个任务，点击 `N 个文件` 进入任务详情。

![aria2_QA_02.jpg](https://mdzz.cf/images/2023/04/16/aria2_QA_02.jpg)

进入文件列表，然后根据剩余硬盘大小勾选部分文件下载。

![aria2_QA_03.jpg](https://mdzz.cf/images/2023/04/16/aria2_QA_03.jpg)

点击 `选择文件` 可以根据文件类型进行快速选择（无意中发现这个可以点😓）。

![aria2_QA_04.jpg](https://mdzz.cf/images/2023/04/16/aria2_QA_04.jpg)

还有一个问题就是可能添加超过硬盘大小的任务时会直接失败，根本没法先暂停任务，也就没法进行部分文件选择。解决这个问题需要修改 aira2.conf 配置文件，在 `## 文件保存相关 ##` 这类里找到 `文件预分配方式`，可以搜索这部分 `file-allocation=`，把值修改为trunc（如下），前面如果有 # 记得去掉前面 # 使其生效，同样不要忘记保存配置文件后重启 aria2。

```
file-allocation=trunc
```

# OneDrive 被墙免代理直连下载

有些地区宽带运营商会把 OneDrive 给墙了，本地无法直连登录和下载，得挂代理才能下载（某种意义上还不如挂代理从服务器上下载更方便）。这时可以采用迂回战术，先注册个 [koofr](https://k00.fr/kgaes2wa) 网盘（德国的），这个网盘免费空间只有 2G，不过没关系，我们主要用它绑定 OneDrive，然后就可以在这里免代理直连下载 OneDrive 的文件（生成的下载链接变成 app.koofr.net 开头的）。

![aria2_QA_05.jpg](https://mdzz.cf/images/2023/04/16/aria2_QA_05.jpg)

# 单个大文件分卷上传

其实挂载网盘真的没啥必要，直接从服务器下回本地最好，如果网络可以的话，分卷上传属于下下策。OneDrive 是有单个文件大小上传限制的，单个文件超过 15G 不能上传。像 4K 原盘、Remux 这类影片基本都会超过这个大小。这时就得在服务器上对大文件进行分卷压缩然后上传网盘，因为是要下到 PC 上用，所以用 zip 来压缩，但是 linux 压缩 zip 得分两次，一次是先将文件压成一个 zip，然后分卷这个 zip，所以如果你要分卷一个 40G 的源文件，服务器剩余硬盘空间最少要有 80G。

根据 Linux 发行版选下面一个命令安装 zip

```
yum install -y unzip zip #红帽系
apt install -y unzip zip #Debian系
```

这样就能使用zip压缩了，接着假设你要压缩的文件名为 `2ha.iso`，这个文件大小为 `40G`，位于 `/data/download/` 这个目录，准备将他分卷成 `5G` 大小的 `8` 个文件，参考操作如下。

```
cd /data/download  #先进入这个目录位置
zip -r name.zip 2ha.iso  #将 2ha.iso 压缩成一个 name.zip
zip -s 5G name.zip --out name2.zip  #将 name.zip 按 5G 大小分卷压缩，分卷名称为 name2，不要跟单个 zip 同名
```

上面分卷使用的单位除了 G 也可以用 M。将分卷上传到网盘，再从网盘将所有分卷下载到电脑后，放在同个文件夹，然后同时解压就出来 2ha.iso 了。

# 给AriaNg面板添加文件管理选项

因为经常会用到文件管理，每次手动输入网址挺麻烦的，干脆在 AriaNg 的界面加一个文件管理选项，效果如下。

![aria2_QA_06.jpg](https://mdzz.cf/images/2023/04/16/aria2_QA_06.jpg)

要添加选项你得编辑 AriaNg 目录（就是安装教程里宝塔 `站点` 的目录 ）下的 `index.html`（修改之前建议你先备份一下），点开编辑后会发现排版挤在一起很乱不容易找，这里用搜索定位，因为是要在 `Aria2 状态` 选项下面新增选项，所以搜索 `Aria2 Status`，大致内容如下。

```
<li data-href-match="/status">
<a href="#!/status">
<span class="label pull-right" ng-if="globalStatusContext.isEnabled || isCurrentRpcUseWebSocket" ng-class="{'label-primary': taskContext.rpcStatus === 'Connecting', 'label-success': taskContext.rpcStatus === 'Connected', 'label-danger': taskContext.rpcStatus === 'Disconnected'}" ng-bind="taskContext.rpcStatus | translate"></span> 
<i class="fa fa-server"></i>
<span translate>Aria2 Status</span>
</a>
</li>
```

找到 Aria2 Status 的 li 标签结尾，也就是 `</li>`，在这后面加入如下代码，注意下面代码里面的 `http://IP:8080`，将这个地址改为你 FileBrowser 的地址。

```
<li data-href-match="/file">
<a href="http://IP:8080" target="_blank">
<i class="fa fa-folder"></i>
<span translate>文件管理</span>
</a>
</li>
```
保存后刷新下你的AriaNg界面应该就能看到这个选项了，如果没出现清理下浏览器缓存再刷新试试。

# FAQ

>1. **下载完成会占用VPS空间吗**
>要等完全上传到网盘上后就不占用VPS空间了，你也可以在文件管理下对不需要的文件进行删除。

>2. **文件下载100％完成了，没有上传到OneDrive网盘**
>文件要从 `正在下载` 进入 `已完成` 才会触发上传脚本，有时“正在下载”显示100％完成了也不会马上进入“已完成”，因为BT要做种，我也不建议图自己方便将分享率设0。看看国内BT环境，既然出来下BT，本着你好我好大家好的原则，建议最小也设置个1.1（比下载多上传0.1的数据），做种时不会自动上传可以使用上面手动上传的方案，注意用 `copy` 不要用 `move`，用 move 传完会把你服务器文件删了，影响你做种率（PT的尤为注意）。

>3. **上传总是失败，OneDrive下生成一大堆TMP临时文件**
>VPS内存太小（一般发生在 512M 的小鸡上）导致的上传崩溃，你可以在 rclone 手动上传命令后面加入 `--buffer-size=8M`（buffer-size默认是16M）或者加入 `--transfers=3`（同时上传数3，默认是4）
有时候上传太频繁也会导致失败，可以先等会再手动上传，或加入 `--tpslimit 1` 就不会那么容易失败了（玄学）。