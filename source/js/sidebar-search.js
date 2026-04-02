(function() {
    var data = null;
    var dropdown = null;
    var input = null;

    function load(cb) {
        if (data) return cb();
        fetch('/content.json').then(function(r) { return r.json(); }).then(function(res) {
            data = res instanceof Array ? res : res.posts;
            cb();
        });
    }

    function init() {
        input = document.getElementById('search_value');
        if (!input) return;

        // Hide Nexmoe built-in search overlay
        var space = document.getElementById('nexmoe-search-space');
        if (space) space.remove();

        // Create dropdown appended to body so nothing clips it
        dropdown = document.createElement('div');
        dropdown.className = 'sidebar-search-dropdown';
        document.body.appendChild(dropdown);

        input.addEventListener('input', function() {
            var val = this.value.trim();
            if (!val) { dropdown.style.display = 'none'; return; }
            load(function() { render(val); });
        });

        input.addEventListener('focus', function() {
            if (this.value.trim()) positionAndShow();
        });

        document.addEventListener('click', function(e) {
            if (!input.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });

        window.addEventListener('resize', function() {
            if (dropdown.style.display === 'block') positionAndShow();
        });
    }

    function positionAndShow() {
        var rect = input.getBoundingClientRect();
        dropdown.style.position = 'fixed';
        dropdown.style.top = (rect.bottom + 4) + 'px';
        dropdown.style.left = rect.left + 'px';
        dropdown.style.width = rect.width + 'px';
        dropdown.style.display = 'block';
    }

    function render(val) {
        var q = val.toLowerCase();
        var results = data.filter(function(p) {
            return p.title.toLowerCase().includes(q) ||
                   (p.text && p.text.toLowerCase().includes(q));
        });

        if (results.length === 0) {
            dropdown.innerHTML = '<div class="ssd-empty">找不到結果</div>';
        } else {
            var reg = new RegExp('(' + val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
            dropdown.innerHTML = results.slice(0, 8).map(function(p) {
                var title = p.title.replace(reg, '<mark>$1</mark>');
                var snippet = '';
                if (p.text) {
                    var idx = p.text.toLowerCase().indexOf(q);
                    if (idx >= 0) {
                        var start = Math.max(0, idx - 20);
                        var end = Math.min(p.text.length, idx + val.length + 40);
                        snippet = (start > 0 ? '...' : '') + p.text.substring(start, end).replace(reg, '<mark>$1</mark>') + (end < p.text.length ? '...' : '');
                    }
                }
                return '<a class="ssd-item" href="/' + p.path + '">' +
                    '<div class="ssd-title">' + title + '</div>' +
                    (snippet ? '<div class="ssd-text">' + snippet + '</div>' : '') +
                    '</a>';
            }).join('');
        }
        positionAndShow();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
