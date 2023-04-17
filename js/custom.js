// 暗中观察
$(document).ready(function() {
    var backgroundImage = jQuery('#background-image');
    // 如果背景图片元素不存在，则返回
    if (backgroundImage.length === 0) {
      return;
    }
    var board = jQuery('#board');
    if (board.length === 0) {
      return;
    }
    // 定义两个标志变量，分别表示背景图片是否应该根据窗口大小和页面滚动高度显示
    var posDisplay = false;
    var scrollDisplay = false;
    // 定义一个函数，用于设置背景图片的位置
    var setBackgroundImagePos = function() {
      // 计算文章区块左侧与浏览器窗口左侧的距离
      var boardLeft = board[0].getClientRects()[0].left;
      // 如果距离大于等于50，则更新posDisplay变量的值
      posDisplay = boardLeft >= 50;
      // 根据posDisplay和scrollDisplay变量的值来设置背景图片的bottom属性
      backgroundImage.css({
        'display': posDisplay && scrollDisplay ? 'block' : 'none',
        'left' : boardLeft - 136 + 'px'
      });
    };
    // 调用setBackgroundImagePos函数设置初始位置
    setBackgroundImagePos();
    // 监听窗口大小改变事件，在窗口大小改变时重新调用setBackgroundImagePos函数
    jQuery(window).resize(setBackgroundImagePos);
    // 监听页面滚动事件
    var headerHeight = board.offset().top;
    Fluid.utils.listenScroll(function() {
      // 计算页面滚动高度
      var scrollHeight = document.body.scrollTop + document.documentElement.scrollTop;
      // 如果页面滚动高度大于等于文章区块顶部的位置，则更新scrollDisplay变量的值
      scrollDisplay = scrollHeight >= headerHeight;
      // 根据posDisplay和scrollDisplay变量的值来设置背景图片隐藏显示
      backgroundImage.css({
        'display': posDisplay && scrollDisplay ? 'block' : 'none'
      });
    });
  });