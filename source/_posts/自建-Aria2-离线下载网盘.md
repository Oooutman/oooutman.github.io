---
title: 自建 Aria2 离线下载网盘
date: 2023-03-29 00:31:29
permalink: aria2/
banner_position: center 50%
index_img: https://www.mdzz.cf/images/2023/04/15/wallhaven-gjyoq7.jpg
banner_img: https://www.mdzz.cf/images/2023/04/15/wallhaven-gjyoq7.jpg
published: false
tags:
---
旧文章待更新
## 简单介绍下实现方式

在 VPS 主机上安装 Aria2 来帮助我们 7×24 小时不间断下载 BT，好比你本地电脑用迅雷下载资源一样。优点就是不间断，比起国内受限的 BT 环境，通常 VPS 的速度会更快，前提 VPS 带宽够大，VPS 建议用国外的，毕竟国外 BT 的环境好一点，做种的人多速度就容易上来。还有就是硬盘要够大，这就涉及到块存储了，普通切片一


{% note info %}
<font size=4>**准备环境**</font>

* 一台 VPS 主机（推荐FranTech家，G口无限流量+便宜的块存储=爽歪歪，看介绍）
* 教程使用 CentOS 7 系统搭建
* 一个 OneDrive 账号（如何申请OneDrive5T网盘的教程我就不写了，网上一堆，淘宝5块钱不到也能买到）

<font size=2>除了挂载OneDrive网盘之外，还支持 Google Drive、Mege、Box等几十个国外网盘，其它网盘挂载教程这里我就不说了，善用搜索引擎。</font>
{% endnote %}

小白可以理解为你租了别人一台电脑（只不过是linux系统的），然后在上面安装了Aria2下载软件帮你7×24小时不间断下载做种。别人的电脑下载跟自己的电脑下载不是一样的，干嘛还要另外花钱租？如果你有这个疑问也正常，但是国内个人宽带下载BT速度受限的厉害，能有速度给你下就不错了，VPS服务器则基本不会受限，但也不是说一定就快，具体还要看种子，但是比自己本地速度快基本是肯定的，如下图，能上60MB/s的还是极少的，多数都在10MB/s以下。
![下载界面](https://upload-images.jianshu.io/upload_images/18075075-87e4be42a8c251e0.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##SSH登录服务器开搞
如果你是连怎么买VPS服务器，SSH是什么都不知道的超小白，还是先网上了解下比较好。或者我也可以有偿代建。

**不说废话了，先安装小z大佬的CCAA傻瓜一键式脚本，直接整合了aria2下载工具、AriaNg前端显示面板（界面）、Caddy filemanager文件管理（直观的对下载文件进行管理）**
```
yum -y update  #更新系统
yum -y install wget unzip curl    #安装wget 、unzip、curl
wget https://github.com/helloxz/ccaa/archive/master.zip  #下载安装文件压缩包
unzip master.zip && cd ccaa-master && sh ccaa.sh  #解压 创建目录 开始安装
```
**出现下面界面输入 1 回车安装CCAA**
```
CentOS 7 + Caddy + Aria2 + AriaNg一键安装脚本，简称CCAA
1) 安装CCAA
2) 卸载CCAA
3) 更新bt-tracker
q) 退出！
:1
```
接下来根据提示设置**下载路径、RPC密钥、用户名、密码**，填好记住就行，稍后要用到，这里我强调下我设置下载路径为 `/data/download` ，这个在教程后面挂载网盘时会用到，如果你是小白，怕出错可以完全按照我的来填写。
```
设置下载路径（请填写绝对地址，默认/data/ccaaDown）:/data/download
Aria2 RPC 密钥:(字母或数字组合，不要含有特殊字符):2ha123
设置Caddy用户名:2ha
设置Caddy密码:2ha123
```
根据提示打开浏览器访问`http://IP:6080/`打开AriaNg界面，并输入上一个步骤中设置Caddy用户名和密码。
登录进来后会提示认证失败，点确定关掉小窗口，接着我们来认证，打开**AriaNg设置**，再点**RPC**项 ，填写前面设置的**Aria2 RPC 密钥**，填完点**重新加载页面**，Aria2 状态显示已连接就好了，现在已经可以下载了。
![RPC认证](https://upload-images.jianshu.io/upload_images/18075075-c45829e0c24d892c.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
点击右上角文件管理按钮会跳转到Caddy filemanager进行文件管理，或者手动输入地址`http://IP:6080/admin`也可以进入Caddy filemanager
![文件管理](https://upload-images.jianshu.io/upload_images/18075075-11a7db2c0e021fa6.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
**设置下CCAA开机自启**
```
chmod +x /etc/rc.d/rc.local 
echo "/usr/sbin/ccaa start" >> /etc/rc.d/rc.local
```
##绑定网盘并实现 Aria2 下载结束自动上传文件
以下分为三小步这里做个简介：第一步是 PC 端获取网盘授权的 token；第二步是在 VPS 里绑定获得的授权；第三步才是真正挂载到网盘上。因为OneDrive的授权需要在浏览器打开，而 VPS 没有图形界面，只能先在 PC 端获取授权，所以第一步和第二步有点重复。

**1、windows（PC）端安装Rclone**
登录[Rclone官网](https://rclone.org/downloads/)下载 Rclone 的 windows 客户端
![下载windows文件](https://upload-images.jianshu.io/upload_images/18075075-d1e220ebdac6184a.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
下载后将其解压将里面的 rclone.exe 移动到本地 C:\Windows\System32这个目录，其它的可以删掉没关系
按` win + R `快捷键打开运行，输入 `cmd` 确定来打开cmd窗口,输入下面命令开始配置
```
rclone config
```
然后出现如下界面，按提示输入`n`回车创建个新的远程，然后提示输入name，名称随意但要记住，这里我填`remote`
```
Current remotes:

Name                 Type
====                 ====
onedrive             onedrive

e) Edit existing remote
n) New remote
d) Delete remote
r) Rename remote
c) Copy remote
s) Set configuration password
q) Quit config
e/n/d/r/c/s/q> n   
name> remote
```
回车后出现一长串网盘列表让你选，这里OneDrive是19，填入19回车，不要死记数字，不同版本数字会变化
```
Current remotes:

Name                 Type
====                 ====
onedrive             onedrive

e) Edit existing remote
n) New remote
d) Delete remote
r) Rename remote
c) Copy remote
s) Set configuration password
q) Quit config
e/n/d/r/c/s/q> n
name> onedrive
Type of storage to configure.
Enter a string value. Press Enter for the default ("").
Choose a number from below, or type in your own value
 1 / A stackable unification remote, which can appear to merge the contents of several remotes
   \ "union"
 2 / Alias for a existing remote
   \ "alias"
 3 / Amazon Drive
   \ "amazon cloud drive"
 4 / Amazon S3 Compliant Storage Provider (AWS, Alibaba, Ceph, Digital Ocean, Dreamhost, IBM COS, Minio, etc)
   \ "s3"
 5 / Backblaze B2
   \ "b2"
 6 / Box
   \ "box"
 7 / Cache a remote
   \ "cache"
 8 / Dropbox
   \ "dropbox"
 9 / Encrypt/Decrypt a remote
   \ "crypt"
10 / FTP Connection
   \ "ftp"
11 / Google Cloud Storage (this is not Google Drive)
   \ "google cloud storage"
12 / Google Drive
   \ "drive"
13 / Hubic
   \ "hubic"
14 / JottaCloud
   \ "jottacloud"
15 / Koofr
   \ "koofr"
16 / Local Disk
   \ "local"
17 / Mega
   \ "mega"
18 / Microsoft Azure Blob Storage
   \ "azureblob"
19 / Microsoft OneDrive
   \ "onedrive"
20 / OpenDrive
   \ "opendrive"
21 / Openstack Swift (Rackspace Cloud Files, Memset Memstore, OVH)
   \ "swift"
22 / Pcloud
   \ "pcloud"
23 / QingCloud Object Storage
   \ "qingstor"
24 / SSH/SFTP Connection
   \ "sftp"
25 / Webdav
   \ "webdav"
26 / Yandex Disk
   \ "yandex"
27 / http Connection
   \ "http"
Storage> 19
```
接着`client_id`和`client_secret` 直接不填回车
`Edit advanced config?` 输入 n 回车
`Already have a token - refresh? `输入 y 回车，后面 VPS 里配置时是没有这个提示的，会出现下个自动配置选项，别手快直接y
`Use auto config?` 这里输入 y 回车，后面 VPS 配置时这步要选 n
具体操作如下，不同版本可能会有变化，反正就是做选择题，看不懂复制出来可以翻译
```
Microsoft App Client Id
Leave blank normally.
Enter a string value. Press Enter for the default ("").
client_id>
Microsoft App Client Secret
Leave blank normally.
Enter a string value. Press Enter for the default ("").
client_secret>
Edit advanced config? (y/n) 
y) Yes
n) No
y/n> n
Remote config 
Already have a token - refresh?  
y) Yes
n) No
y/n> y
Use auto config?  
 * Say Y if not sure
 * Say N if you are working on a remote or headless machine
y) Yes
n) No
y/n> y
```
接着浏览器会自动弹出窗口，然后登录你要挂载的OneDrive账号，征求许可接受就行了，出现下图界面授权成功。
![授权成功](https://upload-images.jianshu.io/upload_images/18075075-d0cac4be426cdddc.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
授权成功后返回 cmd 窗口出现以下界面，这里选1回车。
```
Choose a number from below, or type in an existing value
 1 / OneDrive Personal or Business  #个人和商用
   \ "onedrive"
 2 / Root Sharepoint site
   \ "sharepoint"
 3 / Type in driveID
   \ "driveid"
 4 / Type in SiteID
   \ "siteid"
 5 / Search a Sharepoint site
   \ "search"
Your choice>1
```
提示找到一个驱动器，让你选择，这里就一个选项0，那就填入0回车，然后问你是否ok，选y回车。
```
Found 1 drives, please select the one you want to use:
0: OneDrive (business) id=huioaeuiaeagioioieuiaaefe@#%gaege94#
Chose drive to use:>0
Found drive 'root' of type 'business', URL:https://jxjjxy-my.sharepoint.com/personal/meeaghvp_t_odmail_cn/Documents
Is that okay?
y) Yes
n) No
y/n> y
```
接着会出现一串长token，PC端的操作全是为了这个token，将下图红框内的整个复制，复制范围 `{"access_token":…………………………2019-04-21T16:41:25.1595637+08:00"} `保存好以后可以省了这步PC端操作，下面就要连接VPS操作了。
![复制token](https://upload-images.jianshu.io/upload_images/18075075-389ef6a528d002e3.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
**2、VPS安装Rclone**
```
cd ~  #返回root目录
curl https://rclone.org/install.sh | sudo bash  #安装Rclone
rclone config  #配置Rclone
```
上面输入完`rclone config`回车后的过程就跟前面在 PC 端的配置步骤基本一样，这里就不重复了，**只有Use auto config? 问你是否使用自动配置这步不同，这里选n回车，然后在出现的 result> 后面粘贴上你前面获得的 token 然后回车，接着会有几个确认（问你是否OK），按提示填y就行，**
直到又回到下图配置开头界面，输入 q 回车退出配置即可，到此我们完成了网盘的授权。
```
Name                 Type
====                 ====
onedrive             onedrive

e) Edit existing remote
n) New remote
d) Delete remote
r) Rename remote
c) Copy remote
s) Set configuration password
q) Quit config
e/n/d/r/c/s/q> q
```
>以上两步就是为了得到token，并在vps里的rclone下创建一个`rclone.conf`配置文件，这个配置文件存储位置在`root/.config/rclone/rclone.conf`，可以将这个文件下载到本地，以后直接VPS上安装好rclone就不用配置了，直接将这个配置文件放进这个目录即可。**小白可以利用宝塔面板来管理编辑文件**

**3、自动上传设置**
```
yum -y install vim*  #先安装下vim，也可以不安装用vi命令
vim /root/rcloneupload.sh  #创建并打开名为 rcloneupload.sh 的脚本，用来处理自动上载
```
vi命令给不懂的小白先科普下，上面代码`vim /root/rcloneupload.sh`，你可以把它理解为用记事本 (vim) 新建了一个txt文档，`rcloneupload.sh`这个脚本是新建的，所以打开后里面是空白的，接着就要编辑它，要编辑需要先敲下键盘的` i` 键，这样我们就进入 `INSERT` 插入模式了，可以将光标移动到对应位置来修改文档内容。修改完要保存时先敲下 `esc` 键来退出插入模式，然后保持英文输入法下输入`:wq`回车就保存退出vim了。
这里复制以下全部内容粘贴进去，确保里面以下三项的路径跟你前面设置的一致，最后检查下有没有复制漏了的部分，我这边复制总是缺失头部两行的内容，没问题就保存退出。
`downloadpath='/data/download' #Aria2下载目录`
`name='remote' #配置Rclone时的name`
`folder='/backup' #网盘里的文件夹，如果是根目录直接留空`
```
#!/bin/bash
filepath=$3     #取文件原始路径，如果是单文件则为/Download/a.mp4，如果是文件夹则该值为文件夹内第一个文件比如/Download/a/1.mp4
path=${3%/*}     #取文件根路径，如把/Download/a/1.mp4变成/Download/a
downloadpath='/data/download'    #Aria2下载目录
name='remote' #配置Rclone时的name
folder='/backup'     #网盘里的文件夹，如果是根目录直接留空
MinSize='10k'     #限制最低上传大小，默认10k，BT下载时可防止上传其他无用文件。会删除文件，谨慎设置。
MaxSize='15G'     #限制最高文件大小，默认15G，OneDrive上传限制。

if [ $2 -eq 0 ]; then exit 0; fi

while true; do
if [ "$path" = "$downloadpath" ] && [ $2 -eq 1 ]    #如果下载的是单个文件
    then
    rclone move -v "$filepath" ${name}:${folder} --tpslimit 1 --buffer-size=10M --min-size $MinSize --max-size $MaxSize
    rm -vf "$filepath".aria2    #删除残留的.aria.2文件
    exit 0
elif [ "$path" != "$downloadpath" ]    #如果下载的是文件夹
    then
    while [[ "`ls -A "$path/"`" != "" ]]; do
    rclone move -v "$path" ${name}:/${folder}/"${path##*/}" --tpslimit 1 --buffer-size=10M --min-size $MinSize --max-size $MaxSize --delete-empty-src-dirs
    rclone delete -v "$path" --max-size $MinSize    #删除多余的文件
    rclone rmdirs -v "$downloadpath" --leave-root    #删除空目录，--delete-empty-src-dirs 参数已实现，加上无所谓。
    done
    rm -vf "$path".aria2    #删除残留的.aria2文件
    exit 0
fi
done
```
保存后给予执行权限
```
chmod +x /root/rcloneupload.sh
```
然后编辑 Aria2 配置文件中，在末尾加上一行 `on-download-complete=/root/rcloneupload.sh` 即可，后面为脚本的路径，意思是下载完成执行这个脚本，这个脚本具有变量千万不要手动执行。重启 CCAA 使 Aria2 配置文件生效。
操作如下
```
vim /etc/ccaa/aria2.conf  #编辑aria2.conf
on-download-complete=/root/rcloneupload.sh  #末尾另起一行加上
ccaa restart  #重启ccaa
```
#多个网盘之间文件拷贝
有人可能担心自己撸的 5T OneDrive 或无限 Google Drive 会随时扑街，就会想搞两个网盘互相对拷，总不能两个一起死吧。既然我们能用 rclone config 创建了一个名为 `remote` 的配置，当然也能创建多个，你只需要再创建第二个网盘的配置即可，比如我给第二个配置命名为 `remote2`，然后拷贝的文件放到第二个网盘的 backup 文件夹下。
还有一个问题就是拷贝一般是手动执行，且时间可能会很长，如果拷贝过程中关闭SHH客户端会导致拷贝中断，所以先安装以下`screen`,通过screen来进行拷贝，关闭SSH客户端就不会造成任务中断了。
```
yum -y install screen  #安装screen
```
那么在绑定完第二个网盘后，只需要执行以下命令即可，目录要跟你的对的上，这里的意思是将**remote网盘配置的OneDrive里的backup目录下的文件**拷贝到**remote2网盘配置的OneDrive里的backup目录下的文件**，如果你是要拷贝OneDrive里backup目录下的**2ha**就这样写 `remote:backup/2ha`
```
screen rclone copy -v remote:backup remote2:backup
```
# 常见问题说明

**1、VPS的选择**

>用来下载的VPS当然是硬盘越大越好，所以还是选择大盘鸡比较划算，这里推荐下 **[virmach](https://billing.virmach.com/aff.php?aff=7514)**这家低价 VPS，他家最便宜3.5美元500G硬盘的大盘鸡还是很适合下载的，就是多数时间断货，需要经常关注下偶尔会补货。还有下载盗版的行为多数VPS商家是不允许的，不过如果商家没有接到投诉也不会来搞你，如果选择不是抗DMCA无视盗版的商家最好按月付款，降低封号损失。

**2、下载完成会占用 VPS 空间吗**

>要等完全上传到网盘上后就不占用 VPS 空间了，你也可以在 Aria2 文件管理下对不需要的文件进行删除，自动上传并不会将 Aria2 下载时自动生成的 BT 文件和 .aria2 文件也上传到网盘，你可以手动清理。

**3、文件下载100%完成了，为什么没有上传到网**
>文件要从“正在下载”进入“已完成”才会触发上传脚本，有时“正在下载”显示100%完成了也不会马上进入“已完成”，因为有时还要做种，你可以在Aria2设置→BitTorrent设置，将做种比率设小点，不过玩BT本着你好我好大家好的原则，建议最小也设置个1.0吧，如果真的急用就从“正在下载”删除任务，这个删除并不会删除文件，只是将任务直接移动到“已完成”这样服务器就会上传网盘了。

**4、上传总是失败，OneDrive下生成一大堆tmp临时文件**
>主要原因是上传太频繁导致的，最常见就是上传到一定百分比就中断二次三次频繁上传，这时你可以进filemanager文件管理新建个文件夹，比如我建个名为`2ha`的文件夹，然后将你下好的文件移动到这个文件夹内，先这样中断自动上传脚本（我也是小白只会这样中断，有大佬知道命令怎么中断吗），然后改为像两个网盘互拷那样手动上传，不过上传的命令要将`copy`改为`move`，如果还是出错歇一会再搞。
>也可能是VPS内存太小导致的上传崩溃，你可以在手动上传命令后面加入`--buffer-size=8M` （这应该是单个文件上传的内存占用，默认是16M）或者 加入`--transfers=3`(同时上传数3，默认是4)
>更多设置请参考 [Rclone 官方文档]([https://rclone.org/docs/](https://rclone.org/docs/)
>)