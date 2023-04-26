hexo.extend.filter.register('theme_inject', function(injects) {
    injects.bodyBegin.raw('menhera', `
        <% if (theme.background_image.enable) { %>
            <div id="background-image">
                <img src="/img/bg01.png" alt="Background image">
            </div>
        <% } %>
    `);
});