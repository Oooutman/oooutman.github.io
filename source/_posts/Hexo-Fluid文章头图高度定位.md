---
title: Hexo_Fluid文章头图高度定位
date: 2023-04-10 03:35:30
permalink: fluid_banner_height
banner_position: center 50%
index_img:
banner_img:
tags: Fluid
published: false
categories: Fluid 主题自定义
---
# 涉及以下文件

`hexo-theme-fluid\layout\_partials\header\banner.ejs`
在`banner.ejs`文件中，我们定义了一个变量`banner_position`，它的值是这样获取的：

```
var banner_position = page.banner_position || 'center center'
```

这段代码表示，如果文章的头部信息中设置了`banner_position`字段，那么就使用该字段的值作为图片的定位；否则，就使用默认值`center center`作为图片的定位。

因此，对于那些你想要保持原样的文章，你不需要在它们的头部信息中添加`banner_position`字段，它们会自动使用默认值`center center`作为图片的定位。

如果你想要控制图片的定位，在文章的头部信息中添加一个新的字段，例如banner_position，来单独控制图片的定位。然后在 `banner.ejs` 文件中进行相应的修改。
var banner_position = page.banner_position || 'center center'
...
<div id="banner" class="banner" <%- theme.banner && theme.banner.parallax && 'parallax=true' %>
     style="background: url('<%- url_for(banner_img) %>') no-repeat <%= banner_position %>; background-size: cover;">


然后在文章头部信息增加：banner_position: top center
```
---
title: 标题
banner_img: //1080.jpg
banner_position: top center
---
```