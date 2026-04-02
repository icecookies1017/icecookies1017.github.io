(function() {
    var root = document.documentElement;

    var saved = localStorage.getItem('theme');
    if (!saved) {
        saved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    if (saved === 'dark') {
        root.classList.add('dark-mode');
    }

    document.addEventListener('click', function(e) {
        var btn = e.target.closest('#theme-toggle');
        if (!btn) return;

        root.classList.toggle('dark-mode');
        var theme = root.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        syncGiscus(theme);
    });

    window.addEventListener('message', function(e) {
        if (e.origin !== 'https://giscus.app') return;
        if (!(typeof e.data === 'object' && e.data.giscus)) return;
        syncGiscus(root.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    function syncGiscus(theme) {
        var iframe = document.querySelector('iframe.giscus-frame');
        if (!iframe) return;
        iframe.contentWindow.postMessage(
            { giscus: { setConfig: { theme: theme } } },
            'https://giscus.app'
        );
    }
})();
