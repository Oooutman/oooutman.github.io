---
title: Hexo-Fluid 自用样式 (custom.css)
date: 2023-04-16 22:31:28
permalink: fluid_css/
banner_position: center 80%
index_img: https://mdzz.cf/images/2023/04/16/wallhaven-p9lex9_1080.jpg
banner_img: https://mdzz.cf/images/2023/04/16/wallhaven-p9lex9_1080.jpg
tags: Fluid 修改
categories: Fluid 修改
---

关于自定义样式，请参考 [Fluid 官方文档](https://hexo.fluid-dev.com/docs/guide/#%E8%87%AA%E5%AE%9A%E4%B9%89-js-css-html)

{% note info %}
部分样式还需要修改其它文件
直接能用的：**表格样式、超链接默认下划线、块引用**
{% endnote %}
```
/* 暗中观察 */
#background-image {
    position: fixed;
    bottom: 280px;
    z-index: 4;
}

/* 表格中的偶数行具有背景色 */
[data-user-color-scheme="dark"] table tr:nth-child(even) td {
    background-color: rgba(27,31,35,0.5);
}

[data-user-color-scheme="light"] table tr:nth-child(even) td {
    background-color: rgba(27,31,35,0.05);
}

/* 表格中标题栏背景色和文字颜色 */
[data-user-color-scheme="dark"] table th {
    background-color: #1589e9;
    color: #fff;
}

[data-user-color-scheme="light"] table th {
    background-color: #0366d6;
    color: #fff;
}

/* 超链接默认启用下划线，鼠标悬停下划线消失 */
.markdown-body a {
    text-decoration: underline;
}
.markdown-body a:hover {
    text-decoration: none;
}

/* banner 网点覆盖 */
.banner .mask {
	background: url(/img/overlay_dot_ptn_0.6.png);
}

/* 块引用样式 */
.markdown-body blockquote{
    color: var(--post-text-color);
    padding: 1rem 1.45rem 1.25rem 1.45rem;
    border: 1px double rgba(0,0,0,.1);
    background-color: rgba(27,31,35,0.05);
    border-radius: 0.25rem;
    margin: 1.8rem 0;
}
[data-user-color-scheme="dark"] .markdown-body blockquote{
    border: 1px double rgb(128 128 128 / 30%);
    background-color: rgba(62,75,94,0.35);
}

/* 排版 */
.markdown-body {
    line-height: 1.7;
    margin-bottom: 2rem;
}

.markdown-body blockquote, .markdown-body details, .markdown-body dl, .markdown-body ol, .markdown-body p, .markdown-body pre, .markdown-body table, .markdown-body ul {
    margin-bottom: 20px;
}

.markdown-body .highlight {
    margin-bottom: 28px;
}

figure {
    margin: 1.5rem 0;
}

.markdown-body p > img, .markdown-body p > a > img, .markdown-body figure > img, .markdown-body figure > a > img {
    margin: 2rem auto;
}

.note {
    padding: 0.85rem 1.1rem 0.85rem 1.1rem;
}
```