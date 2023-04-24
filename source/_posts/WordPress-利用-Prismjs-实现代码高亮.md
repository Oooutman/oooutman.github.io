---
title: WordPress 利用 Prismjs 实现代码高亮
banner_position: center 50%
date: 2023-04-16 01:20:59
index_img:
banner_img:
tags:
categories:
published: false
---

试了很多WordPress的代码高亮插件，或多或少都有各种各样的问题，要么是版本兼容性问题，要么是样式太难看，总之没有找到满意的。正在苦恼之际找到了PrismJS这个代码高亮项目。项目地址：https://prismjs.com

PrismJS的特点是简单、轻量、高效、可扩展、支持178种语言的代码高亮。下面就开始教程吧。除了PrismJS这个代码高亮项目外，还有一个比较知名的项目叫highlightJS ，有着更丰富的主题，不过不支持行号（网上有一些方法可以支持行号），但是我试用感觉不是很好，有时代码明明没分行，却给我自动分行了，加上没有PrismJS轻量就没用它了。

# 1、下载配置文件

进入官网首页后，看到如下图，顶部有 **DOWNLOAD** 的图标，右侧则是8个主题样式选项。

![01](https://www.twoha.tk/wp-content/uploads/2019/06/%E4%BB%A3%E7%A0%81%E9%AB%98%E4%BA%AE/1.jpg)

页面下拉可以看到你当前选择的主题样式的代码预览效果，你可以分别选择8种样式看看有没有你喜欢的，没有就不用再看下去了。

![02](https://www.twoha.tk/wp-content/uploads/2019/06/%E4%BB%A3%E7%A0%81%E9%AB%98%E4%BA%AE/2.jpg)

找到中意的主题后点击“DOWNLOAD”进入下载页面，这个页面主要有这六部分组成：`Compression level（压缩等级）、Core（核心）、Themes（主题）、Languages（程序语言）、Plugins（插件）。`

选中你要下载的主题， Compression level默认Minified version就可以，Core不可选不用管，然后选择你中意的主题，剩下 Languages 和 Plugins 根据你的需要选择，选的越多产生的文件也会越大，后面有大小提示，我是只选了个代码行号的插件（Line Numbers）

选完后点击底下 `DOWNLOAD JS` 和 `DOWNLOAD CSS` 按钮下载这两个文件。

# 2、引入这两个文件

首先将这两个文件上传到网站，然后修改主题下的 `functions.php` 文件来引入，如果你的 Wordpress 安装有子主题，建议还是修改子主题的 `functions.php`。

如下图编辑主题或子主题的 `functions.php` 文件，在里面加入如下代码，注意里面两个文件的路径跟你上传的文件路径要对上，然后更新文件保存下就可以了。

![03](https://www.twoha.tk/wp-content/uploads/2019/06/%E4%BB%A3%E7%A0%81%E9%AB%98%E4%BA%AE/3.jpg)

加入的代码
```
function add_prism() {
    // Register prism.css file
    wp_register_style(
        'prismCSS', // handle name for the style so we can register, de-register, etc.
        get_stylesheet_directory_uri() . '/prism.css' // prism.css文件路径
    );
    // Register prism.js file
    wp_register_script(
        'prismJS', // handle name for the script so we can register, de-register, etc.
        get_stylesheet_directory_uri() . '/prism.js' // prism.js文件路径
    );
    // Enqueue the registered style and script files
    wp_enqueue_style('prismCSS');
    wp_enqueue_script('prismJS');
}
add_action('wp_enqueue_scripts', 'add_prism');
```
到此你的网站就支持代码高亮了，但是还没结束，这时你去编辑文章插入代码区块，然后输入代码，预览下你会发现并没有应用代码高亮。

# 3、修改代码块html

要想应用代码高亮，我们需要将代码区块转换为html修改下相关设置，代码区块转换如下图操作，先要预格式化，然后作为html编辑，或者一开始就添加html区块。

![04](https://www.twoha.tk/wp-content/uploads/2019/06/%E4%BB%A3%E7%A0%81%E9%AB%98%E4%BA%AE/4.jpg)
![05](https://www.twoha.tk/wp-content/uploads/2019/06/%E4%BB%A3%E7%A0%81%E9%AB%98%E4%BA%AE/5.jpg)

修改html格式如下 。
```
<pre class="line-numbers"><code class="language-php">代码放这里</code></pre>
```
`language-php` 这里的 `php` 可以换成其它语言，比如改 CSS 就写 `language-CSS` 。
`line-numbers` 是代码行号，需要你前面下载文件的时候勾选了行号插件才能显示，如果不想用就去掉它。

修改完后预览下就发现可以代码高亮了，但是每次手动加是不是很艹蛋，下面来给区块编辑器添加自定义代码区块。

# 4、自定义代码区块

代码高亮是免插件了，自定义区块则借助了 `Block Lab` 这个插件实现，安装并启用这个插件后，进行插件设置，点击 `Add New` 创建自定义区块。然后如下图填写相关信息，填好后点发布。

![06](https://www.twoha.tk/wp-content/uploads/2019/06/%E4%BB%A3%E7%A0%81%E9%AB%98%E4%BA%AE/6.jpg)

当你创建一个自定义区块后，接着要在服务器创建个php文件，目录位置上图有提示：Template: /wp-content/themes/typology-child/blocks/block-code-highlight.php，具体的路径或名称你的可能跟我有点不同时正常的，重点在于后面的 `blocks` 目录和 `php` 文件这个需要手动创建，然后编辑 `php` 文件，编辑内容如下。
```
<pre class="line-numbers"><code class="language-php"><?php block_field('code'); ?></code></pre>
```
重点在于中间 `<?php block_field('code'); ?>` 这部分代码，这里的code对应前面自定义区块设置的 `Field Name`。

保存后再去编辑文章，如下图，添加区块的常用区块项目就有新建的区块了。

![07](https://www.twoha.tk/wp-content/uploads/2019/06/%E4%BB%A3%E7%A0%81%E9%AB%98%E4%BA%AE/7.jpg)

添加后如下图，可以直接在输入框内输入代码就可以了。

![08](https://www.twoha.tk/wp-content/uploads/2019/06/%E4%BB%A3%E7%A0%81%E9%AB%98%E4%BA%AE/8.jpg)

最后预览下没问题就成功了。