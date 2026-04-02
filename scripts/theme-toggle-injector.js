hexo.extend.filter.register('after_render:html', function(str) {
    var toggle = '<div class="nexmoe-widget-wrap" style="background:transparent;box-shadow:none;">' +
        '<div class="nexmoe-widget nexmoe-switch-theme">' +
        '<div id="theme-toggle" class="theme-toggle-container">' +
        '<div class="theme-slider">' +
        '<svg class="theme-icon sun" width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" fill="#ffd700"/><path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke="#ffd700" stroke-width="2" stroke-linecap="round"/></svg>' +
        '<svg class="theme-icon moon" width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="#e8e8e8" stroke="#cccccc" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '</div></div></div></div>';

    // Insert before the search widget's parent wrap
    return str.replace(
        '<div class="nexmoe-widget-wrap">\n    <div class="nexmoe-widget nexmoe-search">',
        toggle + '\n        <div class="nexmoe-widget-wrap">\n    <div class="nexmoe-widget nexmoe-search">'
    );
});
