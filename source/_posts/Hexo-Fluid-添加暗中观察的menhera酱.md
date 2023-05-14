---
title: Hexo-Fluid 添加暗中观察的 menhera 酱
date: 2023-04-13 01:47:31
banner_position: center 90%
index_img: https://www.mdzz.cf/images/2023/04/13/wallhaven-p92y93_1080.png
banner_img: https://www.mdzz.cf/images/2023/04/13/wallhaven-p92y93_1080.png
tags:
- Fluid
categories: Fluid 主题自定义
---

# 涉及文件
除了第一个主题配置文件，其它文件需自行创建。

`_config.fluid.yml`
`hexo-theme-fluid\source\css\custom.css`
`\hexo-theme-fluid\source\js\custom.js`
`\hexo-theme-fluid\scripts\bgimage.js`

# 1. 修改主题配置文件

在 `_config.fluid.yml` 里添加一项配置。

```
background_image:
  enable: true
  src: /img/bg01.png
```

>`background_image` 是配置名称，名称可以随便写只要不跟其它项冲突就行，确定好后面就要统一使用这个名称。
>`enable:` 项方便随时启用和关闭
>`src:` 项则填写要加入的图片地址

{% note info %}
**提醒：**第 1 步其实可以省略，直接将第 2 步里的 `<%= theme.background_image.src %>` 改为图片地址，再把 `if 语句` 去掉就可以了。
{% endnote %}

# 2. 注入 HTML 片段

在主题的 `\scripts` 目录下新建个 `bgimage.js` 文件，文件名可自行修改。参考[Fluid 官方注入代码教程](https://hexo.fluid-dev.com/docs/advance/#fluid-%E6%B3%A8%E5%85%A5%E4%BB%A3%E7%A0%81)

写入以下内容，`bodyBegin` 这个注入点名称代表注入的 HTML 片段位于 `<body>` 标签中的开始位置。`menhera` 这个注入键名也可以自行修改，因为这个小人叫 menhera 所以我这么取名，以后要注入其它代码这个键名不能重复。
```
hexo.extend.filter.register('theme_inject', function(injects) {
    injects.bodyBegin.raw('menhera', `
        <% if (theme.background_image.enable) { %>
            <div id="background-image">
                <img src="<%= theme.background_image.src %>" alt="Background image">
            </div>
        <% } %>
    `);
});
```
这步做完使用 `hexo server` 命令来预览博客就可以看到加入的图片了，不过现在图片位于页面最左上角，还把头图给挤压到下面去了。除了修改主题配置文件需要退出重进预览才能看到效果，这里的其它修改都是可以修改后在预览状态下刷新页面查看效果的。

# 3. 自定义 CSS 文件

在主题的 `\source\css` 目录下创建个 `custom.css` 文件，名称也可以随意，然后在主题配置文件 `_config.fluid.yml` 找到 `custom_css:` 项引入这个 CSS 文件路径，可参考 [Fluid 官方的自定义 JS / CSS / HTML](https://hexo.fluid-dev.com/docs/guide/#%E8%87%AA%E5%AE%9A%E4%B9%89-js-css-html)

复制以下内容编辑 `custom.css` 文件，设置了 3 项
1. 图片位置固定
2. 距离底部高度 280px（可自行修改）
3. 层级设置了 4 ，设置层级是为了让图片显示在文章区块上面，不然我这里图片的手会被挡住，如果你的图片不想放上面层级可以不设置。

```
#background-image {
    position: fixed;
    bottom: 280px;
    z-index: 4;
}
```
这步做完就能看到图片固定在画面最左侧距离底部 280px 高度位置。

# 4. 自定义 JS 文件

接着给图片加一些效果，fluid 主题的网页右下角有个回到顶部按钮，我们要参考它做些修改，它的函数设置位于主题目录下的这个文件 `\source\js\events.js`，函数名是 `registerScrollTopArrowEvent` 。

{% note info %}
<font size=3>**添加的图片和回到顶部按钮的相似之处和不同之处**</font>
* 相似之处：要自适应浏览器宽度，缩放窗口宽度时让图片保持与文章区块位置不变
* 不同之处：页面顶部下拉一段距离后，按钮是从底部弹出来的，我不要图片弹出来，而是从消失状态到显示状态；另外就是图片在文章区块左边，而按钮在右边
{% endnote %}

在主题的 `\source\js` 目录下创建个 `custom.js` 文件，名称也可以随意，然后复制下面内容粘贴进去保存。这是我让 NewBing 参考回到顶部按钮改的，还加了注释。

下面 `50` 和 `136` 这两个数值注意下，50 这个注释写的很清楚了，除非你图片宽度很大，否则可以不管，这是为了自适应手机端；136 这个数值是代表 `图片左侧` 基于 `文章区块左侧`并`往左移动`的距离是 136，不同图片宽度自行调整测试显示效果。
```
// 等待文档加载完成
$(document).ready(function() {
    // 获取背景图像元素
    var backgroundImage = jQuery('#background-image');
    // 如果背景图像元素不存在，则返回
    if (backgroundImage.length === 0) {
      return;
    }
    // 获取board元素
    var board = jQuery('#board');
    // 如果board元素不存在，则返回
    if (board.length === 0) {
      return;
    }
    // 定义posDisplay和scrollDisplay变量，用于控制背景图像的显示
    var posDisplay = false;
    var scrollDisplay = false;
    // 定义setBackgroundImagePos函数，用于设置背景图像的位置
    var setBackgroundImagePos = function() {
      // 获取board元素的左边距
      var boardLeft = board[0].getClientRects()[0].left;
      // 根据左边距是否大于等于50来决定是否显示背景图像
      posDisplay = boardLeft >= 50;
      // 设置背景图像的display和left属性
      backgroundImage.css({
        'display': posDisplay && scrollDisplay ? 'block' : 'none',
        'left' : boardLeft - 136 + 'px'
      });
    };
    // 调用setBackgroundImagePos函数
    setBackgroundImagePos();
    // 在窗口大小调整时重新调用setBackgroundImagePos函数
    jQuery(window).resize(setBackgroundImagePos);
    // 获取board元素的顶部偏移量
    var headerHeight = board.offset().top;
    // 监听页面滚动事件
    Fluid.utils.listenScroll(function() {
      // 获取滚动高度
      var scrollHeight = document.body.scrollTop + document.documentElement.scrollTop;
      // 根据滚动高度是否大于等于headerHeight来决定是否显示背景图像
      scrollDisplay = scrollHeight >= headerHeight;
      // 设置背景图像的display属性
      backgroundImage.css({
        'display': posDisplay && scrollDisplay ? 'block' : 'none'
      });
    });
});
```

接着和前面自定义 CSS 文件差不多，在主题配置文件 `_config.fluid.yml` 找到 `custom_js:` 项引入这个 JS 文件路径，同样参考 [Fluid 官方的自定义 JS / CSS / HTML](https://hexo.fluid-dev.com/docs/guide/#%E8%87%AA%E5%AE%9A%E4%B9%89-js-css-html)